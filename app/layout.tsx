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
  title: 'NextEleven — We Build Presence That Works',
  description:
    'NextEleven discovers, designs, and engineers premium web foundations and full vertical custom environments for established businesses.',
  openGraph: {
    title: 'We build presence that works.',
    description: 'Strategy through operation. One accountable partner.',
    type: 'website',
    url: 'https://nexteleven-web-presence.vercel.app',
    images: [
      {
        url: '/og-v2.png',
        width: 1200,
        height: 630,
        alt: 'We build presence that works. Strategy through operation. One accountable partner.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'We build presence that works.',
    description: 'Strategy through operation. One accountable partner.',
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
