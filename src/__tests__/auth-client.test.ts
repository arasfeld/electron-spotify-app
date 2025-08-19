import { describe, it, expect, beforeEach, vi } from 'vitest';

import { refreshTokens } from '../auth-client';
import type { Tokens } from '../types';

// Mock the config module
vi.mock('../config', () => ({
  SPOTIFY_CONFIG: {
    CLIENT_ID: 'test-client-id',
    REDIRECT_URI: 'http://localhost:5173/callback',
    SCOPES: ['user-read-private', 'user-read-email'],
  },
}));

describe('Auth Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset fetch mock
    (global.fetch as ReturnType<typeof vi.fn>).mockReset();
  });

  describe('refreshTokens', () => {
    it('should successfully refresh tokens', async () => {
      const mockResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await refreshTokens('old-refresh-token');

      expect(result).toEqual({
        access_token: 'new-access-token',
        expires_in: 3600,
      });
      expect(global.fetch).toHaveBeenCalledWith(
        'https://accounts.spotify.com/api/token',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: 'test-client-id',
            grant_type: 'refresh_token',
            refresh_token: 'old-refresh-token',
          }),
        }
      );
    });

    it('should handle successful refresh without new refresh token', async () => {
      const mockResponse: Tokens = {
        access_token: 'new-access-token',
        expires_in: 3600,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await refreshTokens('old-refresh-token');

      expect(result).toEqual(mockResponse);
    });

    it('should return null on network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
        new Error('Network error')
      );

      const result = await refreshTokens('old-refresh-token');

      expect(result).toBeNull();
    });

    it('should return null on HTTP error response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: 'Bad Request',
      });

      const result = await refreshTokens('invalid-refresh-token');

      expect(result).toBeNull();
    });

    it('should return null on invalid JSON response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      const result = await refreshTokens('old-refresh-token');

      expect(result).toBeNull();
    });

    it('should handle 401 unauthorized response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
      });

      const result = await refreshTokens('expired-refresh-token');

      expect(result).toBeNull();
    });

    it('should handle 403 forbidden response', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: 'Forbidden',
      });

      const result = await refreshTokens('invalid-refresh-token');

      expect(result).toBeNull();
    });

    it('should handle 500 server error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      });

      const result = await refreshTokens('old-refresh-token');

      expect(result).toBeNull();
    });

    it('should use correct request body format', async () => {
      const mockResponse: Tokens = {
        access_token: 'new-access-token',
        expires_in: 3600,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await refreshTokens('test-refresh-token');

      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      const requestBody = fetchCall[1].body;

      expect(requestBody).toBeInstanceOf(URLSearchParams);
      expect(requestBody.get('client_id')).toBe('test-client-id');
      expect(requestBody.get('grant_type')).toBe('refresh_token');
      expect(requestBody.get('refresh_token')).toBe('test-refresh-token');
    });

    it('should set correct headers', async () => {
      const mockResponse: Tokens = {
        access_token: 'new-access-token',
        expires_in: 3600,
      };

      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      await refreshTokens('test-refresh-token');

      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock
        .calls[0];
      const headers = fetchCall[1].headers;

      expect(headers['Content-Type']).toBe('application/x-www-form-urlencoded');
    });

    it('should handle empty refresh token', async () => {
      const result = await refreshTokens('');

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should handle null refresh token', async () => {
      const result = await refreshTokens(null as any);

      expect(result).toBeNull();
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
