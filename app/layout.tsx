import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Chabot from "./components/Chabot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keyairius Hopkins | Senior Fullstack Engineer",
  description:
    "Senior Fullstack Engineer with 10+ years building React, TypeScript, and Node applications at scale — currently Senior/Lead Frontend Engineer at CVS Health.",
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
      <body className="flex min-h-full flex-col bg-slate-950 text-slate-200">
        <Header />
        <div className="flex flex-1 flex-col">{children}</div>
        <Footer />
        <Chabot />
      </body>
    </html>
  );
}
