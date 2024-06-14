// In your main.js
const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.handle('read-file', (event, filePath, options) => fs.readFileSync(filePath, options));
ipcMain.handle('write-file', (event, filePath, data) => fs.writeFileSync(filePath, data));
ipcMain.handle('join-path', (event, ...args) => path.join(...args));