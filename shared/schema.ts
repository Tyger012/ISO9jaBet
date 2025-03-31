import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").notNull().default(5000),
  isVip: boolean("is_vip").notNull().default(false),
  lastSpinDate: timestamp("last_spin_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Bets table
export const bets = pgTable("bets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  matchId: text("match_id").notNull(),
  prediction: text("prediction").notNull(), // "home", "draw", "away"
  odds: text("odds").notNull(),
  status: text("status").notNull().default("pending"), // "pending", "won", "lost"
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(), // "deposit", "withdrawal", "win", "loss", "lucky_spin"
  amount: integer("amount").notNull(),
  details: text("details"),
  status: text("status").notNull().default("pending"), // "pending", "completed", "failed"
  bankName: text("bank_name"),
  accountNumber: text("account_number"),
  accountName: text("account_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Virtual transactions for the feed
export const virtualTransactions = pgTable("virtual_transactions", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  amount: integer("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

// Match cache to minimize API calls
export const matchCache = pgTable("match_cache", {
  id: serial("id").primaryKey(),
  data: jsonb("data").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  balance: true,
  isVip: true,
  lastSpinDate: true,
  createdAt: true,
});

export const insertBetSchema = createInsertSchema(bets).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertVirtualTransactionSchema = createInsertSchema(virtualTransactions).omit({
  id: true,
});

export const insertMatchCacheSchema = createInsertSchema(matchCache).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Bet = typeof bets.$inferSelect;
export type InsertBet = z.infer<typeof insertBetSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type VirtualTransaction = typeof virtualTransactions.$inferSelect;
export type InsertVirtualTransaction = z.infer<typeof insertVirtualTransactionSchema>;

export type MatchCache = typeof matchCache.$inferSelect;
export type InsertMatchCache = z.infer<typeof insertMatchCacheSchema>;

// API types
export type Match = {
  event_key: string;
  event_date: string;
  event_time: string;
  event_home_team: string;
  event_away_team: string;
  event_halftime_result: string;
  event_final_result: string;
  event_status: string;
  country_name: string;
  league_name: string;
  league_key: string;
  home_team_logo: string;
  away_team_logo: string;
  odds?: {
    home: string;
    draw: string;
    away: string;
  };
};

export type LeaderboardUser = {
  id: number;
  username: string;
  balance: number;
  isVip: boolean;
};
