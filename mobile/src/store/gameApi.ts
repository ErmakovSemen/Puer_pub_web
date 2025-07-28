import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface TeaCard {
  id: number;
  name: string;
  description: string;
  rarity: string;
  image_url: string;
  strength: number;
  freshness: number;
  aroma: number;
  abilities: string[];
  brewing_time: string;
  brewing_temperature: string;
}

export interface Player {
  id: number;
  username: string;
  level: number;
  experience: number;
  coins: number;
}

export interface Quest {
  id: number;
  title: string;
  description: string;
  type: string;
  requirement: number;
  experience_reward: number;
  coin_reward: number;
  is_completed: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  category: string;
  requirement: number;
  progress: number;
  is_completed: boolean;
  experience_reward: number;
  coin_reward: number;
}

export interface WeeklyEvent {
  id: number;
  title: string;
  description: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  reward_type: string;
  reward_amount: number;
}

export const gameApi = createApi({
  reducerPath: 'gameApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8000/api/', // Django backend URL
  }),
  tagTypes: ['Player', 'TeaCard', 'Quest', 'Achievement', 'WeeklyEvent'],
  endpoints: (builder) => ({
    // Player endpoints
    getCurrentPlayer: builder.query<Player, void>({
      query: () => 'user/',
      providesTags: ['Player'],
    }),
    
    // Tea Cards endpoints
    getTeaCards: builder.query<TeaCard[], void>({
      query: () => 'tea-cards/',
      providesTags: ['TeaCard'],
    }),
    
    // Quests endpoints
    getQuests: builder.query<Quest[], void>({
      query: () => 'quests/',
      providesTags: ['Quest'],
    }),
    
    completeQuest: builder.mutation<Quest, number>({
      query: (questId) => ({
        url: `quests/${questId}/complete/`,
        method: 'POST',
      }),
      invalidatesTags: ['Quest', 'Player'],
    }),
    
    // Achievements endpoints
    getAchievements: builder.query<Achievement[], void>({
      query: () => 'achievements/',
      providesTags: ['Achievement'],
    }),
    
    completeAchievement: builder.mutation<Achievement, number>({
      query: (achievementId) => ({
        url: `achievements/${achievementId}/complete/`,
        method: 'POST',
      }),
      invalidatesTags: ['Achievement', 'Player'],
    }),
    
    // Weekly Events endpoints
    getWeeklyEvents: builder.query<WeeklyEvent[], void>({
      query: () => 'weekly-events/',
      providesTags: ['WeeklyEvent'],
    }),
  }),
});

export const {
  useGetCurrentPlayerQuery,
  useGetTeaCardsQuery,
  useGetQuestsQuery,
  useCompleteQuestMutation,
  useGetAchievementsQuery,
  useCompleteAchievementMutation,
  useGetWeeklyEventsQuery,
} = gameApi;