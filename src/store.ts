import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';

import { authSlice } from './features/auth/auth-slice';
import { spotifyApi } from './features/spotify/spotify-api';
import themeReducer from './features/theme/theme-slice';

const reducer = combineReducers({
  [authSlice.reducerPath]: authSlice.reducer,
  [spotifyApi.reducerPath]: spotifyApi.reducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage: {
    getItem: (key: string) =>
      new Promise((resolve) => {
        resolve(window.electron.store.get(key));
      }),
    setItem: (key: string, item: unknown) => {
      return new Promise((resolve) => {
        resolve(window.electron.store.set(key, item));
      });
    },
    removeItem: (key: string) => {
      return new Promise((resolve) => {
        resolve(window.electron.store.delete(key));
      });
    },
  },
  whitelist: ['auth', 'theme'],
};

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
      // Disable immutability check for RTK Query compatibility
      immutableCheck: false,
    }).concat(spotifyApi.middleware) as any, // Type assertion needed for Redux Persist + RTK Query compatibility
  devTools: process.env.NODE_ENV !== 'production',
});

setupListeners(store.dispatch);

export const persistor = persistStore(store);

// Infer the type of `store`
export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
// Infer the `AppDispatch` type from the store itself
export type AppDispatch = AppStore['dispatch'];
// Define a reusable type describing thunk functions
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
