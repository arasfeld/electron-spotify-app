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
import { useGetSavedAlbumsQuery } from '../features/spotify/spotify-api';

import type { RootState } from '../store';

const ITEMS_PER_PAGE = 50;

export function Albums() {
  const [page, setPage] = useState(1);
  const auth = useSelector((state: RootState) => state.auth);

  const {
    data: savedAlbumsResponse,
    isLoading,
    error,
  } = useGetSavedAlbumsQuery(
    {
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    },
    {
      skip: !auth.authenticated || !auth.accessToken,
    }
  );

  const formatArtistNames = (artists: Array<{ name: string }>) => {
    return artists.map((artist) => artist.name).join(', ');
  };

  if (isLoading) {
    return (
      <Layout>
        <Box p="md">
          <Title order={2} mb="lg">
            Your Albums
          </Title>
          <Stack gap="md">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} p="md">
                <Group>
                  <Skeleton height={80} width={80} />
                  <Box style={{ flex: 1 }}>
                    <Skeleton height={24} width="60%" mb={8} />
                    <Skeleton height={16} width="40%" mb={4} />
                    <Skeleton height={14} width="30%" />
                  </Box>
                  <Skeleton height={32} width={32} radius="50%" />
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
            Your Albums
          </Title>
          <Text c="red">Failed to load saved albums. Please try again.</Text>
        </Box>
      </Layout>
    );
  }

  const savedAlbums = savedAlbumsResponse?.items || [];
  const totalPages = Math.ceil(
    (savedAlbumsResponse?.total || 0) / ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <Box p="md">
        <Title order={2} mb="lg">
          Your Albums
        </Title>

        {savedAlbums.length === 0 ? (
          <Text c="dimmed">No saved albums found.</Text>
        ) : (
          <Stack gap="md">
            {savedAlbums.map(({ album, added_at }) => (
              <Card key={album.id} p="md" withBorder>
                <Group>
                  <Image
                    alt={album.name}
                    height={80}
                    radius="sm"
                    src={album.images[0]?.url}
                    width={80}
                  />
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="lg">
                      {album.name}
                    </Text>
                    <Text c="dimmed" size="sm">
                      {formatArtistNames(album.artists)}
                    </Text>
                    <Text c="dimmed" size="xs">
                      Saved on {new Date(added_at).toLocaleDateString()}
                    </Text>
                  </Box>
                  <ActionIcon size="lg" variant="subtle">
                    <Play size={20} />
                  </ActionIcon>
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
