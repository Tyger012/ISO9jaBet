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
    const usernames = [
      'Johnson_123', 'SportsKing', 'FootieExpert', 'BettingPro', 'PredictionGuru',
      'FootballFan', 'BetMaster', 'LuckyWinner', 'SoccerPro', 'GoalDigger',
      'BetChampion', 'MatchWinner', 'SportsFanatic', 'FootballWiz', 'GoalKeeper'
    ];
    
    const amounts = [30000, 35000, 42000, 31500, 45000, 38000, 50000, 33000, 40000, 46000];
    
    for (let i = 0; i < 50; i++) {
      const username = usernames[Math.floor(Math.random() * usernames.length)];
      const amount = amounts[Math.floor(Math.random() * amounts.length)];
      
      this.createVirtualTransaction({
        username,
        amount
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
    return Array.from(this.users.values())
      .sort((a, b) => b.balance - a.balance)
      .slice(0, limit)
      .map(user => ({
        id: user.id,
        username: user.username,
        balance: user.balance,
        isVip: user.isVip
      }));
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
    const newTransaction: Transaction = { ...transaction, id, createdAt: now };
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
