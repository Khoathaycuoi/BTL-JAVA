package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Ho_so_kham")
public class HoSoKham {
    @Id
    @Column(name = "Ma_ho_so", length = 20)
    private String maHoSo;

    @Column(name = "Ngay_kham", nullable = false)
    private LocalDate ngayKham;

    @Column(name = "Trieu_chung", columnDefinition = "TEXT")
    private String trieuChung;

    @Column(name = "Chuan_doan", columnDefinition = "TEXT")
    private String chuanDoan;

    @Column(name = "Ngay_tai_kham")
    private LocalDate ngayTaiKham;

    @Column(name = "Ma_bac_si", nullable = false, length = 20)
    private String maBacSi;

    @Column(name = "Ma_KH", nullable = false, length = 20)
    private String maKH;

    @Column(name = "Ma_lich_hen", length = 20)
    private String maLichHen;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}