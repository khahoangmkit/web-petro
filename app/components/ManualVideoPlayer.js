'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ManualVideoPlayer.module.css';
import { OrgChart as D3OrgChart } from 'd3-org-chart';

export default function ManualVideoPlayer({onBack}) {
  const videoRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [expandedFolders, setExpandedFolders] = useState({
    '1. Chuyển đổi số ': true  // Mặc định mở thư mục cấp đầu tiên
  });

  const d3Container = useRef(null);


  // Cấu trúc tree thư mục dataSources trong folder public
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
          name: '2.Ban Công nghệ Thông tin',
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

  const playVideoFullscreen = (video) => {
    console.log(video, '==========');
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
        setSelectedVideo(video);
      }).catch(error => {
        console.error('Error playing video:', error);
        document.body.removeChild(videoElement);
      });
    };
    
    // Handle fullscreen exit
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && 
          !document.webkitFullscreenElement && 
          !document.mozFullScreenElement) {
        // Fullscreen exited, clean up
        videoElement.pause();
        if (document.body.contains(videoElement)) {
          document.body.removeChild(videoElement);
        }
        setIsPlaying(false);
        // Remove event listeners
        document.removeEventListener('fullscreenchange', handleFullscreenChange);
        document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
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
    };
    
    // Handle video end
    videoElement.onended = () => {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      }
    };
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
          onClick={() => playVideoFullscreen(node)}
        >
          <div className={styles.videoInfo}>
            <span className={styles.videoIcon}>🎬</span>
            <span className={styles.videoName}>{node.name}</span>
          </div>
        </div>
      );
    }
  };



  useEffect(() => {

    const playVideo = (url) => {
      if (!url) return;
      console.log('Playing video:', url);
      // Logic phát video sẽ được thêm sau
    };

    // Hàm xử lý click với animation
    const handleNodeClick = (event, url) => {
      console.log('==============das', url)
      const nodeElement = event.currentTarget;

      // Gọi hàm phát video
      if (url) {
        console.log("=================", url)
        playVideo(url);
        playVideoFullscreen( {
          name: '1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng.mp4',
          type: 'video',
          path: url
        });
      }
    };

    // Gắn hàm vào window để có thể gọi từ HTML
    window.handleNodeClick = handleNodeClick;

    // Dữ liệu mẫu cho sơ đồ
    const data = [
      { id: '0', parentId: null, name: 'Petrolimex' },
      { id: '1', parentId: '0', name: 'Tổng công ty hóa dầu Petrolimex' },
      { id: '2', parentId: '1', name: '30 năm thành lập  PLC', url: './sources/30nam.mp4' },
      { id: '3', parentId: '1', name: 'Năng lực PLC' },
      { id: '4', parentId: '1', name: 'Sản phẩm Dầu mỡ nhờn' },
      { id: '5', parentId: '1', name: 'Sản phẩm PowerSyn, Cater CI-4, Racer Scooter' },
      { id: '6', parentId: '0', name: 'Công ty TNHH Nhựa đường Petrolimex' },
      { id: '7', parentId: '6', name: '15 ngày thành lập công ty TNHH Nhựa đường Petrolimex' },
      { id: '8', parentId: '6', name: 'Sản phẩm nhựa đường của Công ty TNHH Nhựa đường petrolimex' },
      { id: '9', parentId: '6', name: 'Sản phẩm hóa chất' },
    ];

    let chart = null;

    // Đảm bảo container đã tồn tại trước khi vẽ
    if (d3Container.current) {
      chart = new D3OrgChart();
      chart
        .container(d3Container.current) // Chỉ định container
        .data(data) // Nạp dữ liệu
        .nodeId((d) => d.id)
        .parentNodeId((d) => d.parentId)
        .nodeContent(function (d) {
          // Tùy chỉnh giao diện cho mỗi nút

          return `
            <div class="${styles.nodeCard}" onclick="window.handleNodeClick(event, '${d.data.url || ''}')">
                <div class="${styles.nodeName}">${d.data.name}</div>
<!--                <div class="${styles.nodePosition}">${d.data.position}</div>-->
            </div>
          `;
        })
        .render(); // Vẽ sơ đồ
    }
  }, []);


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Quay lại
        </button>
        <div className={styles.titleInfo}>
          {/*<h2>Trình chiếu video</h2>*/}
        </div>
      </div>

      <div ref={d3Container} style={{ width: '100vw', height: '100vh'}} />
    </div>
  );
}
