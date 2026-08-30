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
  metadataBase: new URL(
    'https://nexteleven-web-presence.nexteleven.chatgpt.site',
  ),
  title: 'NextEleven — We Build Presence That Works',
  description:
    'NextEleven conceives, creates, builds, hosts, and maintains complete web presences for established businesses.',
  openGraph: {
    title: 'We build presence that works.',
    description: 'Strategy through operation. One accountable partner.',
    type: 'website',
    url: 'https://nexteleven-web-presence.nexteleven.chatgpt.site',
    images: [
      {
        url: '/og.png',
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
    images: ['/og.png'],
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
