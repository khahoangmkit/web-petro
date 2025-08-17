'use client'

import { useState } from "react";
import styles from "./ManualScreen.module.css";
import { dataHome } from "@/app/constants";


export default function ManualScreen({onBack, screen}) {

  const [path, setPath] = useState([dataHome[`${screen}` || 'screen1']]);
  const currentNode = path[path.length - 1];
  const children = currentNode.children || [];


  const playVideoFullScreen = (url) => {
    if (!url || url === '#') return;

    let videoElement = null;

    const createVideoElement = () => {
      videoElement = document.createElement('video');
      videoElement.controls = true;
      videoElement.style.width = '100vw';
      videoElement.style.height = '100vh';
      videoElement.style.backgroundColor = '#000';
      videoElement.style.objectFit = 'contain';
      videoElement.style.position = 'fixed';
      videoElement.style.top = '0';
      videoElement.style.left = '0';
      videoElement.style.zIndex = '9999';

      document.body.appendChild(videoElement);
      return videoElement;
    };

    const loadAndPlayVideo = (videoUrl) => {
      const videoPath = videoUrl;
      if (!videoPath || !videoElement) return;


      // Chỉ thay đổi src, không tạo element mới
      videoElement.src = videoPath;

      videoElement.onloadeddata = () => {
        videoElement.play().then(() => {
          // Chỉ request fullscreen lần đầu tiên
          if (!document.fullscreenElement) {
            if (videoElement.requestFullscreen) {
              videoElement.requestFullscreen();
            }
          }
        }).catch(error => {
          console.error('Error playing video:', error);
        });
      };
    };

    // Tạo video element một lần duy nhất
    createVideoElement();

    // Khi video kết thúc, chuyển sang video tiếp theo
    videoElement.onended = () => {
      handleFullscreenChange();
    };

    // Xử lý thoát fullscreen
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        if (videoElement && document.body.contains(videoElement)) {
          document.body.removeChild(videoElement);
          videoElement = null;
        }
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    // Bắt đầu phát video đầu tiên
    loadAndPlayVideo(url);
  }

  // Khi click vào 1 node con
  const handleChildClick = (child) => {
    if (child.children && child.children.length > 0) {
      setPath([...path, child]);
    } else {
      console.log("not child");
      playVideoFullScreen(child.path);
    }
  };

  // Quay lại cấp trước
  const handleBack = () => {
    if (path.length > 1) {
      setPath(path.slice(0, -1));
    }
  };

  return (
    <div className={styles.container}>
      {/*<img src="/backgrounds/screen_01.png" alt="anh nen" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1}}/>*/}
      <div className={styles.buttonContainer}>
        {/* Node hiện tại (header) */}
        <button className={`${styles.btnPiacom} ${styles.parentNode}`}>
          {currentNode.name}
        </button>

        {/* Danh sách các node con */}
        <div className={styles.contentContainer}>
          {children.map((child, idx) => (
            <button
              key={idx}
              className={styles.btnPiacom}
              onClick={() => handleChildClick(child)}
            >
              {child.name}
            </button>
          ))}
        </div>
      </div>

      {/* Nút Back */}
      {path.length > 1 && (
        <button className={styles.backButton} onClick={handleBack} style={{ marginBottom: 16 }}>
          ← Back
        </button>
      )}

      <button className={styles.backButton} onClick={onBack} style={{ marginBottom: 16, bottom: '2rem' }}>
        Home
      </button>
    </div>
  );
}