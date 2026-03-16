package com.nhakhoa.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterRequest {
    // Thông tin Con_nguoi
    private String maDinhDanh; // CCCD
    private String ten;
    private String sdt;
    private String gioiTinh;
    private LocalDate ngaySinh;
    private String diaChi;

    // Thông tin Khach_hang
    private String tienSuBenh;
}