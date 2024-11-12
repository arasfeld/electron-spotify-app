/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare global {
  interface Window {
    electron: {
      authenticate: () => void;
      onAuthenticated: (
        callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
      ) => Electron.IpcRenderer;
    };
  }
}

export {};
