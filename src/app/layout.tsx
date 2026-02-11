import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { QrCode, Users, CalendarDays } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Молекула бар',
  description: 'Система контроля доступа для Молекула бара',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background')}>
        <div className="flex flex-col min-h-screen w-full">
          <header className="sticky top-0 z-10 flex h-16 items-center justify-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/logo.png"
                width={40}
                height={40}
                alt="Молекула бар"
                className="rounded-lg"
              />
              <h1 className="font-headline text-2xl font-bold text-primary">
                Молекула бар
              </h1>
            </Link>
          </header>
          <main className="flex-1 p-4 pb-24 sm:p-6">{children}</main>
          <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm">
            <div className="grid h-16 grid-cols-3">
              <Link
                href="/"
                className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <Users />
                <span>Гости</span>
              </Link>
              <Link
                href="/scanner"
                className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <QrCode />
                <span>Сканер</span>
              </Link>
              <Link
                href="/attendance"
                className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary"
              >
                <CalendarDays />
                <span>Календарь</span>
              </Link>
            </div>
          </nav>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
