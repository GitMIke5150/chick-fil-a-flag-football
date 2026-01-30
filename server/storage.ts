import { db } from "../db";
import { type User, type InsertUser, users, type Game, type InsertGame, type UpdateGame, games } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getGame(id: number): Promise<Game | undefined>;
  getAllGames(): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;
  updateGame(id: number, game: UpdateGame): Promise<Game | undefined>;
  deleteGame(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getGame(id: number): Promise<Game | undefined> {
    const [game] = await db.select().from(games).where(eq(games.id, id));
    return game;
  }

  async getAllGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async createGame(insertGame: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(insertGame).returning();
    return game;
  }

  async updateGame(id: number, updateGame: UpdateGame): Promise<Game | undefined> {
    // If updating playerStats, merge with existing to prevent race conditions from losing data
    if (updateGame.playerStats) {
      const [existingGame] = await db.select().from(games).where(eq(games.id, id));
      if (existingGame && existingGame.playerStats) {
        const existingStats = existingGame.playerStats as Record<string, any>;
        const newStats = updateGame.playerStats as Record<string, any>;
        
        // Merge ALL players from existing stats
        for (const player of Object.keys(existingStats)) {
          const existingPlayer = existingStats[player];
          const newPlayer = newStats[player];
          
          if (!newPlayer) {
            // Player not in new stats - preserve ALL their existing data
            newStats[player] = existingPlayer;
          } else {
            // Player exists in both - merge highlights (preserve existing + add new)
            const existingHighlights = existingPlayer?.highlights || [];
            const newHighlights = newPlayer?.highlights || [];
            
            if (existingHighlights.length > 0 || newHighlights.length > 0) {
              // Dedupe by videoUrl, preferring newer entries
              const seenUrls = new Set<string>();
              const mergedHighlights = [];
              // Add new highlights first (they take precedence)
              for (const h of [...newHighlights, ...existingHighlights]) {
                if (!seenUrls.has(h.videoUrl)) {
                  seenUrls.add(h.videoUrl);
                  mergedHighlights.push(h);
                }
              }
              newStats[player].highlights = mergedHighlights;
            }
          }
        }
        updateGame.playerStats = newStats;
      }
    }
    
    const [game] = await db
      .update(games)
      .set({ ...updateGame, updatedAt: new Date() })
      .where(eq(games.id, id))
      .returning();
    return game;
  }

  async deleteGame(id: number): Promise<boolean> {
    const result = await db.delete(games).where(eq(games.id, id));
    return result.rowCount !== null && result.rowCount > 0;
  }
}

export const storage = new DatabaseStorage();
