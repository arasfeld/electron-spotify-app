import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, type PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { Header } from './Header';
import { Navbar } from './Navbar';

import type { RootState } from '../store';

export function Layout({ children }: PropsWithChildren) {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();
  const authenticated = useSelector<RootState>(
    (state) => state.auth.authenticated
  );

  useEffect(() => {
    if (!authenticated) {
      navigate('/login');
    }
  }, [authenticated, navigate]);

  // Don't render anything if not authenticated
  if (!authenticated) {
    return null;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header px={12}>
        <Header onToggle={toggle} />
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <Navbar />
      </AppShell.Navbar>

      <AppShell.Main style={{ overflow: 'auto' }}>{children}</AppShell.Main>
    </AppShell>
  );
}
