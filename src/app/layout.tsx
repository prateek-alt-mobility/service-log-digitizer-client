import { Geist, Geist_Mono } from 'next/font/google';

import { ReduxProvider } from '@/components/providers/redux-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geist.variable} ${geistMono.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <ReduxProvider>
          <ThemeProvider>
            {children}
            <Toaster richColors closeButton />
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
