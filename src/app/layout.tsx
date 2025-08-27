import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI Multi-Agent Companion for India',
  description: 'Choose your AI companion with voice-enabled, minimal latency streaming for the Indian market',
  keywords: 'AI, agents, companion, India, voice, streaming, Murf, minimal latency',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster 
          position="top-right" 
          richColors 
          expand={false}
          duration={4000}
        />
      </body>
    </html>
  );
}
