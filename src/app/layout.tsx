/**
 * Root Layout
 * Global layout with metadata and providers
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Jewelshot - AI-Powered Jewelry Photography',
    template: '%s | Jewelshot',
  },
  description:
    'Transform your jewelry photos with AI. Professional product photography in seconds. Perfect for e-commerce, social media, and marketing.',
  keywords: [
    'jewelry photography',
    'ai photography',
    'product photography',
    'jewelry marketing',
    'e-commerce photography',
    'ai image generation',
  ],
  authors: [{ name: 'Jewelshot' }],
  creator: 'Jewelshot',
  publisher: 'Jewelshot',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Jewelshot - AI-Powered Jewelry Photography',
    description:
      'Transform your jewelry photos with AI. Professional product photography in seconds.',
    siteName: 'Jewelshot',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jewelshot - AI-Powered Jewelry Photography',
    description:
      'Transform your jewelry photos with AI. Professional product photography in seconds.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
