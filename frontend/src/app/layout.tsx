import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ShieldCheck, User } from "lucide-react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "CartUnmask AI | Enterprise-Grade Shopping Integrity",
  description:
    "Advanced marketplace analysis for dark patterns and marketplace integrity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} font-sans antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 min-h-screen flex flex-col`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <header className="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors duration-300">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-8 h-8 text-[#4285F4]" />
                <span className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                  CARTUNMASK <span className="text-[#4285F4]">AI</span>
                </span>
              </div>
              <div className="flex items-center gap-4">
                <ThemeToggle />
                <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-[#4285F4] transition-all">
                  <User className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
