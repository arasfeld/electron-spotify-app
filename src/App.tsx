import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from './components/ThemeProvider';

import { Albums } from './pages/Albums';
import { Artists } from './pages/Artists';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { PlaylistView } from './pages/PlaylistView';
import { Settings } from './pages/Settings';
import { Songs } from './pages/Songs';

import { persistor, store } from './store';

// Simple loading component that doesn't use Mantine components
const LoadingComponent = () => (
  <div
    style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      color: 'var(--mantine-color-gray-6)',
    }}
  >
    Loading...
  </div>
);

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
    <PersistGate loading={<LoadingComponent />} persistor={persistor}>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/playlist/:playlistId" element={<PlaylistView />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/albums" element={<Albums />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
