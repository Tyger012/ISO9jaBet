import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBetting } from '@/context/BettingContext';
import { X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function BetSlip() {
  const { 
    selectedBets, 
    removeBet, 
    clearBets, 
    confirmBets, 
    potentialReturn,
    potentialLoss,
    isLoading
  } = useBetting();
  
  const { user } = useAuth();
  const isVip = user?.isVip || false;
  
  if (selectedBets.length === 0) {
    return null;
  }
  
  return (
    <section className="px-4 py-6 bg-dark-200">
      <div className="container mx-auto">
        <h2 className="text-xl font-heading font-bold mb-4">Your Current Predictions</h2>
        
        <Card className="bg-dark-50 shadow border border-gray-700">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Selected Matches ({selectedBets.length})</span>
              <Button 
                variant="ghost" 
                className="text-xs text-red-400 hover:text-red-300 h-auto py-1 px-2"
                onClick={clearBets}
              >
                Clear All
              </Button>
            </div>
            
            <div className="space-y-3">
              {selectedBets.map((bet) => (
                <div key={bet.matchId} className="flex items-center justify-between p-3 bg-dark-100 rounded-lg border border-gray-700">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">
                        {bet.match.event_home_team} vs {bet.match.event_away_team}
                      </span>
                      <span className="text-xs text-gray-400">{bet.match.league_name}</span>
                    </div>
                    <div className="flex mt-1">
                      <span className="text-xs text-primary">
                        Your pick: <span className="font-semibold">
                          {bet.prediction === 'home' ? 'Home Win' : 
                           bet.prediction === 'away' ? 'Away Win' : 'Draw'} ({bet.odds})
                        </span>
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    className="ml-2 text-gray-400 hover:text-red-400 h-auto p-1"
                    onClick={() => removeBet(bet.matchId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-dark-100 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm">Potential Return:</span>
                <span className="text-lg font-heading font-bold text-accent">₦{potentialReturn.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-400">If predictions fail:</span>
                <span className="text-xs text-red-400">-₦{potentialLoss.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <Button
                className="w-full py-3 bg-primary hover:bg-primary/90 text-white font-semibold"
                onClick={confirmBets}
                disabled={isLoading}
              >
                Confirm Predictions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
