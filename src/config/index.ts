// Application configuration
// Combines environment variables with static constants

// Validation function to ensure required env vars are set
function validateRequiredEnvVars() {
  const missing = [];

  if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID) {
    missing.push('VITE_SPOTIFY_CLIENT_ID');
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
        'Please create a .env file in the project root with the required variables.\n' +
        'See README.md for setup instructions.'
    );
  }
}

// Validate on module load
validateRequiredEnvVars();

// Main application configuration
export const config = {
  // Environment
  NODE_ENV: import.meta.env.NODE_ENV || 'development',

  // Spotify API
  spotify: {
    clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
    redirectUri:
      import.meta.env.VITE_SPOTIFY_REDIRECT_URI ||
      'http://localhost:5173/callback',
    scopes: [
      'playlist-read-private',
      'user-follow-read',
      'user-library-read',
      'user-read-currently-playing',
      'user-read-private',
      'user-read-recently-played',
      'user-top-read',
    ],
  },

  // App constants
  app: {
    name: 'Electron Spotify App',
    version: '1.0.0',
  },
} as const;

// Legacy exports for backward compatibility (can be removed later)
export const SPOTIFY_CONFIG = {
  CLIENT_ID: config.spotify.clientId,
  REDIRECT_URI: config.spotify.redirectUri,
  SCOPES: config.spotify.scopes,
} as const;
