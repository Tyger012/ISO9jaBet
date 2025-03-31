import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { useMatches } from '@/hooks/useMatches';
import { MatchCard } from '@/components/MatchCard';
import { BetSlip } from '@/components/BetSlip';
import { LiveMatchesFeed } from '@/components/LiveMatchesFeed';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Match } from '@shared/schema';
import { Search, Calendar, Activity } from 'lucide-react';

export default function Matches() {
  const { matches, liveMatches, isLoadingMatches } = useMatches();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showLiveOnly, setShowLiveOnly] = useState(false);
  
  const liveMatchesCount = liveMatches?.length || 0;
  
  // Get unique countries and leagues for filters
  const uniqueCountries = new Set<string>();
  const uniqueLeagues = new Set<string>();
  
  matches?.forEach(match => {
    if (match.country_name) uniqueCountries.add(match.country_name);
    if (match.league_name) uniqueLeagues.add(match.league_name);
  });
  
  const countries = Array.from(uniqueCountries);
  const leagues = Array.from(uniqueLeagues);
  
  // Filter and search matches
  const filteredMatches = (showLiveOnly ? liveMatches : matches)?.filter((match: Match) => {
    const matchesSearch = 
      match.event_home_team.toLowerCase().includes(searchTerm.toLowerCase()) || 
      match.event_away_team.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.country_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      match.league_name.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (filter === 'all') return matchesSearch;
    
    // Filter by country or league
    if (filter.startsWith('country:')) {
      const country = filter.replace('country:', '');
      return matchesSearch && match.country_name === country;
    }
    
    if (filter.startsWith('league:')) {
      const league = filter.replace('league:', '');
      return matchesSearch && match.league_name === league;
    }
    
    return matchesSearch;
  });
  
  return (
    <MainLayout>
      <section className="px-4 py-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-heading font-bold">All Matches</h1>
            
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={showLiveOnly} 
                  onCheckedChange={setShowLiveOnly}
                  className="data-[state=checked]:bg-red-500"
                />
                <span className="text-sm font-medium flex items-center">
                  <Activity className="h-4 w-4 mr-1 text-red-500" />
                  Live Only
                  {liveMatchesCount > 0 && (
                    <Badge variant="destructive" className="ml-2">{liveMatchesCount}</Badge>
                  )}
                </span>
              </div>
            </div>
          </div>
          
          {/* Live Matches Section */}
          {!showLiveOnly && liveMatchesCount > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold flex items-center">
                  <Activity className="h-4 w-4 mr-2 text-red-500" />
                  Live Matches
                  <Badge variant="destructive" className="ml-2">{liveMatchesCount}</Badge>
                </h2>
              </div>
              <div className="overflow-auto pb-2">
                <LiveMatchesFeed />
              </div>
            </div>
          )}
          
          {/* Search and Filters */}
          <div className="mb-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search teams, leagues, countries..."
                className="pl-10 bg-dark-50 border-gray-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full md:w-[200px] bg-dark-50 border-gray-700">
                <SelectValue placeholder="Filter matches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Matches</SelectItem>
                <SelectItem value="divider" disabled className="py-2 px-2 text-xs font-semibold text-gray-500 bg-dark-200">
                  COUNTRIES
                </SelectItem>
                {countries.map(country => (
                  <SelectItem key={country} value={`country:${country}`}>{country}</SelectItem>
                ))}
                <SelectItem value="divider2" disabled className="py-2 px-2 text-xs font-semibold text-gray-500 bg-dark-200">
                  LEAGUES
                </SelectItem>
                {leagues.map(league => (
                  <SelectItem key={league} value={`league:${league}`}>{league}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {isLoadingMatches ? (
            <div className="flex justify-center items-center p-12">
              <Spinner size="lg" />
            </div>
          ) : (
            <>
              {/* Match Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMatches?.map((match) => (
                  <MatchCard key={match.event_key} match={match} />
                ))}
                
                {(!filteredMatches || filteredMatches.length === 0) && (
                  <div className="col-span-3 text-center p-12 bg-dark-50 rounded-lg border border-gray-700">
                    {searchTerm || filter !== 'all' ? (
                      <div>
                        <p className="text-gray-400 mb-2">No matches found with your current filters</p>
                        <Button 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => {
                            setSearchTerm('');
                            setFilter('all');
                          }}
                        >
                          Clear Filters
                        </Button>
                      </div>
                    ) : (
                      <p className="text-gray-400">No upcoming matches found</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>
      
      {/* Bet Slip */}
      <BetSlip />
    </MainLayout>
  );
}
