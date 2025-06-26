import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  level: integer("level").default(1),
  experience: integer("experience").default(0),
  coins: integer("coins").default(0),
});

export const teaCards = pgTable("tea_cards", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // Green Tea, Black Tea, Oolong, etc.
  origin: text("origin").notNull(),
  rarity: text("rarity").notNull(), // common, uncommon, rare, epic, legendary
  power: integer("power").notNull(),
  powerType: text("power_type").notNull(), // Focus, Energy, Calm, etc.
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  // New characteristics
  strength: integer("strength").notNull(), // 1-10 scale
  freshness: integer("freshness").notNull(), // 1-10 scale
  aroma: integer("aroma").notNull(), // 1-10 scale
  ability: text("ability").notNull(), // soothes, invigorates, concentrates, etc.
  brewingTime: text("brewing_time"), // e.g. "3-5 minutes"
  temperature: text("temperature"), // e.g. "80-85°C"
});

export const userCards = pgTable("user_cards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cardId: integer("card_id").notNull(),
  quantity: integer("quantity").default(1),
});

export const quests = pgTable("quests", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // daily, weekly, special
  requirement: integer("requirement").notNull(),
  progress: integer("progress").default(0),
  rewardXp: integer("reward_xp").notNull(),
  rewardCoins: integer("reward_coins").notNull(),
  rewardCardId: integer("reward_card_id"),
  isCompleted: boolean("is_completed").default(false),
  userId: integer("user_id").notNull(),
});

export const weeklyEvents = pgTable("weekly_events", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  dayOfWeek: text("day_of_week").notNull(), // monday, tuesday, etc.
  time: text("time").notNull(),
  cost: integer("cost").default(0),
  type: text("type").notNull(), // free, paid, registration
  isActive: boolean("is_active").default(true),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  level: true,
  experience: true,
  coins: true,
});

export const insertTeaCardSchema = createInsertSchema(teaCards).omit({
  id: true,
});

export const insertUserCardSchema = createInsertSchema(userCards).omit({
  id: true,
});

export const insertQuestSchema = createInsertSchema(quests).omit({
  id: true,
  progress: true,
  isCompleted: true,
});

export const insertWeeklyEventSchema = createInsertSchema(weeklyEvents).omit({
  id: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type TeaCard = typeof teaCards.$inferSelect;
export type InsertTeaCard = z.infer<typeof insertTeaCardSchema>;
export type UserCard = typeof userCards.$inferSelect;
export type InsertUserCard = z.infer<typeof insertUserCardSchema>;
export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type WeeklyEvent = typeof weeklyEvents.$inferSelect;
export type InsertWeeklyEvent = z.infer<typeof insertWeeklyEventSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
