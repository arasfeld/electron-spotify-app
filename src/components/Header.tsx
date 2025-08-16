import { Burger, Group } from '@mantine/core';

import { LogoIcon } from './LogoIcon';
import { SearchInput } from './SearchInput';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  onToggle: () => void;
  open?: boolean;
}

export function Header({ onToggle, open = false }: HeaderProps) {
  return (
    <Group justify="space-between" p={6}>
      <Burger hiddenFrom="sm" onClick={onToggle} opened={open} size="sm" />
      <LogoIcon size={42} />
      <SearchInput />
      <UserMenu />
    </Group>
  );
}
