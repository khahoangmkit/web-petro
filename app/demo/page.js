'use client';

import { useState, useEffect } from 'react';
import styles from "./page.module.css";

export default function Page() {
  const [videoConfig, setVideoConfig] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [isConfigured, setIsConfigured] = useState(false);
  const [videoStructure, setVideoStructure] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Load saved configuration on component mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('videoConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      setVideoConfig(config);
      setIsConfigured(true);
      setVideoStructure(config.structure);
    }
  }, []);

  // Handle folder selection for video import
  const handleFolderSelect = async () => {
    try {
      // For Electron apps, you would use the main process to show directory dialog
      // This is a web fallback - in Electron, replace with ipcRenderer.invoke
      if (window.electronAPI) {
        const result = await window.electronAPI.selectVideoFolder();
        if (result && !result.canceled) {
          await processVideoFolder(result.filePaths[0]);
        }
      } else {
        // Web fallback - create input element
        const input = document.createElement('input');
        input.type = 'file';
        input.webkitdirectory = true;
        input.multiple = true;
        input.accept = 'video/*';
        
        input.onchange = (e) => {
          const files = Array.from(e.target.files);
          processWebVideoFiles(files);
        };
        
        input.click();
      }
    } catch (error) {
      console.error('Error selecting folder:', error);
      alert('Lỗi khi chọn thư mục video. Vui lòng thử lại.');
    }
  };

  // Process video folder structure (Electron version)
  const processVideoFolder = async (folderPath) => {
    try {
      if (window.electronAPI) {
        const structure = await window.electronAPI.scanVideoFolder(folderPath);
        const config = {
          basePath: folderPath,
          structure: structure,
          configuredAt: new Date().toISOString()
        };
        
        setVideoConfig(config);
        setVideoStructure(structure);
        setIsConfigured(true);
        
        // Save configuration
        localStorage.setItem('videoConfig', JSON.stringify(config));
        
        alert('Cấu hình video thành công!');
      }
    } catch (error) {
      console.error('Error processing video folder:', error);
      alert('Lỗi khi xử lý thư mục video.');
    }
  };

  // Process video files (Web version)
  const processWebVideoFiles = (files) => {
    try {
      const structure = buildFileStructure(files);
      const config = {
        basePath: 'web-files',
        structure: structure,
        files: files,
        configuredAt: new Date().toISOString()
      };
      
      setVideoConfig(config);
      setVideoStructure(structure);
      setIsConfigured(true);
      
      localStorage.setItem('videoConfig', JSON.stringify({
        basePath: config.basePath,
        structure: config.structure,
        configuredAt: config.configuredAt
      }));
      
      alert('Cấu hình video thành công!');
    } catch (error) {
      console.error('Error processing video files:', error);
      alert('Lỗi khi xử lý file video.');
    }
  };

  // Build folder structure from file list
  const buildFileStructure = (files) => {
    const structure = { name: 'Videos', type: 'folder', children: [] };
    const folderMap = new Map();
    folderMap.set('', structure);

    files.forEach(file => {
      if (file.type.startsWith('video/')) {
        const pathParts = file.webkitRelativePath.split('/');
        let currentPath = '';
        let currentFolder = structure;

        // Create folder structure
        for (let i = 0; i < pathParts.length - 1; i++) {
          const folderName = pathParts[i];
          currentPath = currentPath ? `${currentPath}/${folderName}` : folderName;
          
          if (!folderMap.has(currentPath)) {
            const newFolder = {
              name: folderName,
              type: 'folder',
              children: []
            };
            currentFolder.children.push(newFolder);
            folderMap.set(currentPath, newFolder);
          }
          
          currentFolder = folderMap.get(currentPath);
        }

        // Add video file
        currentFolder.children.push({
          name: pathParts[pathParts.length - 1],
          type: 'video',
          path: file.webkitRelativePath,
          file: file
        });
      }
    });

    return structure;
  };

  // Reset configuration
  const resetConfiguration = () => {
    setVideoConfig(null);
    setVideoStructure(null);
    setIsConfigured(false);
    setSelectedVideo(null);
    localStorage.removeItem('videoConfig');
  };

  // Render folder tree
  const renderFolderTree = (node, level = 0) => {
    if (!node) return null;

    return (
      <div key={node.name} style={{ marginLeft: `${level * 20}px` }}>
        {node.type === 'folder' ? (
          <div className={styles.folder}>
            📁 {node.name}
            {node.children && node.children.map(child => 
              renderFolderTree(child, level + 1)
            )}
          </div>
        ) : (
          <div 
            className={styles.videoFile}
            onClick={() => playVideo(node)}
          >
            🎥 {node.name}
          </div>
        )}
      </div>
    );
  };

  // Play selected video
  const playVideo = async (videoNode) => {
    try {
      if (videoNode.file) {
        // Web version - create object URL from File object
        const videoUrl = URL.createObjectURL(videoNode.file);
        setSelectedVideo({ ...videoNode, url: videoUrl });
      } else if (window.electronAPI && videoConfig) {
        // Electron version - use HTTP server endpoint for video serving
        const relativePath = videoNode.path || videoNode.name;
        const videoUrl = `http://localhost:3001/video/${relativePath}`;
        console.log('Playing video:', videoUrl);
        setSelectedVideo({ ...videoNode, url: videoUrl });
      } else {
        // Fallback - try to construct path
        const videoPath = videoNode.path || videoNode.name;
        setSelectedVideo({ ...videoNode, url: videoPath });
      }
    } catch (error) {
      console.error('Error playing video:', error);
      alert('Không thể phát video. Vui lòng kiểm tra đường dẫn file.');
    }
  };

  if (!isConfigured) {
    return (
      <div className={styles.container}>
        <div className={styles.configSection}>
          <h2>Cấu hình Video cho Ứng dụng</h2>
          <p>
            Để giữ cho ứng dụng nhẹ, video không được đóng gói cùng với app. 
            Vui lòng chọn thư mục chứa video để bắt đầu sử dụng.
          </p>
          
          <div className={styles.configActions}>
            <button 
              className={styles.selectButton}
              onClick={handleFolderSelect}
            >
              📁 Chọn Thư Mục Video
            </button>
          </div>
          
          <div className={styles.instructions}>
            <h3>Hướng dẫn:</h3>
            <ul>
              <li>Nhấn nút "Chọn Thư Mục Video" để chọn thư mục chứa video</li>
              <li>Ứng dụng sẽ quét và tạo cấu trúc thư mục tự động</li>
              <li>Cấu hình sẽ được lưu để sử dụng cho lần sau</li>
              <li>Bạn có thể thay đổi cấu hình bất cứ lúc nào</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Demo Video Player</h2>
        <button 
          className={styles.resetButton}
          onClick={resetConfiguration}
        >
          ⚙️ Cấu hình lại
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <h3>Danh sách Video</h3>
          <div className={styles.folderTree}>
            {renderFolderTree(videoStructure)}
          </div>
        </div>

        <div className={styles.player}>
          {selectedVideo ? (
            <div className={styles.videoContainer}>
              <h4>{selectedVideo.name}</h4>
              <video 
                controls 
                width="100%" 
                height="400"
                src={selectedVideo.url || selectedVideo.path}
              >
                Trình duyệt không hỗ trợ video.
              </video>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <p>Chọn video từ danh sách để phát</p>
            </div>
          )}
        </div>
      </div>

      {videoConfig && (
        <div className={styles.configInfo}>
          <small>
            Đã cấu hình: {videoConfig.basePath} 
            ({new Date(videoConfig.configuredAt).toLocaleString('vi-VN')})
          </small>
        </div>
      )}
    </div>
  );
}