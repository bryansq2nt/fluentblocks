'use client';

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FeedbackProvider } from "../components/game/FeedbackProvider";
import SessionProvider from "@/components/providers/SessionProvider";
import UserSyncer from '@/components/auth/UserSyncer';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>
          <UserSyncer />
          <FeedbackProvider>
            {children}
          </FeedbackProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
