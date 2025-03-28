import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { TestProvider } from "./context/TestProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "肥胖心理測驗 | 國家肥胖研究院",
  description: "國家肥胖研究院最新研究成果，透過心理測驗評估您的肥胖程度！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" className={`${inter.variable}`}>
      <body className="min-h-screen bg-amber-50 dark:bg-gray-900">
        <TestProvider>{children}</TestProvider>
      </body>
    </html>
  );
}
