export const dataHome = {
  screen1: {
    title: `Ban Công nghệ an toàn <br/> và Ban Công nghệ thông tin`,
    background: '/backgrounds/screen_01.png',
    name: 'Chuyển đổi số',
    videoList: [
      '/dataSources/1.Chuyen_doi_so/1.BanCongNgheAnToan/VideoDienTapPAChuaChay.mp4',
      '/dataSources/1.Chuyen_doi_so/1.BanCongNgheAnToan/VideoDienTapUPSCTranDau.mp4',
      '/dataSources/1.Chuyen_doi_so/2.BanCNTT/1.QuanLyDonHang.mp4',
      '/dataSources/1.Chuyen_doi_so/2.BanCNTT/2.DinhDangTaiKhoanNFC.mp4',
      '/dataSources/1.Chuyen_doi_so/2.BanCNTT/3.TaiKhoanLienKet.mp4'
    ],
    path: '#',
    children: [
      {
        name: 'Ban Công nghệ an toàn',
        path: '#',
        children: [
          {
            name: 'Diễn tập PA chữa cháy',
            path: '/dataSources/1.Chuyen_doi_so/1.BanCongNgheAnToan/VideoDienTapPAChuaChay.mp4'
          },
          {
            name: 'Diễn tập UPSC tràn dầu',
            path: '/dataSources/1.Chuyen_doi_so/1.BanCongNgheAnToan/VideoDienTapUPSCTranDau.mp4'
          }
        ]
      },
      {
        name: 'Ban Công nghệ thông tin',
        path: '#',
        children: [
          {
            name: 'Quản lý đơn hàng',
            path: '/dataSources/1.Chuyen_doi_so/2.BanCNTT/1.QuanLyDonHang.mp4'
          },
          {
            name: 'Định danh tài khoản bằng NFC',
            path: '/dataSources/1.Chuyen_doi_so/2.BanCNTT/2.DinhDangTaiKhoanNFC.mp4'
          },
          {
            name: 'Tài khoản liên kết',
            path: '/dataSources/1.Chuyen_doi_so/2.BanCNTT/3.TaiKhoanLienKet.mp4'
          },
        ]
      }
    ]
  },
  screen23: {
    title: 'Công ty CP Nhiên liệu bay Petrolimex',
    background: '/backgrounds/screen_02.png',
    videoList: [
      '/dataSources/2_3_Nhien_lieu_bay_PA/hinh_anh_tra_nap_PA.mp4',
      '/dataSources/2_3_Nhien_lieu_bay_PA/2.Video_15_nam_thanh_lap_PA.mp4',
      '/dataSources/2_3_Nhien_lieu_bay_PA/3.Chuyen_tra_nap_dau_tien.mp4',
      '/dataSources/2_3_Nhien_lieu_bay_PA/4.Quang_cao_TVC_QC.mp4',
    ],
    name: 'Petrolimex Aviation',
    path: '#',
    children: [
      {
        name: 'Hình ảnh tra nạp',
        path: '/dataSources/2_3_Nhien_lieu_bay_PA/hinh_anh_tra_nap_PA.mp4',
      },
      {
        name: 'Video 15 năm thành lập',
        path: '/dataSources/2_3_Nhien_lieu_bay_PA/2.Video_15_nam_thanh_lap_PA.mp4',
      },
      {
        name: 'Video về chuyến bay',
        path: '/dataSources/2_3_Nhien_lieu_bay_PA/3.Chuyen_tra_nap_dau_tien.mp4',
      },
      {
        name: 'Video giới thiệu về công tác tra nạp',
        path: '/dataSources/2_3_Nhien_lieu_bay_PA/4.Quang_cao_TVC_QC.mp4',
      },
      // {
      //   name: 'Video giới thiệu về mẫu xe tra nạp',
      //   path: '#',
      // }
    ]
  },


  screen4: {
    title: 'Tổng Công Ty Vận Tải Thủy Petrolimex',
    background: '/backgrounds/screen_03.png',
    videoList: [
      '/dataSources/4.TCT_van_tai_thuy/1.PGTANKER-CLip_hoi_nghi.mp4',
      '/dataSources/4.TCT_van_tai_thuy/2.Video_tong_ket_hoi_nghi_khach_hang.mp4'
    ],
    name: 'PG Tanker',
    path: '#',
    children: [
      {
        name: 'Ảnh các đội tàu',
        path: '#'
      },
      {
        name: 'Ảnh ban lãnh đạo',
        path: '#'
      },
      {
        name: 'Hội nghị đào tạo',
        path: '/dataSources/4.TCT_van_tai_thuy/1.PGTANKER-CLip_hoi_nghi.mp4'
      },
      {
        name: 'Clip của Tổng công ty',
        path: '#',
        children: [
          {
            name: 'Hội nghị khách hàng năm 2024',
            path: '/dataSources/4.TCT_van_tai_thuy/2.Video_tong_ket_hoi_nghi_khach_hang.mp4'
          },
          {
            name: 'Khóa đào tạo An toàn, an ninh mạng và Chuyển đổi số',
            path: '#'
          }
        ]
      },
      {
        name: 'Mô hình tàu',
        path: '#'
      },
    ]
  },

  screen5: {
    title: 'Công ty Cổ phần Tin học Viễn thông Petrolimex',
    background: '/backgrounds/screen_04.png',
    videoList: [
      '/dataSources/5.Cty_cp_vien_thong/01.Gioi_thieu_PIACOM_TV.mp4',
      '/dataSources/5.Cty_cp_vien_thong/02.PIACOM introduction_Eng.mp4',
      '/dataSources/5.Cty_cp_vien_thong/03.PIA_Gioi_thieu_phan_mem_EGAS.mp4',
      '/dataSources/5.Cty_cp_vien_thong/04.PIA_Gioi_thieu_TDH_do_bon_be.mp4',
      '/dataSources/5.Cty_cp_vien_thong/05.PIA_Co_che_do_be&thu_nhan_tin_hieu_cot_bom_CHXD.mp4',
      '/dataSources/5.Cty_cp_vien_thong/06.PIA_QR_code_dong+HDDT_quang_cao.mp4',
      '/dataSources/5.Cty_cp_vien_thong/08.PIA_GT_TDH_Kho_TAS.mp4',
      '/dataSources/5.Cty_cp_vien_thong/09.PIA_GT_PIACOM_ERP.mp4',
      '/dataSources/5.Cty_cp_vien_thong/10.PIA_TDH_Kho_Nha_be_Case_study.mp4',
    ],
    name: 'Petrolimex Information Technology and Telecommunication Joint-Stock Company',
    path: '#',
    children: [
      {
        name: 'Video giới thiệu về PIACOM',
        path: '/dataSources/5.Cty_cp_vien_thong/01.Gioi_thieu_PIACOM_TV.mp4'
      },
      {
        name: 'Video PIACOM Introduction',
        path: '/dataSources/5.Cty_cp_vien_thong/02.PIACOM introduction_Eng.mp4'
      },
      {
        name: 'Video giới thiệu phần mềm EGAS',
        path: '/dataSources/5.Cty_cp_vien_thong/03.PIA_Gioi_thieu_phan_mem_EGAS.mp4'
      },
      {
        name: 'Video giới thiệu TĐH đo bồn bể',
        path: '/dataSources/5.Cty_cp_vien_thong/04.PIA_Gioi_thieu_TDH_do_bon_be.mp4'
      },
      {
        name: 'Video cơ chế TĐH đo bể',
        path: '/dataSources/5.Cty_cp_vien_thong/05.PIA_Co_che_do_be&thu_nhan_tin_hieu_cot_bom_CHXD.mp4'
      },
      {
        name: 'Video PIA Code động',
        path: '/dataSources/5.Cty_cp_vien_thong/06.PIA_QR_code_dong+HDDT_quang_cao.mp4'
      },
      {
        name: 'Video giới thiệu TĐH kho',
        path: '/dataSources/5.Cty_cp_vien_thong/08.PIA_GT_TDH_Kho_TAS.mp4'
      },
      {
        name: 'Video giới thiệu Piacom erp',
        path: '/dataSources/5.Cty_cp_vien_thong/09.PIA_GT_PIACOM_ERP.mp4'
      },
      {
        name: 'Video TĐH kho nhà bè case study',
        path: '/dataSources/5.Cty_cp_vien_thong/10.PIA_TDH_Kho_Nha_be_Case_study.mp4'
      },

    ]
  },

  screen67: {
    title: 'Tổng Công ty Hóa dầu Petrolimex(PLC)',
    background: '/backgrounds/screen_06.png',
    videoList: [
      '/dataSources/67.Cty_CP_Petrolimex/PHIM_TCT_PETROLIMEX.mp4',
      '/dataSources/67.Cty_CP_Petrolimex/30_nam_thanh_lap_Petrolimex.mp4',
      '/dataSources/67.Cty_CP_Petrolimex/Powersyn.mp4',
      '/dataSources/67.Cty_CP_Petrolimex/Scooter_30s_final.mp4',
      '/dataSources/67.Cty_CP_Petrolimex/PLC Cater CI-4 30s_final chuan.mp4',
      '/dataSources/67.Cty_CP_Petrolimex/san_pham_Dau_mau_nhon.mp4'
    ],
    name: 'Tổng Công ty Hóa dầu Petrolimex(PLC)',
    path: '#',
    children: [
      {
        name: 'Dầu mỡ nhờn',
        path: '#',
        children: [
          {
            name: 'Video quảng cáo sản phẩm',
            path: '#',
            children: [
              {
                name: 'PowerSyn',
                path: '/dataSources/67.Cty_CP_Petrolimex/Powersyn.mp4'
              },
              {
                name: 'Racer Scooter',
                path: '/dataSources/67.Cty_CP_Petrolimex/Scooter_30s_final.mp4'
              },
              {
                name: 'Cater CI-4',
                path: '/dataSources/67.Cty_CP_Petrolimex/PLC Cater CI-4 30s_final chuan.mp4'
              }
            ]
          },
          {
            name: 'Video năng lực TCT PLC',
            path: '/dataSources/67.Cty_CP_Petrolimex/PHIM_TCT_PETROLIMEX.mp4'
          },
          {
            name: 'Video 30 năm thành lập PLC',
            path: '/dataSources/67.Cty_CP_Petrolimex/30_nam_thanh_lap_Petrolimex.mp4'
          },
          {
            name: 'Danh mục sản phẩm Dầu mỡ nhờn',
            path: '/dataSources/67.Cty_CP_Petrolimex/san_pham_Dau_mau_nhon.mp4'
          }
        ]
      },
      {
        name: 'Nhựa đường',
        path: '#',
        children: [
          {
            name: 'Sản phẩm nhựa đường',
            path: '#'
          },
          {
            name: 'Video giới thiệu Công ty',
            path: '/dataSources/67.Cty_CP_Petrolimex/PETROLIMEX_NhuaDuong.mp4'
          },
          {
            name: 'Video 15 năm thành lập TCT',
            path: '/dataSources/67.Cty_CP_Petrolimex/15nam_nhuaduongfinal.mp4'
          }
        ]
      },
      {
        name: 'Hóa chất',
        path: '#',
        children: [
          {
            name: 'Sản phẩm hóa chất',
            path: '/dataSources/67.Cty_CP_Petrolimex/hoa_chat.mp4'
          }
        ]
      }
    ]
  },

  screen8: {
    title: 'Tổng Công ty CP Gas Petrolimex (PGC - PGas)',
    background: '/backgrounds/screen_05.png',
    videoList: [
      '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng - Copy.mp4',
      '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/2.Định danh tài khoản bằng NFC.mp4',
      '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/3.Tài khoản liên kết.mp4'
    ],
    name: 'Tổng Công ty CP Gas Petrolimex (PGC - PGas)',
    path: '#',
    children: [
      {
        name: 'Vận chuyển, đặc thù chung của Gas',
        path: '#'
      },
      {
        name: 'Gas mang nguồn năng lượng sạch',
        path: '/dataSources/8.Tổng công ty Gas Petrolimex/Gas_mang_nguon_nang_luong_sach.mp4'
      },
      {
        name: 'Hình ảnh sản phẩm Gas',
        path: '/dataSources/8.Tổng công ty Gas Petrolimex/Hinh_anh_GAS.mp4'
      }
    ]
  },

  screen9: {
    title: 'Công ty CP Thiết bị Xăng dầu Petrolimex (PECO)',
    background: '/backgrounds/screen_06.png',
    videoList: [
      '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/1.Quản lý đơn hàng-Cửa hàng yêu cầu tiếp tục giao hàng - Copy.mp4',
      '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/2.Định danh tài khoản bằng NFC.mp4',
      '/dataSources/1.Chuyen_doi_so/2.Ban Cong nghệ Thông tin/3.Tài khoản liên kết.mp4'
    ],
    name: 'Công ty CP Thiết bị Xăng dầu Petrolimex (PECO)',
    path: '#',
    children: [
      {
        name: 'Sản xuất niên PECO',
        path: '#'
      },
      {
        name: 'Sản xuất cột bơm tại nhà máy PECO',
        path: '#'
      },
      {
        name: 'Phòng nghiên cứu sản phẩm mới',
        path: '#'
      },
      {
        name: 'Linh kiện cột bơm Tatsuno',
        path: '#'
      }
    ]
  }

};

export const videoConfigData = {}