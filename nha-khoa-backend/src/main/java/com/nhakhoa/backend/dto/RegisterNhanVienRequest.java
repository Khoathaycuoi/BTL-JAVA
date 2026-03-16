package com.nhakhoa.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterNhanVienRequest {
    private String maDinhDanh;
    private String ten;
    private String sdt;
    private String gioiTinh;
    private LocalDate ngaySinh;
    private String diaChi;
    private String matKhau;
}