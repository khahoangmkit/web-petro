'use client';

import { useState } from 'react';
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
              <img src="/icons/auto-renewal.svg" style={{display: "inline-block"}} alt="Manual" width={50}></img>
              <h3>Phát tự động</h3>
            </div>
          </button>

          <button 
            className={`${styles.modeButton} ${styles.manualButton}`}
            onClick={() => setMode('manual')}
          >
            <div className={styles.buttonContent}>
              <img src="/icons/hand-raised.svg" alt="Manual" width={50}></img>
              <h3>Phát Thủ công</h3>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
