import { 
  users, 
  teaCards, 
  userCards, 
  quests, 
  weeklyEvents, 
  achievements,
  type User, 
  type InsertUser,
  type TeaCard,
  type InsertTeaCard,
  type UserCard,
  type InsertUserCard,
  type Quest,
  type InsertQuest,
  type WeeklyEvent,
  type InsertWeeklyEvent,
  type Achievement,
  type InsertAchievement
} from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  
  // Tea card methods
  getAllTeaCards(): Promise<TeaCard[]>;
  getTeaCard(id: number): Promise<TeaCard | undefined>;
  createTeaCard(card: InsertTeaCard): Promise<TeaCard>;
  
  // User card methods
  getUserCards(userId: number): Promise<(UserCard & { card: TeaCard })[]>;
  addUserCard(userCard: InsertUserCard): Promise<UserCard>;
  
  // Quest methods
  getUserQuests(userId: number): Promise<Quest[]>;
  createQuest(quest: InsertQuest): Promise<Quest>;
  updateQuest(id: number, updates: Partial<Quest>): Promise<Quest>;
  
  // Weekly event methods
  getWeeklyEvents(): Promise<WeeklyEvent[]>;
  createWeeklyEvent(event: InsertWeeklyEvent): Promise<WeeklyEvent>;
  
  // Achievement methods
  getUserAchievements(userId: number): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
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

  async createTeaCard(insertCard: InsertTeaCard): Promise<TeaCard> {
    const [card] = await db
      .insert(teaCards)
      .values(insertCard)
      .returning();
    return card;
  }

  async getUserCards(userId: number): Promise<(UserCard & { card: TeaCard })[]> {
    return await db
      .select()
      .from(userCards)
      .leftJoin(teaCards, eq(userCards.cardId, teaCards.id))
      .where(eq(userCards.userId, userId))
      .then(rows => rows.map(row => ({
        ...row.user_cards,
        card: row.tea_cards!
      })));
  }

  async addUserCard(insertUserCard: InsertUserCard): Promise<UserCard> {
    const [userCard] = await db
      .insert(userCards)
      .values(insertUserCard)
      .returning();
    return userCard;
  }

  async getUserQuests(userId: number): Promise<Quest[]> {
    return await db.select().from(quests).where(eq(quests.userId, userId));
  }

  async createQuest(insertQuest: InsertQuest): Promise<Quest> {
    const [quest] = await db
      .insert(quests)
      .values(insertQuest)
      .returning();
    return quest;
  }

  async updateQuest(id: number, updates: Partial<Quest>): Promise<Quest> {
    const [quest] = await db
      .update(quests)
      .set(updates)
      .where(eq(quests.id, id))
      .returning();
    return quest;
  }

  async getWeeklyEvents(): Promise<WeeklyEvent[]> {
    return await db.select().from(weeklyEvents);
  }

  async createWeeklyEvent(insertEvent: InsertWeeklyEvent): Promise<WeeklyEvent> {
    const [event] = await db
      .insert(weeklyEvents)
      .values(insertEvent)
      .returning();
    return event;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return await db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const [achievement] = await db
      .insert(achievements)
      .values(insertAchievement)
      .returning();
    return achievement;
  }
}

export const storage = new DatabaseStorage();