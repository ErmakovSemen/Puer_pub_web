import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  level: integer('level').default(1),
  experience: integer('experience').default(0),
  coins: integer('coins').default(100),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tea Cards table
export const teaCards = pgTable('tea_cards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  rarity: text('rarity').notNull(), // common, rare, epic, legendary
  image: text('image'),
  category: text('category').notNull(), // green, black, oolong, white, etc.
  power: integer('power').default(1),
  strength: integer('strength').default(1),
  freshness: integer('freshness').default(1),
  aroma: integer('aroma').default(1),
  brewingTime: integer('brewing_time').default(3),
  brewingTemp: integer('brewing_temp').default(80),
  abilities: jsonb('abilities').$type<string[]>().default([]),
  createdAt: timestamp('created_at').defaultNow(),
});

// User Cards (collection) table
export const userCards = pgTable('user_cards', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  cardId: integer('card_id').references(() => teaCards.id).notNull(),
  quantity: integer('quantity').default(1),
  obtainedAt: timestamp('obtained_at').defaultNow(),
});

// Quests table
export const quests = pgTable('quests', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  type: text('type').notNull(), // daily, weekly, special
  requirement: text('requirement').notNull(),
  progress: integer('progress').default(0),
  maxProgress: integer('max_progress').default(1),
  completed: boolean('completed').default(false),
  reward: jsonb('reward').$type<{coins?: number, experience?: number, cards?: number[]}>(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Achievements table
export const achievements = pgTable('achievements', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  category: text('category').notNull(), // collection, quests, events, levels
  progress: integer('progress').default(0),
  maxProgress: integer('max_progress').default(1),
  completed: boolean('completed').default(false),
  reward: jsonb('reward').$type<{coins?: number, experience?: number}>(),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Weekly Events table
export const weeklyEvents = pgTable('weekly_events', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  eventType: text('event_type').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  rewards: jsonb('rewards').$type<{coins?: number, experience?: number, cards?: number[]}>(),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  userCards: many(userCards),
  achievements: many(achievements),
}));

export const teaCardsRelations = relations(teaCards, ({ many }) => ({
  userCards: many(userCards),
}));

export const userCardsRelations = relations(userCards, ({ one }) => ({
  user: one(users, {
    fields: [userCards.userId],
    references: [users.id],
  }),
  card: one(teaCards, {
    fields: [userCards.cardId],
    references: [teaCards.id],
  }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, {
    fields: [achievements.userId],
    references: [users.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const selectUserSchema = createSelectSchema(users);

export const insertTeaCardSchema = createInsertSchema(teaCards).omit({ id: true, createdAt: true });
export const selectTeaCardSchema = createSelectSchema(teaCards);

export const insertUserCardSchema = createInsertSchema(userCards).omit({ id: true, obtainedAt: true });
export const selectUserCardSchema = createSelectSchema(userCards);

export const insertQuestSchema = createInsertSchema(quests).omit({ id: true, createdAt: true });
export const selectQuestSchema = createSelectSchema(quests);

export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, createdAt: true, completedAt: true });
export const selectAchievementSchema = createSelectSchema(achievements);

export const insertWeeklyEventSchema = createInsertSchema(weeklyEvents).omit({ id: true, createdAt: true });
export const selectWeeklyEventSchema = createSelectSchema(weeklyEvents);

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type TeaCard = typeof teaCards.$inferSelect;
export type InsertTeaCard = z.infer<typeof insertTeaCardSchema>;

export type UserCard = typeof userCards.$inferSelect;
export type InsertUserCard = z.infer<typeof insertUserCardSchema>;

export type Quest = typeof quests.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type WeeklyEvent = typeof weeklyEvents.$inferSelect;
export type InsertWeeklyEvent = z.infer<typeof insertWeeklyEventSchema>;