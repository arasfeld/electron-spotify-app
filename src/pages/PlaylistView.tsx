import {
  Container,
  Title,
  Paper,
  Stack,
  Text,
  Group,
  Image,
  Button,
  ActionIcon,
  Table,
  Badge,
  Tooltip,
} from '@mantine/core';
import { Play, Clock } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetPlaylistTracksQuery } from '../features/spotify/spotify-api';
import type { RootState } from '../store';
import { Layout } from '../components/Layout';

export function PlaylistView() {
  const { playlistId } = useParams<{ playlistId: string }>();
  const auth = useSelector((state: RootState) => state.auth);

  const {
    data: playlistData,
    isLoading,
    error,
  } = useGetPlaylistTracksQuery(playlistId || '', {
    skip: !auth.authenticated || !auth.accessToken || !playlistId,
  });

  // Format time in MM:SS
  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handlePlayTrack = (trackUri: string) => {
    // TODO: Implement play track functionality
    console.log('Play track:', trackUri);
  };

  const handlePlayPlaylist = () => {
    // TODO: Implement play entire playlist functionality
    console.log('Play entire playlist');
  };

  if (isLoading) {
    return (
      <Layout>
        <Container size="lg" py="xl">
          <Text>Loading playlist...</Text>
        </Container>
      </Layout>
    );
  }

  if (error || !playlistData) {
    return (
      <Layout>
        <Container size="lg" py="xl">
          <Text c="red">Failed to load playlist</Text>
        </Container>
      </Layout>
    );
  }

  // The Spotify API returns the playlist data directly
  const playlist = playlistData;
  const tracks =
    playlistData.tracks?.items
      ?.map((item: any) => item.track)
      .filter(Boolean) || [];

  return (
    <Layout>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          {/* Playlist Header */}
          <Paper p="lg" withBorder>
            <Group gap="lg">
              <Image
                src={playlist.images?.[0]?.url}
                alt={playlist.name || 'Playlist'}
                width={200}
                height={200}
                radius="md"
                fallbackSrc="https://placehold.co/200x200/666/fff?text=🎵"
              />
              <Stack gap="md" style={{ flex: 1 }}>
                <div>
                  <Badge variant="light" mb="xs">
                    Playlist
                  </Badge>
                  <Title order={1} mb="xs">
                    {playlist.name || 'Untitled Playlist'}
                  </Title>
                  {playlist.description && (
                    <Text c="dimmed" mb="md">
                      {playlist.description}
                    </Text>
                  )}
                  <Text size="sm" c="dimmed">
                    Created by {playlist.owner?.display_name || 'Unknown'} •{' '}
                    {playlist.tracks?.total || 0} tracks
                  </Text>
                </div>
                <Group>
                  <Button
                    leftSection={<Play size={16} />}
                    onClick={handlePlayPlaylist}
                    size="md"
                  >
                    Play
                  </Button>
                </Group>
              </Stack>
            </Group>
          </Paper>

          {/* Tracks Table */}
          <Paper p="lg" withBorder>
            <Title order={3} mb="md">
              Tracks
            </Title>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th style={{ width: 50 }}>#</Table.Th>
                  <Table.Th>Title</Table.Th>
                  <Table.Th>Artist</Table.Th>
                  <Table.Th>Album</Table.Th>
                  <Table.Th style={{ width: 100 }}>
                    <Group gap="xs" justify="center">
                      <Clock size={16} />
                    </Group>
                  </Table.Th>
                  <Table.Th style={{ width: 50 }}></Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {tracks.map((track: any, index: number) => (
                  <Table.Tr key={track.id}>
                    <Table.Td>
                      <Text size="sm" c="dimmed">
                        {index + 1}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm">
                        <Image
                          src={track.album?.images?.[0]?.url}
                          alt={track.name || 'Track'}
                          width={40}
                          height={40}
                          radius="sm"
                          fallbackSrc="https://placehold.co/40x40/666/fff?text=🎵"
                        />
                        <Tooltip
                          label={track.name || 'Unknown Track'}
                          disabled={!track.name}
                        >
                          <Text
                            size="sm"
                            fw={500}
                            lineClamp={1}
                            style={{ maxWidth: 200 }}
                          >
                            {track.name || 'Unknown Track'}
                          </Text>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip
                        label={
                          track.artists
                            ?.map((artist: { name: string }) => artist.name)
                            .join(', ') || 'Unknown Artist'
                        }
                        disabled={!track.artists?.length}
                      >
                        <Text
                          size="sm"
                          c="dimmed"
                          lineClamp={1}
                          style={{ maxWidth: 150 }}
                        >
                          {track.artists
                            ?.map((artist: { name: string }) => artist.name)
                            .join(', ') || 'Unknown Artist'}
                        </Text>
                      </Tooltip>
                    </Table.Td>
                    <Table.Td>
                      <Tooltip
                        label={track.album?.name || 'Unknown Album'}
                        disabled={!track.album?.name}
                      >
                        <Text
                          size="sm"
                          c="dimmed"
                          lineClamp={1}
                          style={{ maxWidth: 150 }}
                        >
                          {track.album?.name || 'Unknown Album'}
                        </Text>
                      </Tooltip>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c="dimmed" ta="center">
                        {formatTime(track.duration_ms || 0)}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() => handlePlayTrack(track.uri || '')}
                        title="Play track"
                      >
                        <Play size={16} />
                      </ActionIcon>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Stack>
      </Container>
    </Layout>
  );
}
