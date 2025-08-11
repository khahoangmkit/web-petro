'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ManualVideoPlayer.module.css';

export default function ManualVideoPlayer({onBack}) {
  const videoRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState({});

  // Cấu trúc tree thư mục dataSources
  const folderStructure =
    {
      name: '1. Chuyển đổi số ',
      type: 'folder',
      children: [
        {
          name: '1.Ban Công nghệ an toàn',
          type: 'folder',
          children: [
            {
              name: '1. (Video 1)Diễn tập PA chữa cháy & CNCH bể  C11-K130 (12-9-2021).mp4',
              type: 'video',
              path: '/dataSources/1.Chuyen_doi_so/1.Ban Cong nghệ an toàn/1. (Video 1)Diễn tập PA chữa cháy & CNCH bể  C11-K130 (12-9-2021).mp4'
            },
            {
              name: '2. (Video 2)DIEN TAP UPSC TRAN  DAU TKXD NHA BE 2019 - hoan chinh ten nhan vat.mp4',
              type: 'video',
              path: '/dataSources/1.Chuyen_doi_so/1.Ban Cong nghệ an toàn/2. (Video 2)DIEN TAP UPSC TRAN  DAU TKXD NHA BE 2019 - hoan chinh ten nhan vat.mp4'
            }
          ]
        },
        {
          name: '2.Ban Cong nghệ Thông tin',
          type: 'folder',
          children: [
            {
              name: '1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng.mp4',
              type: 'video',
              path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng - Copy.mp4'
            },
            {
              name: '2.Định danh tài khoản bằng NFC.mp4',
              type: 'video',
              path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/2.Định danh tài khoản bằng NFC.mp4'
            },
            {
              name: '3.Tài khoản liên kết.mp4',
              type: 'video',
              path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/3.Tài khoản liên kết.mp4'
            }
          ]
        }
      ]
    };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, [selectedVideo]);

  // Auto hide controls after 3 seconds
  useEffect(() => {
    let timeout;
    if (isPlaying && showControls) {
      timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isPlaying, showControls]);

  const toggleFolder = (folderPath) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const selectVideo = (video) => {
    setSelectedVideo(video);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const playVideoFullscreen = (video) => {
    selectVideo(video);
    setTimeout(() => {
      const videoElement = videoRef.current;
      if (videoElement) {
        videoElement.play();
        setIsPlaying(true);
        enterFullscreen();
      }
    }, 100);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * duration;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
  };

  const enterFullscreen = async () => {
    const video = videoRef.current;
    try {
      if (video.requestFullscreen) {
        await video.requestFullscreen();
      } else if (video.webkitRequestFullscreen) {
        await video.webkitRequestFullscreen();
      } else if (video.mozRequestFullScreen) {
        await video.mozRequestFullScreen();
      }
      setIsFullscreen(true);
    } catch (error) {
      console.error('Error entering fullscreen:', error);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      }
      setIsFullscreen(false);
    } catch (error) {
      console.error('Error exiting fullscreen:', error);
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const skipTime = (seconds) => {
    const video = videoRef.current;
    video.currentTime = Math.max(0, Math.min(duration, video.currentTime + seconds));
  };

  const renderTreeNode = (node, path = '', level = 0) => {
    const currentPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders[currentPath];

    if (node.type === 'folder') {
      return (
        <div key={currentPath} className={styles.folderNode}>
          <div
            className={styles.folderHeader}
            style={{paddingLeft: `${level * 20}px`}}
            onClick={() => toggleFolder(currentPath)}
          >
            <span className={styles.folderIcon}>
              {isExpanded ? '📂' : '📁'}
            </span>
            <span className={styles.folderName}>{node.name}</span>
            <span className={styles.expandIcon}>
              {isExpanded ? '▼' : '▶'}
            </span>
          </div>
          {isExpanded && node.children && (
            <div className={styles.folderChildren}>
              {node.children.map(child => renderTreeNode(child, currentPath, level + 1))}
            </div>
          )}
        </div>
      );
    } else if (node.type === 'video') {
      return (
        <div
          key={currentPath}
          className={`${styles.videoNode} ${selectedVideo?.path === node.path ? styles.selected : ''}`}
          style={{paddingLeft: `${level * 20}px`}}
        >
          <div className={styles.videoInfo}>
            <span className={styles.videoIcon}>🎬</span>
            <span className={styles.videoName}>{node.name}</span>
          </div>
          <div className={styles.videoActions}>
            <button
              className={styles.selectButton}
              onClick={() => selectVideo(node)}
            >
              📺 Chọn
            </button>
            <button
              className={styles.playButton}
              onClick={() => playVideoFullscreen(node)}
            >
              ▶️ Phát
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Quay lại
        </button>
        <div className={styles.titleInfo}>
          <h2>Trình chiếu video</h2>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.sidebar}>
          <h3>Cấu trúc thư mục</h3>
          <div className={styles.treeContainer}>
            {renderTreeNode(folderStructure)}
          </div>
        </div>

        <div className={styles.videoSection}>
          {selectedVideo ? (
            <>
              <div className={styles.videoInfo}>
                <h3>{selectedVideo.name}</h3>
              </div>

              <div
                className={styles.videoContainer}
                onMouseMove={() => setShowControls(true)}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  className={styles.video}
                  src={selectedVideo.path}
                  onClick={togglePlay}
                />

                {showControls && (
                  <div className={styles.controls}>
                    <div className={styles.progressContainer}>
                      <div
                        className={styles.progressBar}
                        onClick={handleSeek}
                      >
                        <div
                          className={styles.progress}
                          style={{width: `${(currentTime / duration) * 100}%`}}
                        />
                      </div>
                    </div>

                    <div className={styles.controlsBottom}>
                      <div className={styles.leftControls}>
                        <button
                          className={styles.controlButton}
                          onClick={togglePlay}
                        >
                          {isPlaying ? '⏸️' : '▶️'}
                        </button>

                        <button
                          className={styles.controlButton}
                          onClick={() => skipTime(-10)}
                        >
                          ⏪
                        </button>

                        <button
                          className={styles.controlButton}
                          onClick={() => skipTime(10)}
                        >
                          ⏩
                        </button>

                        <div className={styles.volumeContainer}>
                          <span>🔊</span>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={volume}
                            onChange={handleVolumeChange}
                            className={styles.volumeSlider}
                          />
                        </div>

                        <div className={styles.timeDisplay}>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>

                      <div className={styles.rightControls}>
                        <button
                          className={styles.controlButton}
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? '🔲' : '⛶'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.placeholderContent}>
                <span className={styles.placeholderIcon}>🎬</span>
                <h3>Chọn video để phát</h3>
                <p>Sử dụng cây thư mục bên trái để chọn video muốn xem</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
