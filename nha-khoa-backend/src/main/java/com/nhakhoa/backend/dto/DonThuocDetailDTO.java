package com.nhakhoa.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class DonThuocDetailDTO {
    private String maDonThuoc;                  // Mã đơn thuốc
    private LocalDate ngayKe;                    // Ngày kê
    private String ghiChu;                       // Ghi chú
    private String maHoSo;                       // Mã hồ sơ khám
    private List<ChiTietDonThuocDTO> chiTietDonThuocList;  // Danh sách chi tiết thuốc

    @Data
    public static class ChiTietDonThuocDTO {
        private String maCTDonThuoc;  // Mã chi tiết đơn thuốc
        private String tenThuoc;      // Tên thuốc
        private Integer soLuong;      // Số lượng
        private String lieuDung;      // Liều dùng
    }
}
