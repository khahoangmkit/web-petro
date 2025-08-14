'use client';

import styles from "./page.module.css";
import { useRouter } from 'next/navigation';

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
  },
  {
    name: '1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng.mp4',
    path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng - Copy.mp4',
    folder: 'Ban Công nghệ Thông tin'
  },
  {
    name: '2.Định danh tài khoản bằng NFC.mp4',
    path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/2.Định danh tài khoản bằng NFC.mp4',
    folder: 'Ban Công nghệ Thông tin'
  },
  {
    name: '3.Tài khoản liên kết.mp4',
    path: '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/3.Tài khoản liên kết.mp4',
    folder: 'Ban Công nghệ Thông tin'
  }
];

export default function Home() {
  const router = useRouter();


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
      const video = videoList[videoIndex];
      if (!video || !videoElement) return;

      console.log(`Loading video ${videoIndex + 1}: ${video.name}`);

      // Chỉ thay đổi src, không tạo element mới
      videoElement.src = video.path;

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
          currentIndex = (currentIndex + 1) % videoList.length;
          setTimeout(() => loadAndPlayVideo(currentIndex), 500);
        });
      };

      // Xử lý lỗi video
      videoElement.onerror = () => {
        console.error('Video load error:', video.path);
        // Nếu lỗi, thử video tiếp theo
        currentIndex = (currentIndex + 1) % videoList.length;
        setTimeout(() => loadAndPlayVideo(currentIndex), 500);
      };
    };

    // Tạo video element một lần duy nhất
    createVideoElement();

    // Khi video kết thúc, chuyển sang video tiếp theo
    videoElement.onended = () => {
      currentIndex = (currentIndex + 1) % videoList.length; // Lặp lại từ đầu
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
    <div>

      <button onClick={() => startAutoPlayImmediately()}> Auto</button>
      <button onClick={() => router.push('/home/manual')}> Manual</button>


    </div>
  )
}