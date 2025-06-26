import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestSchema, insertAchievementSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (simplified - in real app would use authentication)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(1); // Default user ID
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Get all tea cards
  app.get("/api/tea-cards", async (req, res) => {
    try {
      const cards = await storage.getAllTeaCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get tea cards" });
    }
  });

  // Get user's tea cards
  app.get("/api/user-cards", async (req, res) => {
    try {
      const userCards = await storage.getUserCards(1); // Default user ID
      res.json(userCards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user cards" });
    }
  });

  // Get user's quests
  app.get("/api/quests", async (req, res) => {
    try {
      const quests = await storage.getUserQuests(1); // Default user ID
      res.json(quests);
    } catch (error) {
      res.status(500).json({ message: "Failed to get quests" });
    }
  });

  // Update quest progress
  app.patch("/api/quests/:id", async (req, res) => {
    try {
      const questId = parseInt(req.params.id);
      const updates = req.body;
      
      const quest = await storage.updateQuest(questId, updates);
      res.json(quest);
    } catch (error) {
      res.status(500).json({ message: "Failed to update quest" });
    }
  });

  // Get weekly events
  app.get("/api/weekly-events", async (req, res) => {
    try {
      const events = await storage.getWeeklyEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ message: "Failed to get weekly events" });
    }
  });

  // Get user achievements
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getUserAchievements(1); // Default user ID
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to get achievements" });
    }
  });

  // Start daily quest
  app.post("/api/start-daily-quest", async (req, res) => {
    try {
      // Logic to start a new daily quest
      const newQuest = await storage.createQuest({
        title: "Daily Discovery",
        description: "Find and collect 3 different green tea varieties to unlock a rare tea card.",
        type: "daily",
        requirement: 3,
        rewardXp: 500,
        rewardCoins: 200,
        rewardCardId: 3,
        userId: 1
      });
      res.json(newQuest);
    } catch (error) {
      res.status(500).json({ message: "Failed to start daily quest" });
    }
  });

  // Update user stats (level, experience, coins)
  app.patch("/api/user/stats", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(1, updates); // Default user ID
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
