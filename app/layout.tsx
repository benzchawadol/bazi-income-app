import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ดวงป้าจื้อ (八字) และธาตุทั้งห้า",
  description: "คำนวณสี่เสาชะตา (Four Pillars) และธาตุทั้งห้าจากวันเกิด เพื่อความบันเทิงเท่านั้น",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@400;500;600;700&family=Noto+Serif+Thai:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-thai min-h-screen text-parchment-50">{children}</body>
    </html>
  );
}
