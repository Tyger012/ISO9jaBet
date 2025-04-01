import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { LeaderboardUser } from '@shared/schema';
import { Spinner } from '@/components/ui/spinner';

export function Leaderboard() {
  const { 
    data = [], 
    isLoading, 
    error 
  } = useQuery<LeaderboardUser[]>({
    queryKey: ['/api/leaderboard'],
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-80">
        <Spinner />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center p-4 text-red-400">
        Failed to load leaderboard. Please try again.
      </div>
    );
  }
  
  // Get medal color based on position
  const getMedalColor = (position: number) => {
    switch (position) {
      case 0: return 'bg-green-600';
      case 1: return 'bg-gray-400';
      case 2: return 'bg-amber-700';
      default: return 'bg-dark-50 text-gray-300';
    }
  };
  
  return (
    <Card className="bg-dark-50 rounded-lg shadow border border-gray-700">
      <CardContent className="p-4">
        <div className="space-y-2">
          {data.map((user, index) => (
            <div key={user.id} className="flex items-center p-3 bg-dark-100 rounded-lg border border-gray-700">
              <div className={`flex items-center justify-center w-8 h-8 mr-3 rounded-full ${getMedalColor(index)} text-dark font-bold text-sm`}>
                {index + 1}
              </div>
              <div className="flex-1 flex items-center justify-between">
                <div className="flex items-center">
                  <span className="font-medium">{user.username}</span>
                  {user.isVip && (
                    <span className="ml-2 px-1.5 py-0.5 bg-accent/20 text-accent text-xs rounded">VIP</span>
                  )}
                </div>
                <span className="font-heading font-bold text-accent">₦{user.balance.toLocaleString()}</span>
              </div>
            </div>
          ))}
          
          {data.length === 0 && (
            <div className="text-center p-4 text-gray-400">
              No leaderboard data available yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
