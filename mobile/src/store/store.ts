import { configureStore } from '@reduxjs/toolkit';
import { gameApi } from './gameApi';
import playerReducer from './playerSlice';

export const store = configureStore({
  reducer: {
    player: playerReducer,
    [gameApi.reducerPath]: gameApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(gameApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;