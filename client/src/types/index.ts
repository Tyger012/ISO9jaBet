export interface Match {
  id: number;
  eventKey: string;
  eventDate: string;
  eventTime: string;
  eventHomeTeam: string;
  homeTeamKey: string;
  eventAwayTeam: string;
  awayTeamKey: string;
  eventStatus: string;
  eventFinalResult?: string;
  countryName: string;
  leagueName: string;
  leagueKey: string;
  homeTeamLogo?: string;
  awayTeamLogo?: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  updatedAt: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  balance: number;
  isVip: boolean;
  totalWins: number;
  totalLosses: number;
  createdAt: string;
}

export interface Prediction {
  id: number;
  userId: number;
  matchId: number;
  prediction: "home" | "draw" | "away";
  odds: number;
  result?: "win" | "loss" | "pending";
  amount?: number;
  createdAt: string;
  match?: Match;
}

export interface Transaction {
  id: number;
  userId: number;
  type: "win" | "loss" | "withdrawal" | "vip" | "spin";
  amount: number;
  details?: string;
  createdAt: string;
  user?: User;
}

export interface WithdrawalRequest {
  id: number;
  userId: number;
  amount: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export interface LuckySpin {
  id: number;
  userId: number;
  amount: number;
  createdAt: string;
}

export interface VirtualTransaction {
  id: number;
  username: string;
  type: "withdrawal" | "win" | "vip" | "spin";
  amount: number;
  createdAt: string;
}

export interface LeaderboardUser {
  id: number;
  username: string;
  totalWins: number;
  balance: number;
  isVip: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export interface PredictionSubmit {
  matchId: number;
  prediction: "home" | "draw" | "away";
  odds: number;
}

export interface WithdrawalSubmit {
  amount: number;
  accountNumber: string;
  bankName: string;
  accountName: string;
  activationKey: string;
}

export interface VipActivation {
  activationKey: string;
}

export interface ApiError {
  message: string;
}
