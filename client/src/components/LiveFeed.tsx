import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { VirtualTransaction } from '@shared/schema';
import { Spinner } from '@/components/ui/spinner';
import { User } from 'lucide-react';

export function LiveFeed() {
  const [transactions, setTransactions] = useState<VirtualTransaction[]>([]);
  
  const { 
    data = [], 
    isLoading, 
    error,
    refetch
  } = useQuery<VirtualTransaction[]>({
    queryKey: ['/api/virtual-transactions'],
  });
  
  // Update transactions every 10 seconds
  useEffect(() => {
    setTransactions(data);
  }, [data]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [refetch]);
  
  // Format time difference
  const formatTimeDiff = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return '1 day ago';
    return `${diffDays} days ago`;
  };
  
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
        Failed to load live feed. Please try again.
      </div>
    );
  }
  
  return (
    <Card className="bg-dark-50 rounded-lg shadow border border-gray-700 h-80 overflow-y-auto">
      <CardContent className="p-4">
        <div className="space-y-3">
          {transactions.map((tx) => (
            <div key={tx.id} className="flex items-center p-3 bg-dark-100 rounded-lg border border-gray-700">
              <div className="h-8 w-8 rounded-full bg-dark-50 flex items-center justify-center mr-3">
                <User className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">{tx.username}</span>
                  <span className="text-sm font-heading font-bold text-primary">₦{tx.amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-0.5">
                  <span className="text-xs text-gray-400">{formatTimeDiff(tx.timestamp)}</span>
                  <span className="text-xs text-gray-400">Withdrawal Successful</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
