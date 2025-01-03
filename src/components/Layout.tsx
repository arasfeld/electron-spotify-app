import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, type PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import type { RootState } from '../store';
import { Header } from './Header';
import { Navbar } from './Navbar';

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
  }, [authenticated]);

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

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
