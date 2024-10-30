import { Avatar, Menu } from '@mantine/core';
import { User } from 'lucide-react';

export function UserMenu() {
  return (
    <Menu>
      <Menu.Target>
        <Avatar radius="xl">
          <User />
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item>Profile</Menu.Item>
        <Menu.Item>Settings</Menu.Item>
        <Menu.Divider />
        <Menu.Item>Log out</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
