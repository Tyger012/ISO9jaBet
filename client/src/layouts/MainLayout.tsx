import React, { ReactNode } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showBottomNav?: boolean;
  className?: string;
}

export function MainLayout({ 
  children, 
  showHeader = true, 
  showBottomNav = true,
  className = ''
}: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen bg-dark-100 text-light">
      {showHeader && <Header />}
      
      <main className={`flex-1 overflow-y-auto pb-16 ${className}`}>
        {children}
      </main>
      
      {showBottomNav && <BottomNav />}
    </div>
  );
}
