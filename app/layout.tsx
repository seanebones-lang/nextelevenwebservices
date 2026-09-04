import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://nexteleven-web-presence.vercel.app'),
  title: 'NextEleven Web Presence | Custom Websites and Connected Business Systems',
  description:
    'NextEleven designs and builds custom web presences, inquiry paths, portals, commerce foundations, and connected workflows for DFW and remote clients.',
  openGraph: {
    title: 'Web presence built around the business behind it.',
    description: 'Custom websites and connected business systems from an owner-operated DFW studio.',
    type: 'website',
    url: 'https://nexteleven-web-presence.vercel.app',
    images: [
      {
        url: '/og-v2.png',
        width: 1200,
        height: 630,
        alt: 'NextEleven Web Presence — custom websites and connected business systems.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Web presence built around the business behind it.',
    description: 'Custom websites and connected business systems from an owner-operated DFW studio.',
    images: ['/og-v2.png'],
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
        {children}
      </body>
    </html>
  );
}
