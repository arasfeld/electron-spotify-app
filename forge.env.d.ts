/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare global {
  interface Window {
    electron: {
      authenticate: () => void;
      onAuthenticated: (
        callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
      ) => Electron.IpcRenderer;
      store: {
        get: (key: string) => unknown;
        set: (key: string, item: unknown) => void;
        delete: (key: string) => void;
      };
    };
  }

  // Vite environment variables type declarations
  interface ImportMetaEnv {
    readonly VITE_SPOTIFY_CLIENT_ID: string;
    readonly VITE_SPOTIFY_REDIRECT_URI?: string;
    readonly NODE_ENV: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};
