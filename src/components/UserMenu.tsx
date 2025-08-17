import { Avatar, Button, Group, Menu, Modal, Text } from '@mantine/core';
import { LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { logout } from '../features/auth/auth-slice';
import { useGetCurrentUserProfileQuery } from '../features/spotify/spotify-api';
import type { AppDispatch, RootState } from '../store';

export function UserMenu() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const { data: userProfile } = useGetCurrentUserProfileQuery(undefined, {
    skip: !auth.authenticated || !auth.accessToken,
  });

  // Get the first (largest) profile image, or fallback to null
  const profileImageUrl = userProfile?.images?.[0]?.url || null;

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
          <Avatar radius="xl" src={profileImageUrl}>
            <User />
          </Avatar>
        </Menu.Target>

        <Menu.Dropdown>
          {userProfile && (
            <Menu.Item disabled>
              <Text size="sm" fw={500}>
                {userProfile.display_name}
              </Text>
              {userProfile.email && (
                <Text size="xs" c="dimmed">
                  {userProfile.email}
                </Text>
              )}
            </Menu.Item>
          )}
          <Menu.Divider />
          <Menu.Item onClick={() => navigate('/settings')}>Settings</Menu.Item>
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
