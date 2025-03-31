import React, { useState } from 'react';
import { LuckyWheel } from '@/components/ui/lucky-wheel';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { Trophy } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

export function LuckySpin() {
  const { user, spinLuckyWheel } = useUser();
  const { toast } = useToast();
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [showResultDialog, setShowResultDialog] = useState(false);
  
  // Every user can spin once per 24 hours regardless of balance
  const canSpin = !!user as boolean;
  
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
    setShowResultDialog(false);
    
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
      // Show trophy dialog instead of toast
      setShowResultDialog(true);
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
              disabled={isSpinning || hasSpunToday || !canSpin}
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
            <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-3 rounded-lg text-center shadow-md">
              <div className="text-sm text-white font-medium">₦3,000</div>
              <div className="text-xs text-gray-400 mt-1">40% chance</div>
            </div>
            <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-3 rounded-lg text-center shadow-md">
              <div className="text-sm text-white font-medium">₦4,000</div>
              <div className="text-xs text-gray-400 mt-1">20% chance</div>
            </div>
            <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-3 rounded-lg text-center shadow-md">
              <div className="text-sm text-white font-medium">₦5,000</div>
              <div className="text-xs text-gray-400 mt-1">15% chance</div>
            </div>
            <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-3 rounded-lg text-center shadow-md">
              <div className="text-sm text-white font-medium">₦6,000</div>
              <div className="text-xs text-gray-400 mt-1">10% chance</div>
            </div>
            <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-3 rounded-lg text-center shadow-md">
              <div className="text-sm text-white font-medium">₦7,000</div>
              <div className="text-xs text-gray-400 mt-1">10% chance</div>
            </div>
            <div className="bg-gradient-to-br from-dark-100 to-dark-200 p-3 rounded-lg text-center shadow-md">
              <div className="text-sm text-white font-medium">₦8,000</div>
              <div className="text-xs text-gray-400 mt-1">5% chance</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trophy Dialog for Spin Results */}
      <Dialog open={showResultDialog} onOpenChange={setShowResultDialog}>
        <DialogContent className="sm:max-w-md bg-gradient-to-b from-dark-100 to-dark-200 border border-yellow-600/30 shadow-xl">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold text-yellow-500">Congratulations!</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center py-6 space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Trophy className="w-20 h-20 text-yellow-500" />
              </div>
              <div className="w-36 h-36 rounded-full bg-gradient-to-r from-yellow-600/20 via-yellow-500/20 to-yellow-600/20 flex items-center justify-center animate-pulse" />
              {/* Light rays animation */}
              <div className="absolute inset-0 z-0">
                <div className="w-full h-full absolute opacity-30">
                  {[...Array(8)].map((_, i) => (
                    <div 
                      key={i} 
                      className="absolute top-1/2 left-1/2 w-1 h-12 bg-yellow-500/50 animate-pulse"
                      style={{ 
                        transform: `rotate(${i * 45}deg) translateY(-150%)` 
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="text-center space-y-3 bg-dark-300/50 p-5 rounded-xl backdrop-blur-sm w-full">
              <h3 className="text-2xl font-bold text-yellow-400">You Won</h3>
              <p className="text-4xl font-bold text-white">₦{spinResult?.toLocaleString()}</p>
              <p className="text-gray-300 text-sm mt-2">
                The amount has been added to your account balance
              </p>
            </div>
          </div>
          
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={() => setShowResultDialog(false)}
              className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white font-medium px-8"
            >
              Continue Betting
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
