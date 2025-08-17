import {
  ActionIcon,
  Autocomplete,
  Box,
  Card,
  Group,
  Image,
  Modal,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import { Play, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useSearchQuery } from '../features/spotify/spotify-api';

import type { RootState } from '../store';

export function SearchInput() {
  const [value, setValue] = useState('');
  const [opened, setOpened] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const auth = useSelector((state: RootState) => state.auth);

  const {
    data: searchResults,
    isLoading: searchLoading,
    error: searchError,
  } = useSearchQuery(
    { query: searchQuery },
    {
      skip: !auth.authenticated || !auth.accessToken || !searchQuery.trim(),
    }
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setOpened(true);
    }
  };

  const handleInputClick = () => {
    if (value.trim()) {
      setSearchQuery(value);
      setOpened(true);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K to focus search
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const input = document.querySelector(
          'input[placeholder="What do you want to play?"]'
        ) as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }
      // Escape to close modal
      if (event.key === 'Escape' && opened) {
        setOpened(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [opened]);

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatArtistNames = (artists: Array<{ name: string }>) => {
    return artists.map((artist) => artist.name).join(', ');
  };

  // Calculate total results for modal title
  const totalResults = searchResults
    ? (searchResults.tracks?.total || 0) +
      (searchResults.artists?.total || 0) +
      (searchResults.albums?.total || 0) +
      (searchResults.playlists?.total || 0)
    : 0;

  const renderSearchResults = () => {
    if (searchLoading) {
      return (
        <Stack gap="md">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} p="sm" withBorder>
              <Group>
                <Skeleton height={60} width={60} radius="sm" />
                <Box style={{ flex: 1 }}>
                  <Skeleton height={16} width="60%" mb={4} />
                  <Skeleton height={12} width="40%" />
                </Box>
                <Skeleton height={16} width={40} />
              </Group>
            </Card>
          ))}
        </Stack>
      );
    }

    if (searchError) {
      return (
        <Text c="red" ta="center" py="xl">
          Failed to load search results. Please try again.
        </Text>
      );
    }

    if (!searchResults) {
      return (
        <Text c="dimmed" ta="center" py="xl">
          Start typing to search for music...
        </Text>
      );
    }

    const allResults = [
      ...(searchResults.tracks?.items || []).map((item: any) => ({
        ...item,
        type: 'track',
      })),
      ...(searchResults.artists?.items || []).map((item: any) => ({
        ...item,
        type: 'artist',
      })),
      ...(searchResults.albums?.items || []).map((item: any) => ({
        ...item,
        type: 'album',
      })),
      ...(searchResults.playlists?.items || []).map((item: any) => ({
        ...item,
        type: 'playlist',
      })),
    ].slice(0, 20);

    if (allResults.length === 0) {
      return (
        <Text c="dimmed" ta="center" py="xl">
          No results found for "{searchQuery}"
        </Text>
      );
    }

    return (
      <Stack gap="md">
        {allResults.map((item: any) => (
          <Card key={`${item.type}-${item.id}`} p="sm" withBorder>
            <Group>
              <Image
                alt={item.name}
                height={60}
                radius="sm"
                src={
                  item.type === 'artist'
                    ? item.images?.[0]?.url
                    : item.images?.[0]?.url || item.album?.images?.[0]?.url
                }
                width={60}
              />
              <Box style={{ flex: 1 }}>
                <Text fw={500} lineClamp={1} size="sm">
                  {item.name}
                </Text>
                <Text c="dimmed" lineClamp={1} size="xs">
                  {item.type === 'track'
                    ? formatArtistNames(item.artists)
                    : item.type === 'album'
                    ? formatArtistNames(item.artists)
                    : item.type === 'playlist'
                    ? `Playlist • ${item.owner?.display_name}`
                    : 'Artist'}
                </Text>
              </Box>
              <Group gap="xs">
                {item.type === 'track' && (
                  <Text c="dimmed" size="xs">
                    {formatDuration(item.duration_ms)}
                  </Text>
                )}
                <ActionIcon size="sm" variant="subtle">
                  <Play size={14} />
                </ActionIcon>
              </Group>
            </Group>
          </Card>
        ))}
      </Stack>
    );
  };

  return (
    <>
      <Group gap="xs" style={{ width: '100%' }}>
        <Autocomplete
          data={[]}
          leftSection={<Search size={16} />}
          onChange={setValue}
          onClick={handleInputClick}
          onOptionSubmit={handleSearch}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && value.trim()) {
              handleSearch(value);
            }
          }}
          placeholder="Search for music... (Ctrl+K)"
          radius="xl"
          size="sm"
          style={{
            flex: 1,
            minWidth: 150,
          }}
          styles={{
            input: {
              backgroundColor: 'var(--mantine-color-dark-6)',
              border: '1px solid var(--mantine-color-dark-4)',
              '&:focus': {
                borderColor: 'var(--mantine-color-primary-6)',
              },
            },
          }}
          value={value}
        />
        {value.trim() && (
          <>
            <ActionIcon
              loading={searchLoading}
              onClick={() => handleSearch(value)}
              size="lg"
              variant="filled"
              radius="xl"
            >
              <Search size={16} />
            </ActionIcon>
            <ActionIcon
              onClick={() => setValue('')}
              size="lg"
              variant="subtle"
              radius="xl"
            >
              <X size={16} />
            </ActionIcon>
          </>
        )}
      </Group>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={
          <Text size="lg" fw={600}>
            Search Results
            {searchQuery && (
              <Text component="span" c="dimmed" fw={400}>
                {' '}
                for "{searchQuery}"
                {totalResults > 0 && (
                  <Text component="span" c="dimmed" fw={400}>
                    {' '}
                    ({totalResults} results)
                  </Text>
                )}
              </Text>
            )}
          </Text>
        }
        size="lg"
        centered
      >
        <Box py="md">{renderSearchResults()}</Box>
      </Modal>
    </>
  );
}
