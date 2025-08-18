import {
  Box,
  Button,
  Center,
  Container,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { ExternalLink, Music, Play, Radio } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Logo } from '../components/Logo';
import { setCredentials } from '../features/auth/auth-slice';

import type { AppDispatch, RootState } from '../store';
import type { Tokens } from '../types';

export function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const theme = useMantineTheme();

  const authenticated = useSelector<RootState>(
    (state) => state.auth.authenticated
  );
  const primaryColor = useSelector<RootState>(
    (state) => state.theme.primaryColor
  );
  const themeMode = useSelector<RootState>((state) => state.theme.mode);

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleCallback = useCallback(
    (_event: Electron.IpcRendererEvent, tokens: Tokens) => {
      dispatch(setCredentials(tokens));
    },
    [dispatch]
  );

  const handleLogin = () => {
    window?.electron?.authenticate?.();
  };

  useEffect(() => {
    window?.electron?.onAuthenticated?.(handleCallback);
  }, [handleCallback]);

  // Get primary color from theme
  const primaryColorValue =
    theme.colors[primaryColor as keyof typeof theme.colors]?.[6] ||
    theme.colors.green[6];
  const primaryColorLight =
    theme.colors[primaryColor as keyof typeof theme.colors]?.[5] ||
    theme.colors.green[5];

  // Theme-aware colors - use Redux store theme mode
  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  const backgroundStart = isDark ? theme.colors.dark[8] : theme.colors.gray[0];
  const backgroundEnd = isDark ? theme.colors.dark[6] : theme.colors.gray[2];
  const titleColor = isDark ? theme.white : theme.colors.dark[9];
  const titleGradientEnd = isDark ? theme.colors.gray[3] : theme.colors.gray[6];
  const descriptionColor = isDark ? theme.colors.gray[3] : theme.colors.gray[7];
  const subtitleColor = isDark ? theme.colors.gray[5] : theme.colors.gray[6];
  const featureColor = isDark ? theme.colors.gray[5] : theme.colors.gray[6];
  const iconColor = isDark ? theme.colors.gray[4] : theme.colors.gray[5];

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${backgroundStart} 0%, ${backgroundEnd} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Pattern */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 20% 80%, ${primaryColorValue}15 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${theme.colors.blue[6]}15 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${theme.colors.violet[6]}10 0%, transparent 50%)
          `,
          opacity: 0.6,
        }}
      />

      {/* Floating Icons */}
      <Box
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          color: iconColor,
          opacity: 0.3,
        }}
      >
        <Music size={40} />
      </Box>
      <Box
        style={{
          position: 'absolute',
          top: '20%',
          right: '15%',
          color: iconColor,
          opacity: 0.3,
        }}
      >
        <Play size={30} />
      </Box>
      <Box
        style={{
          position: 'absolute',
          bottom: '15%',
          left: '20%',
          color: iconColor,
          opacity: 0.3,
        }}
      >
        <Radio size={35} />
      </Box>

      <Container size="sm" style={{ position: 'relative', zIndex: 1 }}>
        <Center style={{ minHeight: '100vh' }}>
          <Stack align="center" gap="xl" justify="center" w="100%">
            {/* Logo Section */}
            <Stack align="center" gap="md">
              <Logo size={80} />
              <Title
                order={1}
                size="3rem"
                ta="center"
                style={{
                  background: `linear-gradient(135deg, ${titleColor} 0%, ${titleGradientEnd} 100%)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  fontWeight: 700,
                }}
              >
                Welcome to
                <br />
                Spotify Desktop
              </Title>
            </Stack>

            {/* Description */}
            <Stack align="center" gap="xs">
              <Text
                size="xl"
                ta="center"
                c={descriptionColor}
                style={{ maxWidth: 400 }}
              >
                Access your music library, discover new tracks, and enjoy your
                favorite playlists
              </Text>
              <Text size="md" ta="center" c={subtitleColor}>
                Connect your Spotify account to get started
              </Text>
            </Stack>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              size="xl"
              radius="xl"
              rightSection={<ExternalLink size={20} />}
              style={{
                background: `linear-gradient(135deg, ${primaryColorValue} 0%, ${primaryColorLight} 100%)`,
                border: 'none',
                boxShadow: `0 8px 32px ${primaryColorValue}40`,
                transition: 'all 0.3s ease',
                minWidth: 200,
              }}
              styles={{
                root: {
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 40px ${primaryColorValue}60`,
                  },
                },
              }}
            >
              Connect with Spotify
            </Button>

            {/* Features */}
            <Stack gap="md" mt="xl">
              <Text size="sm" c={featureColor} ta="center">
                ✨ Personalized recommendations
              </Text>
              <Text size="sm" c={featureColor} ta="center">
                🎵 Your saved tracks, albums & artists
              </Text>
              <Text size="sm" c={featureColor} ta="center">
                📱 Browse featured playlists & new releases
              </Text>
            </Stack>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
}
