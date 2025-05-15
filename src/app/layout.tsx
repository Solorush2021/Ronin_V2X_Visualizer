import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a common, readable font
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"; // Import Toaster

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'V2X Visualizer',
  description: 'Simulated V2X Alert System Dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable
        )}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
