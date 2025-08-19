import { describe, it, expect, beforeEach, vi } from 'vitest';

import {
  authSlice,
  logout,
  setCredentials,
  updateAccessToken,
} from '../auth-slice';
import type { Tokens } from '../../../types';

describe('Auth Slice', () => {
  const initialState = {
    authenticated: false,
    accessToken: null,
    refreshToken: null,
    expiresIn: null,
  };

  beforeEach(() => {
    // Reset state before each test
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should return the initial state', () => {
      const state = authSlice.reducer(undefined, { type: 'unknown' });
      expect(state).toEqual(initialState);
    });
  });

  describe('setCredentials', () => {
    it('should handle setting credentials', () => {
      const mockTokens: Tokens = {
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
      };

      const action = setCredentials(mockTokens);
      const state = authSlice.reducer(initialState, action);

      expect(state.authenticated).toBe(true);
      expect(state.accessToken).toBe('test-access-token');
      expect(state.refreshToken).toBe('test-refresh-token');
      expect(state.expiresIn).toBe(3600);
    });

    it('should handle tokens without refresh_token', () => {
      const mockTokens: Tokens = {
        access_token: 'test-access-token',
        expires_in: 3600,
      };

      const action = setCredentials(mockTokens);
      const state = authSlice.reducer(initialState, action);

      expect(state.authenticated).toBe(true);
      expect(state.accessToken).toBe('test-access-token');
      expect(state.refreshToken).toBeUndefined();
      expect(state.expiresIn).toBe(3600);
    });
  });

  describe('updateAccessToken', () => {
    it('should update access token and expiresIn', () => {
      const initialStateWithAuth = {
        authenticated: true,
        accessToken: 'old-access-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 1000,
      };

      const mockTokens = {
        access_token: 'new-access-token',
        expires_in: 7200,
      };

      const action = updateAccessToken(mockTokens);
      const state = authSlice.reducer(initialStateWithAuth, action);

      expect(state.authenticated).toBe(true);
      expect(state.accessToken).toBe('new-access-token');
      expect(state.refreshToken).toBe('test-refresh-token'); // Should remain unchanged
      expect(state.expiresIn).toBe(7200);
    });
  });

  describe('logout', () => {
    it('should reset state to initial values', () => {
      const initialStateWithAuth = {
        authenticated: true,
        accessToken: 'test-access-token',
        refreshToken: 'test-refresh-token',
        expiresIn: 3600,
      };

      const action = logout();
      const state = authSlice.reducer(initialStateWithAuth, action);

      expect(state).toEqual(initialState);
    });

    it('should work from any state', () => {
      const randomState = {
        authenticated: true,
        accessToken: 'random-token',
        refreshToken: 'random-refresh',
        expiresIn: 123456789,
      };

      const action = logout();
      const state = authSlice.reducer(randomState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('action creators', () => {
    it('should create setCredentials action with correct payload', () => {
      const mockTokens: Tokens = {
        access_token: 'test-token',
        refresh_token: 'test-refresh',
        expires_in: 3600,
      };

      const action = setCredentials(mockTokens);

      expect(action.type).toBe('auth/setCredentials');
      expect(action.payload).toEqual(mockTokens);
    });

    it('should create updateAccessToken action with correct payload', () => {
      const mockTokens = {
        access_token: 'new-token',
        expires_in: 7200,
      };

      const action = updateAccessToken(mockTokens);

      expect(action.type).toBe('auth/updateAccessToken');
      expect(action.payload).toEqual(mockTokens);
    });

    it('should create logout action', () => {
      const action = logout();

      expect(action.type).toBe('auth/logout');
      expect(action.payload).toBeUndefined();
    });
  });
});
