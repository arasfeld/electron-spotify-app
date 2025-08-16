import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

import { ThemeProvider } from './components/ThemeProvider';

import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { PlaylistView } from './pages/PlaylistView';
import { Settings } from './pages/Settings';

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
      color: '#666',
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
