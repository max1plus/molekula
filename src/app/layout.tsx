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
        <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr]">
          {/* Desktop Sidebar */}
          <div className="hidden border-r bg-muted/20 md:block">
            <div className="flex h-full max-h-screen flex-col gap-4">
              <header className="flex h-16 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2">
                  <Image
                    src="/logo.png"
                    width={40}
                    height={40}
                    alt="Молекула бар"
                    className="rounded-lg"
                  />
                  <h1 className="font-headline text-xl font-bold text-primary">
                    Молекула бар
                  </h1>
                </Link>
              </header>
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
                >
                  <Users className="h-5 w-5" />
                  <span>Гости</span>
                </Link>
                <Link
                  href="/scanner"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
                >
                  <QrCode className="h-5 w-5" />
                  <span>Сканер</span>
                </Link>
                <Link
                  href="/attendance"
                  className="flex items-center gap-3 rounded-lg px-3 py-3 text-muted-foreground transition-all hover:bg-muted hover:text-primary"
                >
                  <CalendarDays className="h-5 w-5" />
                  <span>Посещаемость</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="flex flex-col">
            <header className="sticky top-0 z-10 flex h-16 items-center justify-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
              <div className="flex items-center gap-2">
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
              </div>
            </header>
            <main className="flex-1 p-4 pb-24 sm:p-6 md:pb-6">{children}</main>
            <nav className="fixed bottom-0 left-0 right-0 z-20 border-t bg-background/95 backdrop-blur-sm md:hidden">
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
        </div>
        <Toaster />
      </body>
    </html>
  );
}
