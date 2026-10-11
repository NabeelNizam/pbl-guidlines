import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PBL Engineering Guide | Standar Rekayasa Web Mahasiswa",
  description:
    "Panduan komprehensif, task-oriented workflow, dan standar engineering untuk mahasiswa Project-Based Learning (PBL).",
};

import { FloatingTaskBar } from "@/components/tasks/FloatingTaskBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col font-sidebar bg-[#09090b] text-zinc-100 antialiased selection:bg-blue-500/30 selection:text-blue-300">
        {children}
        <FloatingTaskBar />
      </body>
    </html>
  );
}

