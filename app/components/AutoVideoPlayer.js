'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AutoVideoPlayer.module.css';

export default function AutoVideoPlayer({ onBack }) {
  const videoRef = useRef(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Danh sách tất cả video trong dataSources
  const videoList = [
    {
      name: 'Video 1: Diễn tập PA chữa cháy & CNCH bể C11-K130',
      path: '/dataSources/1.Chuyen_doi_so/1.Ban Cong nghệ an toàn/1. (Video 1)Diễn tập PA chữa cháy & CNCH bể  C11-K130 (12-9-2021).mp4',
      folder: 'Ban Công nghệ an toàn'
    },
    {
      name: 'Video 2: Diễn tập UPSC Trần Đầu TKXD Nhà Bè 2019',
      path: '/dataSources/1.Chuyen_doi_so/1.Ban Cong nghệ an toàn/2. (Video 2)DIEN TAP UPSC TRAN  DAU TKXD NHA BE 2019 - hoan chinh ten nhan vat.mp4',
      folder: 'Ban Công nghệ an toàn'
    }
    ,
    {
      name: '1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng.mp4',
      path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng - Copy.mp4',
      folder: 'Ban Cong nghệ Thông tin'
    }
    ,
    {
      name: '2.Định danh tài khoản bằng NFC.mp4',
      path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/2.Định danh tài khoản bằng NFC.mp4',
      folder: 'Ban Cong nghệ Thông tin'
    },
    {
      name: '3.Tài khoản liên kết.mp4',
      type: 'video',
      path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/3.Tài khoản liên kết.mp4',
      folder: 'Ban Cong nghệ Thông tin'
    }

  ];

  const currentVideo = videoList[currentVideoIndex];

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleEnded = () => {
      // Tự động chuyển sang video tiếp theo
      nextVideo();
    };

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('ended', handleEnded);
    };
  }, [currentVideoIndex]);

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

  // Auto start playing when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.play();
        setIsPlaying(true);
        enterFullscreen();
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const nextVideo = () => {
    const nextIndex = (currentVideoIndex + 1) % videoList.length;
    setCurrentVideoIndex(nextIndex);
    setCurrentTime(0);
    
    // Auto play next video
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.play();
        setIsPlaying(true);
      }
    }, 500);
  };

  const prevVideo = () => {
    const prevIndex = currentVideoIndex === 0 ? videoList.length - 1 : currentVideoIndex - 1;
    setCurrentVideoIndex(prevIndex);
    setCurrentTime(0);
    
    setTimeout(() => {
      const video = videoRef.current;
      if (video) {
        video.play();
        setIsPlaying(true);
      }
    }, 500);
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

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Quay lại
        </button>
        <div className={styles.videoInfo}>
          <h2>Chế độ Tự động</h2>
          <p>Video {currentVideoIndex + 1}/{videoList.length}: {currentVideo?.name}</p>
        </div>
      </div>

      <div 
        className={styles.videoContainer}
        onMouseMove={() => setShowControls(true)}
        onMouseLeave={() => isPlaying && setShowControls(false)}
      >
        <video
          ref={videoRef}
          className={styles.video}
          src={currentVideo?.path}
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
                  onClick={prevVideo}
                  title="Video trước"
                >
                  ⏮️
                </button>
                
                <button 
                  className={styles.controlButton}
                  onClick={togglePlay}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
                
                <button 
                  className={styles.controlButton}
                  onClick={nextVideo}
                  title="Video tiếp theo"
                >
                  ⏭️
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

      <div className={styles.playlist}>
        <h3>Danh sách phát ({videoList.length} video)</h3>
        <div className={styles.playlistItems}>
          {videoList.map((video, index) => (
            <div
              key={index}
              className={`${styles.playlistItem} ${
                index === currentVideoIndex ? styles.current : ''
              }`}
              onClick={() => setCurrentVideoIndex(index)}
            >
              <div className={styles.itemNumber}>
                {index === currentVideoIndex ? '▶️' : index + 1}
              </div>
              <div className={styles.itemInfo}>
                <div className={styles.itemName}>{video.name}</div>
                <div className={styles.itemFolder}>{video.folder}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
