import {
  ActionIcon,
  Box,
  Card,
  Group,
  Image,
  Pagination,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Play } from 'lucide-react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { Layout } from '../components/Layout';
import { useGetSavedTracksQuery } from '../features/spotify/spotify-api';

import type { RootState } from '../store';

const ITEMS_PER_PAGE = 50;

export function Songs() {
  const [page, setPage] = useState(1);
  const auth = useSelector((state: RootState) => state.auth);

  const {
    data: savedTracksResponse,
    isLoading,
    error,
  } = useGetSavedTracksQuery(
    {
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    },
    {
      skip: !auth.authenticated || !auth.accessToken,
    }
  );

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatArtistNames = (artists: Array<{ name: string }>) => {
    return artists.map((artist) => artist.name).join(', ');
  };

  if (isLoading) {
    return (
      <Layout>
        <Box p="md">
          <Title order={2} mb="lg">
            Your Songs
          </Title>
          <Stack gap="md">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} p="md">
                <Group>
                  <Skeleton height={60} width={60} />
                  <Box style={{ flex: 1 }}>
                    <Skeleton height={20} width="60%" mb={8} />
                    <Skeleton height={16} width="40%" />
                  </Box>
                  <Skeleton height={16} width={40} />
                </Group>
              </Card>
            ))}
          </Stack>
        </Box>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box p="md">
          <Title order={2} mb="lg">
            Your Songs
          </Title>
          <Text c="red">Failed to load saved tracks. Please try again.</Text>
        </Box>
      </Layout>
    );
  }

  const savedTracks = savedTracksResponse?.items || [];
  const totalPages = Math.ceil(
    (savedTracksResponse?.total || 0) / ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <Box p="md">
        <Title order={2} mb="lg">
          Your Songs
        </Title>

        {savedTracks.length === 0 ? (
          <Text c="dimmed">No saved tracks found.</Text>
        ) : (
          <Stack gap="md">
            {savedTracks.map(({ track, added_at }) => (
              <Card key={track.id} p="md" withBorder>
                <Group>
                  <Image
                    alt={track.album.name}
                    height={60}
                    radius="sm"
                    src={track.album.images[0]?.url}
                    width={60}
                  />
                  <Box style={{ flex: 1 }}>
                    <Text fw={500} size="sm">
                      {track.name}
                    </Text>
                    <Text c="dimmed" size="sm">
                      {formatArtistNames(track.artists)}
                    </Text>
                    <Text c="dimmed" size="xs">
                      {track.album.name} • Saved on{' '}
                      {new Date(added_at).toLocaleDateString()}
                    </Text>
                  </Box>
                  <Group gap="xs">
                    <Text c="dimmed" size="sm">
                      {formatDuration(track.duration_ms)}
                    </Text>
                    <ActionIcon size="sm" variant="subtle">
                      <Play size={16} />
                    </ActionIcon>
                  </Group>
                </Group>
              </Card>
            ))}

            {totalPages > 1 && (
              <Group justify="center" mt="lg">
                <Pagination
                  onChange={setPage}
                  total={totalPages}
                  value={page}
                />
              </Group>
            )}
          </Stack>
        )}
      </Box>
    </Layout>
  );
}
