// In your main.js
const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    }
  })
  
  // In your preload.js
  window.fs = require('fs');
  window.path = require('path');
  
  // In your renderer.js, you can now use the fs and path modules like this:
  const fs = window.fs;
  const path = window.path;