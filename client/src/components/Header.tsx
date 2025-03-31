import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { Link } from 'wouter';

export function Header() {
  const { user, logout } = useAuth();
  
  const userInitials = user?.username 
    ? user.username.slice(0, 2).toUpperCase() 
    : 'U';
    
  const userBalance = user?.balance ? user.balance.toLocaleString() : '0';
  const isVip = user?.isVip || false;
  
  const handleLogout = () => {
    logout.mutate();
  };
  
  return (
    <header className="bg-dark-200 shadow-md">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <span className="text-accent font-heading font-bold text-2xl">ISO9ja<span className="text-primary">Bet</span></span>
          </a>
        </Link>
        
        <div className="flex items-center space-x-3">
          {/* Balance Display */}
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">Balance</span>
            <span className="font-heading font-bold text-lg text-white">₦{userBalance}</span>
          </div>
          
          {/* User Avatar/Menu Trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="relative cursor-pointer">
                <Avatar className="h-10 w-10 bg-dark-50 border border-gray-700">
                  <AvatarFallback className="text-sm font-medium">{userInitials}</AvatarFallback>
                </Avatar>
                {isVip && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-accent rounded-full text-[10px] text-white font-bold">
                    VIP
                  </span>
                )}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 bg-dark-50 border-gray-700">
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/profile">
                  <a className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/wallet">
                  <a className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </a>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer text-red-400 focus:text-red-400" 
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
