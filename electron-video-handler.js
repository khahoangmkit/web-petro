const { dialog } = require('electron');
const fs = require('fs').promises;
const path = require('path');

// Supported video file extensions
const VIDEO_EXTENSIONS = ['.mp4', '.avi', '.mov', '.mkv', '.wmv', '.flv', '.webm', '.m4v'];

/**
 * Show directory selection dialog for video folder
 */
async function selectVideoFolder() {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Chọn thư mục chứa video',
      buttonLabel: 'Chọn thư mục'
    });
    
    return result;
  } catch (error) {
    console.error('Error showing directory dialog:', error);
    throw error;
  }
}

/**
 * Recursively scan a folder for video files and build folder structure
 */
async function scanVideoFolder(folderPath) {
  try {
    const structure = await buildFolderStructure(folderPath, path.basename(folderPath));
    return structure;
  } catch (error) {
    console.error('Error scanning video folder:', error);
    throw error;
  }
}

/**
 * Build folder structure recursively
 */
async function buildFolderStructure(dirPath, name) {
  const stats = await fs.stat(dirPath);
  
  if (!stats.isDirectory()) {
    return null;
  }

  const folder = {
    name: name,
    type: 'folder',
    children: []
  };

  try {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      // Skip hidden files and system files
      if (item.startsWith('.') || item.startsWith('__')) {
        continue;
      }

      const itemPath = path.join(dirPath, item);
      const itemStats = await fs.stat(itemPath);

      if (itemStats.isDirectory()) {
        // Recursively process subdirectories
        const subFolder = await buildFolderStructure(itemPath, item);
        if (subFolder && subFolder.children.length > 0) {
          folder.children.push(subFolder);
        }
      } else if (itemStats.isFile()) {
        // Check if it's a video file
        const ext = path.extname(item).toLowerCase();
        if (VIDEO_EXTENSIONS.includes(ext)) {
          folder.children.push({
            name: item,
            type: 'video',
            path: path.relative(dirPath, itemPath),
            fullPath: itemPath,
            size: itemStats.size,
            modified: itemStats.mtime
          });
        }
      }
    }

    // Sort children: folders first, then videos
    folder.children.sort((a, b) => {
      if (a.type === 'folder' && b.type === 'video') return -1;
      if (a.type === 'video' && b.type === 'folder') return 1;
      return a.name.localeCompare(b.name, 'vi', { numeric: true });
    });

  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
  }

  return folder;
}

/**
 * Get video file info
 */
async function getVideoInfo(videoPath) {
  try {
    const stats = await fs.stat(videoPath);
    return {
      path: videoPath,
      size: stats.size,
      modified: stats.mtime,
      exists: true
    };
  } catch (error) {
    return {
      path: videoPath,
      exists: false,
      error: error.message
    };
  }
}

/**
 * Validate video folder path
 */
async function validateVideoFolder(folderPath) {
  try {
    const stats = await fs.stat(folderPath);
    if (!stats.isDirectory()) {
      return { valid: false, error: 'Path is not a directory' };
    }

    // Check if folder contains any video files
    const structure = await scanVideoFolder(folderPath);
    const hasVideos = countVideos(structure) > 0;

    return {
      valid: true,
      hasVideos: hasVideos,
      videoCount: countVideos(structure)
    };
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
}

/**
 * Count total number of videos in structure
 */
function countVideos(structure) {
  if (!structure || !structure.children) return 0;
  
  let count = 0;
  for (const child of structure.children) {
    if (child.type === 'video') {
      count++;
    } else if (child.type === 'folder') {
      count += countVideos(child);
    }
  }
  return count;
}

module.exports = {
  selectVideoFolder,
  scanVideoFolder,
  getVideoInfo,
  validateVideoFolder,
  countVideos
};
