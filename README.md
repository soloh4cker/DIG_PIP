# DIG PIP

A simple shared project board for the Days Inn Grayling Property Improvement Plan.

## Features

- Create and assign tasks to Ketan or Deep&Sana
- Track To do, In progress, and Completed work
- Add category, priority, description, and optional due date
- Comment on tasks and retain activity history
- Filter by team member and search the board
- Shared persistent Cloudflare D1 database
- Responsive desktop and mobile interface

## Local development

```bash
npm ci
npm run db:generate
npm run build
```

The production deployment uses the Sites runtime and a D1 binding named `DB`.
