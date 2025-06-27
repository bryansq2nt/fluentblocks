import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FeedbackProvider } from "../components/game/FeedbackProvider";
import { ExerciseTrackingProvider } from '@/components/providers/ExerciseTrackingProvider';
import { TutorialProvider } from "@/context/TutorialContext";
import { TutorialPlayer } from "@/components/tutorial/TutorialPlayer";
import AuthInitializer from "@/components/security/AuthInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FluentBlocks",
  description: "Aprende a construir oraciones en inglés de forma interactiva y divertida, bloque por bloque.",
  
  manifest: '/manifest.json',
  
  openGraph: {
    title: 'FluentBlocks - Aprende Inglés Interactivo',
    description: 'Construye tu fluidez, bloque por bloque.',
    url: 'https://fluentblocks.com', 
    siteName: 'FluentBlocks',
    images: [
      {
        url: 'https://fluentblocks.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FluentBlocks Logo',
      },
    ],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FluentBlocks - Aprende Inglés Interactivo',
    description: 'Construye tu fluidez, bloque por bloque.',
    images: ['https://fluentblocks.com/og-image.png'], 
  },
  
  // PWA meta tags
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FluentBlocks',
  },
};

export const viewport: Viewport = {
  themeColor: '#3b82f6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <AuthInitializer>
          <TutorialProvider>
            <ExerciseTrackingProvider>
              <FeedbackProvider>
                {children}
              </FeedbackProvider>
            </ExerciseTrackingProvider>
            <TutorialPlayer />
          </TutorialProvider>
        </AuthInitializer>
      </body>
    </html>
  );
}
