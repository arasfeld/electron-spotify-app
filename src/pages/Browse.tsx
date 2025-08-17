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
  useGetBrowseCategoriesQuery,
  useGetNewReleasesQuery,
} from '../features/spotify/spotify-api';

import type { RootState } from '../store';

export function Browse() {
  const auth = useSelector((state: RootState) => state.auth);

  const {
    data: newReleases,
    isLoading: releasesLoading,
    error: releasesError,
  } = useGetNewReleasesQuery(
    { limit: 12 },
    {
      skip: !auth.authenticated || !auth.accessToken,
    }
  );

  const {
    data: categories,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useGetBrowseCategoriesQuery(undefined, {
    skip: !auth.authenticated || !auth.accessToken,
  });

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

  return (
    <Layout>
      <Box p="md">
        <Title order={2} mb="lg">
          Browse
        </Title>

        <Stack gap="xl">
          {/* Browse Categories */}
          <Box>
            <Title order={3} mb="md">
              Browse Categories
            </Title>
            {categoriesLoading ? (
              renderSkeletonGrid(8)
            ) : categoriesError ? (
              <Text c="red">Failed to load categories.</Text>
            ) : (
              <Grid gutter="md">
                {categories?.categories?.items
                  ?.slice(0, 8)
                  .map((category: any) => (
                    <Grid.Col
                      key={category.id}
                      span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                    >
                      <Card withBorder p="sm">
                        <Stack gap="xs">
                          <Image
                            alt={category.name}
                            height={120}
                            radius="sm"
                            src={category.icons[0]?.url}
                            width="100%"
                          />
                          <Stack gap={2}>
                            <Text fw={500} lineClamp={1} size="sm">
                              {category.name}
                            </Text>
                            <Text c="dimmed" lineClamp={1} size="xs">
                              {category.description || 'Music category'}
                            </Text>
                          </Stack>
                          <Group justify="space-between">
                            <Text c="dimmed" size="xs">
                              Category
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

          {/* New Releases */}
          <Box>
            <Title order={3} mb="md">
              New Releases
            </Title>
            {releasesLoading ? (
              renderSkeletonGrid(8)
            ) : releasesError ? (
              <Text c="red">Failed to load new releases.</Text>
            ) : (
              <Grid gutter="md">
                {newReleases?.albums?.items?.slice(0, 8).map((album: any) => (
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

          {/* Browse Categories */}
          <Box>
            <Title order={3} mb="md">
              Browse by Category
            </Title>
            {categoriesLoading ? (
              renderSkeletonGrid(8)
            ) : categoriesError ? (
              <Text c="red">Failed to load categories.</Text>
            ) : (
              <Grid gutter="md">
                {categories?.categories?.items?.slice(0, 8).map((category) => (
                  <Grid.Col
                    key={category.id}
                    span={{ base: 12, sm: 6, md: 4, lg: 3 }}
                  >
                    <Card withBorder p="sm">
                      <Stack gap="xs">
                        <Image
                          alt={category.name}
                          height={120}
                          radius="sm"
                          src={category.icons[0]?.url}
                          width="100%"
                        />
                        <Stack gap={2}>
                          <Text fw={500} lineClamp={1} size="sm">
                            {category.name}
                          </Text>
                        </Stack>
                        <Group justify="space-between">
                          <Text c="dimmed" size="xs">
                            {category.name}
                          </Text>
                          <ActionIcon color="blue" size="sm" variant="subtle">
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
