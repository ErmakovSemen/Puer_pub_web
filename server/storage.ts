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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private teaCards: Map<number, TeaCard>;
  private userCards: Map<number, UserCard>;
  private quests: Map<number, Quest>;
  private weeklyEvents: Map<number, WeeklyEvent>;
  private achievements: Map<number, Achievement>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.teaCards = new Map();
    this.userCards = new Map();
    this.quests = new Map();
    this.weeklyEvents = new Map();
    this.achievements = new Map();
    this.currentId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "player",
      password: "password",
      level: 23,
      experience: 8450,
      coins: 1247
    };
    this.users.set(1, defaultUser);

    // Initialize tea cards
    const cards: TeaCard[] = [
      {
        id: 1,
        name: "Dragon Well Supreme",
        type: "Green Tea",
        origin: "Hangzhou",
        rarity: "legendary",
        power: 25,
        powerType: "Focus",
        imageUrl: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        description: "A legendary green tea with unmatched clarity and focus enhancement."
      },
      {
        id: 2,
        name: "Ceremonial Matcha",
        type: "Powdered Green",
        origin: "Kyoto",
        rarity: "epic",
        power: 20,
        powerType: "Calm",
        imageUrl: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        description: "Traditional ceremonial matcha that brings inner peace and tranquility."
      },
      {
        id: 3,
        name: "Earl Grey Supreme",
        type: "Black Tea",
        origin: "Ceylon",
        rarity: "rare",
        power: 15,
        powerType: "Energy",
        imageUrl: "https://images.unsplash.com/photo-1597318150924-b1ebb48e4c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "A premium Earl Grey blend with bergamot that energizes the spirit."
      },
      {
        id: 4,
        name: "Golden Chamomile",
        type: "Herbal",
        origin: "Egypt",
        rarity: "uncommon",
        power: 10,
        powerType: "Rest",
        imageUrl: "https://images.unsplash.com/photo-1597318150924-b1ebb48e4c66?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        description: "Soothing chamomile flowers that promote restful sleep and relaxation."
      },
      {
        id: 5,
        name: "Garden Green",
        type: "Green Tea",
        origin: "China",
        rarity: "common",
        power: 5,
        powerType: "Health",
        imageUrl: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        description: "A simple yet refreshing green tea that supports overall health."
      },
      {
        id: 6,
        name: "Morning Blend",
        type: "Black Tea",
        origin: "India",
        rarity: "common",
        power: 5,
        powerType: "Energy",
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
        description: "A robust morning tea blend perfect for starting the day."
      }
    ];

    cards.forEach(card => this.teaCards.set(card.id, card));

    // Initialize user cards
    const userCardData: UserCard[] = [
      { id: 1, userId: 1, cardId: 1, quantity: 1 },
      { id: 2, userId: 1, cardId: 2, quantity: 1 },
      { id: 3, userId: 1, cardId: 3, quantity: 1 },
      { id: 4, userId: 1, cardId: 4, quantity: 1 },
      { id: 5, userId: 1, cardId: 5, quantity: 2 },
      { id: 6, userId: 1, cardId: 6, quantity: 1 }
    ];

    userCardData.forEach(uc => this.userCards.set(uc.id, uc));

    // Initialize quests
    const questData: Quest[] = [
      {
        id: 1,
        title: "Daily Discovery",
        description: "Find and collect 3 different green tea varieties to unlock a rare tea card.",
        type: "daily",
        requirement: 3,
        progress: 2,
        rewardXp: 500,
        rewardCoins: 200,
        rewardCardId: 3,
        isCompleted: false,
        userId: 1
      },
      {
        id: 2,
        title: "Master Collector",
        description: "Collect 25 different tea cards from various regions around the world.",
        type: "weekly",
        requirement: 25,
        progress: 18,
        rewardXp: 2000,
        rewardCoins: 1000,
        rewardCardId: 2,
        isCompleted: false,
        userId: 1
      }
    ];

    questData.forEach(q => this.quests.set(q.id, q));

    // Initialize weekly events
    const eventData: WeeklyEvent[] = [
      {
        id: 1,
        title: "Green Tea Discovery",
        description: "New Player Friendly",
        dayOfWeek: "monday",
        time: "18:00",
        cost: 0,
        type: "free",
        isActive: true
      },
      {
        id: 2,
        title: "Oolong Mastery",
        description: "Quest Registration",
        dayOfWeek: "tuesday",
        time: "17:00",
        cost: 0,
        type: "registration",
        isActive: true
      },
      {
        id: 3,
        title: "Rare Tea Hunt",
        description: "Quest Registration",
        dayOfWeek: "wednesday",
        time: "11:00",
        cost: 300,
        type: "paid",
        isActive: true
      },
      {
        id: 4,
        title: "Tea Ceremony Training",
        description: "Free",
        dayOfWeek: "wednesday",
        time: "18:00",
        cost: 0,
        type: "free",
        isActive: true
      },
      {
        id: 5,
        title: "Black Tea Adventure",
        description: "Free",
        dayOfWeek: "thursday",
        time: "19:00",
        cost: 0,
        type: "free",
        isActive: true
      },
      {
        id: 6,
        title: "Legendary Tea Quest",
        description: "Epic Rewards",
        dayOfWeek: "friday",
        time: "20:00",
        cost: 500,
        type: "paid",
        isActive: true
      },
      {
        id: 7,
        title: "Tea Tournament",
        description: "Quest Registration",
        dayOfWeek: "saturday",
        time: "12:00-14:00",
        cost: 300,
        type: "registration",
        isActive: true
      },
      {
        id: 8,
        title: "Grand Championship",
        description: "Quest Registration",
        dayOfWeek: "sunday",
        time: "14:00-16:00",
        cost: 300,
        type: "registration",
        isActive: true
      }
    ];

    eventData.forEach(e => this.weeklyEvents.set(e.id, e));

    // Initialize achievements
    const achievementData: Achievement[] = [
      {
        id: 1,
        userId: 1,
        title: "Tea Master",
        description: "Collected 100 different teas",
        unlockedAt: new Date()
      },
      {
        id: 2,
        userId: 1,
        title: "First Legendary",
        description: "Obtained your first legendary tea",
        unlockedAt: new Date()
      }
    ];

    achievementData.forEach(a => this.achievements.set(a.id, a));

    this.currentId = 100; // Start IDs from 100 to avoid conflicts
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      level: 1, 
      experience: 0, 
      coins: 0 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllTeaCards(): Promise<TeaCard[]> {
    return Array.from(this.teaCards.values());
  }

  async getTeaCard(id: number): Promise<TeaCard | undefined> {
    return this.teaCards.get(id);
  }

  async createTeaCard(insertCard: InsertTeaCard): Promise<TeaCard> {
    const id = this.currentId++;
    const card: TeaCard = { ...insertCard, id };
    this.teaCards.set(id, card);
    return card;
  }

  async getUserCards(userId: number): Promise<(UserCard & { card: TeaCard })[]> {
    const userCards = Array.from(this.userCards.values()).filter(uc => uc.userId === userId);
    return userCards.map(uc => {
      const card = this.teaCards.get(uc.cardId);
      if (!card) throw new Error(`Card not found: ${uc.cardId}`);
      return { ...uc, card };
    });
  }

  async addUserCard(insertUserCard: InsertUserCard): Promise<UserCard> {
    const id = this.currentId++;
    const userCard: UserCard = { ...insertUserCard, id };
    this.userCards.set(id, userCard);
    return userCard;
  }

  async getUserQuests(userId: number): Promise<Quest[]> {
    return Array.from(this.quests.values()).filter(q => q.userId === userId);
  }

  async createQuest(insertQuest: InsertQuest): Promise<Quest> {
    const id = this.currentId++;
    const quest: Quest = { 
      ...insertQuest, 
      id, 
      progress: 0, 
      isCompleted: false 
    };
    this.quests.set(id, quest);
    return quest;
  }

  async updateQuest(id: number, updates: Partial<Quest>): Promise<Quest> {
    const quest = this.quests.get(id);
    if (!quest) throw new Error("Quest not found");
    
    const updatedQuest = { ...quest, ...updates };
    this.quests.set(id, updatedQuest);
    return updatedQuest;
  }

  async getWeeklyEvents(): Promise<WeeklyEvent[]> {
    return Array.from(this.weeklyEvents.values()).filter(e => e.isActive);
  }

  async createWeeklyEvent(insertEvent: InsertWeeklyEvent): Promise<WeeklyEvent> {
    const id = this.currentId++;
    const event: WeeklyEvent = { ...insertEvent, id };
    this.weeklyEvents.set(id, event);
    return event;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(a => a.userId === userId);
  }

  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.currentId++;
    const achievement: Achievement = { 
      ...insertAchievement, 
      id, 
      unlockedAt: new Date() 
    };
    this.achievements.set(id, achievement);
    return achievement;
  }
}

export const storage = new MemStorage();
