package com.nhakhoa.backend.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterBacSiRequest {
    private String maDinhDanh;
    private String ten;
    private String sdt;
    private String gioiTinh;
    private LocalDate ngaySinh;
    private String diaChi;
    private String chungChi;
    private String bangCap;
    private Integer namKinhNghiem;
    private String matKhau;
}