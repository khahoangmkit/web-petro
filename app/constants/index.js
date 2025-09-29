export const dataHome = {
  screen1: {
    title: ``,
    background: '/backgrounds/chuyen_dich_xanh.png',
    name: 'Chuyển dịch xanh',
    path: '/dataSources/screen_1/chuyen_dich_xanh.mp4',
    listVideo: [
      {
        name: 'Chuyển dịch xanh',
        path: '/dataSources/screen_1/chuyen_dich_xanh.mp4',
      }
    ]
  },
  screen2: {
    title: '',
    background: '/backgrounds/chuyen_doi_so.png',
    videoList: [
      '/dataSources/screen_2/quan_tri_boi_bo.mp4',
      '/dataSources/screen_2/app_petro.mp4',

    ],
    name: 'Chuyển đổi số',
    path: '#',
    children: [
      {
        name: 'Quản trị nội bộ-BI',
        path: '/dataSources/screen_2/quan_tri_boi_bo.mp4'
      },
      {
        name: 'App Petrolimex 2.0',
        path: '/dataSources/screen_2/app_petro.mp4',
      }
    ]
  },
  screen3: {
    title: 'Hệ thống bán hàng toàn quốc',
    background: '/backgrounds/he_thong_ban_hang.png',
    videoList: [
      '/dataSources/screen_3/video_ban_hang_toan_quoc.mp4',
    ],
    name: 'Hệ thống bán hàng toàn quốc',
    path: '/dataSources/screen_3/video_ban_hang_toan_quoc.mp4',
    listVideo: [
      {
        name: 'Hệ thống bán hàng toàn quốc',
        path: '/dataSources/screen_3/video_ban_hang_toan_quoc.mp4',
      }
    ]
  },
  screen4: {
    title: 'Hệ thống bán hàng toàn quốc',
    background: '/backgrounds/screen_4.png',
    videoList: [],
    name: 'Hệ thống bán hàng toàn quốc',
    path: '#',
    listVideo: [
      {
        name: `Petrolimex <br/> cùng đất nước tiến vào kỷ nguyên mới`,
        path: '/dataSources/screen_4/petro_cung_dat_nuoc.mp4'
      },
      {
        name: 'Thông tin về Petrolimex',
        path: '/dataSources/screen_4/thong_tin_petro.mp4'
      }
    ]
  }
};
