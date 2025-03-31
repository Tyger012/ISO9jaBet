import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { WithdrawalForm } from '@/components/WithdrawalForm';
import { LuckySpin } from '@/components/LuckySpin';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { useMatches } from '@/hooks/useMatches';
import { Button } from '@/components/ui/button';
import { 
  Wallet as WalletIcon, 
  RefreshCcw, 
  ArrowDownCircle, 
  Info,
  TrendingUp,
} from 'lucide-react';

export default function Wallet() {
  const { user } = useAuth();
  const { checkBetResults } = useMatches();
  
  const balance = user?.balance || 0;
  const isVip = user?.isVip || false;
  
  // Handle check results
  const handleCheckResults = () => {
    checkBetResults.mutate();
  };
  
  return (
    <MainLayout>
      <section className="px-4 py-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-heading font-bold mb-4">My Wallet</h1>
          
          {/* Balance Card */}
          <Card className="bg-gradient-to-r from-dark-50 to-dark-100 border-gray-700 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <WalletIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-lg font-medium">Current Balance</span>
                </div>
                {isVip && (
                  <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full">
                    VIP
                  </span>
                )}
              </div>
              
              <div className="text-3xl font-heading font-bold text-white mb-3">
                ₦{balance.toLocaleString()}
              </div>
              
              <div className="space-y-2 mt-4">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                  onClick={handleCheckResults}
                  disabled={checkBetResults.isPending}
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  {checkBetResults.isPending ? 'Checking...' : 'Check Bet Results'}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full bg-dark-50 hover:bg-dark-50/90 text-white border-gray-700"
                  onClick={() => window.location.href = '#withdrawal-section'}
                >
                  <ArrowDownCircle className="h-4 w-4 mr-2" />
                  Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Earnings & Rules */}
          <Card className="bg-dark-50 border-gray-700 mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-heading font-bold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-accent" />
                Earnings & Rules
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-dark-100 rounded-lg border border-gray-700">
                  <h3 className="font-medium text-white mb-2">Betting Rewards</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-green-900/20 text-green-500 flex items-center justify-center mr-2 mt-0.5">+</span>
                      <span>Win: <strong className="text-green-500">₦{isVip ? '7,500' : '5,000'}</strong> per correct match prediction</span>
                    </li>
                    <li className="flex items-start">
                      <span className="h-5 w-5 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center mr-2 mt-0.5">-</span>
                      <span>Loss: <strong className="text-red-500">₦{isVip ? '1,000' : '2,000'}</strong> per incorrect match prediction</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 bg-dark-100 rounded-lg border border-gray-700">
                  <h3 className="font-medium text-white mb-2">Withdrawal Rules</h3>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start">
                      <Info className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Minimum withdrawal: <strong>₦30,000</strong></span>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Account Box Breaking Fee: <strong>₦3,000</strong></span>
                    </li>
                    <li className="flex items-start">
                      <Info className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                      <span>Withdrawal Activation Key required: <strong>197200</strong></span>
                    </li>
                  </ul>
                </div>
                
                {isVip ? (
                  <div className="p-4 bg-accent/10 rounded-lg border border-accent/30">
                    <h3 className="font-medium text-white mb-2 flex items-center">
                      <span className="h-5 w-5 rounded-full bg-accent/20 flex items-center justify-center mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-accent" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </span>
                      VIP Benefits Active
                    </h3>
                    <p className="text-sm text-gray-400">You're enjoying enhanced earning rates and reduced penalties.</p>
                  </div>
                ) : (
                  <div className="p-4 bg-dark-100 rounded-lg border border-gray-700">
                    <h3 className="font-medium text-white mb-2">VIP Benefits</h3>
                    <p className="text-sm text-gray-400 mb-3">Activate VIP status to enjoy enhanced rates.</p>
                    <Button 
                      className="w-full bg-accent hover:bg-accent/90 text-white"
                      onClick={() => window.location.href = '/'}
                    >
                      Upgrade to VIP
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Lucky Spin */}
          <LuckySpin />
          
          {/* Withdrawal Form */}
          <div id="withdrawal-section">
            <WithdrawalForm />
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
