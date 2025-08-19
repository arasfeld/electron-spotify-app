import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Electron APIs
Object.defineProperty(window, 'electron', {
  value: {
    authenticate: vi.fn(),
    onAuthenticated: vi.fn(() => ({
      on: vi.fn(),
      removeListener: vi.fn(),
    })),
    store: {
      get: vi.fn(),
      set: vi.fn(),
      delete: vi.fn(),
    },
  },
  writable: true,
});

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_SPOTIFY_CLIENT_ID: 'test-client-id',
    VITE_SPOTIFY_REDIRECT_URI: 'http://localhost:5173/callback',
    NODE_ENV: 'test',
  },
  writable: true,
});

// Mock fetch globally
global.fetch = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Suppress console errors in tests unless explicitly needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
