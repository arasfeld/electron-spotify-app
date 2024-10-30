import { Text, Title } from '@mantine/core';
import { Layout } from '../components/Layout';

export function Home() {
  return (
    <Layout>
      <Title order={1}>💖 Hello World!</Title>
      <Text>Welcome to your Electron application.</Text>
    </Layout>
  );
}
