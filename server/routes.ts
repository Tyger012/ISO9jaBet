import express, { Request, Response, NextFunction } from "express";
import session from "express-session";
import MemoryStore from "memorystore";
import bcrypt from "bcryptjs";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { fetchMatches, fetchUpcomingMatches, fetchLiveMatches, checkMatchResults, getMatchById } from "./api";
import { sendWithdrawalEmail, sendWelcomeEmail, sendVIPActivationEmail, spinLuckyWheel, isSameDay, validateVIPCode, validateWithdrawalCode } from "./utils";
import { z } from "zod";
import { insertUserSchema, User } from "@shared/schema";

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

// Extend Session to include userId
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

const MemoryStoreSession = MemoryStore(session);

export async function registerRoutes(app: express.Express): Promise<Server> {
  // Set up session middleware
  app.use(session({
    secret: process.env.SESSION_SECRET || 'iso9ja-bet-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }, // 24 hours
    store: new MemoryStoreSession({
      checkPeriod: 86400000 // 24 hours
    })
  }));
  
  // Authentication middleware
  const requireAuth = async (req: Request, res: Response, next: Function) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ message: "User not found" });
    }
    
    req.user = user;
    next();
  };

  // User authentication routes
  app.post("/api/register", async (req, res) => {
    try {
      const userInput = insertUserSchema.parse(req.body);
      
      // Check if username or email already exists
      const existingUser = await storage.getUserByUsername(userInput.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      const existingEmail = await storage.getUserByEmail(userInput.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userInput.password, salt);
      
      // Create user
      const user = await storage.createUser({
        ...userInput,
        password: hashedPassword
      });
      
      // Set session
      req.session.userId = user.id;
      
      // Send welcome email (asynchronously, don't wait for it)
      sendWelcomeEmail({
        username: user.username,
        email: user.email
      }).catch(err => console.error('Error sending welcome email:', err));
      
      // Return user data (without password)
      const { password, ...userData } = user;
      res.status(201).json(userData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid input", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to register" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Validate input
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Return user data (without password)
      const { password: _, ...userData } = user;
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Failed to login" });
    }
  });

  app.post("/api/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/me", requireAuth, (req, res) => {
    const { password, ...userData } = req.user;
    res.json(userData);
  });

  // Matches routes
  app.get("/api/matches", async (req, res) => {
    try {
      const { date } = req.query;
      const matches = await fetchMatches(date as string);
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch matches" });
    }
  });

  app.get("/api/live-matches", async (req, res) => {
    try {
      const matches = await fetchLiveMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch live matches" });
    }
  });

  app.get("/api/upcoming-matches", async (req, res) => {
    try {
      const matches = await fetchUpcomingMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming matches" });
    }
  });
  
  app.get("/api/match/:matchId", async (req, res) => {
    try {
      const matchId = req.params.matchId;
      const match = await getMatchById(matchId);
      
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      res.json(match);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch match details" });
    }
  });

  // Betting routes
  app.post("/api/place-bet", requireAuth, async (req, res) => {
    try {
      const { matchId, prediction, odds } = req.body;
      
      // Validate input
      if (!matchId || !prediction || !odds) {
        return res.status(400).json({ message: "Match ID, prediction, and odds are required" });
      }
      
      // Get user
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check user's existing bets
      const userBets = await storage.getBetsByUserId(userId);
      const pendingBets = userBets.filter(bet => bet.status === "pending");
      
      // Check if user has reached bet limit (2 for regular, 4 for VIP)
      const betLimit = user.isVip ? 4 : 2;
      if (pendingBets.length >= betLimit) {
        return res.status(400).json({ 
          message: user.isVip 
            ? "VIP members can only bet on up to 4 matches at a time" 
            : "Free users can only bet on up to 2 matches at a time. Upgrade to VIP for more!"
        });
      }
      
      // Check if user is already betting on this match
      const existingMatchBet = pendingBets.find(bet => bet.matchId === matchId);
      if (existingMatchBet) {
        return res.status(400).json({ message: "You already have a bet for this match" });
      }
      
      // Create bet record
      const betAmount = 0; // No actual bet amount as users bet for free
      const bet = await storage.createBet({
        userId,
        matchId,
        prediction,
        odds,
        amount: betAmount
      });
      
      res.status(201).json(bet);
    } catch (error) {
      res.status(500).json({ message: "Failed to place bet" });
    }
  });

  app.get("/api/my-bets", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const bets = await storage.getBetsByUserId(userId);
      res.json(bets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bets" });
    }
  });

  // Endpoint to check and update bet results
  app.post("/api/check-bet-results", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Get pending bets
      const userBets = await storage.getBetsByUserId(userId);
      const pendingBets = userBets.filter(bet => bet.status === "pending");
      
      const results = [];
      
      for (const bet of pendingBets) {
        const matchResult = await checkMatchResults(bet.matchId);
        
        if (matchResult) {
          // Match is finished, update bet status
          let betStatus = "lost";
          let balanceChange = 0;
          
          if (matchResult === bet.prediction) {
            betStatus = "won";
            balanceChange = user.isVip ? 7500 : 5000; // VIP gets ₦7,500, regular gets ₦5,000
          } else {
            balanceChange = -(user.isVip ? 1000 : 2000); // VIP loses ₦1,000, regular loses ₦2,000
          }
          
          // Update bet
          await storage.updateBetStatus(bet.id, betStatus);
          
          // Update user balance
          await storage.updateUser(userId, { balance: user.balance + balanceChange });
          
          // Record transaction
          await storage.createTransaction({
            userId,
            type: betStatus === "won" ? "win" : "loss",
            amount: balanceChange,
            details: `Bet ${bet.id} on match ${bet.matchId} (${bet.prediction})`,
            status: "completed"
          });
          
          results.push({
            betId: bet.id,
            matchId: bet.matchId,
            prediction: bet.prediction,
            result: matchResult,
            status: betStatus,
            balanceChange
          });
        }
      }
      
      // Return updated user data and results
      const updatedUser = await storage.getUser(userId);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userData } = updatedUser;
      
      res.json({
        user: userData,
        results
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to check bet results" });
    }
  });

  // Lucky Spin routes
  app.post("/api/lucky-spin", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // All users can use the spin once per day
      // We no longer check balance requirement
      
      // Check if user has spun today
      const today = new Date();
      if (user.lastSpinDate && isSameDay(user.lastSpinDate, today)) {
        return res.status(400).json({ message: "You've already used your free spin today" });
      }
      
      // Spin the wheel
      const winAmount = spinLuckyWheel();
      
      // Update user's balance and last spin date
      await storage.updateUser(userId, {
        balance: user.balance + winAmount,
        lastSpinDate: today
      });
      
      // Record transaction
      await storage.createTransaction({
        userId,
        type: "lucky_spin",
        amount: winAmount,
        details: "Lucky Spin bonus",
        status: "completed"
      });
      
      const updatedUser = await storage.getUser(userId);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userData } = updatedUser;
      
      res.json({
        user: userData,
        spinResult: {
          amount: winAmount
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to spin the wheel" });
    }
  });

  // VIP activation routes
  app.post("/api/activate-vip", requireAuth, async (req, res) => {
    try {
      const { activationKey, hasMadePayment } = req.body;
      
      if (!activationKey) {
        return res.status(400).json({ message: "Activation key is required" });
      }
      
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if already VIP
      if (user.isVip) {
        return res.status(400).json({ message: "You are already a VIP member" });
      }
      
      // If user claims to have made payment, send notification to admin
      if (hasMadePayment) {
        // Send email notification to admin
        await sendVIPActivationEmail({
          username: user.username,
          email: user.email,
          userId: user.id
        });
        
        return res.json({
          success: true,
          message: "Your payment notification has been sent to the admin. VIP access will be granted after verification."
        });
      }
      
      // If they're using an activation key, validate it
      if (!validateVIPCode(activationKey)) {
        return res.status(400).json({ message: "Invalid activation key" });
      }
      
      // Check balance for VIP fee (if they're not using direct payment option)
      if (user.balance < 3000) {
        return res.status(400).json({ message: "Insufficient balance. You need ₦3,000 to activate VIP" });
      }
      
      // Update user to VIP status and deduct fee
      await storage.updateUser(userId, {
        isVip: true,
        balance: user.balance - 3000
      });
      
      // Record transaction
      await storage.createTransaction({
        userId,
        type: "vip_activation",
        amount: -3000,
        details: "VIP Activation",
        status: "completed"
      });
      
      const updatedUser = await storage.getUser(userId);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userData } = updatedUser;
      
      res.json({
        user: userData,
        message: "VIP status activated successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to activate VIP status" });
    }
  });

  // Withdrawal routes
  app.post("/api/request-withdrawal", requireAuth, async (req, res) => {
    try {
      const { accountNumber, bankName, accountName, amount, activationKey } = req.body;
      
      // Validate input
      if (!accountNumber || !bankName || !accountName || !amount || !activationKey) {
        return res.status(400).json({ message: "All fields are required" });
      }
      
      // Validate activation key
      if (!validateWithdrawalCode(activationKey)) {
        return res.status(400).json({ message: "Invalid withdrawal activation key" });
      }
      
      const userId = req.session.userId!;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check balance
      if (user.balance < 30000) {
        return res.status(400).json({ message: "You need at least ₦30,000 to request a withdrawal" });
      }
      
      // Check if user has enough balance for withdrawal + fee
      if (user.balance < amount + 3000) {
        return res.status(400).json({ message: "Insufficient balance for withdrawal plus ₦3,000 Account Box Breaking Fee" });
      }
      
      // Create withdrawal transaction
      const transaction = await storage.createTransaction({
        userId,
        type: "withdrawal",
        amount: -amount,
        details: "Withdrawal request",
        status: "pending",
        bankName,
        accountNumber,
        accountName
      });
      
      // Create fee transaction
      await storage.createTransaction({
        userId,
        type: "fee",
        amount: -3000,
        details: "Account Box Breaking Fee",
        status: "completed"
      });
      
      // Update user balance (deduct amount + fee)
      await storage.updateUser(userId, {
        balance: user.balance - amount - 3000
      });
      
      // Send email to admin and confirmation to user
      await sendWithdrawalEmail({
        username: user.username,
        accountName,
        accountNumber,
        bankName,
        amount,
        email: user.email // Include user's email for confirmation
      });
      
      // Create virtual transaction for feed
      await storage.createVirtualTransaction({
        username: user.username,
        amount
      });
      
      const updatedUser = await storage.getUser(userId);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const { password, ...userData } = updatedUser;
      
      res.json({
        user: userData,
        transaction,
        message: "Withdrawal request submitted successfully"
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to request withdrawal" });
    }
  });

  // Transactions routes
  app.get("/api/my-transactions", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId!;
      const transactions = await storage.getTransactionsByUserId(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  // Virtual transactions for the feed
  app.get("/api/virtual-transactions", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 100;
      const transactions = await storage.getVirtualTransactions(limit);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch virtual transactions" });
    }
  });

  // Leaderboard route
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
