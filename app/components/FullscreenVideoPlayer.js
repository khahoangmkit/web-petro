'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './FullscreenVideoPlayer.module.css';

export default function FullscreenVideoPlayer() {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Danh sách video trong thư mục public
  const videoList = [
    {
      name: 'Video 1: Diễn tập PA chữa cháy & CNCH bể C11-K130',
      path: '/1_Ban_Cong_nghe_an_toan/1. (Video 1)Diễn tập PA chữa cháy & CNCH bể  C11-K130 (12-9-2021).mp4'
    },
    {
      name: 'Video 2: Diễn tập UPSC Trần Đầu TKXD Nhà Bè 2019',
      path: '/1_Ban_Cong_nghe_an_toan/2. (Video 2)DIEN TAP UPSC TRAN  DAU TKXD NHA BE 2019 - hoan chinh ten nhan vat.mp4'
    }
  ];

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

  const selectVideo = (videoPath) => {
    setSelectedVideo(videoPath);
    setIsPlaying(false);
    setCurrentTime(0);
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
    const container = containerRef.current;
    try {
      if (container.requestFullscreen) {
        await container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        await container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        await container.mozRequestFullScreen();
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

  // Auto enter fullscreen when video is selected and starts playing
  const playVideoFullscreen = (videoPath) => {
    selectVideo(videoPath);
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.play();
        setIsPlaying(true);
        enterFullscreen();
      }
    }, 100);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Ban công nghệ an toàn</h1>
      </div>

      <div className={styles.videoList}>
        <h3>Danh sách Video</h3>
        {videoList.map((video, index) => (
          <div
            key={index}
            className={`${styles.videoItem} ${selectedVideo === video.path ? styles.selected : ''}`}
          >
            <div className={styles.videoInfo}>
              <h4>{video.name}</h4>
              {/*<p>Đường dẫn: {video.path}</p>*/}
            </div>
            <div className={styles.videoActions}>
              {/*<button*/}
              {/*  className={styles.selectButton}*/}
              {/*  onClick={() => selectVideo(video.path)}*/}
              {/*>*/}
              {/*  Chọn*/}
              {/*</button>*/}
              <button
                className={styles.playFullscreenButton}
                onClick={() => playVideoFullscreen(video.path)}
              >
                Phát Video
              </button>
            </div>
          </div>
        ))}
      </div>

      <div 
        ref={containerRef}
        className={styles.videoContainer}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        {selectedVideo ? (
          <>
            <video
              ref={videoRef}
              className={styles.video}
              src={selectedVideo}
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
                      style={{ width: `${(currentTime / duration) * 100}%` }}
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
          </>
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholderContent}>
              <span className={styles.placeholderIcon}>🎬</span>
              <p>Chọn video từ danh sách để bắt đầu phát</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
