import { Express } from 'express';
import { storage } from './storage.js';

export function setupRoutes(app: Express) {
  // User endpoints
  app.get('/api/user', async (req, res) => {
    try {
      const user = await storage.getUser(2); // Default user for now
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user' });
    }
  });

  // Tea cards endpoints
  app.get('/api/tea-cards', async (req, res) => {
    try {
      const cards = await storage.getAllTeaCards();
      res.json(cards);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tea cards' });
    }
  });

  // User cards (collection) endpoints
  app.get('/api/user-cards', async (req, res) => {
    try {
      const userCards = await storage.getUserCards(2); // Default user
      res.json(userCards);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user cards' });
    }
  });

  // Quests endpoints
  app.get('/api/quests', async (req, res) => {
    try {
      const quests = await storage.getAllQuests();
      res.json(quests);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch quests' });
    }
  });

  // Achievements endpoints
  app.get('/api/achievements', async (req, res) => {
    try {
      const achievements = await storage.getAchievements(2); // Default user
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch achievements' });
    }
  });

  // Weekly events endpoints
  app.get('/api/weekly-events', async (req, res) => {
    try {
      const events = await storage.getWeeklyEvents();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch weekly events' });
    }
  });

  // Quest completion
  app.post('/api/quests/:id/complete', async (req, res) => {
    try {
      const questId = parseInt(req.params.id);
      const result = await storage.completeQuest(questId, 2); // Default user
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to complete quest' });
    }
  });

  // Achievement progress
  app.post('/api/achievements/:id/progress', async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const { progress } = req.body;
      const result = await storage.updateAchievementProgress(achievementId, progress);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update achievement progress' });
    }
  });
}