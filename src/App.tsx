import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Settings } from './pages/Settings';
import { persistor, store } from './store';
import { ThemeProvider } from './components/ThemeProvider';

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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </PersistGate>
  </Provider>
);
