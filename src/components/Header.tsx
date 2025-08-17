import { ActionIcon, Box, Burger, Group } from '@mantine/core';
import { Search } from 'lucide-react';

import { LogoIcon } from './LogoIcon';
import { SearchInput } from './SearchInput';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onToggle: () => void;
  open?: boolean;
}

export function Header({ onToggle, open = false }: HeaderProps) {
  return (
    <Group
      justify="space-between"
      p={6}
      gap="xs"
      style={{ minWidth: 0 }}
      align="center"
    >
      {/* Left: Burger menu - hidden on large screens */}
      <Burger onClick={onToggle} opened={open} size="sm" hiddenFrom="sm" />

      {/* Center: Logo - hidden on small screens */}
      <Box visibleFrom="sm">
        <LogoIcon size={42} />
      </Box>

      {/* Search input - responsive */}
      <Box style={{ flex: 1, minWidth: 0, maxWidth: 450 }}>
        <SearchInput />
      </Box>

      {/* Compact search button for very small screens */}
      <Box hiddenFrom="xs">
        <ActionIcon size="lg" variant="subtle" radius="xl">
          <Search size={18} />
        </ActionIcon>
      </Box>

      {/* Right: User menu */}
      <UserMenu />
    </Group>
  );
}
