package com.nhakhoa.backend.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ChamCongResponse {
    private String maChamCong;
    private String maNhanVien;
    private String tenNhanVien;
    private LocalDate ngayChamCong;
    private LocalTime gioVaoThucTe;
    private LocalTime gioRaThucTe;
    private String trangThai;
    private Integer soPhutTre;
    private String trangThaiDuyet;
}