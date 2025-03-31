import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Match, Bet } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useMatches() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { 
    data: matches = [],
    isLoading: isLoadingMatches,
    isError: isMatchesError,
    error: matchesError,
    refetch: refetchMatches
  } = useQuery<Match[]>({
    queryKey: ['/api/upcoming-matches'],
  });
  
  const { 
    data: myBets = [],
    isLoading: isLoadingBets,
    isError: isBetsError,
    error: betsError,
    refetch: refetchBets
  } = useQuery<Bet[]>({
    queryKey: ['/api/my-bets'],
  });
  
  const placeBet = useMutation({
    mutationFn: async (betData: { matchId: string; prediction: string; odds: string }) => {
      const res = await apiRequest('POST', '/api/place-bet', betData);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-bets'] });
      toast({
        title: 'Bet Placed!',
        description: 'Your prediction has been submitted. Good luck!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Bet Failed',
        description: error.message || 'Could not place your bet',
        variant: 'destructive',
      });
    },
  });
  
  const checkBetResults = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/check-bet-results', {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-bets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      
      if (data.results && data.results.length > 0) {
        const wins = data.results.filter((result: any) => result.status === 'won').length;
        const losses = data.results.filter((result: any) => result.status === 'lost').length;
        
        if (wins > 0 || losses > 0) {
          toast({
            title: 'Bet Results Updated!',
            description: `You have ${wins} new win(s) and ${losses} new loss(es).`,
          });
        } else {
          toast({
            title: 'No New Results',
            description: 'There are no new bet results to report.',
          });
        }
      } else {
        toast({
          title: 'No New Results',
          description: 'There are no new bet results to report.',
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to Check Results',
        description: error.message || 'Could not check your bet results',
        variant: 'destructive',
      });
    },
  });
  
  // Get current active bets (pending ones)
  const activeBets = myBets.filter(bet => bet.status === 'pending');
  
  // Filter matches that already have active bets
  const matchesWithActiveBets = activeBets.map(bet => bet.matchId);
  
  // Function to clear all bets
  const clearBets = () => {
    // In a real app, we would have an API endpoint to clear bets
    // For now, we'll just show a toast
    toast({
      title: 'Not Implemented',
      description: 'Clearing bets is not implemented in this demo',
    });
  };
  
  return {
    matches,
    myBets,
    activeBets,
    matchesWithActiveBets,
    isLoadingMatches,
    isMatchesError,
    matchesError,
    isLoadingBets,
    isBetsError,
    betsError,
    placeBet,
    checkBetResults,
    refetchMatches,
    refetchBets,
    clearBets,
  };
}
