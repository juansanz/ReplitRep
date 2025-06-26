import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizAttemptSchema, insertAnalyticsSchema } from "@shared/schema";
import { nanoid } from "nanoid";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start quiz session
  app.post("/api/quiz/start", async (req, res) => {
    try {
      const sessionId = nanoid();
      const attempt = await storage.createQuizAttempt({
        sessionId,
        currentQuestion: 0,
        completed: false,
      });

      // Track quiz start
      await storage.trackAnalytics({
        event: "quiz_started",
        sessionId,
        questionNumber: null,
        answer: null,
      });

      res.json({ sessionId, attempt });
    } catch (error) {
      res.status(500).json({ message: "Error starting quiz" });
    }
  });

  // Submit answer
  app.post("/api/quiz/answer", async (req, res) => {
    try {
      const { sessionId, questionNumber, answer } = req.body;

      if (!sessionId || questionNumber === undefined || !answer) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const attempt = await storage.getQuizAttempt(sessionId);
      if (!attempt) {
        return res.status(404).json({ message: "Quiz session not found" });
      }

      if (attempt.completed) {
        return res.status(400).json({ message: "Quiz already completed" });
      }

      // Track the answer
      await storage.trackAnalytics({
        event: "question_answered",
        sessionId,
        questionNumber,
        answer,
      });

      const isCorrect = answer === "A"; // All correct answers are A
      
      if (isCorrect) {
        const newCurrentQuestion = attempt.currentQuestion + 1;
        const isCompleted = newCurrentQuestion >= 3;

        const updatedAttempt = await storage.updateQuizAttempt(sessionId, {
          currentQuestion: newCurrentQuestion,
          completed: isCompleted,
        });

        if (isCompleted) {
          // Track quiz completion
          await storage.trackAnalytics({
            event: "quiz_completed",
            sessionId,
            questionNumber: null,
            answer: null,
          });
        }

        res.json({ 
          correct: true, 
          completed: isCompleted,
          currentQuestion: newCurrentQuestion,
          attempt: updatedAttempt 
        });
      } else {
        res.json({ 
          correct: false, 
          completed: false,
          currentQuestion: attempt.currentQuestion,
          attempt 
        });
      }
    } catch (error) {
      res.status(500).json({ message: "Error processing answer" });
    }
  });

  // Get quiz status
  app.get("/api/quiz/status/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const attempt = await storage.getQuizAttempt(sessionId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Quiz session not found" });
      }

      res.json(attempt);
    } catch (error) {
      res.status(500).json({ message: "Error getting quiz status" });
    }
  });

  // Track profile view
  app.post("/api/profile/view", async (req, res) => {
    try {
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }

      const attempt = await storage.getQuizAttempt(sessionId);
      if (!attempt || !attempt.completed) {
        return res.status(403).json({ message: "Quiz must be completed to view profile" });
      }

      await storage.trackAnalytics({
        event: "profile_viewed",
        sessionId,
        questionNumber: null,
        answer: null,
      });

      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Error tracking profile view" });
    }
  });

  // Get analytics (for admin purposes)
  app.get("/api/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Error getting analytics" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
