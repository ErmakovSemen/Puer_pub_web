import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertQuestSchema, insertAchievementSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (simplified - in real app would use authentication)
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(2); // Default user ID
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
      const userCards = await storage.getUserCards(2); // Default user ID
      res.json(userCards);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user cards" });
    }
  });

  // Get user's quests
  app.get("/api/quests", async (req, res) => {
    try {
      const quests = await storage.getUserQuests(2); // Default user ID
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
      const achievements = await storage.getUserAchievements(2); // Default user ID
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
        userId: 2
      });
      res.json(newQuest);
    } catch (error) {
      res.status(500).json({ message: "Failed to start daily quest" });
    }
  });

  // Complete quest and update user stats with rewards
  app.post("/api/complete-quest/:questId", async (req, res) => {
    try {
      const questId = parseInt(req.params.questId);
      const quest = await storage.updateQuest(questId, { isCompleted: true });
      
      // Get current user
      const user = await storage.getUser(2);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Calculate level progression
      const currentExp = user.experience || 0;
      const currentCoins = user.coins || 0;
      const currentLevel = user.level || 1;
      
      const newExperience = currentExp + quest.rewardXp;
      const newCoins = currentCoins + quest.rewardCoins;
      
      // Calculate new level (every 1000 XP = 1 level)
      const newLevel = Math.floor(newExperience / 1000) + 1;
      const leveledUp = newLevel > currentLevel;

      // Update user with rewards
      const updatedUser = await storage.updateUser(2, {
        experience: newExperience,
        coins: newCoins,
        level: newLevel
      });

      res.json({
        user: updatedUser,
        quest: quest,
        leveledUp,
        rewards: {
          xp: quest.rewardXp,
          coins: quest.rewardCoins,
          cardId: quest.rewardCardId
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to complete quest" });
    }
  });

  // Complete achievement and award rewards
  app.post("/api/complete-achievement/:achievementId", async (req, res) => {
    try {
      const achievementId = parseInt(req.params.achievementId);
      const achievement = await storage.updateAchievement(achievementId, { 
        isCompleted: true,
        unlockedAt: new Date()
      });
      
      // Get current user and award rewards
      const user = await storage.getUser(2);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const currentExp = user.experience || 0;
      const currentCoins = user.coins || 0;
      const currentLevel = user.level || 1;
      
      const newExperience = currentExp + (achievement.rewardXp || 0);
      const newCoins = currentCoins + (achievement.rewardCoins || 0);
      
      // Calculate new level (every 1000 XP = 1 level)
      const newLevel = Math.floor(newExperience / 1000) + 1;
      const leveledUp = newLevel > currentLevel;

      // Update user with rewards
      const updatedUser = await storage.updateUser(2, {
        experience: newExperience,
        coins: newCoins,
        level: newLevel
      });

      res.json({
        user: updatedUser,
        achievement: achievement,
        leveledUp,
        rewards: {
          xp: achievement.rewardXp,
          coins: achievement.rewardCoins
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to complete achievement" });
    }
  });

  // Update achievement progress
  app.patch("/api/achievement/:achievementId/progress", async (req, res) => {
    try {
      const achievementId = parseInt(req.params.achievementId);
      const { progress } = req.body;
      
      const achievement = await storage.updateAchievement(achievementId, { progress });
      
      // Check if achievement is now completed
      if ((achievement.progress || 0) >= achievement.requirement && !achievement.isCompleted) {
        // Auto-complete the achievement
        const completedAchievement = await storage.updateAchievement(achievementId, { 
          isCompleted: true,
          unlockedAt: new Date()
        });
        res.json({ achievement: completedAchievement, autoCompleted: true });
      } else {
        res.json({ achievement, autoCompleted: false });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to update achievement progress" });
    }
  });

  // Update user stats (level, experience, coins)
  app.patch("/api/user/stats", async (req, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(2, updates); // Default user ID
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
