import React from 'react';
import { Link, useLocation } from 'wouter';
import { Home, Trophy, History, Wallet, User } from 'lucide-react';

export function BottomNav() {
  const [location] = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Overlay with gradient background */}
      <div className="bg-gradient-to-t from-black/95 via-dark-300/95 to-dark-300/90 backdrop-blur-sm border-t border-gray-800 shadow-xl">
        <div className="flex items-center justify-around py-1">
          <Link href="/">
            <a className={`flex flex-col items-center p-2 ${location === '/' 
              ? 'text-primary' 
              : 'text-gray-500 hover:text-gray-300'}`}>
              <div className={`p-2 rounded-full ${location === '/' ? 'bg-primary/10' : ''}`}>
                <Home className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Home</span>
            </a>
          </Link>
          <Link href="/matches">
            <a className={`flex flex-col items-center p-2 ${location === '/matches' 
              ? 'text-primary' 
              : 'text-gray-500 hover:text-gray-300'}`}>
              <div className={`p-2 rounded-full ${location === '/matches' ? 'bg-primary/10' : ''}`}>
                <Trophy className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Matches</span>
            </a>
          </Link>
          <Link href="/history">
            <a className={`flex flex-col items-center p-2 ${location === '/history' 
              ? 'text-primary' 
              : 'text-gray-500 hover:text-gray-300'}`}>
              <div className={`p-2 rounded-full ${location === '/history' ? 'bg-primary/10' : ''}`}>
                <History className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">History</span>
            </a>
          </Link>
          <Link href="/wallet">
            <a className={`flex flex-col items-center p-2 ${location === '/wallet' 
              ? 'text-primary' 
              : 'text-gray-500 hover:text-gray-300'}`}>
              <div className={`p-2 rounded-full ${location === '/wallet' ? 'bg-primary/10' : ''}`}>
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Wallet</span>
            </a>
          </Link>
          <Link href="/profile">
            <a className={`flex flex-col items-center p-2 ${location === '/profile' 
              ? 'text-primary' 
              : 'text-gray-500 hover:text-gray-300'}`}>
              <div className={`p-2 rounded-full ${location === '/profile' ? 'bg-primary/10' : ''}`}>
                <User className="h-5 w-5" />
              </div>
              <span className="text-xs mt-1">Profile</span>
            </a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
