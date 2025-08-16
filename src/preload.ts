// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  authenticate: () => ipcRenderer.invoke('spotify-auth'),
  onAuthenticated: (
    callback: (event: Electron.IpcRendererEvent, ...args: unknown[]) => void
  ) => ipcRenderer.on('spotify-auth-callback', callback),
  store: {
    get: (key: string) => ipcRenderer.sendSync('electron-store-get', key),
    set: (key: string, item: unknown) =>
      ipcRenderer.send('electron-store-set', key, item),
    delete: (key: string) => ipcRenderer.sendSync('electron-store-delete', key),
  },
});
