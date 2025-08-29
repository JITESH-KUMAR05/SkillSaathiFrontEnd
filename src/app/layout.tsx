import './globals-clean.css';
import type { Metadata } from 'next';
import { DM_Sans, Plus_Jakarta_Sans } from 'next/font/google';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';

const dmSans = DM_Sans({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dm-sans'
});

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: 'SkillSaathi - AI Multi-Agent Companion Platform',
  description: 'Discover your perfect AI companion with Mitra, Guru, and Parikshak. Voice-enabled, culturally aware, real-time responsive AI agents crafted specifically for India.',
  keywords: 'AI companions, Indian AI, voice AI, learning AI, emotional support AI, performance coaching, cultural AI, real-time AI',
  authors: [{ name: 'SkillSaathi Team' }],
  creator: 'SkillSaathi',
  publisher: 'SkillSaathi',
  robots: 'index, follow',
  openGraph: {
    title: 'SkillSaathi - Choose Your AI Companion',
    description: 'Personalized AI agents for conversation, learning, and evaluation. Voice-ready, culturally aware, real-time responsive.',
    type: 'website',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillSaathi - AI Multi-Agent Platform',
    description: 'Your perfect AI companion awaits. Choose from Mitra, Guru, or Parikshak.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${dmSans.variable} ${jakarta.variable} font-sans antialiased`}>
        <ThemeProvider>
          <div className="relative min-h-screen">
            {children}
          </div>
          <Toaster 
            position="top-right" 
            richColors 
            expand={false}
            duration={4000}
            className="font-sans"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
