package com.nhakhoa.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String ten;
    private String sdt;
    private String gioiTinh;
    private String role;
    private String diaChi;
    private String bangCap;
    private String chungChi;
    private LocalDate ngaySinh;
    private String tienSuBenh;
    private Integer soNamKinhNghiem;
    private String trangThai;
}