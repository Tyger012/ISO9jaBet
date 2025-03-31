import { pgTable, text, serial, integer, boolean, timestamp, json, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  balance: integer("balance").default(10000).notNull(),
  isVip: boolean("is_vip").default(false).notNull(),
  totalWins: integer("total_wins").default(0).notNull(),
  totalLosses: integer("total_losses").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  eventKey: text("event_key").notNull().unique(),
  eventDate: text("event_date").notNull(),
  eventTime: text("event_time").notNull(),
  eventHomeTeam: text("event_home_team").notNull(),
  homeTeamKey: text("home_team_key").notNull(),
  eventAwayTeam: text("event_away_team").notNull(),
  awayTeamKey: text("away_team_key").notNull(),
  eventStatus: text("event_status").notNull(),
  eventFinalResult: text("event_final_result"),
  countryName: text("country_name").notNull(),
  leagueName: text("league_name").notNull(),
  leagueKey: text("league_key").notNull(),
  homeTeamLogo: text("home_team_logo"),
  awayTeamLogo: text("away_team_logo"),
  homeOdds: doublePrecision("home_odds").notNull(),
  drawOdds: doublePrecision("draw_odds").notNull(),
  awayOdds: doublePrecision("away_odds").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const predictions = pgTable("predictions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  matchId: integer("match_id").notNull().references(() => matches.id),
  prediction: text("prediction").notNull(), // 'home', 'draw', 'away'
  odds: doublePrecision("odds").notNull(),
  result: text("result"), // 'win', 'loss', 'pending'
  amount: integer("amount"), // amount won/lost
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'win', 'loss', 'withdrawal', 'vip', 'spin'
  amount: integer("amount").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const withdrawalRequests = pgTable("withdrawal_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  accountNumber: text("account_number").notNull(),
  bankName: text("bank_name").notNull(),
  accountName: text("account_name").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'approved', 'rejected'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const luckySpins = pgTable("lucky_spins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const virtualTransactions = pgTable("virtual_transactions", {
  id: serial("id").primaryKey(),
  username: text("username").notNull(),
  type: text("type").notNull(), // 'withdrawal', 'win', 'vip', 'spin'
  amount: integer("amount").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  isVip: true,
  totalWins: true,
  totalLosses: true,
  balance: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  updatedAt: true,
});

export const insertPredictionSchema = createInsertSchema(predictions).omit({
  id: true,
  createdAt: true,
  result: true,
  amount: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertWithdrawalRequestSchema = createInsertSchema(withdrawalRequests).omit({
  id: true,
  createdAt: true,
  status: true,
});

export const insertLuckySpinSchema = createInsertSchema(luckySpins).omit({
  id: true,
  createdAt: true,
});

export const insertVirtualTransactionSchema = createInsertSchema(virtualTransactions).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type Prediction = typeof predictions.$inferSelect;
export type InsertPrediction = z.infer<typeof insertPredictionSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = z.infer<typeof insertWithdrawalRequestSchema>;

export type LuckySpin = typeof luckySpins.$inferSelect;
export type InsertLuckySpin = z.infer<typeof insertLuckySpinSchema>;

export type VirtualTransaction = typeof virtualTransactions.$inferSelect;
export type InsertVirtualTransaction = z.infer<typeof insertVirtualTransactionSchema>;
