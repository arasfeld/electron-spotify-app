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
import { useGetSavedArtistsQuery } from '../features/spotify/spotify-api';

import type { RootState } from '../store';

const ITEMS_PER_PAGE = 50;

export function Artists() {
  const [page, setPage] = useState(1);
  const auth = useSelector((state: RootState) => state.auth);

  const {
    data: savedArtistsResponse,
    isLoading,
    error,
  } = useGetSavedArtistsQuery(
    {
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    },
    {
      skip: !auth.authenticated || !auth.accessToken,
    }
  );

  if (isLoading) {
    return (
      <Layout>
        <Box p="md">
          <Title order={2} mb="lg">
            Your Artists
          </Title>
          <Stack gap="md">
            {Array.from({ length: 10 }).map((_, index) => (
              <Card key={index} p="md">
                <Group>
                  <Skeleton height={80} width={80} radius="50%" />
                  <Box style={{ flex: 1 }}>
                    <Skeleton height={24} width="50%" mb={8} />
                    <Skeleton height={16} width="30%" />
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
            Your Artists
          </Title>
          <Text c="red">
            Failed to load followed artists. Please try again.
          </Text>
        </Box>
      </Layout>
    );
  }

  const savedArtists = savedArtistsResponse?.items || [];
  const totalPages = Math.ceil(
    (savedArtistsResponse?.total || 0) / ITEMS_PER_PAGE
  );

  return (
    <Layout>
      <Box p="md">
        <Title order={2} mb="lg">
          Your Artists
        </Title>

        {savedArtists.length === 0 ? (
          <Text c="dimmed">No followed artists found.</Text>
        ) : (
          <Stack gap="md">
            {savedArtists.map((artist) => (
              <Card key={artist.id} p="md" withBorder>
                <Group>
                  <Image
                    alt={artist.name}
                    height={80}
                    radius="50%"
                    src={artist.images[0]?.url}
                    width={80}
                  />
                  <Box style={{ flex: 1 }}>
                    <Text fw={600} size="lg">
                      {artist.name}
                    </Text>
                    <Text c="dimmed" size="sm">
                      Artist
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
