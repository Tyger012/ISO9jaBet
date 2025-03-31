import React, { useState } from 'react';
import { LuckyWheel } from '@/components/ui/lucky-wheel';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';

export function LuckySpin() {
  const { user, spinLuckyWheel } = useUser();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  
  // Every user can spin once per 24 hours regardless of balance
  const canSpin = !!user;
  
  // Format date to check if user has spun today
  const today = new Date();
  const lastSpinDate = user?.lastSpinDate ? new Date(user.lastSpinDate) : null;
  const hasSpunToday = lastSpinDate && 
    lastSpinDate.getDate() === today.getDate() &&
    lastSpinDate.getMonth() === today.getMonth() &&
    lastSpinDate.getFullYear() === today.getFullYear();
  
  const handleSpin = async () => {
    if (!canSpin || hasSpunToday) {
      let message = !canSpin 
        ? 'You must be logged in to use the Lucky Spin' 
        : 'You\'ve already used your free spin today';
      
      toast({
        title: 'Cannot Spin',
        description: message,
        variant: 'destructive',
      });
      return;
    }
    
    setIsSpinning(true);
    
    try {
      const result = await spinLuckyWheel.mutateAsync();
      setSpinResult(result);
    } catch (error) {
      setIsSpinning(false);
    }
  };
  
  const handleSpinComplete = () => {
    setIsSpinning(false);
    
    if (spinResult) {
      toast({
        title: 'Congratulations!',
        description: `You've won ₦${spinResult.toLocaleString()}!`,
      });
    }
  };
  
  return (
    <section className="px-4 py-6 bg-dark-200">
      <div className="container mx-auto">
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-heading font-bold mb-2">Lucky Spin</h2>
          <p className="text-gray-400 text-center mb-6">Balance too low? Spin the wheel to win bonus cash!</p>
          
          <LuckyWheel 
            isSpinning={isSpinning}
            onSpinComplete={handleSpinComplete}
            result={spinResult || undefined}
            size="lg"
          />
          
          <div className="mt-8 text-center">
            <Button 
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-semibold shadow-lg"
              onClick={handleSpin}
              disabled={isSpinning || (canSpin === false) || hasSpunToday}
            >
              {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
            </Button>
            <p className="text-xs text-gray-400 mt-2">
              {hasSpunToday 
                ? 'You\'ve already used your spin today. Come back tomorrow!' 
                : '1 free spin available daily. Spin to earn money!'}
            </p>
          </div>
          
          <div className="mt-6 grid grid-cols-3 gap-2 w-full max-w-md">
            <div className="bg-dark-100 p-2 rounded text-center">
              <div className="text-sm text-gray-400">₦3,000</div>
              <div className="text-xs text-gray-500">40% chance</div>
            </div>
            <div className="bg-dark-100 p-2 rounded text-center">
              <div className="text-sm text-gray-400">₦4,000</div>
              <div className="text-xs text-gray-500">20% chance</div>
            </div>
            <div className="bg-dark-100 p-2 rounded text-center">
              <div className="text-sm text-gray-400">₦5,000</div>
              <div className="text-xs text-gray-500">15% chance</div>
            </div>
            <div className="bg-dark-100 p-2 rounded text-center">
              <div className="text-sm text-gray-400">₦6,000</div>
              <div className="text-xs text-gray-500">10% chance</div>
            </div>
            <div className="bg-dark-100 p-2 rounded text-center">
              <div className="text-sm text-gray-400">₦7,000</div>
              <div className="text-xs text-gray-500">10% chance</div>
            </div>
            <div className="bg-dark-100 p-2 rounded text-center">
              <div className="text-sm text-gray-400">₦8,000</div>
              <div className="text-xs text-gray-500">5% chance</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
