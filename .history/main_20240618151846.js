const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

const appDataPath = path.join(app.getPath('appData'), 'electron-ivy-lee-method');
if (!fs.existsSync(appDataPath)){
    fs.mkdirSync(appDataPath);
}

ipcMain.handle('read-file', (event, filePath) => {
  const absoluteFilePath = path.join(appDataPath, filePath);
  try {
    return fs.readFileSync(absoluteFilePath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read file at ${absoluteFilePath}:`, error);
    return '[]';
  }
});

ipcMain.handle('write-file', (event, filePath, data) => {
  const absoluteFilePath = path.join(appDataPath, filePath);
  fs.writeFileSync(absoluteFilePath, data);
});

ipcMain.handle('join-path', (event, ...args) => path.join(...args));

function createWindow () {
  const win = new BrowserWindow({
    width: 400,
    height: 600,
    title: "The Ivy Lee Method",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    }
  })

  win.loadFile('index.html');

  win.webContents.on('did-finish-load', () => {
    win.webContents.send('dirname', __dirname);
  });

  const instructionsWin = new BrowserWindow({
    width: 400,
    height: 400,
    parent: win, 
    modal: true, 
    show: false, 
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, 
    }
  });

  instructionsWin.loadFile('instructions.html'); 

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