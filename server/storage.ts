import {
  User, InsertUser,
  Bet, InsertBet,
  Transaction, InsertTransaction,
  VirtualTransaction, InsertVirtualTransaction,
  MatchCache, InsertMatchCache,
  LeaderboardUser
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  getLeaderboard(limit?: number): Promise<LeaderboardUser[]>;
  
  // Bet operations
  createBet(bet: InsertBet): Promise<Bet>;
  getBetsByUserId(userId: number): Promise<Bet[]>;
  getPendingBets(): Promise<Bet[]>;
  updateBetStatus(id: number, status: string): Promise<Bet | undefined>;
  
  // Transaction operations
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  getTransactionsByUserId(userId: number): Promise<Transaction[]>;
  updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined>;
  getVirtualTransactions(limit?: number): Promise<VirtualTransaction[]>;
  createVirtualTransaction(transaction: InsertVirtualTransaction): Promise<VirtualTransaction>;
  
  // Match cache operations
  getMatchCache(): Promise<MatchCache | undefined>;
  setMatchCache(cache: InsertMatchCache): Promise<MatchCache>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private bets: Map<number, Bet>;
  private transactions: Map<number, Transaction>;
  private virtualTransactions: Map<number, VirtualTransaction>;
  private matchCache: Map<number, MatchCache>;
  private userIdCounter: number;
  private betIdCounter: number;
  private transactionIdCounter: number;
  private virtualTransactionIdCounter: number;
  private matchCacheIdCounter: number;

  constructor() {
    this.users = new Map();
    this.bets = new Map();
    this.transactions = new Map();
    this.virtualTransactions = new Map();
    this.matchCache = new Map();
    this.userIdCounter = 1;
    this.betIdCounter = 1;
    this.transactionIdCounter = 1;
    this.virtualTransactionIdCounter = 1;
    this.matchCacheIdCounter = 1;
    
    // Initialize with virtual transactions
    this.initializeVirtualTransactions();
  }

  private initializeVirtualTransactions() {
    // Generate over 300 virtual transactions with different user names
    const usernames = [
      'SoccerPro', 'FootieKing', 'BetMaster', 'GoalHunter', 'BallWizard',
      'StrikerFC', 'PitchMaster', 'TopScorer', 'FootballFan', 'BettingKing',
      'LuckyWinner', 'GoalScorer', 'CupWinner', 'ChampionBet', 'BigWinner',
      'PremiumUser', 'EliteGamer', 'FootballGuru', 'SportsMaster', 'WinnerCircle',
      'TopBettor', 'GoldenBoot', 'PremierFan', 'VictoryLane', 'ChampionsLeague',
      'WorldCupFan', 'TrophyWinner', 'SportsBaron', 'LeagueMaster', 'PenaltyKing',
      'FreeKickPro', 'HeaderSpecialist', 'MidfielderPro', 'DefenderElite', 'GoalieKing',
      'CornerTaker', 'PenaltyTaker', 'FootballIcon', 'SportsStar', 'LeagueHero',
      'Johnson_123', 'SportsKing', 'FootieExpert', 'BettingPro', 'PredictionGuru'
    ];
    
    const amounts = [3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000, 18000, 20000, 26000, 30000];
    const currentTime = new Date();
    
    // Create 300+ transactions with random users and amounts
    for (let i = 0; i < 320; i++) {
      const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
      const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
      
      const timestamp = new Date(currentTime);
      // Space them out by random minutes (1-30 minutes apart)
      timestamp.setMinutes(timestamp.getMinutes() - (i * Math.floor(Math.random() * 30) + 1));
      
      this.createVirtualTransaction({
        username: randomUsername,
        amount: randomAmount,
        timestamp: timestamp
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { 
      ...insertUser, 
      id, 
      balance: 5000, 
      isVip: false, 
      lastSpinDate: null,
      createdAt: now
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getLeaderboard(limit: number = 10): Promise<LeaderboardUser[]> {
    // Create top players with high balances
    const topPlayers: LeaderboardUser[] = [
      { id: 1001, username: "FootballKing", balance: 7000000, isVip: true },
      { id: 1002, username: "BetMaster365", balance: 5600000, isVip: true },
      { id: 1003, username: "GoalScorer", balance: 3800000, isVip: true },
      { id: 1004, username: "PremierPro", balance: 2500000, isVip: true },
      { id: 1005, username: "EliteVIPBet", balance: 1900000, isVip: true },
      { id: 1006, username: "TopGunner", balance: 1250000, isVip: true },
      { id: 1007, username: "FootieLegend", balance: 980000, isVip: true },
      { id: 1008, username: "SoccerKing", balance: 750000, isVip: true },
      { id: 1009, username: "BetWizard", balance: 520000, isVip: true },
      { id: 1010, username: "GoalMachine", balance: 350000, isVip: true }
    ];
    
    // Get real users from the database
    const realUsers = Array.from(this.users.values())
      .map(user => ({
        id: user.id,
        username: user.username,
        balance: user.balance,
        isVip: user.isVip
      }));
    
    // Combine both lists and sort by balance
    const allUsers = [...topPlayers, ...realUsers]
      .sort((a, b) => b.balance - a.balance)
      .slice(0, limit);
    
    return allUsers;
  }

  // Bet operations
  async createBet(bet: InsertBet): Promise<Bet> {
    const id = this.betIdCounter++;
    const now = new Date();
    const newBet: Bet = { ...bet, id, status: "pending", createdAt: now };
    this.bets.set(id, newBet);
    return newBet;
  }

  async getBetsByUserId(userId: number): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .filter((bet) => bet.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getPendingBets(): Promise<Bet[]> {
    return Array.from(this.bets.values())
      .filter((bet) => bet.status === "pending");
  }

  async updateBetStatus(id: number, status: string): Promise<Bet | undefined> {
    const bet = this.bets.get(id);
    if (!bet) return undefined;
    
    const updatedBet = { ...bet, status };
    this.bets.set(id, updatedBet);
    return updatedBet;
  }

  // Transaction operations
  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = this.transactionIdCounter++;
    const now = new Date();
    
    // Ensure status is set to a default value if not provided
    const status = transaction.status || 'pending';
    // Ensure other nullable fields have default values
    const details = transaction.details ?? null;
    const bankName = transaction.bankName ?? null;
    const accountNumber = transaction.accountNumber ?? null;
    const accountName = transaction.accountName ?? null;
    
    const newTransaction: Transaction = { 
      ...transaction, 
      id, 
      createdAt: now,
      status,
      details,
      bankName,
      accountNumber,
      accountName
    };
    
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getTransactionsByUserId(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter((transaction) => transaction.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async updateTransactionStatus(id: number, status: string): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, status };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async getVirtualTransactions(limit: number = 20): Promise<VirtualTransaction[]> {
    return Array.from(this.virtualTransactions.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createVirtualTransaction(transaction: InsertVirtualTransaction): Promise<VirtualTransaction> {
    const id = this.virtualTransactionIdCounter++;
    const now = new Date();
    const newTransaction: VirtualTransaction = { ...transaction, id, timestamp: now };
    this.virtualTransactions.set(id, newTransaction);
    return newTransaction;
  }

  // Match cache operations
  async getMatchCache(): Promise<MatchCache | undefined> {
    const caches = Array.from(this.matchCache.values());
    const validCache = caches.find(cache => new Date(cache.expiresAt) > new Date());
    return validCache;
  }

  async setMatchCache(cache: InsertMatchCache): Promise<MatchCache> {
    const id = this.matchCacheIdCounter++;
    const now = new Date();
    const newCache: MatchCache = { ...cache, id, createdAt: now };
    this.matchCache.set(id, newCache);
    return newCache;
  }
}

// Create and export a single instance of the storage
export const storage = new MemStorage();
