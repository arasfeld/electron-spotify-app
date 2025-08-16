import { Button, Card, Center, Stack, Title } from '@mantine/core';
import { ExternalLink } from 'lucide-react';
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
  const authenticated = useSelector<RootState>(
    (state) => state.auth.authenticated
  );

  useEffect(() => {
    if (authenticated) {
      navigate('/');
    }
  }, [authenticated]);

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
  }, []);

  return (
    <Center style={{ height: '100vh', width: '100vw' }}>
      <Card padding="xl">
        <Stack align="center" gap="md" justify="center">
          <Logo size={120} />
          <Title order={1} mb="lg">
            Millions of songs.
            <br />
            Free on Spotify.
          </Title>
          <Button
            onClick={handleLogin}
            radius="xl"
            rightSection={<ExternalLink size={18} />}
            size="lg"
          >
            Log in
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
