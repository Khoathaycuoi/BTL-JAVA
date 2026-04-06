package com.nhakhoa.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
public class LichHenResponse {
    private String maLichHen;
    private LocalDate ngayHen;
    private LocalTime gioHen;
    private String trangThai;
    private String maKH;
    private String tenKH;
    private String maBacSi;
    private String tenBacSi;
    private String ghi_chu;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}