'use client';

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

  return (
    <div className={styles.container}>
      <br/>
      <br/>
      <button className={styles.btnPiacom}>
        Video giới thiệu về PIACOM
      </button>
    </div>
  )
}