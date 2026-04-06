package com.nhakhoa.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class DatLichRequest {
    private String maKhachHang;
    private String maBacSi;

    @NotNull(message = "Ngày hẹn không được để trống")
    private LocalDate ngayHen;

    @NotNull(message = "Giờ hẹn không được để trống")
    private LocalTime gioHen;

    @NotNull(message = "Phải chọn ít nhất 1 dịch vụ")
    private List<String> danhSachMaDichVu;

}