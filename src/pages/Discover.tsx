import {
  ActionIcon,
  Box,
  Card,
  Grid,
  Group,
  Image,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Play } from 'lucide-react';
import { useSelector } from 'react-redux';

import { Layout } from '../components/Layout';
import {
  useGetCurrentlyPlayingQuery,
  useGetNewReleasesQuery,
  useGetRecentlyPlayedQuery,
  useGetSavedAlbumsQuery,
  useGetTopArtistsQuery,
  useGetTopTracksQuery,
} from '../features/spotify/spotify-api';

import type { RootState } from '../store';
import type { Artist, Track } from '../types';

export function Discover() {
  const auth = useSelector((state: RootState) => state.auth);

  const {
    data: topTracks,
    isLoading: topTracksLoading,
    error: topTracksError,
  } = useGetTopTracksQuery(
    { timeRange: 'short_term' },
    {
      skip: !auth.authenticated || !auth.accessToken,
    }
  );

  const {
    data: topArtists,
    isLoading: topArtistsLoading,
    error: topArtistsError,
  } = useGetTopArtistsQuery(
    { timeRange: 'short_term' },
    {
      skip: !auth.authenticated || !auth.accessToken,
    }
  );

  const {
    data: newReleases,
    isLoading: newReleasesLoading,
    error: newReleasesError,
  } = useGetNewReleasesQuery(
    { limit: 20 },
    {
      skip: !auth.authenticated || !auth.accessToken,
    }
  );

  const {
    data: recentlyPlayed,
    isLoading: recentlyPlayedLoading,
    error: recentlyPlayedError,
  } = useGetRecentlyPlayedQuery(undefined, {
    skip: !auth.authenticated || !auth.accessToken,
  });

  const {
    data: currentlyPlaying,
    isLoading: currentlyPlayingLoading,
    error: currentlyPlayingError,
  } = useGetCurrentlyPlayingQuery(undefined, {
    skip: !auth.authenticated || !auth.accessToken,
  });

  const {
    data: savedAlbums,
    isLoading: savedAlbumsLoading,
    error: savedAlbumsError,
  } = useGetSavedAlbumsQuery(
    { limit: 8 },
    {
      skip: !auth.authenticated || !auth.accessToken,
    }
  );

  const renderSkeletonGrid = (count: number) => (
    <Grid gutter="md">
      {Array.from({ length: count }).map((_, index) => (
        <Grid.Col key={index} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <Card withBorder p="sm">
            <Stack gap="xs">
              <Skeleton height={120} width="100%" radius="sm" />
              <Stack gap={2}>
                <Skeleton height={16} width="80%" />
                <Skeleton height={12} width="60%" />
              </Stack>
            </Stack>
          </Card>
        </Grid.Col>
      ))}
    </Grid>
  );

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <Box p="md">
        <Title order={2} mb="lg">
          Discover New Music
        </Title>

        <Stack gap="xl">
          {/* Currently Playing */}
          {currentlyPlaying?.item && (
            <Box>
              <Title order={3} mb="md">
                Currently Playing
              </Title>
              <Card withBorder p="md">
                <Group gap="md">
                  <Image
                    alt={currentlyPlaying.item.name}
                    height={80}
                    radius="sm"
                    src={currentlyPlaying.item.album.images[0]?.url}
                    width={80}
                  />
                  <Stack gap="xs" style={{ flex: 1 }}>
                    <Text fw={600} size="lg">
                      {currentlyPlaying.item.name}
                    </Text>
                    <Text c="dimmed" size="sm">
                      {currentlyPlaying.item.artists
                        .map((artist: any) => artist.name)
                        .join(', ')}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {currentlyPlaying.item.album.name}
                    </Text>
                  </Stack>
                  <ActionIcon size="lg" variant="subtle">
                    <Play size={20} />
                  </ActionIcon>
                </Group>
              </Card>
            </Box>
          )}

          {/* New Releases */}
          <Box>
            <Title order={3} mb="md">
              New Releases
            </Title>
            {newReleasesLoading ? (
              renderSkeletonGrid(12)
            ) : newReleasesError ? (
              <Text c="red">Failed to load new releases.</Text>
            ) : (
              <Grid gutter="md">
                {newReleases?.albums?.items?.slice(0, 12).map((album: any) => (
                  <Grid.Col
                    key={album.id}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Card withBorder p="sm">
                      <Stack gap="xs">
                        <Image
                          alt={album.name}
                          height={120}
                          radius="sm"
                          src={album.images[0]?.url}
                          width="100%"
                        />
                        <Stack gap={2}>
                          <Text fw={500} lineClamp={1} size="sm">
                            {album.name}
                          </Text>
                          <Text c="dimmed" lineClamp={1} size="xs">
                            {album.artists
                              .map((artist: any) => artist.name)
                              .join(', ')}
                          </Text>
                        </Stack>
                        <Group justify="space-between">
                          <Text c="dimmed" size="xs">
                            {album.release_date}
                          </Text>
                          <ActionIcon size="sm" variant="subtle">
                            <Play size={14} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Box>

          {/* Your Top Artists */}
          <Box>
            <Title order={3} mb="md">
              Your Top Artists
            </Title>
            {topArtistsLoading ? (
              renderSkeletonGrid(8)
            ) : topArtistsError ? (
              <Text c="red">Failed to load top artists.</Text>
            ) : (
              <Grid gutter="md">
                {topArtists?.items?.slice(0, 8).map((artist: Artist) => (
                  <Grid.Col
                    key={artist.id}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Card withBorder p="sm">
                      <Stack gap="xs">
                        <Image
                          alt={artist.name}
                          height={120}
                          radius="50%"
                          src={artist.images[0]?.url}
                          width="100%"
                        />
                        <Stack gap={2}>
                          <Text fw={500} lineClamp={1} size="sm">
                            {artist.name}
                          </Text>
                          <Text c="dimmed" lineClamp={1} size="xs">
                            Artist
                          </Text>
                        </Stack>
                        <Group justify="space-between">
                          <Text c="dimmed" size="xs">
                            Popular
                          </Text>
                          <ActionIcon size="sm" variant="subtle">
                            <Play size={14} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Box>

          {/* Your Top Tracks */}
          <Box>
            <Title order={3} mb="md">
              Your Top Tracks
            </Title>
            {topTracksLoading ? (
              renderSkeletonGrid(8)
            ) : topTracksError ? (
              <Text c="red">Failed to load top tracks.</Text>
            ) : (
              <Grid gutter="md">
                {topTracks?.items?.slice(0, 8).map((track: Track) => (
                  <Grid.Col
                    key={track.id}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Card withBorder p="sm">
                      <Stack gap="xs">
                        <Image
                          alt={track.name}
                          height={120}
                          radius="sm"
                          src={track.album.images[0]?.url}
                          width="100%"
                        />
                        <Stack gap={2}>
                          <Text fw={500} lineClamp={1} size="sm">
                            {track.name}
                          </Text>
                          <Text c="dimmed" lineClamp={1} size="xs">
                            {track.artists
                              .map((artist: Artist) => artist.name)
                              .join(', ')}
                          </Text>
                        </Stack>
                        <Group justify="space-between">
                          <Text c="dimmed" size="xs">
                            {formatDuration(track.duration_ms)}
                          </Text>
                          <ActionIcon size="sm" variant="subtle">
                            <Play size={14} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Box>

          {/* Your Saved Albums */}
          <Box>
            <Title order={3} mb="md">
              Your Saved Albums
            </Title>
            {savedAlbumsLoading ? (
              renderSkeletonGrid(8)
            ) : savedAlbumsError ? (
              <Text c="red">Failed to load saved albums.</Text>
            ) : (
              <Grid gutter="md">
                {savedAlbums?.items?.slice(0, 8).map((item: any) => (
                  <Grid.Col
                    key={item.album.id}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Card withBorder p="sm">
                      <Stack gap="xs">
                        <Image
                          alt={item.album.name}
                          height={120}
                          radius="sm"
                          src={item.album.images[0]?.url}
                          width="100%"
                        />
                        <Stack gap={2}>
                          <Text fw={500} lineClamp={1} size="sm">
                            {item.album.name}
                          </Text>
                          <Text c="dimmed" lineClamp={1} size="xs">
                            {item.album.artists
                              .map((artist: any) => artist.name)
                              .join(', ')}
                          </Text>
                        </Stack>
                        <Group justify="space-between">
                          <Text c="dimmed" size="xs">
                            Saved
                          </Text>
                          <ActionIcon size="sm" variant="subtle">
                            <Play size={14} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Box>

          {/* Recently Played */}
          <Box>
            <Title order={3} mb="md">
              Recently Played
            </Title>
            {recentlyPlayedLoading ? (
              renderSkeletonGrid(8)
            ) : recentlyPlayedError ? (
              <Text c="red">Failed to load recently played.</Text>
            ) : (
              <Grid gutter="md">
                {recentlyPlayed?.items?.slice(0, 8).map((item: any) => (
                  <Grid.Col
                    key={item.played_at}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Card withBorder p="sm">
                      <Stack gap="xs">
                        <Image
                          alt={item.track.name}
                          height={120}
                          radius="sm"
                          src={item.track.album.images[0]?.url}
                          width="100%"
                        />
                        <Stack gap={2}>
                          <Text fw={500} lineClamp={1} size="sm">
                            {item.track.name}
                          </Text>
                          <Text c="dimmed" lineClamp={1} size="xs">
                            {item.track.artists
                              .map((artist: any) => artist.name)
                              .join(', ')}
                          </Text>
                        </Stack>
                        <Group justify="space-between">
                          <Text c="dimmed" size="xs">
                            {formatDuration(item.track.duration_ms)}
                          </Text>
                          <ActionIcon size="sm" variant="subtle">
                            <Play size={14} />
                          </ActionIcon>
                        </Group>
                      </Stack>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>
            )}
          </Box>
        </Stack>
      </Box>
    </Layout>
  );
}
