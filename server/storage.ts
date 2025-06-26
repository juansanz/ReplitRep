import { users, quizAttempts, analytics, blockedIps, type User, type InsertUser, type QuizAttempt, type InsertQuizAttempt, type Analytics, type InsertAnalytics, type BlockedIp, type InsertBlockedIp } from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizAttempts: Map<string, QuizAttempt>;
  private analytics: Map<number, Analytics>;
  private blockedIps: Map<string, BlockedIp>;
  private currentUserId: number;
  private currentQuizAttemptId: number;
  private currentAnalyticsId: number;
  private currentBlockedIpId: number;

  constructor() {
    this.users = new Map();
    this.quizAttempts = new Map();
    this.analytics = new Map();
    this.blockedIps = new Map();
    this.currentUserId = 1;
    this.currentQuizAttemptId = 1;
    this.currentAnalyticsId = 1;
    this.currentBlockedIpId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getQuizAttempt(sessionId: string): Promise<QuizAttempt | undefined> {
    return this.quizAttempts.get(sessionId);
  }

  async createQuizAttempt(insertAttempt: InsertQuizAttempt): Promise<QuizAttempt> {
    const id = this.currentQuizAttemptId++;
    const now = new Date();
    const attempt: QuizAttempt = {
      id,
      sessionId: insertAttempt.sessionId,
      currentQuestion: insertAttempt.currentQuestion || 0,
      completed: insertAttempt.completed || false,
      createdAt: now,
      completedAt: insertAttempt.completedAt || null,
    };
    this.quizAttempts.set(insertAttempt.sessionId, attempt);
    return attempt;
  }

  async updateQuizAttempt(sessionId: string, updates: Partial<QuizAttempt>): Promise<QuizAttempt | undefined> {
    const existing = this.quizAttempts.get(sessionId);
    if (!existing) return undefined;

    const updated: QuizAttempt = { ...existing, ...updates };
    if (updates.completed && !existing.completed) {
      updated.completedAt = new Date();
    }
    
    this.quizAttempts.set(sessionId, updated);
    return updated;
  }

  async trackAnalytics(insertAnalytics: InsertAnalytics): Promise<Analytics> {
    const id = this.currentAnalyticsId++;
    const analytics: Analytics = {
      id,
      event: insertAnalytics.event,
      sessionId: insertAnalytics.sessionId,
      questionNumber: insertAnalytics.questionNumber || null,
      answer: insertAnalytics.answer || null,
      ipAddress: insertAnalytics.ipAddress || null,
      timestamp: new Date(),
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }

  async isIpBlocked(ipAddress: string): Promise<boolean> {
    return this.blockedIps.has(ipAddress);
  }

  async blockIp(insertBlockedIp: InsertBlockedIp): Promise<BlockedIp> {
    const id = this.currentBlockedIpId++;
    const blockedIp: BlockedIp = {
      id,
      ipAddress: insertBlockedIp.ipAddress,
      reason: insertBlockedIp.reason,
      blockedAt: new Date(),
    };
    this.blockedIps.set(insertBlockedIp.ipAddress, blockedIp);
    return blockedIp;
  }

  async getBlockedIps(): Promise<BlockedIp[]> {
    return Array.from(this.blockedIps.values());
  }
}

export const storage = new MemStorage();
