import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FeedbackProvider } from "../components/game/FeedbackProvider";
import { ExerciseTrackingProvider } from '@/components/providers/ExerciseTrackingProvider';
import { TutorialProvider } from "@/context/TutorialContext";
import { TutorialPlayer } from "@/components/tutorial/TutorialPlayer";

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
  themeColor: '#3b82f6',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'FluentBlocks',
  },
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
         <TutorialProvider>
          <ExerciseTrackingProvider>
            <FeedbackProvider>
              {children}
            </FeedbackProvider>
          </ExerciseTrackingProvider>
           <TutorialPlayer />
        </TutorialProvider>
      
      </body>
    </html>
  );
}
