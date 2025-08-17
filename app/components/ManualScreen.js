'use client'

import { useState } from "react";
import styles from "./ManualScreen.module.css";
import { dataHome } from "@/app/constants";


export default function ManualScreen({onBack, screen}) {

  const [path, setPath] = useState([dataHome[`${screen}` || 'screen1']]);
  const currentNode = path[path.length - 1];
  const children = currentNode.children || [];

  // Khi click vào 1 node con
  const handleChildClick = (child) => {
    if (child.children && child.children.length > 0) {
      setPath([...path, child]);
    } else {
      console.log("not child");
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