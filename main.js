const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const http = require('http');
const fs = require('fs');
const url = require('url');
const videoHandler = require('./electron-video-handler');

let server = null;
let videoFolder = null;

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

function handleVideoRequest(req, res, pathname) {
  const videoPath = path.join(videoFolder, pathname.replace('/video/', ''));
  console.log(`Video request: ${pathname}, File: ${videoPath}`);
  
  fs.stat(videoPath, (err, stats) => {
    if (err) {
      console.log(`File stat error for ${videoPath}: ${err.message}`);
      res.writeHead(404);
      res.end('Not Found');
      return;
    }
    
    const mimeType = getMimeType(videoPath);
    const range = req.headers.range;
    
    console.log(`File: ${videoPath}, Size: ${stats.size}, MIME: ${mimeType}`);
    
    // Handle video streaming with Range requests
    if (range && mimeType.startsWith('video/')) {
      console.log(`Streaming video with range: ${range}`);
      
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
      const chunksize = (end - start) + 1;
      
      console.log(`Range: ${start}-${end}/${stats.size}, Chunk: ${chunksize}`);
      
      const stream = fs.createReadStream(videoPath, { start, end });
      
      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stats.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType,
      });
      
      stream.on('error', (streamErr) => {
        console.log(`Stream error: ${streamErr.message}`);
        res.end();
      });
      
      stream.pipe(res);
    } else {
      // Regular file serving
      console.log(`Serving static file: ${videoPath}`);
      
      const stream = fs.createReadStream(videoPath);
      
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Content-Length': stats.size,
        'Accept-Ranges': 'bytes',
      });
      
      stream.on('error', (streamErr) => {
        console.log(`Stream error: ${streamErr.message}`);
        res.end();
      });
      
      stream.pipe(res);
    }
  });
}

function createLocalServer() {
  return new Promise((resolve, reject) => {
    const staticPath = path.join(__dirname, 'out');
    console.log(`Static files will be served from: ${staticPath}`);
    
    server = http.createServer((req, res) => {
      const parsedUrl = url.parse(req.url);
      let pathname = parsedUrl.pathname;
      
      console.log(`Request: ${req.method} ${pathname}`);
      
      // Add CORS headers for all requests
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
      res.setHeader('Accept-Ranges', 'bytes');
      
      // Handle OPTIONS requests
      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }
      
      // Handle video file requests from configured folder
      if (pathname.startsWith('/video/')) {
        handleVideoRequest(req, res, pathname);
        return;
      }
      
      // Default to index.html for root or unknown routes
      if (pathname === '/' || pathname === '') {
        pathname = '/index.html';
      }
      
      // Decode URL to handle special characters in file names
      let decodedPathname = pathname;
      try {
        decodedPathname = decodeURIComponent(pathname);
        console.log(`Original pathname: ${pathname}`);
        console.log(`Decoded pathname: ${decodedPathname}`);
      } catch (e) {
        console.log(`URL decode error: ${e.message}, using original pathname`);
        decodedPathname = pathname;
      }
      
      // Try both decoded and original paths
      const possiblePaths = [
        path.join(staticPath, decodedPathname),
        path.join(staticPath, pathname),
        // Also try with different encoding
        path.join(staticPath, pathname.replace(/%20/g, ' ').replace(/%26/g, '&'))
      ];
      
      console.log(`Trying paths:`, possiblePaths);
      
      // Find the first existing file
      let filePath = null;
      for (const testPath of possiblePaths) {
        // Security check - ensure file is within static directory
        if (testPath.startsWith(staticPath)) {
          try {
            if (fs.existsSync(testPath)) {
              filePath = testPath;
              console.log(`Found file at: ${filePath}`);
              break;
            }
          } catch (e) {
            console.log(`Error checking path ${testPath}: ${e.message}`);
          }
        }
      }
      
      if (!filePath) {
        console.log(`No valid file found for paths:`, possiblePaths);
        // If file not found, serve index.html for SPA routing
        const indexPath = path.join(staticPath, 'index.html');
        fs.readFile(indexPath, (indexErr, indexData) => {
          if (indexErr) {
            res.writeHead(404);
            res.end('Not Found');
          } else {
            console.log(`Serving index.html for route: ${pathname}`);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexData);
          }
        });
        return;
      }
      
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.log(`File stat error for ${filePath}: ${err.message}`);
          // If file not found, serve index.html for SPA routing
          const indexPath = path.join(staticPath, 'index.html');
          fs.readFile(indexPath, (indexErr, indexData) => {
            if (indexErr) {
              res.writeHead(404);
              res.end('Not Found');
            } else {
              console.log(`Serving index.html for route: ${pathname}`);
              res.writeHead(200, { 'Content-Type': 'text/html' });
              res.end(indexData);
            }
          });
          return;
        }
        
        const mimeType = getMimeType(filePath);
        const range = req.headers.range;
        
        console.log(`File: ${filePath}, Size: ${stats.size}, MIME: ${mimeType}`);
        
        // Handle video streaming with Range requests
        if (range && mimeType.startsWith('video/')) {
          console.log(`Streaming video with range: ${range}`);
          
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : stats.size - 1;
          const chunksize = (end - start) + 1;
          
          console.log(`Range: ${start}-${end}/${stats.size}, Chunk: ${chunksize}`);
          
          const stream = fs.createReadStream(filePath, { start, end });
          
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${stats.size}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': mimeType,
          });
          
          stream.on('error', (streamErr) => {
            console.log(`Stream error: ${streamErr.message}`);
            res.end();
          });
          
          stream.pipe(res);
        } else {
          // Regular file serving
          console.log(`Serving static file: ${filePath}`);
          
          const stream = fs.createReadStream(filePath);
          
          res.writeHead(200, {
            'Content-Type': mimeType,
            'Content-Length': stats.size,
            'Accept-Ranges': 'bytes',
          });
          
          stream.on('error', (streamErr) => {
            console.log(`Stream error: ${streamErr.message}`);
            res.end();
          });
          
          stream.pipe(res);
        }
      });
    });
    
    server.listen(0, 'localhost', (err) => {
      if (err) {
        reject(err);
      } else {
        const port = server.address().port;
        console.log(`Local server started on http://localhost:${port}`);
        resolve(`http://localhost:${port}`);
      }
    });
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Disable web security for local file loading
      allowRunningInsecureContent: true, // Allow loading local CSS/JS
    }
  });

  // Check if the app is packaged or in development
  if (app.isPackaged) {
    // In production, start local server and load from it
    createLocalServer().then((serverUrl) => {
      console.log(`Loading app from: ${serverUrl}`);
      win.loadURL(serverUrl);
      
      // Enable dev tools to debug CSS issues
      win.webContents.openDevTools();
      
      // Log when page finishes loading
      win.webContents.once('did-finish-load', () => {
        console.log('Page finished loading');
      });
      
      // Log any console messages from the renderer
      win.webContents.on('console-message', (event, level, message) => {
        console.log(`Renderer console [${level}]: ${message}`);
      });
      
    }).catch((error) => {
      console.error('Failed to start local server:', error);
      // Fallback to file loading if server fails
      const indexPath = path.join(__dirname, 'out', 'index.html');
      win.loadFile(indexPath);
    });
  } else {
    // In development, load from the Next.js server
    win.loadURL('http://localhost:3000');
    // Optionally open dev tools
    // win.webContents.openDevTools();
  }
}

// IPC handlers for video functionality
ipcMain.handle('select-video-folder', async () => {
  try {
    const result = await videoHandler.selectVideoFolder();
    if (result && !result.canceled && result.filePaths && result.filePaths.length > 0) {
      videoFolder = result.filePaths[0];
      console.log(`Selected video folder: ${videoFolder}`);
    }
    return result;
  } catch (error) {
    console.error('Error in select-video-folder:', error);
    throw error;
  }
});

ipcMain.handle('scan-video-folder', async (event, folderPath) => {
  try {
    // Store the folder path for video serving
    videoFolder = folderPath;
    console.log(`Video folder set to: ${videoFolder}`);
    return await videoHandler.scanVideoFolder(folderPath);
  } catch (error) {
    console.error('Error in scan-video-folder:', error);
    throw error;
  }
});

ipcMain.handle('validate-video-folder', async (event, folderPath) => {
  try {
    return await videoHandler.validateVideoFolder(folderPath);
  } catch (error) {
    console.error('Error in validate-video-folder:', error);
    throw error;
  }
});

ipcMain.handle('get-video-info', async (event, videoPath) => {
  try {
    return await videoHandler.getVideoInfo(videoPath);
  } catch (error) {
    console.error('Error in get-video-info:', error);
    throw error;
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  // Close the local server when app is closing
  if (server) {
    server.close();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
