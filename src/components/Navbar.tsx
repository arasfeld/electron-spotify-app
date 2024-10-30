import { NavLink, Stack, Title } from '@mantine/core';
import {
  LayoutGrid,
  Library,
  ListMusic,
  MicVocal,
  Music2,
  PlayCircle,
  Radio,
} from 'lucide-react';

export function Navbar() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={4} px={12} py={4}>
          Discover
        </Title>
        <NavLink label="Discover" leftSection={<PlayCircle />} />
        <NavLink label="Browse" leftSection={<LayoutGrid />} />
        <NavLink label="Radio" leftSection={<Radio />} />
      </div>
      <div>
        <Title order={4} px={12} py={4}>
          Library
        </Title>
        <NavLink label="Playlists" leftSection={<ListMusic />} />
        <NavLink label="Songs" leftSection={<Music2 />} />
        <NavLink label="Artists" leftSection={<MicVocal />} />
        <NavLink label="Albums" leftSection={<Library />} />
      </div>
      <div>
        <Title order={4} px={12} py={4}>
          Playlists
        </Title>
        <NavLink label="Recently Added" leftSection={<ListMusic />} />
        <NavLink label="Recently Played" leftSection={<ListMusic />} />
        <NavLink label="Top Songs" leftSection={<ListMusic />} />
        <NavLink label="Top Albums" leftSection={<ListMusic />} />
        <NavLink label="Top Artists" leftSection={<ListMusic />} />
      </div>
    </Stack>
  );
}
