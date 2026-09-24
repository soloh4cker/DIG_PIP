import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { activities, comments, tasks } from "@/db/schema";

const people=["Ketan","Deep","Sana"],statuses=["todo","in_progress","done"],priorities=["Low","Medium","High"],labels:Record<string,string>={todo:"To do",in_progress:"In progress",done:"Completed"};
const normalize=(value:string)=>value==="Deep&Sana"?"Deep":value;

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){try{const id=Number((await params).id),db=getDb(),[task]=await db.select().from(tasks).where(eq(tasks.id,id));if(!task)return Response.json({error:"Task not found."},{status:404});const [taskComments,activity]=await Promise.all([db.select().from(comments).where(eq(comments.taskId,id)).orderBy(desc(comments.createdAt),desc(comments.id)),db.select().from(activities).where(eq(activities.taskId,id)).orderBy(desc(activities.createdAt),desc(activities.id))]);return Response.json({task:{...task,assignee:normalize(task.assignee),comments:taskComments.map(c=>({...c,author:normalize(c.author)})),activity,commentCount:taskComments.length}})}catch{return Response.json({error:"Could not load this task."},{status:500})}}

export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){try{const id=Number((await params).id),b=await request.json() as Record<string,unknown>,db=getDb(),[current]=await db.select().from(tasks).where(eq(tasks.id,id));if(!current)return Response.json({error:"Task not found."},{status:404});const updates:Record<string,unknown>={updatedAt:new Date().toISOString()},notes:string[]=[];
  if(b.title!==undefined){const v=String(b.title).trim();if(!v)return Response.json({error:"Task title is required."},{status:400});updates.title=v;if(v!==current.title)notes.push("updated the task title")}
  if(b.description!==undefined){const v=String(b.description).trim();updates.description=v;if(v!==current.description)notes.push("updated the description")}
  if(b.status!==undefined){const v=String(b.status);if(!statuses.includes(v))return Response.json({error:"Invalid status."},{status:400});updates.status=v;if(v!==current.status)notes.push(`changed status from ${labels[current.status]} to ${labels[v]}`)}
  if(b.assignee!==undefined){const v=String(b.assignee);if(!people.includes(v))return Response.json({error:"Invalid assignee."},{status:400});updates.assignee=v;if(v!==normalize(current.assignee))notes.push(`reassigned the task from ${normalize(current.assignee)} to ${v}`)}
  if(b.category!==undefined){const v=String(b.category).trim()||"Other";updates.category=v;if(v!==current.category)notes.push(`changed the area to ${v}`)}
  if(b.priority!==undefined){const v=String(b.priority);if(!priorities.includes(v))return Response.json({error:"Invalid priority."},{status:400});updates.priority=v;if(v!==current.priority)notes.push(`changed priority to ${v}`)}
  if(b.dueDate!==undefined){const v=String(b.dueDate||"").trim()||null;updates.dueDate=v;if(v!==current.dueDate)notes.push(v?"updated the due date":"removed the due date")}
  if(!notes.length)return Response.json({task:current});const now=updates.updatedAt as string,[task]=await db.update(tasks).set(updates).where(eq(tasks.id,id)).returning();await db.insert(activities).values(notes.map(detail=>({taskId:id,actor:"Team",kind:"updated",detail,createdAt:now})));return Response.json({task})}catch{return Response.json({error:"Could not update this task."},{status:500})}}

export async function DELETE(_:Request,{params}:{params:Promise<{id:string}>}){try{const id=Number((await params).id),db=getDb(),deleted=await db.delete(tasks).where(eq(tasks.id,id)).returning({id:tasks.id});if(!deleted.length)return Response.json({error:"Task not found."},{status:404});return Response.json({success:true})}catch{return Response.json({error:"Could not delete this task."},{status:500})}}
