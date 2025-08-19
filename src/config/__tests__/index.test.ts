import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock environment variables
const mockEnv = {
  VITE_SPOTIFY_CLIENT_ID: 'test-client-id',
  VITE_SPOTIFY_REDIRECT_URI: 'http://localhost:5173/callback',
  NODE_ENV: 'test',
};

describe('Config Module', () => {
  beforeEach(() => {
    // Mock import.meta.env
    Object.defineProperty(import.meta, 'env', {
      value: { ...mockEnv },
      writable: true,
    });
  });

  describe('Environment Variable Validation', () => {
    it('should load successfully with valid environment variables', async () => {
      const configModule = await import('../index');
      expect(configModule).toBeDefined();
    });
  });

  describe('Configuration Values', () => {
    it('should export SPOTIFY_CONFIG with correct values', async () => {
      const { SPOTIFY_CONFIG } = await import('../index');

      expect(SPOTIFY_CONFIG).toBeDefined();
      expect(SPOTIFY_CONFIG.CLIENT_ID).toBe('fa024c3d8afc4eba9ab168cdfc01c7c0');
      expect(SPOTIFY_CONFIG.REDIRECT_URI).toBe(
        'http://localhost:5173/callback'
      );
      expect(Array.isArray(SPOTIFY_CONFIG.SCOPES)).toBe(true);
      expect(SPOTIFY_CONFIG.SCOPES.length).toBeGreaterThan(0);
    });

    it('should include required Spotify scopes', async () => {
      const { SPOTIFY_CONFIG } = await import('../index');

      const requiredScopes = [
        'user-read-private',
        'user-read-email',
        'user-top-read',
        'user-read-recently-played',
        'playlist-read-private',
        'playlist-read-collaborative',
        'playlist-modify-private',
        'playlist-modify-public',
        'user-library-read',
        'user-read-currently-playing',
        'user-follow-read',
      ];

      requiredScopes.forEach((scope) => {
        expect(SPOTIFY_CONFIG.SCOPES).toContain(scope);
      });
    });

    it('should export config object with correct structure', async () => {
      const { config } = await import('../index');

      expect(config).toBeDefined();
      expect(config.NODE_ENV).toBe('test');
      expect(config.spotify).toBeDefined();
      expect(config.spotify.clientId).toBe('fa024c3d8afc4eba9ab168cdfc01c7c0');
      expect(config.spotify.redirectUri).toBe('http://localhost:5173/callback');
      expect(config.app).toBeDefined();
      expect(config.app.name).toBe('Electron Spotify App');
      expect(config.app.version).toBe('1.0.0');
    });

    it('should have scopes in alphabetical order', async () => {
      const { SPOTIFY_CONFIG } = await import('../index');

      const sortedScopes = [...SPOTIFY_CONFIG.SCOPES].sort();
      expect(SPOTIFY_CONFIG.SCOPES).toEqual(sortedScopes);
    });
  });

  describe('Module Structure', () => {
    it('should export SPOTIFY_CONFIG as named export', async () => {
      const configModule = await import('../index');

      expect(configModule.SPOTIFY_CONFIG).toBeDefined();
      expect(configModule.SPOTIFY_CONFIG.CLIENT_ID).toBe(
        'fa024c3d8afc4eba9ab168cdfc01c7c0'
      );
    });

    it('should export config as named export', async () => {
      const configModule = await import('../index');

      expect(configModule.config).toBeDefined();
      expect(configModule.config.spotify.clientId).toBe(
        'fa024c3d8afc4eba9ab168cdfc01c7c0'
      );
    });
  });
});
