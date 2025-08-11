const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // Check if the app is packaged or in development
  if (app.isPackaged) {
    // In production, load the static file
    win.loadFile(path.join(__dirname, 'out', 'index.html'));
  } else {
    // In development, load from the Next.js server
    win.loadURL('http://localhost:3000');
    // Optionally open dev tools
    // win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
