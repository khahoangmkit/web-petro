'use client'

import { useState } from "react";
import styles from "./page.module.css";

export default function Page() {

  const dataTree = {
    name: 'Tong cong ty',
    url: '#',
    children: [
      {
        name: 'Ban Cong nghệ an toàn',
        url: '#',
        children: [
          {
            name: 'Video 1',
            url: '#'
          },
          {
            name: 'Video 2',
            url: '#'
          }
        ]
      },
      {
        name: 'Ban Cong nghệ Thông tin',
        url: '#',
        children: [
          {
            name: 'Video 1',
            url: '#'
          },
          {
            name: 'Video 2',
            url: '#'
          }
        ]
      }
    ]
  };

  // State lưu trữ path các node từ root đến node hiện tại
  const [path, setPath] = useState([dataTree]);
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
      <img src="/backgrounds/man-hinh-02.png" alt="anh nen" style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1}}/>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        {/* Node hiện tại (header) */}
        <button className={`${styles.btnPiacom} ${styles.parentNode}`} style={{ marginBottom: 24 }}>
          {currentNode.name}
        </button>

        {/* Danh sách các node con */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
    </div>
  );
}