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

const appUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://code-runner-fede.vercel.app');

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Universal Code Runner",
  description: "A fast, immersive coding environment spanning modern web paradigms and python runtime executions.",
  openGraph: {
    title: "Universal Code Runner",
    description: "A fast, immersive coding environment spanning modern web paradigms and python runtime executions.",
    url: appUrl,
    images: [{
      url: `${appUrl}/api/og`,
      width: 1200,
      height: 630,
      alt: "Universal Code Runner Preview"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Universal Code Runner",
    description: "A fast, immersive coding environment spanning modern web paradigms and python runtime executions.",
    images: [`${appUrl}/api/og`],
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
