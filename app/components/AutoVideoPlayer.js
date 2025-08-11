'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './AutoVideoPlayer.module.css';

export default function AutoVideoPlayer({ onBack }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentVideoElement, setCurrentVideoElement] = useState(null);
  
  // Use ref to track current index to avoid closure issues
  const currentIndexRef = useRef(0);

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
      name: '1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng.mp4',
      path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng - Copy.mp4',
      folder: 'Ban Cong nghệ Thông tin'
    }
    ,
    {
      name: '2.Định danh tài khoản bằng NFC.mp4',
      path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/2.Định danh tài khoản bằng NFC.mp4',
      folder: 'Ban Công nghệ Thông tin'
    },
    {
      name: '3.Tài khoản liên kết.mp4',
      type: 'video',
      path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/3.Tài khoản liên kết.mp4',
      folder: 'Ban Công nghệ Thông tin'
    }
  ];

  const currentVideo = videoList[currentVideoIndex];

  // Update ref when state changes
  useEffect(() => {
    currentIndexRef.current = currentVideoIndex;
  }, [currentVideoIndex]);

  // Function to load next video in the same video element
  const loadNextVideo = (videoElement) => {
    const nextIndex = (currentIndexRef.current + 1) % videoList.length;
    const nextVideo = videoList[nextIndex];
    
    console.log(`Loading next video: ${nextIndex + 1}/${videoList.length} - ${nextVideo.name}`);
    
    // Update state
    setCurrentVideoIndex(nextIndex);
    currentIndexRef.current = nextIndex;
    
    // Change video source
    videoElement.src = nextVideo.path;
    
    // Set up one-time event listener for this specific video load
    const handleNextVideoLoad = () => {
      videoElement.play().catch(error => {
        console.error('Error playing next video:', error);
        // If error, try the next video after a delay
        setTimeout(() => loadNextVideo(videoElement), 1000);
      });
      
      // Remove this specific event listener
      videoElement.removeEventListener('loadeddata', handleNextVideoLoad);
    };
    
    videoElement.addEventListener('loadeddata', handleNextVideoLoad);
  };

  // Function to create and play video in fullscreen
  const playVideoFullscreen = (video, autoNext = true) => {
    // Clean up previous video if exists
    if (currentVideoElement) {
      if (document.body.contains(currentVideoElement)) {
        document.body.removeChild(currentVideoElement);
      }
    }

    // Create a new video element for fullscreen playback
    const videoElement = document.createElement('video');
    videoElement.src = video.path;
    videoElement.controls = true;
    videoElement.style.width = '100vw';
    videoElement.style.height = '100vh';
    videoElement.style.backgroundColor = '#000';
    videoElement.style.objectFit = 'contain';
    
    // Add video to DOM temporarily
    document.body.appendChild(videoElement);
    setCurrentVideoElement(videoElement);
    
    // Handle video loaded
    videoElement.onloadeddata = () => {
      videoElement.play().then(() => {
        // Request fullscreen on the video element
        if (videoElement.requestFullscreen) {
          videoElement.requestFullscreen();
        } else if (videoElement.webkitRequestFullscreen) {
          videoElement.webkitRequestFullscreen();
        } else if (videoElement.mozRequestFullScreen) {
          videoElement.mozRequestFullScreen();
        }
        
        setIsPlaying(true);
      }).catch(error => {
        console.error('Error playing video:', error);
        if (document.body.contains(videoElement)) {
          document.body.removeChild(videoElement);
        }
      });
    };
    
    // Handle fullscreen exit - only when user manually exits
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.mozFullScreenElement) {
        // User manually exited fullscreen, clean up and go back
        videoElement.pause();
        if (document.body.contains(videoElement)) {
          document.body.removeChild(videoElement);
        }
        setIsPlaying(false);
        setIsFullscreen(false);
        setCurrentVideoElement(null);
        
        // Remove event listeners
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
        
        onBack();
      } else {
        setIsFullscreen(true);
      }
    };
    
    // Add fullscreen change listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    
    // Handle load errors
    videoElement.onerror = (error) => {
      console.error('Error loading video:', error);
      alert('Không thể tải video: ' + video.name);
      if (document.body.contains(videoElement)) {
        document.body.removeChild(videoElement);
      }
      // Try next video if auto mode
      if (autoNext) {
        loadNextVideo(videoElement);
      }
    };
    
    // Handle video end - load next video immediately without exiting fullscreen
    videoElement.onended = () => {
      if (autoNext) {
        loadNextVideo(videoElement);
      } else {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
      }
    };
  };

  // Auto start playing when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      playVideoFullscreen(currentVideo, true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentVideoElement && document.body.contains(currentVideoElement)) {
        document.body.removeChild(currentVideoElement);
      }
    };
  }, [currentVideoElement]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          ← Quay lại
        </button>
        <h2>Phát tự động</h2>
      </div>

      <div className={styles.content}>
        <div className={styles.videoInfo}>
          <h3>Đang phát: {currentVideo?.name}</h3>
          <p>Video {currentVideoIndex + 1} / {videoList.length}</p>
          <p>Thư mục: {currentVideo?.folder}</p>
          <div className={styles.status}>
            {isPlaying ? '▶️ Đang phát...' : '⏸️ Đã dừng'}
          </div>
        </div>
      </div>
    </div>
  );
}
