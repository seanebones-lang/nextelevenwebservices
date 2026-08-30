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
  title: 'NextEleven — Complete Web Presence',
  description:
    'NextEleven conceives, creates, builds, hosts, and maintains complete web presences for established businesses.',
  openGraph: {
    title: 'Your business is established.',
    description: 'Your web presence should make that obvious.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Your business is established.',
    description: 'Your web presence should make that obvious.',
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
