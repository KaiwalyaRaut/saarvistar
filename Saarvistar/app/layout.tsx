import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import '@/styles/globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopHeader } from '@/components/layout/TopHeader';
import { ThemeSync } from '@/components/common/ThemeSync';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Sarvistar — GenAI Content Transformation Platform',
  description:
    'Transform enterprise strategy documents and intelligence into multiple synchronized narrative channels.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} dark`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="bg-surface-dim font-body-md text-on-surface antialiased overflow-x-hidden min-h-screen">
        <ThemeSync />
        <Sidebar />
        <TopHeader />
        <div className="main-content-wrapper min-h-screen transition-all duration-300 md:pl-64">
          <main className="relative pt-16 bg-surface-dim min-h-screen">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
