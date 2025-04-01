import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Match, Bet } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export function useMatches() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const { 
    data: upcomingMatches = [],
    isLoading: isLoadingUpcomingMatches,
    isError: isUpcomingMatchesError,
    error: upcomingMatchesError,
    refetch: refetchUpcomingMatches
  } = useQuery<Match[]>({
    queryKey: ['/api/upcoming-matches'],
  });
  
  const { 
    data: liveMatches = [],
    isLoading: isLoadingLiveMatches,
    isError: isLiveMatchesError,
    error: liveMatchesError,
    refetch: refetchLiveMatches
  } = useQuery<Match[]>({
    queryKey: ['/api/live-matches'],
    refetchInterval: 60000, // Refetch live matches every minute
  });
  
  // Combine live and upcoming matches
  const matches = [...liveMatches, ...upcomingMatches.filter(um => 
    !liveMatches.some(lm => lm.event_key === um.event_key)
  )];
  
  const isLoadingMatches = isLoadingUpcomingMatches || isLoadingLiveMatches;
  const isMatchesError = isUpcomingMatchesError || isLiveMatchesError;
  const matchesError = upcomingMatchesError || liveMatchesError;
  
  const refetchMatches = () => {
    refetchUpcomingMatches();
    refetchLiveMatches();
  };
  
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
      return await apiRequest<Bet>('POST', '/api/place-bet', betData);
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
  
  type BetResultsResponse = {
    user: any;
    results?: Array<{status: string}>;
  };
  
  const checkBetResults = useMutation({
    mutationFn: async () => {
      return await apiRequest<BetResultsResponse>('POST', '/api/check-bet-results', {});
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/my-bets'] });
      queryClient.invalidateQueries({ queryKey: ['/api/me'] });
      
      if (data.results && data.results.length > 0) {
        const wins = data.results.filter((result) => result.status === 'won').length;
        const losses = data.results.filter((result) => result.status === 'lost').length;
        
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
    liveMatches,
    upcomingMatches,
    myBets,
    activeBets,
    matchesWithActiveBets,
    isLoadingMatches,
    isMatchesError,
    matchesError,
    isLoadingLiveMatches,
    isLiveMatchesError,
    liveMatchesError,
    isLoadingUpcomingMatches,
    isUpcomingMatchesError,
    upcomingMatchesError,
    isLoadingBets,
    isBetsError,
    betsError,
    placeBet,
    checkBetResults,
    refetchMatches,
    refetchLiveMatches,
    refetchUpcomingMatches,
    refetchBets,
    clearBets,
  };
}
