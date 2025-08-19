import { render, type RenderOptions } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { vi, type ReactElement } from 'vitest';

import { authSlice } from '../features/auth/auth-slice';
import { spotifyApi } from '../features/spotify/spotify-api';
import themeReducer from '../features/theme/theme-slice';

// Mock data for tests
export const mockUser = {
  id: 'test-user-id',
  display_name: 'Test User',
  email: 'test@example.com',
  images: [
    {
      url: 'https://example.com/avatar.jpg',
      height: 300,
      width: 300,
    },
  ],
  external_urls: {
    spotify: 'https://open.spotify.com/user/test-user-id',
  },
  followers: {
    href: null,
    total: 100,
  },
  href: 'https://api.spotify.com/v1/users/test-user-id',
  type: 'user',
  uri: 'spotify:user:test-user-id',
};

export const mockTrack = {
  id: 'test-track-id',
  name: 'Test Track',
  artists: [
    {
      id: 'test-artist-id',
      name: 'Test Artist',
      external_urls: {
        spotify: 'https://open.spotify.com/artist/test-artist-id',
      },
    },
  ],
  album: {
    id: 'test-album-id',
    name: 'Test Album',
    images: [
      {
        url: 'https://example.com/album.jpg',
        height: 300,
        width: 300,
      },
    ],
  },
  duration_ms: 180000,
  external_urls: {
    spotify: 'https://open.spotify.com/track/test-track-id',
  },
  uri: 'spotify:track:test-track-id',
};

export const mockArtist = {
  id: 'test-artist-id',
  name: 'Test Artist',
  images: [
    {
      url: 'https://example.com/artist.jpg',
      height: 300,
      width: 300,
    },
  ],
  external_urls: {
    spotify: 'https://open.spotify.com/artist/test-artist-id',
  },
  followers: {
    href: null,
    total: 1000,
  },
  genres: ['pop', 'rock'],
  popularity: 80,
  uri: 'spotify:artist:test-artist-id',
};

export const mockPlaylist = {
  id: 'test-playlist-id',
  name: 'Test Playlist',
  description: 'A test playlist',
  images: [
    {
      url: 'https://example.com/playlist.jpg',
      height: 300,
      width: 300,
    },
  ],
  external_urls: {
    spotify: 'https://open.spotify.com/playlist/test-playlist-id',
  },
  owner: {
    display_name: 'Test User',
    external_urls: {
      spotify: 'https://open.spotify.com/user/test-user-id',
    },
    href: 'https://api.spotify.com/v1/users/test-user-id',
    id: 'test-user-id',
    type: 'user',
    uri: 'spotify:user:test-user-id',
  },
  tracks: {
    href: 'https://api.spotify.com/v1/playlists/test-playlist-id/tracks',
    total: 10,
  },
  uri: 'spotify:playlist:test-playlist-id',
};

// Create a test store with initial state
export const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      [authSlice.reducerPath]: authSlice.reducer,
      [spotifyApi.reducerPath]: spotifyApi.reducer,
      theme: themeReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
        immutableCheck: false,
      }).concat(spotifyApi.middleware),
  });
};

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Record<string, unknown>;
  route?: string;
}

export const renderWithProviders = (
  ui: ReactElement,
  {
    preloadedState = {},
    route = '/',
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const store = createTestStore(preloadedState);

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <MantineProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </MantineProvider>
      </Provider>
    );
  };

  // Set up routing
  window.history.pushState({}, 'Test page', route);

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Mock Spotify API responses
export const mockSpotifyApi = {
  getCurrentUserProfile: vi.fn(() => Promise.resolve(mockUser)),
  getTopArtists: vi.fn(() =>
    Promise.resolve({
      items: [mockArtist],
      total: 1,
      limit: 20,
      offset: 0,
    })
  ),
  getTopTracks: vi.fn(() =>
    Promise.resolve({
      items: [mockTrack],
      total: 1,
      limit: 20,
      offset: 0,
    })
  ),
  getUserPlaylists: vi.fn(() =>
    Promise.resolve({
      items: [mockPlaylist],
      total: 1,
      limit: 20,
      offset: 0,
    })
  ),
  getRecentlyPlayed: vi.fn(() =>
    Promise.resolve({
      items: [
        {
          track: mockTrack,
          played_at: '2023-01-01T00:00:00.000Z',
        },
      ],
      cursors: {
        after: 'test-cursor',
        before: 'test-cursor',
      },
    })
  ),
};

// Mock authentication state
export const mockAuthState = {
  authenticated: true,
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
  expiresAt: Date.now() + 3600000, // 1 hour from now
};

// Mock theme state
export const mockThemeState = {
  mode: 'dark' as const,
  primaryColor: 'blue' as const,
};

// Utility to wait for async operations
export const waitFor = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Utility to mock fetch responses
export const mockFetchResponse = (data: unknown, status = 200) => {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: status >= 200 && status < 300,
    status,
    json: async () => data,
    text: async () => JSON.stringify(data),
  });
};

// Utility to mock fetch errors
export const mockFetchError = (error: string, status = 500) => {
  (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
    new Error(error)
  );
};
