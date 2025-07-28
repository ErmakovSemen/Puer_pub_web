import { users, teaCards, userCards, quests, achievements, weeklyEvents } from '../shared/schema.js';
import { db } from './db.js';
import { eq } from 'drizzle-orm';
import type { User, TeaCard, UserCard, Quest, Achievement, WeeklyEvent } from '../shared/schema.js';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;

  // Tea card operations
  getAllTeaCards(): Promise<TeaCard[]>;
  getTeaCard(id: number): Promise<TeaCard | undefined>;

  // User cards operations
  getUserCards(userId: number): Promise<UserCard[]>;
  addUserCard(userId: number, cardId: number, quantity?: number): Promise<UserCard>;

  // Quest operations
  getAllQuests(): Promise<Quest[]>;
  getQuest(id: number): Promise<Quest | undefined>;
  completeQuest(questId: number, userId: number): Promise<Quest>;

  // Achievement operations
  getAchievements(userId: number): Promise<Achievement[]>;
  updateAchievementProgress(achievementId: number, progress: number): Promise<Achievement>;

  // Weekly events operations
  getWeeklyEvents(): Promise<WeeklyEvent[]>;
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

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async getAllTeaCards(): Promise<TeaCard[]> {
    return await db.select().from(teaCards);
  }

  async getTeaCard(id: number): Promise<TeaCard | undefined> {
    const [card] = await db.select().from(teaCards).where(eq(teaCards.id, id));
    return card || undefined;
  }

  async getUserCards(userId: number): Promise<UserCard[]> {
    return await db.select().from(userCards).where(eq(userCards.userId, userId));
  }

  async addUserCard(userId: number, cardId: number, quantity: number = 1): Promise<UserCard> {
    const [userCard] = await db
      .insert(userCards)
      .values({ userId, cardId, quantity })
      .returning();
    return userCard;
  }

  async getAllQuests(): Promise<Quest[]> {
    return await db.select().from(quests);
  }

  async getQuest(id: number): Promise<Quest | undefined> {
    const [quest] = await db.select().from(quests).where(eq(quests.id, id));
    return quest || undefined;
  }

  async completeQuest(questId: number, userId: number): Promise<Quest> {
    const [quest] = await db
      .update(quests)
      .set({ completed: true, progress: db.select().from(quests).where(eq(quests.id, questId)).then(q => q[0]?.maxProgress || 1) })
      .where(eq(quests.id, questId))
      .returning();
    
    // Award rewards to user
    if (quest.reward) {
      const user = await this.getUser(userId);
      if (user) {
        const updates: Partial<User> = {};
        if (quest.reward.coins) updates.coins = (user.coins || 0) + quest.reward.coins;
        if (quest.reward.experience) {
          updates.experience = (user.experience || 0) + quest.reward.experience;
          updates.level = Math.floor(((user.experience || 0) + quest.reward.experience) / 1000) + 1;
        }
        if (Object.keys(updates).length > 0) {
          await this.updateUser(userId, updates);
        }
      }
    }
    
    return quest;
  }

  async getAchievements(userId: number): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async updateAchievementProgress(achievementId: number, progress: number): Promise<Achievement> {
    const [achievement] = await db
      .update(achievements)
      .set({ 
        progress,
        completed: progress >= db.select().from(achievements).where(eq(achievements.id, achievementId)).then(a => a[0]?.maxProgress || 1),
        completedAt: progress >= db.select().from(achievements).where(eq(achievements.id, achievementId)).then(a => a[0]?.maxProgress || 1) ? new Date() : null
      })
      .where(eq(achievements.id, achievementId))
      .returning();
    return achievement;
  }

  async getWeeklyEvents(): Promise<WeeklyEvent[]> {
    return await db.select().from(weeklyEvents);
  }
}

export const storage = new DatabaseStorage();