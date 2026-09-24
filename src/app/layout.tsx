import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'Accident & Incident Tracking System | MongoDB Edition',
  description: 'Workplace safety management system built with Next.js, TypeScript, and MongoDB',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900 flex">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
          <Header />
          <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
        </div>
      </body>
    </html>
  );
}
