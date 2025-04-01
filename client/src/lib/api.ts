import { apiRequest } from "./queryClient";
import { PredictionSubmit, WithdrawalSubmit, VipActivation } from "../types";

// Auth API
export const loginUser = (username: string, password: string) => 
  apiRequest("POST", "/api/auth/login", { username, password });

export const registerUser = (username: string, email: string, password: string) => 
  apiRequest("POST", "/api/auth/register", { username, email, password });

export const logoutUser = () => 
  apiRequest("POST", "/api/auth/logout");

export const getCurrentUser = () => 
  apiRequest("GET", "/api/auth/me");

// Matches API
export const getMatches = () => 
  apiRequest("GET", "/api/matches");

export const getLiveMatches = () => 
  apiRequest("GET", "/api/live-matches");

export const getUpcomingMatches = () => 
  apiRequest("GET", "/api/upcoming-matches");

export const getMatchById = (matchId: string) => 
  apiRequest("GET", `/api/match/${matchId}`);

export const refreshMatches = () => 
  apiRequest("POST", "/api/matches/refresh");

// Predictions API
export const getUserPredictions = () => 
  apiRequest("GET", "/api/predictions/user");

export const makePrediction = (data: PredictionSubmit) => 
  apiRequest("POST", "/api/predictions", data);

// Transactions API
export const getUserTransactions = () => 
  apiRequest("GET", "/api/transactions/user");

export const getRecentTransactions = () => 
  apiRequest("GET", "/api/transactions/recent");

export const getVirtualTransactions = () => 
  apiRequest("GET", "/api/transactions/virtual");

// Leaderboard API
export const getLeaderboard = () => 
  apiRequest("GET", "/api/leaderboard");

// Withdrawal API
export const requestWithdrawal = (data: WithdrawalSubmit) => 
  apiRequest("POST", "/api/withdrawals", data);

export const getUserWithdrawals = () => 
  apiRequest("GET", "/api/withdrawals/user");

// VIP API
export const activateVip = (data: VipActivation) => 
  apiRequest("POST", "/api/vip/activate", data);

// Lucky Spin API
export const performLuckySpin = () => 
  apiRequest("POST", "/api/lucky-spin");

export const getUserSpins = () => 
  apiRequest("GET", "/api/lucky-spin/user");

export const getSpinAvailability = () => 
  apiRequest("GET", "/api/lucky-spin/availability");
