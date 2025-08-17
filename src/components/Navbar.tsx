import {
  Box,
  NavLink,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  LayoutGrid,
  Library,
  ListMusic,
  MicVocal,
  Music2,
  PlayCircle,
  Radio,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { useGetUserPlaylistsQuery } from '../features/spotify/spotify-api';

import type { RootState } from '../store';
import type { SpotifyPlaylist } from '../types';

export function Navbar() {
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const {
    data: playlistsResponse,
    isLoading: playlistsLoading,
    error: playlistsError,
  } = useGetUserPlaylistsQuery(undefined, {
    skip: !auth.authenticated || !auth.accessToken,
  });

  return (
    <Stack
      gap="lg"
      h="100%"
      w="100%"
      style={{
        overflowX: 'hidden',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div>
        <Title order={4} px={12} py={4}>
          Discover
        </Title>
        <NavLink label="Discover" leftSection={<PlayCircle />} />
        <NavLink label="Browse" leftSection={<LayoutGrid />} />
        <NavLink label="Radio" leftSection={<Radio />} />
      </div>
      <div>
        <Title order={4} px={12} py={4}>
          Library
        </Title>
        <NavLink label="Playlists" leftSection={<ListMusic />} />
        <NavLink
          label="Songs"
          leftSection={<Music2 />}
          onClick={() => navigate('/songs')}
        />
        <NavLink
          label="Artists"
          leftSection={<MicVocal />}
          onClick={() => navigate('/artists')}
        />
        <NavLink
          label="Albums"
          leftSection={<Library />}
          onClick={() => navigate('/albums')}
        />
      </div>
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          overflow: 'hidden',
          maxWidth: '100%',
          boxSizing: 'border-box',
        }}
        w="100%"
      >
        <Title order={4} px={12} py={4} style={{ flexShrink: 0 }}>
          Your Playlists
        </Title>
        {playlistsLoading && (
          <Box style={{ flexShrink: 0 }}>
            <Skeleton height={32} mb={4} />
            <Skeleton height={32} mb={4} />
            <Skeleton height={32} mb={4} />
          </Box>
        )}
        {playlistsError && (
          <Box style={{ flexShrink: 0 }} p="xs">
            <Text size="sm" c="red" mb={4}>
              Failed to load playlists
            </Text>
            <Text size="xs" c="dimmed">
              Error: {JSON.stringify(playlistsError)}
            </Text>
          </Box>
        )}
        {playlistsResponse?.items && (
          <ScrollArea flex={1} type="hover" offsetScrollbars scrollbars="y">
            {playlistsResponse.items.length === 0 ? (
              <Text size="sm" c="dimmed" px={12}>
                No playlists found
              </Text>
            ) : (
              [...playlistsResponse.items]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((playlist: SpotifyPlaylist) => (
                  <NavLink
                    description={`${playlist.tracks.total} track${
                      playlist.tracks.total === 1 ? '' : 's'
                    }`}
                    key={playlist.id}
                    label={playlist.name}
                    leftSection={<ListMusic size={16} />}
                    noWrap
                    onClick={() => navigate(`/playlist/${playlist.id}`)}
                  />
                ))
            )}
          </ScrollArea>
        )}
      </Box>
    </Stack>
  );
}
