package com.nhakhoa.backend.dto;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateMedicalRecordRequest {
    private String maBacSi;
    private String maKH;
    private String maLichHen;

    private String trieuChung;
    private String chuanDoan;

    private LocalDate ngayKham;
    private LocalDate ngayTaiKham;
}
