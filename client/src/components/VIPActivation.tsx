import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/hooks/useUser';
import { useToast } from '@/hooks/use-toast';
import { Crown, DollarSign, Shield, Activity } from 'lucide-react';

export function VIPActivation() {
  const { user, activateVip } = useUser();
  const { toast } = useToast();
  const [activationKey, setActivationKey] = useState('');
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  
  const isVip = user?.isVip || false;
  
  const handleActivate = async () => {
    if (!activationKey) {
      toast({
        title: 'Activation Key Required',
        description: 'Please enter the VIP activation key',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      await activateVip.mutateAsync(activationKey);
    } catch (error) {
      // Error is handled in the mutation
    }
  };
  
  const handlePaymentSubmission = async () => {
    try {
      await activateVip.mutateAsync({ activationKey: "PAYMENT", hasMadePayment: true });
      setPaymentSubmitted(true);
      toast({
        title: 'Payment Notification Sent',
        description: 'Your payment notification has been sent. The admin will verify and activate your VIP status.',
        variant: 'default',
      });
    } catch (error) {
      // Error is handled in the mutation
    }
  };
  
  if (isVip) {
    return (
      <section className="px-4 py-6">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-dark-50 to-dark-100 rounded-lg shadow-lg border border-accent/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
              <Crown className="h-24 w-24 text-accent" />
            </div>
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-bold flex items-center">
                <Crown className="text-accent mr-2 h-6 w-6" />
                VIP Status Active
              </h2>
              <p className="text-gray-400 mt-2">You are enjoying exclusive VIP benefits</p>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-100 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-center items-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-3">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-white">4 Matches</h3>
                  <p className="text-sm text-gray-400 mt-1">You can bet on 4 matches at once</p>
                </div>
                
                <div className="bg-dark-100 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-center items-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-3">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-white">Higher Winnings</h3>
                  <p className="text-sm text-gray-400 mt-1">You earn ₦7,500 per match instead of ₦3,000</p>
                </div>
                
                <div className="bg-dark-100 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-center items-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-3">
                    <Shield className="h-5 w-5" />
                  </div>
                  <h3 className="font-medium text-white">Lower Penalties</h3>
                  <p className="text-sm text-gray-400 mt-1">You lose only ₦1,000 instead of ₦2,000 per wrong prediction</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }
  
  return (
    <section className="px-4 py-6">
      <div className="container mx-auto">
        <Card className="bg-gradient-to-r from-dark-50 to-dark-100 rounded-lg shadow-lg border border-gray-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
            <Crown className="h-24 w-24 text-accent" />
          </div>
          <CardContent className="p-6">
            <h2 className="text-xl font-heading font-bold flex items-center">
              <Crown className="text-accent mr-2 h-6 w-6" />
              Upgrade to VIP Status
            </h2>
            <p className="text-gray-400 mt-2">Enhance your betting experience with exclusive VIP benefits</p>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-dark-100 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-center items-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-3">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white">Bet on 4 Matches</h3>
                <p className="text-sm text-gray-400 mt-1">Double your betting options from 2 to 4 matches</p>
              </div>
              
              <div className="bg-dark-100 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-center items-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-3">
                  <DollarSign className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white">Higher Winnings</h3>
                <p className="text-sm text-gray-400 mt-1">Earn ₦7,500 per match instead of ₦3,000</p>
              </div>
              
              <div className="bg-dark-100 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-center items-center h-10 w-10 rounded-full bg-accent/20 text-accent mb-3">
                  <Shield className="h-5 w-5" />
                </div>
                <h3 className="font-medium text-white">Lower Penalties</h3>
                <p className="text-sm text-gray-400 mt-1">Lose only ₦1,000 instead of ₦2,000 per wrong prediction</p>
              </div>
            </div>
            
            <div className="mt-6 bg-dark-100 p-4 rounded-lg border border-gray-700">
              <h3 className="font-medium text-white">Activate VIP Status</h3>
              <p className="text-sm text-gray-400 mt-1">Send ₦5,000 to purchase your VIP activation key</p>
              
              <div className="mt-3 p-3 bg-dark-200 rounded border border-gray-600 mb-4">
                <h4 className="text-sm font-medium text-accent mb-2">Payment Account Details</h4>
                <div className="p-2 bg-dark-300 rounded text-xs">
                  <p className="flex justify-between"><span className="text-gray-400">Bank:</span> <span className="text-white font-medium">OPay</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Account Number:</span> <span className="text-white font-medium">6100827551</span></p>
                  <p className="flex justify-between"><span className="text-gray-400">Account Name:</span> <span className="text-white font-medium">OMOBANKE JUMOKE ADEKAYERO</span></p>
                </div>
                <p className="text-xs text-gray-400 mt-2">After payment, click the button below or enter your activation key</p>
              </div>
              
              {paymentSubmitted ? (
                <div className="mt-4 p-3 bg-green-900/20 border border-green-500/50 rounded-lg">
                  <p className="text-sm text-green-500 flex items-center">
                    <span className="flex items-center justify-center bg-green-500/20 rounded-full w-5 h-5 mr-2">✓</span>
                    Payment notification submitted
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Your VIP status will be activated soon after payment verification.
                  </p>
                </div>
              ) : (
                <Button
                  className="w-full mt-3 mb-4 bg-green-600 hover:bg-green-700 text-white font-medium"
                  onClick={handlePaymentSubmission}
                  disabled={activateVip.isPending}
                >
                  {activateVip.isPending ? 'Processing...' : 'I\'ve Made the Payment'}
                </Button>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="text"
                  placeholder="Enter activation key"
                  className="flex-1 bg-dark-50 text-white border border-gray-700 focus:ring-accent"
                  value={activationKey}
                  onChange={(e) => setActivationKey(e.target.value)}
                />
                <Button 
                  className="px-6 py-2 bg-accent hover:bg-accent/90 text-white font-semibold whitespace-nowrap"
                  onClick={handleActivate}
                  disabled={activateVip.isPending}
                >
                  {activateVip.isPending ? 'Activating...' : 'Activate VIP'}
                </Button>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
