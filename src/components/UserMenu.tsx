import { Avatar, Menu, Modal, Text, Button, Group } from '@mantine/core';
import { LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../features/auth/auth-slice';
import type { AppDispatch } from '../store';

export function UserMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    // Simple logout - just clear auth and redirect
    dispatch(logout());
    setShowLogoutModal(false);
    navigate('/login');
  };

  const openLogoutModal = () => {
    setShowLogoutModal(true);
  };

  return (
    <>
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
          <Menu.Item
            leftSection={<LogOut size={16} />}
            onClick={openLogoutModal}
            color="red"
          >
            Log out
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>

      <Modal
        opened={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
        centered
      >
        <Text mb="lg">
          Are you sure you want to log out? You'll need to sign in again to
          access your Spotify account.
        </Text>

        <Group justify="flex-end">
          <Button variant="light" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button
            color="red"
            onClick={handleLogout}
            leftSection={<LogOut size={16} />}
          >
            Log out
          </Button>
        </Group>
      </Modal>
    </>
  );
}
