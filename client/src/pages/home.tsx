import React, { useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useMatches } from '@/hooks/useMatches';
import { MatchCard } from '@/components/MatchCard';
import { BetSlip } from '@/components/BetSlip';
import { LiveFeed } from '@/components/LiveFeed';
import { LiveMatchesFeed } from '@/components/LiveMatchesFeed';
import { Leaderboard } from '@/components/Leaderboard';
import { LuckySpin } from '@/components/LuckySpin';
import { VIPActivation } from '@/components/VIPActivation';
import { WithdrawalForm } from '@/components/WithdrawalForm';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';

export default function Home() {
  const { matches, isLoadingMatches, refetchMatches, checkBetResults } = useMatches();
  const { user } = useAuth();
  const isVip = user?.isVip || false;
  const [currentPage, setCurrentPage] = React.useState(0);
  const matchesPerPage = 3;
  
  // Check for bet results on load
  useEffect(() => {
    if (user) {
      checkBetResults.mutate();
    }
  }, [user]);
  
  // Calculate pagination
  const totalPages = Math.ceil((matches?.length || 0) / matchesPerPage);
  const paginatedMatches = matches?.slice(
    currentPage * matchesPerPage, 
    (currentPage + 1) * matchesPerPage
  );
  
  // Navigation functions
  const goToPreviousPage = () => {
    setCurrentPage(current => Math.max(0, current - 1));
  };
  
  const goToNextPage = () => {
    setCurrentPage(current => Math.min(totalPages - 1, current + 1));
  };
  
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-dark-200 to-dark-100 px-4 py-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-white">Predict & Win Big</h1>
              <p className="text-gray-300 mt-2">Predict matches correctly and win up to ₦<span className="text-accent font-semibold">{isVip ? '7,500' : '3,000'}</span> per match</p>
              <div className="mt-4 flex space-x-3">
                <Button 
                  variant="default"
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => document.getElementById('matches-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Start Betting
                </Button>
                <Button 
                  variant="outline"
                  className="bg-dark-50 hover:bg-dark-50/90 text-white border-gray-700"
                  onClick={() => window.location.href = '/history'}
                >
                  My History
                </Button>
              </div>
              
              {/* PWA Install Alert - Only visible on small screens */}
              <Alert className="mt-4 md:hidden bg-primary/20 border border-primary shadow-lg">
                <AlertDescription className="text-sm font-medium text-white">
                  To install ISO9jaBet: tap <span className="inline-block"><Download className="h-4 w-4 inline text-primary" /></span> then "Add to Home Screen"
                </AlertDescription>
              </Alert>
            </div>
            
            {/* Lucky Spin Preview */}
            <div className="hidden md:block relative w-32 h-32 shrink-0">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-accent via-primary to-secondary animate-spin-slow"></div>
              <div className="absolute inset-2 rounded-full bg-dark-100 flex items-center justify-center">
                <span className="text-white font-heading font-bold">Lucky Spin</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Live Matches Section */}
      <section className="px-4 pt-6 pb-0">
        <div className="container mx-auto">
          <LiveMatchesFeed />
        </div>
      </section>
      
      {/* Matches Section */}
      <section id="matches-section" className="px-4 py-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold">Upcoming Matches</h2>
            <div className="flex space-x-1">
              <Button 
                size="icon" 
                variant="outline" 
                className="p-1.5 bg-dark-50 rounded-md"
                onClick={goToPreviousPage}
                disabled={currentPage === 0}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                className="p-1.5 bg-dark-50 rounded-md"
                onClick={goToNextPage}
                disabled={currentPage >= totalPages - 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {isLoadingMatches ? (
            <div className="flex justify-center items-center p-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Match Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedMatches?.map((match) => (
                  <MatchCard key={match.event_key} match={match} />
                ))}
                
                {(!paginatedMatches || paginatedMatches.length === 0) && (
                  <div className="col-span-3 text-center p-12 bg-dark-50 rounded-lg border border-gray-700">
                    <p className="text-gray-400">No upcoming matches found</p>
                  </div>
                )}
              </div>
              
              {matches && matches.length > matchesPerPage && (
                <div className="mt-4 text-center">
                  <Button 
                    variant="outline" 
                    className="px-4 py-2 bg-dark-50 hover:bg-dark-50/80 text-white border-gray-700"
                    onClick={() => window.location.href = '/matches'}
                  >
                    View More Matches
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      
      {/* Bet Slip */}
      <BetSlip />
      
      {/* Live Feed & Leaderboard */}
      <section className="px-4 py-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Live Transactions */}
            <div>
              <h2 className="text-xl font-heading font-bold mb-4">Live Withdrawals</h2>
              <LiveFeed />
            </div>
            
            {/* Leaderboard */}
            <div>
              <h2 className="text-xl font-heading font-bold mb-4">Top Players</h2>
              <Leaderboard />
            </div>
          </div>
        </div>
      </section>
      
      {/* Lucky Spin Section */}
      <LuckySpin />
      
      {/* VIP Activation Section */}
      <VIPActivation />
      
      {/* Withdrawal Section */}
      <WithdrawalForm />
    </MainLayout>
  );
}
