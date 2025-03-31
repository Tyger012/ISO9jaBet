import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Trophy, History, Wallet, User } from 'lucide-react';

export function BottomNav() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-dark-200 border-t border-gray-700 shadow-lg z-50">
      <div className="flex items-center justify-around">
        <Link href="/">
          <a className={`flex flex-col items-center p-3 ${location === '/' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
            <Home className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </a>
        </Link>
        <Link href="/matches">
          <a className={`flex flex-col items-center p-3 ${location === '/matches' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
            <Trophy className="h-5 w-5" />
            <span className="text-xs mt-1">Matches</span>
          </a>
        </Link>
        <Link href="/history">
          <a className={`flex flex-col items-center p-3 ${location === '/history' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
            <History className="h-5 w-5" />
            <span className="text-xs mt-1">History</span>
          </a>
        </Link>
        <Link href="/wallet">
          <a className={`flex flex-col items-center p-3 ${location === '/wallet' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
            <Wallet className="h-5 w-5" />
            <span className="text-xs mt-1">Wallet</span>
          </a>
        </Link>
        <Link href="/profile">
          <a className={`flex flex-col items-center p-3 ${location === '/profile' ? 'text-primary' : 'text-gray-500 hover:text-gray-300'}`}>
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </a>
        </Link>
      </div>
    </nav>
  );
}
