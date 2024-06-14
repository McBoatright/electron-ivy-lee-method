// In your preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api', {
    readFileSync: (path, options) => ipcRenderer.invoke('read-file', path, options),
    writeFileSync: (path, data) => ipcRenderer.invoke('write-file', path, data),
    joinPath: (...args) => ipcRenderer.invoke('join-path', ...args),
    receive: (channel, func) => {
      ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
  }
);