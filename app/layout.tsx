import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TestProvider } from "./context/TestProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mind-Fattness Test | Are You Mentally Fat?",
  description: "Take our hilarious Mind-Fattness Test to discover your mental obesity level. Warning: results may be both funny and slightly offensive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TestProvider>
          {children}
        </TestProvider>
      </body>
    </html>
  );
}
