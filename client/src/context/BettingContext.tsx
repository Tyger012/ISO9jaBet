import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Match } from '@shared/schema';
import { useMatches } from '@/hooks/useMatches';
import { useAuth } from '@/context/AuthContext';

interface BettingContextType {
  selectedBets: Array<{
    matchId: string;
    prediction: string;
    odds: string;
    match: Match;
  }>;
  isSelecting: boolean;
  addBet: (matchId: string, prediction: string, odds: string, match: Match) => void;
  removeBet: (matchId: string) => void;
  clearBets: () => void;
  confirmBets: () => Promise<void>;
  potentialReturn: number;
  potentialLoss: number;
  isLoading: boolean;
  matches: Match[];
  myBets: any[];
  activeBets: any[];
  matchesWithActiveBets: string[];
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export function BettingProvider({ children }: { children: ReactNode }) {
  const [selectedBets, setSelectedBets] = useState<Array<{
    matchId: string;
    prediction: string;
    odds: string;
    match: Match;
  }>>([]);
  
  const [isSelecting, setIsSelecting] = useState(false);
  
  const { 
    matches, 
    myBets, 
    activeBets,
    matchesWithActiveBets,
    placeBet,
    isLoadingMatches,
    isLoadingBets
  } = useMatches();
  
  const isLoading = isLoadingMatches || isLoadingBets;
  
  // Get user VIP status from auth context
  const { user } = useAuth();
  const isVip = user?.isVip || false;
  
  // Calculate potential return and loss
  const winAmount = isVip ? 7500 : 5000;
  const lossAmount = isVip ? 1000 : 2000;
  const potentialReturn = selectedBets.length * winAmount;
  const potentialLoss = selectedBets.length * lossAmount;
  
  const addBet = (matchId: string, prediction: string, odds: string, match: Match) => {
    // Check if already in selected bets
    const existingIndex = selectedBets.findIndex(bet => bet.matchId === matchId);
    
    // Check for max bet limit based on VIP status
    const maxBets = isVip ? 4 : 2;
    if (selectedBets.length >= maxBets && existingIndex === -1) {
      return; // Cannot add more bets beyond the limit
    }
    
    if (existingIndex !== -1) {
      // Update the existing bet
      const updatedBets = [...selectedBets];
      updatedBets[existingIndex] = { matchId, prediction, odds, match };
      setSelectedBets(updatedBets);
    } else {
      // Add new bet
      setSelectedBets([...selectedBets, { matchId, prediction, odds, match }]);
    }
    
    setIsSelecting(true);
  };
  
  const removeBet = (matchId: string) => {
    setSelectedBets(selectedBets.filter(bet => bet.matchId !== matchId));
    
    if (selectedBets.length <= 1) {
      setIsSelecting(false);
    }
  };
  
  const clearBets = () => {
    setSelectedBets([]);
    setIsSelecting(false);
  };
  
  const confirmBets = async () => {
    setIsSelecting(false);
    
    // Submit each bet to the API
    for (const bet of selectedBets) {
      await placeBet.mutateAsync({
        matchId: bet.matchId,
        prediction: bet.prediction,
        odds: bet.odds
      });
    }
    
    // Clear selected bets after submission
    setSelectedBets([]);
  };
  
  return (
    <BettingContext.Provider 
      value={{ 
        selectedBets,
        isSelecting,
        addBet,
        removeBet,
        clearBets,
        confirmBets,
        potentialReturn,
        potentialLoss,
        isLoading,
        matches,
        myBets,
        activeBets,
        matchesWithActiveBets
      }}
    >
      {children}
    </BettingContext.Provider>
  );
}

export function useBetting() {
  const context = useContext(BettingContext);
  if (context === undefined) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
}
