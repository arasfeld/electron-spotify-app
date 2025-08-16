import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { RootState } from '../../store';
import type { Artist, Track, User } from '../../types';

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.spotify.com/v1/',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getCurrentUserProfile: builder.query<User, void>({
      query: () => `me`,
    }),
    getTopArtists: builder.query<Artist[], void>({
      query: () => `me/top/artists`,
    }),
    getTopTracks: builder.query<Track[], void>({
      query: () => `me/top/tracks`,
    }),
    // Note: Using 'any' for these endpoints is acceptable as they represent
    // dynamic Spotify API responses that can vary in structure
    getUserPlaylists: builder.query<any[], void>({
      query: () => `me/playlists`,
    }),
    search: builder.query<any, { query: string; type: string }>({
      query: ({ query, type }) =>
        `search?q=${encodeURIComponent(query)}&type=${type}`,
    }),
    getCurrentlyPlaying: builder.query<any, void>({
      query: () => `me/player/currently-playing`,
    }),
    getRecentlyPlayed: builder.query<any[], void>({
      query: () => `me/player/recently-played`,
    }),
  }),
});

export const {
  useGetCurrentUserProfileQuery,
  useGetTopArtistsQuery,
  useGetTopTracksQuery,
  useGetUserPlaylistsQuery,
  useSearchQuery,
  useGetCurrentlyPlayingQuery,
  useGetRecentlyPlayedQuery,
} = spotifyApi;
