import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tokens } from '../../types';

interface AuthState {
  accessToken: string | null;
  authenticated: boolean;
  expiresIn: number | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  authenticated: false,
  expiresIn: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<Tokens>) => {
      const { access_token, refresh_token, expires_in } = action.payload;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      state.expiresIn = expires_in;
      state.authenticated = true;
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = null;
      state.authenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
