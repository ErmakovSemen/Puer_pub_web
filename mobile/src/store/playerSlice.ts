import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player } from './gameApi';

interface PlayerState {
  currentPlayer: Player | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  currentPlayer: null,
  loading: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setPlayer: (state, action: PayloadAction<Player>) => {
      state.currentPlayer = action.payload;
    },
    updatePlayerStats: (state, action: PayloadAction<Partial<Player>>) => {
      if (state.currentPlayer) {
        state.currentPlayer = { ...state.currentPlayer, ...action.payload };
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setPlayer, updatePlayerStats, setLoading, setError } = playerSlice.actions;
export default playerSlice.reducer;