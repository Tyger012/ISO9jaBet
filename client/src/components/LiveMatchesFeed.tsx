import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Timer } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { useMatches } from '@/hooks/useMatches';
import { Match } from '@shared/schema';
import { cn } from '@/lib/utils';

export function LiveMatchesFeed() {
  const { 
    liveMatches = [], 
    isLoadingLiveMatches, 
    isLiveMatchesError,
    refetchLiveMatches
  } = useMatches();
  
  // Refresh live matches periodically
  useEffect(() => {
    const interval = setInterval(() => {
      refetchLiveMatches();
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [refetchLiveMatches]);
  
  if (isLoadingLiveMatches) {
    return (
      <div className="flex justify-center items-center h-52">
        <Spinner />
      </div>
    );
  }
  
  if (isLiveMatchesError) {
    return (
      <div className="text-center p-4 text-red-400">
        Failed to load live matches. Please try again.
      </div>
    );
  }
  
  if (liveMatches.length === 0) {
    return (
      <Card className="bg-dark-50 rounded-lg shadow border border-gray-700 overflow-hidden">
        <CardContent className="p-4">
          <div className="flex flex-col items-center justify-center h-40">
            <p className="text-sm text-gray-400">No live matches at the moment</p>
            <p className="text-xs text-gray-500 mt-1">Check back soon for upcoming games</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-dark-50 rounded-lg shadow border border-gray-700 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium flex items-center">
            <Activity className="w-4 h-4 mr-2 text-red-400" />
            Live Matches
          </h3>
          <Badge variant="outline" className="px-2 py-0.5 text-xs">
            {liveMatches.length} Live
          </Badge>
        </div>
        
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {liveMatches.map((match: Match) => (
            <LiveMatchItem key={match.event_key} match={match} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LiveMatchItem({ match }: { match: Match }) {
  const {
    event_home_team: homeTeam,
    event_away_team: awayTeam,
    home_team_logo: homeLogo,
    away_team_logo: awayLogo,
    event_status: status,
    event_halftime_result: halftimeResult,
    event_final_result: finalResult,
    league_name: league
  } = match;
  
  const score = finalResult || halftimeResult || '0 - 0';
  
  // Indicator color based on match status
  const getStatusColor = () => {
    if (status.includes('Half')) return 'text-yellow-500';
    if (status.includes('Finished')) return 'text-gray-400';
    return 'text-red-400 animate-pulse';
  };
  
  // Default logo fallback
  const defaultLogo = "https://via.placeholder.com/30?text=Team";
  
  return (
    <div className="p-2 bg-dark-100 rounded-lg border border-gray-700 overflow-hidden">
      <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
        <span>{league}</span>
        <div className="flex items-center">
          <Timer className="w-3 h-3 mr-1" />
          <span className={cn(getStatusColor())}>{status}</span>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center w-[40%]">
          <div className="h-5 w-5 rounded-full bg-dark-200 overflow-hidden mr-2">
            <img 
              src={homeLogo || defaultLogo} 
              alt={homeTeam}
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultLogo;
              }}
            />
          </div>
          <span className="text-sm truncate">{homeTeam}</span>
        </div>
        
        <div className="text-center w-[20%]">
          <span className="text-base font-bold text-primary">{score}</span>
        </div>
        
        <div className="flex items-center justify-end w-[40%]">
          <span className="text-sm truncate text-right">{awayTeam}</span>
          <div className="h-5 w-5 rounded-full bg-dark-200 overflow-hidden ml-2">
            <img 
              src={awayLogo || defaultLogo} 
              alt={awayTeam}
              className="h-full w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultLogo;
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}