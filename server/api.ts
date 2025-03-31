import fetch from 'node-fetch';
import { Match } from '@shared/schema';

// API key from environment variable
const API_KEY = process.env.SPORTS_API_KEY || '56a8fee0f6dd264caa27f72a5beb0d233e7b6aa366a5906a8d31db1285096196';
const BASE_URL = 'https://apiv2.allsportsapi.com/football';

// Log API key being used (without revealing the full key for security)
console.log(`Using API key: ${API_KEY.substring(0, 8)}...`);

export type ApiResponse<T> = {
  success: number;
  result: T;
};

// Function to fetch matches from the API
export async function fetchMatches(date?: string): Promise<Match[]> {
  try {
    const formattedDate = date || new Date().toISOString().split('T')[0];
    
    // Fetch matches from the API
    const response = await fetch(
      `${BASE_URL}/?met=Fixtures&APIkey=${API_KEY}&from=${formattedDate}&to=${formattedDate}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json() as ApiResponse<Match[]>;
    
    if (data.success !== 1 || !data.result) {
      return [];
    }
    
    // Process matches and add betting odds
    const matches = data.result.map(match => ({
      ...match,
      odds: generateOdds()
    }));
    
    return matches;
  } catch (error) {
    console.error('Error fetching matches:', error);
    return [];
  }
}

// Function to fetch upcoming matches for the next 3 days
export async function fetchLiveMatches(): Promise<Match[]> {
  try {
    // Fetch live matches from the API
    const response = await fetch(
      `${BASE_URL}/?met=Livescore&APIkey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json() as ApiResponse<Match[]>;
    
    if (data.success !== 1 || !data.result) {
      console.log('No live matches found');
      return [];
    }
    
    console.log(`Found ${data.result.length} live matches`);
    
    // Process matches and add betting odds
    const matches = data.result.map(match => ({
      ...match,
      odds: generateOdds()
    }));
    
    return matches;
  } catch (error) {
    console.error('Error fetching live matches:', error);
    return [];
  }
}

export async function fetchUpcomingMatches(): Promise<Match[]> {
  try {
    const today = new Date();
    const threeDaysLater = new Date(today);
    threeDaysLater.setDate(today.getDate() + 3);
    
    const fromDate = today.toISOString().split('T')[0];
    const toDate = threeDaysLater.toISOString().split('T')[0];
    
    // First try to get live matches
    const liveMatches = await fetchLiveMatches();
    
    // Then fetch upcoming matches
    const response = await fetch(
      `${BASE_URL}/?met=Fixtures&APIkey=${API_KEY}&from=${fromDate}&to=${toDate}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json() as ApiResponse<Match[]>;
    
    if (data.success !== 1 || !data.result) {
      return liveMatches; // Return just live matches if no upcoming matches
    }
    
    // Process matches and add betting odds
    const upcomingMatches = data.result.map(match => ({
      ...match,
      odds: generateOdds()
    }));
    
    // Combine live and upcoming matches, but avoid duplicates
    const liveMatchIds = new Set(liveMatches.map(m => m.event_key));
    const uniqueUpcoming = upcomingMatches.filter(m => !liveMatchIds.has(m.event_key));
    
    return [...liveMatches, ...uniqueUpcoming];
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    return [];
  }
}

// Function to get match details by ID
export async function getMatchById(matchId: string): Promise<Match | null> {
  try {
    const response = await fetch(
      `${BASE_URL}/?met=Fixtures&APIkey=${API_KEY}&matchId=${matchId}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json() as ApiResponse<Match[]>;
    
    if (data.success !== 1 || !data.result || data.result.length === 0) {
      return null;
    }
    
    const match = {
      ...data.result[0],
      odds: generateOdds()
    };
    
    return match;
  } catch (error) {
    console.error('Error fetching match details:', error);
    return null;
  }
}

// Helper function to generate odds (since the API doesn't provide them)
function generateOdds() {
  // Generate realistic but random odds
  const homeOdds = (1 + Math.random() * 3).toFixed(2);
  const drawOdds = (2 + Math.random() * 2).toFixed(2);
  const awayOdds = (1 + Math.random() * 4).toFixed(2);
  
  return {
    home: homeOdds,
    draw: drawOdds,
    away: awayOdds
  };
}

// Function to check match results (for automatically updating bets)
export async function checkMatchResults(matchId: string): Promise<string | null> {
  try {
    const match = await getMatchById(matchId);
    
    if (!match) {
      return null;
    }
    
    // If match is finished, determine result
    if (match.event_status === 'Finished' && match.event_final_result) {
      const [homeScore, awayScore] = match.event_final_result.split(' - ').map(Number);
      
      if (homeScore > awayScore) {
        return 'home';
      } else if (homeScore < awayScore) {
        return 'away';
      } else {
        return 'draw';
      }
    }
    
    return null; // Match not finished
  } catch (error) {
    console.error('Error checking match results:', error);
    return null;
  }
}
