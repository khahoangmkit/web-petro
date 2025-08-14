'use client'

import styles from "./page.module.css";
import { OrgChart as D3OrgChart } from 'd3-org-chart';
import {useEffect, useRef} from "react";

export default function Home() {
  // Tạo một ref để giữ tham chiếu đến DOM element
  const d3Container = useRef(null);

  // Chạy code D3 sau khi component đã được render
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
      }
    };

    // Gắn hàm vào window để có thể gọi từ HTML
    window.handleNodeClick = handleNodeClick;

    // Dữ liệu mẫu cho sơ đồ
    const data = [
      { id: '1', parentId: null, name: 'Tổng Giám đốc', position: 'CEO' },
      { id: '2', parentId: '1', name: 'Phòng Kinh doanh', position: 'Trưởng phòng' },
      { id: '3', parentId: '1', name: 'Phòng Kỹ thuật', position: 'Giám đốc Công nghệ' },
      { id: '4', parentId: '2', name: 'Nhân viên Sales 1', position: 'Nhân viên', url: '/video1.webm' },
      { id: '9', parentId: '2', name: 'Nhân viên Sales 1', position: 'Nhân viên' },
      { id: '10', parentId: '2', name: 'Nhân viên Sales 1', position: 'Nhân viên' },
      { id: '11', parentId: '2', name: 'Nhân viên Sales 1', position: 'Nhân viên' },
      { id: '6', parentId: '3', name: 'Đội Frontend', position: 'Trưởng nhóm' },
      { id: '7', parentId: '3', name: 'Đội Backend', position: 'Trưởng nhóm' },
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
                <div class="${styles.nodePosition}">${d.data.position}</div>
            </div>
          `;
        })
        .render(); // Vẽ sơ đồ
    }
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy một lần

  return (
    <div ref={d3Container} className={styles.background} style={{ width: '100vw', height: '100vh'}} />
  );
}
