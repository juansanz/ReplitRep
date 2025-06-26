import { users, quizAttempts, analytics, blockedIps, type User, type InsertUser, type QuizAttempt, type InsertQuizAttempt, type Analytics, type InsertAnalytics, type BlockedIp, type InsertBlockedIp } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getQuizAttempt(sessionId: string): Promise<QuizAttempt | undefined>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  updateQuizAttempt(sessionId: string, updates: Partial<QuizAttempt>): Promise<QuizAttempt | undefined>;
  trackAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalytics(): Promise<Analytics[]>;
  isIpBlocked(ipAddress: string): Promise<boolean>;
  blockIp(blockedIp: InsertBlockedIp): Promise<BlockedIp>;
  getBlockedIps(): Promise<BlockedIp[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getQuizAttempt(sessionId: string): Promise<QuizAttempt | undefined> {
    const [attempt] = await db.select().from(quizAttempts).where(eq(quizAttempts.sessionId, sessionId));
    return attempt || undefined;
  }

  async createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const [attempt] = await db
      .insert(quizAttempts)
      .values(insertAttempt)
      .returning();
    return attempt;
  }

  async updateQuizAttempt(sessionId: string, updates: Partial<QuizAttempt>): Promise<QuizAttempt | undefined> {
    if (updates.completed && updates.completedAt === undefined) {
      updates.completedAt = new Date();
    }
    
    const [updatedAttempt] = await db
      .update(quizAttempts)
      .set(updates)
      .where(eq(quizAttempts.sessionId, sessionId))
      .returning();
    
    return updatedAttempt || undefined;
  }

  async trackAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const [analyticsRecord] = await db
      .insert(analytics)
      .values(insertAnalytics)
      .returning();
    return analyticsRecord;
  }

  async getAnalytics(): Promise<Analytics[]> {
    return await db.select().from(analytics);
  }

  async isIpBlocked(ipAddress: string): Promise<boolean> {
    const [blocked] = await db.select().from(blockedIps).where(eq(blockedIps.ipAddress, ipAddress));
    return !!blocked;
  }

  async blockIp(insertBlockedIp: InsertBlockedIp): Promise<BlockedIp> {
    const [blocked] = await db
      .insert(blockedIps)
      .values(insertBlockedIp)
      .returning();
    return blocked;
  }

  async getBlockedIps(): Promise<BlockedIp[]> {
    return await db.select().from(blockedIps);
  }
}

export const storage = new DatabaseStorage();
