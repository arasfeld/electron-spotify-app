import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';

import { refreshTokens } from '../../auth-client';
import type { RootState } from '../../store';
import type { Artist, PlaylistsResponse, Track, User } from '../../types';

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.spotify.com/v1/',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Token expired, try to refresh
    const state = api.getState() as RootState;
    const { refreshToken } = state.auth;

    if (refreshToken) {
      const refreshResult = await refreshTokens(refreshToken);
      if (refreshResult) {
        // Update the store with new tokens
        api.dispatch({
          type: 'auth/updateAccessToken',
          payload: refreshResult,
        });
        // Retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed, logout user
        api.dispatch({ type: 'auth/logout' });
      }
    } else {
      // No refresh token, logout user
      api.dispatch({ type: 'auth/logout' });
    }
  }

  return result;
};

export const spotifyApi = createApi({
  reducerPath: 'spotifyApi',
  baseQuery: baseQueryWithReauth,
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
    getUserPlaylists: builder.query<PlaylistsResponse, void>({
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
    getPlaylistTracks: builder.query<any, string>({
      query: (playlistId) => `playlists/${playlistId}`,
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
  useGetPlaylistTracksQuery,
} = spotifyApi;
