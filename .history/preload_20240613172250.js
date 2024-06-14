const { contextBridge, ipcRenderer } = require('electron');
const fs = require('fs');

contextBridge.exposeInMainWorld(
  'api', {
    readFileSync: (path, options) => fs.readFileSync(path, options),
    // Add other fs functions as needed
  }
);