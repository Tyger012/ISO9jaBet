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
                  <p className="text-sm text-gray-400 mt-1">You earn ₦7,500 per match instead of ₦5,000</p>
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
                <p className="text-sm text-gray-400 mt-1">Earn ₦7,500 per match instead of ₦5,000</p>
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
              <p className="text-sm text-gray-400 mt-1">Send ₦5,000 to the ISO9jaBet account and enter the activation key below</p>
              
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
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
              <p className="text-xs text-gray-500 mt-2">VIP Activation Key: Enter activation code provided by admin</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
