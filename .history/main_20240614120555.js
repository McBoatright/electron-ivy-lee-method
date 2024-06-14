const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.handle('read-file', (event, filePath) => {
    try {
      return fs.readFileSync(filePath, 'utf-8');
    } catch (error) {
      console.error(`Failed to read file at ${filePath}:`, error);
      return '[]';
    }
  });
  
ipcMain.handle('write-file', (event, filePath, data) => fs.writeFileSync(filePath, data));
ipcMain.handle('join-path', (event, ...args) => path.join(...args));

function createWindow () {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    }
  })

  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('dirname', __dirname);
  });

  // Create a new window for the instructions
  const instructionsWin = new BrowserWindow({
    width: 400,
    height: 300,
    parent: win, // make the main window the parent of this window
    modal: true, // make this window modal - it will prevent interaction with the parent window
    show: false, // don't show the window immediately
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    }
  });

  instructionsWin.loadFile('instructions.html'); // load the instructions from this file

  instructionsWin.once('ready-to-show', () => {
    instructionsWin.show(); 
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