package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Dich_vu")
public class DichVu {
    @Id
    @Column(name = "Ma_dich_vu", length = 20)
    private String maDichVu;

    @Column(name = "Ten_dich_vu", nullable = false, length = 100)
    private String tenDichVu;

    @Column(name = "Mo_ta", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "Don_gia", nullable = false)
    private BigDecimal donGia;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @Column(name = "Trang_thai")
    private String trangThai = "Hoạt động";

}