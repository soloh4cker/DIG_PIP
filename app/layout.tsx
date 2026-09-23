import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DIG PIP | Improvement Board",
  description: "Shared project board for the Days Inn Grayling Property Improvement Plan.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  );
}
