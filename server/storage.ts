import { users, quizAttempts, analytics, type User, type InsertUser, type QuizAttempt, type InsertQuizAttempt, type Analytics, type InsertAnalytics } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getQuizAttempt(sessionId: string): Promise<QuizAttempt | undefined>;
  createQuizAttempt(attempt: InsertQuizAttempt): Promise<QuizAttempt>;
  updateQuizAttempt(sessionId: string, updates: Partial<QuizAttempt>): Promise<QuizAttempt | undefined>;
  trackAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
  getAnalytics(): Promise<Analytics[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quizAttempts: Map<string, QuizAttempt>;
  private analytics: Map<number, Analytics>;
  private currentUserId: number;
  private currentQuizAttemptId: number;
  private currentAnalyticsId: number;

  constructor() {
    this.users = new Map();
    this.quizAttempts = new Map();
    this.analytics = new Map();
    this.currentUserId = 1;
    this.currentQuizAttemptId = 1;
    this.currentAnalyticsId = 1;
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
      ...insertAttempt,
      id,
      createdAt: now,
      completedAt: null,
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
      ...insertAnalytics,
      id,
      timestamp: new Date(),
    };
    this.analytics.set(id, analytics);
    return analytics;
  }

  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values());
  }
}

export const storage = new MemStorage();
