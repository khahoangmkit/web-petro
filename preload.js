const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Video folder selection and management
  selectVideoFolder: () => ipcRenderer.invoke('select-video-folder'),
  scanVideoFolder: (folderPath) => ipcRenderer.invoke('scan-video-folder', folderPath),
  validateVideoFolder: (folderPath) => ipcRenderer.invoke('validate-video-folder', folderPath),
  getVideoInfo: (videoPath) => ipcRenderer.invoke('get-video-info', videoPath),

  // Platform detection
  platform: process.platform,
  
  // App version
  version: process.env.npm_package_version || '1.0.0'
});

// Log that preload script has loaded
console.log('Preload script loaded successfully');
