import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const games = pgTable("games", {
  id: integer("id").primaryKey(),
  opponent: text("opponent").notNull(),
  ourScore: integer("our_score").notNull().default(0),
  opponentScore: integer("opponent_score").notNull().default(0),
  notes: text("notes").default(""),
  isFinished: integer("is_finished").notNull().default(0),
  quarter: integer("quarter").notNull().default(1),
  isHalftime: integer("is_halftime").notNull().default(0),
  possession: text("possession").notNull().default("offense"),
  coachCommentary: jsonb("coach_commentary").$type<Array<{
    text: string;
    timestamp: number;
    quarter: number;
    videoUrl?: string;
  }>>().default([]),
  aiHighlights: text("ai_highlights").default(""),
  playerStats: jsonb("player_stats").notNull().$type<Record<string, {
    touchdowns: number;
    extraPoints: number;
    twoPointConversions: number;
    qbTouchdowns: number;
    catches: number;
    flagPulls: number;
    interceptions: number;
    sacks: number;
    runs: number;
    firstDowns: number;
    qbFirstDownThrows: number;
    catchFirstDowns: number;
    completions: number;
    incompletes: number;
    drops: number;
    notes?: Array<{ text: string; quarter: number; timestamp: number }>;
  }>>(),
  lastPlay: jsonb("last_play").$type<{
    player: string;
    action: string;
    emoji: string;
    timestamp: number;
    videoUrl?: string;
  } | null>(),
  publicLastPlay: jsonb("public_last_play").$type<{
    player: string;
    action: string;
    emoji: string;
    timestamp: number;
    videoUrl?: string;
  } | null>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertGameSchema = createInsertSchema(games).omit({
  createdAt: true,
  updatedAt: true,
});

export const updateGameSchema = z.object({
  ourScore: z.number().min(0).optional(),
  opponentScore: z.number().min(0).optional(),
  notes: z.string().optional(),
  isFinished: z.number().min(0).max(1).optional(),
  quarter: z.number().min(1).max(4).optional(),
  isHalftime: z.number().min(0).max(1).optional(),
  possession: z.enum(["offense", "defense"]).optional(),
  coachCommentary: z.array(z.object({
    text: z.string(),
    timestamp: z.number(),
    quarter: z.number(),
    videoUrl: z.string().optional(),
  })).optional(),
  aiHighlights: z.string().optional(),
  playerStats: z.record(z.object({
    touchdowns: z.number().min(0),
    extraPoints: z.number().min(0),
    twoPointConversions: z.number().min(0),
    qbTouchdowns: z.number().min(0),
    catches: z.number().min(0),
    flagPulls: z.number().min(0),
    interceptions: z.number().min(0),
    sacks: z.number().min(0),
    runs: z.number().min(0).optional().default(0),
    firstDowns: z.number().min(0).optional().default(0),
    qbFirstDownThrows: z.number().min(0).optional().default(0),
    catchFirstDowns: z.number().min(0).optional().default(0),
    completions: z.number().min(0).optional().default(0),
    incompletes: z.number().min(0).optional().default(0),
    drops: z.number().min(0).optional().default(0),
    notes: z.array(z.object({
      text: z.string(),
      quarter: z.number(),
      timestamp: z.number(),
    })).optional().default([]),
  })).optional(),
  lastPlay: z.object({
    player: z.string(),
    action: z.string(),
    emoji: z.string(),
    timestamp: z.number(),
    videoUrl: z.string().optional(),
  }).nullable().optional(),
  publicLastPlay: z.object({
    player: z.string(),
    action: z.string(),
    emoji: z.string(),
    timestamp: z.number(),
    videoUrl: z.string().optional(),
  }).nullable().optional(),
});

export type InsertGame = z.infer<typeof insertGameSchema>;
export type Game = typeof games.$inferSelect;
export type UpdateGame = z.infer<typeof updateGameSchema>;
