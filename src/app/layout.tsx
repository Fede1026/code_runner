import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Universal Code Runner",
  description: "A fast, immersive coding environment spanning modern web paradigms and python runtime executions.",
  openGraph: {
    title: "Universal Code Runner",
    description: "A fast, immersive coding environment spanning modern web paradigms and python runtime executions.",
    images: ["/api/og"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Code Runner",
    description: "A fast, immersive coding environment spanning modern web paradigms and python runtime executions.",
    images: ["/api/og"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#09090b] selection:bg-[#ccff00]/30 selection:text-[#ccff00]">
        {children}
      </body>
    </html>
  );
}
