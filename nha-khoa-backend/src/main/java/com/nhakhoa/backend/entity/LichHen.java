package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Lich_hen")
public class LichHen {
    @Id
    @Column(name = "Ma_lich_hen", length = 20)
    private String maLichHen;

    @Column(name = "Ngay_hen", nullable = false)
    private LocalDate ngayHen;

    @Column(name = "Gio_hen")
    private LocalTime gioHen;

    @Column(name = "Trang_thai", nullable = false, length = 50)
    private String trangThai;

    @Column(name = "Ma_KH", nullable = false, length = 20)
    private String maKH;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}