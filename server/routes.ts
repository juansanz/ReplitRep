import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuizAttemptSchema, insertAnalyticsSchema } from "@shared/schema";
import { nanoid } from "nanoid";

// Helper function to get client IP
function getClientIp(req: any): string {
  return req.headers['x-forwarded-for']?.split(',')[0] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress || 
         req.ip || 
         'unknown';
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Start quiz session
  app.post("/api/quiz/start", async (req, res) => {
    try {
      const clientIp = getClientIp(req);
      
      // Check if IP is blocked
      if (await storage.isIpBlocked(clientIp)) {
        return res.status(403).json({ 
          message: "Access denied",
          blocked: true 
        });
      }

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
        ipAddress: clientIp,
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
      const clientIp = getClientIp(req);

      if (!sessionId || questionNumber === undefined || !answer) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check if IP is blocked
      if (await storage.isIpBlocked(clientIp)) {
        return res.status(403).json({ 
          message: "Access denied",
          blocked: true 
        });
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
        ipAddress: clientIp,
      });

      // Check if answer is correct based on question number
      let isCorrect = false;
      if (questionNumber === 1) {
        isCorrect = answer === "A"; // Question 1: Only A is correct
      } else if (questionNumber === 2) {
        isCorrect = answer === "B" || answer === "C"; // Question 2: B or C are correct
      } else if (questionNumber === 3) {
        isCorrect = answer === "C"; // Question 3: Only C is correct
      }
      
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
            ipAddress: clientIp,
          });
        }

        res.json({ 
          correct: true, 
          completed: isCompleted,
          currentQuestion: newCurrentQuestion,
          attempt: updatedAttempt 
        });
      } else {
        // Wrong answer - block IP if it's question 3 (smoking question)
        if (questionNumber === 3) {
          await storage.blockIp({
            ipAddress: clientIp,
            reason: "smoking_dealbreaker"
          });
          
          await storage.trackAnalytics({
            event: "blocked_attempt",
            sessionId,
            questionNumber,
            answer,
            ipAddress: clientIp,
          });
        }

        res.json({ 
          correct: false, 
          completed: false,
          currentQuestion: attempt.currentQuestion,
          attempt,
          blocked: questionNumber === 3 
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
