import { Autocomplete } from '@mantine/core';
import { Search } from 'lucide-react';
import { useState } from 'react';

export function SearchInput() {
  const [value, setValue] = useState('');

  return (
    <Autocomplete
      data={[]}
      leftSection={<Search />}
      onChange={setValue}
      placeholder="What do you want to play?"
      radius="xl"
      value={value}
    />
  );
}
