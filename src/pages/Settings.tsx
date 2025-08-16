import {
  Container,
  Title,
  Paper,
  Stack,
  Text,
  Switch,
  Select,
  Button,
  Group,
  Divider,
  Badge,
} from '@mantine/core';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useGetCurrentUserProfileQuery } from '../features/spotify/spotify-api';
import type { RootState, AppDispatch } from '../store';
import { Layout } from '../components/Layout';
import { setThemeMode } from '../features/theme/theme-slice';

export function Settings() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const { data: userProfile } = useGetCurrentUserProfileQuery(undefined, {
    skip: !auth.authenticated || !auth.accessToken,
  });

  // Settings state
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [quality, setQuality] = useState('high');

  const handleThemeChange = (value: string | null) => {
    const newTheme = (value as 'light' | 'dark' | 'system') || 'system';
    dispatch(setThemeMode(newTheme));
  };

  return (
    <Layout>
      <Container size="md" py="xl" style={{ minHeight: '100%' }}>
        <Stack gap="xl">
          {/* Header */}
          <div>
            <Title order={1} mb="xs">
              Settings
            </Title>
            <Text c="dimmed">
              Manage your app preferences and account settings
            </Text>
          </div>

          {/* Account Information */}
          <Paper p="lg" withBorder>
            <Title order={3} mb="md">
              Account
            </Title>
            <Stack gap="md">
              {userProfile && (
                <Group>
                  <Text fw={500}>Spotify Account:</Text>
                  <Text>{userProfile.display_name}</Text>
                  <Badge color="green" variant="light">
                    Connected
                  </Badge>
                </Group>
              )}
              {userProfile?.email && (
                <Group>
                  <Text fw={500}>Email:</Text>
                  <Text>{userProfile.email}</Text>
                </Group>
              )}
              <Group>
                <Text fw={500}>Account ID:</Text>
                <Text>{userProfile?.id || 'Loading...'}</Text>
              </Group>
            </Stack>
          </Paper>

          {/* App Settings */}
          <Paper p="lg" withBorder>
            <Title order={3} mb="md">
              App Settings
            </Title>
            <Stack gap="lg">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Auto-refresh tokens</Text>
                  <Text size="sm" c="dimmed">
                    Automatically refresh Spotify tokens when they expire
                  </Text>
                </div>
                <Switch
                  checked={autoRefresh}
                  onChange={(event) =>
                    setAutoRefresh(event.currentTarget.checked)
                  }
                />
              </Group>

              <Group justify="space-between">
                <div>
                  <Text fw={500}>Theme</Text>
                  <Text size="sm" c="dimmed">
                    Choose your preferred app theme
                  </Text>
                </div>
                <Select
                  value={themeMode}
                  onChange={handleThemeChange}
                  data={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' },
                  ]}
                  w={120}
                />
              </Group>

              <Group justify="space-between">
                <div>
                  <Text fw={500}>Notifications</Text>
                  <Text size="sm" c="dimmed">
                    Show desktop notifications for new tracks
                  </Text>
                </div>
                <Switch
                  checked={notifications}
                  onChange={(event) =>
                    setNotifications(event.currentTarget.checked)
                  }
                />
              </Group>

              <Group justify="space-between">
                <div>
                  <Text fw={500}>Audio Quality</Text>
                  <Text size="sm" c="dimmed">
                    Preferred audio quality for playback
                  </Text>
                </div>
                <Select
                  value={quality}
                  onChange={(value) => setQuality(value || 'high')}
                  data={[
                    { value: 'low', label: 'Low' },
                    { value: 'medium', label: 'Medium' },
                    { value: 'high', label: 'High' },
                  ]}
                  w={120}
                />
              </Group>
            </Stack>
          </Paper>

          {/* About */}
          <Paper p="lg" withBorder>
            <Title order={3} mb="md">
              About
            </Title>
            <Stack gap="md">
              <Group>
                <Text fw={500}>Version:</Text>
                <Text>1.0.0</Text>
              </Group>
              <Group>
                <Text fw={500}>Electron:</Text>
                <Text>Latest</Text>
              </Group>
              <Group>
                <Text fw={500}>Spotify API:</Text>
                <Text>v1</Text>
              </Group>
            </Stack>
          </Paper>

          {/* Actions */}
          <Paper p="lg" withBorder>
            <Title order={3} mb="md">
              Actions
            </Title>
            <Stack gap="md">
              <Button variant="light" color="blue">
                Export Settings
              </Button>
              <Button variant="light" color="orange">
                Clear Cache
              </Button>
              <Divider />
              <Button variant="light" color="red">
                Reset All Settings
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </Layout>
  );
}
