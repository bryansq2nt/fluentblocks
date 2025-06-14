import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FluentBlocks",
  description: "Aprende a construir oraciones en inglés de forma interactiva y divertida, bloque por bloque.",
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
}; 