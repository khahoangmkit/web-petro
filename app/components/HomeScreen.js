'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./HomeScreen.module.css";
import ManualScreen from "@/app/components/ManualScreen";
import { dataHome } from "@/app/constants";

export default function HomeScreen({screenIndex}) {
  const router = useRouter();
  console.log(screenIndex, '----sd-ds-sd-');
  const [mode, setMode] = useState(null);

  const [data, setData] = useState(dataHome[screenIndex]);

  // Function để phát video tự động ngay lập tức
  const startAutoPlayImmediately = () => {
    let currentIndex = 0;
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

    const loadAndPlayVideo = (videoIndex) => {
      const videoPath = data.videoList[videoIndex];
      if (!videoPath || !videoElement) return;


      // Chỉ thay đổi src, không tạo element mới
      videoElement.src = videoPath;

      videoElement.onloadeddata = () => {
        videoElement.play().then(() => {
          // Chỉ request fullscreen lần đầu tiên
          if (!document.fullscreenElement && videoIndex === 0) {
            if (videoElement.requestFullscreen) {
              videoElement.requestFullscreen();
            }
          }
        }).catch(error => {
          console.error('Error playing video:', error);
          // Nếu lỗi, thử video tiếp theo
          currentIndex = (currentIndex + 1) % data.videoList.length;
          setTimeout(() => loadAndPlayVideo(currentIndex), 500);
        });
      };

      // Xử lý lỗi video
      videoElement.onerror = () => {
        console.error('Video load error:', videoPath);
        // Nếu lỗi, thử video tiếp theo
        currentIndex = (currentIndex + 1) % data.videoList.length;
        setTimeout(() => loadAndPlayVideo(currentIndex), 500);
      };
    };

    // Tạo video element một lần duy nhất
    createVideoElement();

    // Khi video kết thúc, chuyển sang video tiếp theo
    videoElement.onended = () => {
      currentIndex = (currentIndex + 1) % data.videoList.length; // Lặp lại từ đầu
      console.log(`Video ended, switching to video ${currentIndex + 1}`);
      // Chuyển video ngay lập tức trên cùng element
      loadAndPlayVideo(currentIndex);
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
    loadAndPlayVideo(currentIndex);
  };

  return (
    <div className={`${styles.pageHomeScreen} ${screenIndex === 'screen1' ? styles.screen1 : ''}`}>
       {/*Video Background*/}

      {/*<video*/}
      {/*  className={styles.backgroundVideo}*/}
      {/*  autoPlay*/}
      {/*  muted*/}
      {/*  loop*/}
      {/*  playsInline*/}
      {/*>*/}
      {/*  <source src="/sources/PLC.mp4" type="video/mp4" />*/}
      {/*  Your browser does not support the video tag.*/}
      {/*</video>*/}

      <img src={data.background} alt="anh nen" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1}}/>

      {
        mode === 'manualMode' ?
          <ManualScreen
            onBack={() => setMode(null)}
            screen={screenIndex} />
          :
          <div className={styles.container}>
            <h1 className={styles.titlePage} dangerouslySetInnerHTML={{ __html: data.title }} />

            <div className={styles.buttonContainer}>
              <button
                className={`${styles.btnAction}`}
                onClick={startAutoPlayImmediately}
              >
                <div className={styles.buttonContent}>
                  {/*<img src="/icons/auto-renewal.svg" style={{display: "inline-block"}} alt="Auto" width={50}></img>*/}
                  <h3>Auto</h3>
                </div>
              </button>

              <button
                className={`${styles.btnAction} `}
                onClick={() => setMode('manualMode')}
              >
                <div className={styles.buttonContent}>
                  {/*<img src="/icons/hand-raised.svg" alt="Manual" width={50}></img>*/}
                  <h3>Manual</h3>
                </div>
              </button>
            </div>
          </div>
      }

    </div>
  );
}