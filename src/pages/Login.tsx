import { Button, Card, Center, Title } from '@mantine/core';
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
    <Center>
      <Card padding="xl">
        <Logo size={120} />
        <Title order={1}>
          Millions of songs.
          <br />
          Free on Spotify.
        </Title>
        <Button
          m={36}
          onClick={handleLogin}
          radius="xl"
          rightSection={<ExternalLink size={18} />}
        >
          Log in
        </Button>
      </Card>
    </Center>
  );
}
