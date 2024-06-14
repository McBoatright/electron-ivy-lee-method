// In your main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.handle('read-file', (event, filePath, options) => fs.readFileSync(filePath, options || 'utf-8'));
ipcMain.handle('write-file', (event, filePath, data) => fs.writeFileSync(filePath, data));
ipcMain.handle('join-path', (event, ...args) => path.join(...args));


function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })

  win.loadFile('index.html');

  // Add this line to send __dirname to the renderer process
  win.webContents.on('did-finish-load', () => {
    win.webContents.send('dirname', __dirname);
  });
}

app.whenReady().then(() => {
  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
})