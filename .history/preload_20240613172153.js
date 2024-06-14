// In your preload.js
window.fs = require('fs');
window.path = require('path');

// In your renderer.js, you can now use the fs and path modules like this:
const fs = window.fs;
const path = window.path;