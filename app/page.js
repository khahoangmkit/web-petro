'use client';

import { useState } from 'react';
import Image from "next/image";
import styles from "./page.module.css";
import AutoVideoPlayer from './components/AutoVideoPlayer';
import ManualVideoPlayer from './components/ManualVideoPlayer';

export default function Home() {
  const [mode, setMode] = useState(null); // null, 'auto', 'manual'

  if (mode === 'auto') {
    return <AutoVideoPlayer onBack={() => setMode(null)} />;
  }

  if (mode === 'manual') {
    return <ManualVideoPlayer onBack={() => setMode(null)} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Ban Công Nghệ An Toàn</h1>
        </header>

        <div className={styles.buttonContainer}>
          <button 
            className={`${styles.modeButton} ${styles.autoButton}`}
            onClick={() => setMode('auto')}
          >
            <div className={styles.buttonContent}>
              <h3>Chế độ Tự động</h3>
              <p>Phát lần lượt toàn bộ video trong hệ thống</p>
            </div>
          </button>

          <button 
            className={`${styles.modeButton} ${styles.manualButton}`}
            onClick={() => setMode('manual')}
          >
            <div className={styles.buttonContent}>
              <h3>Chế độ Thủ công</h3>
              <p>Chọn video từ danh sách thư mục</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
