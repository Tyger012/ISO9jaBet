import React from 'react';
import { Match } from '@shared/schema';
import { useCountdown } from '@/hooks/useCountdown';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useBetting } from '@/context/BettingContext';
import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity } from 'lucide-react';

interface MatchCardProps {
  match: Match;
  isActive?: boolean;
  className?: string;
}

export function MatchCard({ match, isActive = false, className }: MatchCardProps) {
  const { 
    event_key: matchId,
    event_date: matchDate,
    event_time: matchTime,
    event_home_team: homeTeam,
    event_away_team: awayTeam,
    country_name: country,
    league_name: league,
    home_team_logo: homeLogo,
    away_team_logo: awayLogo,
    event_status: status,
    event_live: isLive,
    event_halftime_result: halftimeResult,
    event_final_result: finalResult,
    odds
  } = match;
  
  const { user } = useAuth();
  const isVip = user?.isVip || false;
  
  const { 
    addBet,
    selectedBets,
    matchesWithActiveBets
  } = useBetting();
  
  // Setup countdown - use useMemo to prevent re-creation of date object on every render
  const targetDate = React.useMemo(() => new Date(`${matchDate}T${matchTime}`), [matchDate, matchTime]);
  const countdown = useCountdown(targetDate);
  const isStarted = countdown.isComplete;
  
  // Check if this match is in selected bets
  const currentBet = selectedBets.find(bet => bet.matchId === matchId);
  const isAlreadyBetting = matchesWithActiveBets.includes(matchId);
  const isSelectableMatch = !isAlreadyBetting && !isStarted;
  
  // Set default logos if none provided
  const defaultLogo = "https://via.placeholder.com/50?text=Team";
  const homeLogoUrl = homeLogo || defaultLogo;
  const awayLogoUrl = awayLogo || defaultLogo;
  
  // Handle bet selection
  const handleBetSelection = (prediction: 'home' | 'draw' | 'away') => {
    if (!isSelectableMatch) return;
    
    const oddsValue = odds ? odds[prediction] : "1.0";
    addBet(matchId, prediction, oddsValue, match);
  };
  
  // Determine which bet is selected
  const selectedPrediction = currentBet?.prediction;
  
  return (
    <Card 
      className={cn(
        "bg-dark-50 shadow-lg transition-all border border-gray-700 hover:border-gray-600 overflow-hidden",
        isActive && "border-primary shadow-xl",
        !isSelectableMatch && "opacity-75",
        className
      )}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xs px-2 py-0.5 bg-dark-200 text-gray-400 rounded">{league}</span>
            <span className="text-xs text-gray-400">{country}</span>
          </div>
          <div className="flex items-center space-x-1">
            {isLive === "1" ? (
              <Badge variant="destructive" className="px-2 py-0.5 flex items-center space-x-1">
                <Activity className="w-3 h-3 animate-pulse" />
                <span className="text-xs">LIVE</span>
              </Badge>
            ) : status === "Finished" ? (
              <Badge variant="outline" className="px-2 py-0.5 bg-gray-800">
                <span className="text-xs text-gray-400">Finished</span>
              </Badge>
            ) : (
              <span className="text-xs text-orange-500 font-semibold flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span className="countdown">
                  {countdown.formatted}
                </span>
              </span>
            )}
          </div>
        </div>
        
        {/* Teams Info */}
        <div className="flex justify-between items-center">
          {/* Home Team */}
          <div className="flex flex-col items-center space-y-1 w-2/5">
            <div className="h-14 w-14 bg-dark-200 rounded-full p-1 flex items-center justify-center overflow-hidden">
              <img 
                src={homeLogoUrl} 
                alt={homeTeam} 
                className="h-11 w-11 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultLogo;
                }}
              />
            </div>
            <span className="text-sm text-center font-medium">{homeTeam}</span>
          </div>
          
          {/* Score/VS */}
          <div className="flex flex-col items-center justify-center w-1/5">
            {isLive === "1" || status === "Finished" ? (
              <div className="flex flex-col items-center">
                <span className="text-lg font-bold text-primary">
                  {finalResult || halftimeResult || "0 - 0"}
                </span>
                {status === "Finished" ? (
                  <span className="text-xs text-gray-400 mt-1">FT</span>
                ) : (
                  <span className="text-xs text-red-500 mt-1 animate-pulse">Live</span>
                )}
              </div>
            ) : (
              <span className="text-lg font-bold">VS</span>
            )}
          </div>
          
          {/* Away Team */}
          <div className="flex flex-col items-center space-y-1 w-2/5">
            <div className="h-14 w-14 bg-dark-200 rounded-full p-1 flex items-center justify-center overflow-hidden">
              <img 
                src={awayLogoUrl} 
                alt={awayTeam} 
                className="h-11 w-11 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultLogo;
                }}
              />
            </div>
            <span className="text-sm text-center font-medium">{awayTeam}</span>
          </div>
        </div>
        
        {/* Betting Options */}
        <div className="mt-4 grid grid-cols-3 gap-2">
          <Button
            variant="outline"
            className={cn(
              "flex flex-col h-auto py-2 bg-dark-200 hover:bg-green-900/30 border-gray-700",
              selectedPrediction === 'home' && "bg-green-900/30 border-green-500",
              !isSelectableMatch && "opacity-70 cursor-not-allowed"
            )}
            onClick={() => handleBetSelection('home')}
            disabled={!isSelectableMatch}
          >
            <span className={cn(
              "text-xs text-gray-400",
              selectedPrediction === 'home' && "text-green-400"
            )}>Home</span>
            <span className={cn(
              "font-semibold",
              selectedPrediction === 'home' && "text-green-400"
            )}>{odds?.home || '2.00'}</span>
          </Button>
          
          <Button
            variant="outline"
            className={cn(
              "flex flex-col h-auto py-2 bg-dark-200 hover:bg-green-900/30 border-gray-700",
              selectedPrediction === 'draw' && "bg-green-900/30 border-green-500",
              !isSelectableMatch && "opacity-70 cursor-not-allowed"
            )}
            onClick={() => handleBetSelection('draw')}
            disabled={!isSelectableMatch}
          >
            <span className={cn(
              "text-xs text-gray-400",
              selectedPrediction === 'draw' && "text-green-400"
            )}>Draw</span>
            <span className={cn(
              "font-semibold",
              selectedPrediction === 'draw' && "text-green-400"
            )}>{odds?.draw || '3.00'}</span>
          </Button>
          
          <Button
            variant="outline"
            className={cn(
              "flex flex-col h-auto py-2 bg-dark-200 hover:bg-green-900/30 border-gray-700",
              selectedPrediction === 'away' && "bg-green-900/30 border-green-500",
              !isSelectableMatch && "opacity-70 cursor-not-allowed"
            )}
            onClick={() => handleBetSelection('away')}
            disabled={!isSelectableMatch}
          >
            <span className={cn(
              "text-xs text-gray-400",
              selectedPrediction === 'away' && "text-green-400"
            )}>Away</span>
            <span className={cn(
              "font-semibold",
              selectedPrediction === 'away' && "text-green-400"
            )}>{odds?.away || '4.00'}</span>
          </Button>
        </div>
        
        {isAlreadyBetting && (
          <div className="mt-2 text-center">
            <span className="text-xs text-primary">
              You already have an active bet on this match
            </span>
          </div>
        )}
        
        {isStarted && !isLive && status !== "Finished" && (
          <div className="mt-2 text-center">
            <span className="text-xs text-yellow-500">
              This match has already started
            </span>
          </div>
        )}
        
        {isLive === "1" && (
          <div className="mt-2 text-center">
            <span className="text-xs text-red-400 flex items-center justify-center">
              <Activity className="w-3 h-3 mr-1 animate-pulse" />
              Match in progress: {status}
            </span>
          </div>
        )}
        
        {status === "Finished" && (
          <div className="mt-2 text-center">
            <span className="text-xs text-gray-400">
              Match completed with result: {finalResult}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
