package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Chuc_vu")
public class ChucVu {
    @Id
    @Column(name = "Ma_chuc_vu", length = 20)
    private String maChucVu;

    @Column(name = "Ten_chuc_vu", nullable = false, length = 100)
    private String tenChucVu;

    @Column(name = "He_so_luong")
    private BigDecimal heSoLuong;

    @Column(name = "Luong_co_ban")
    private BigDecimal luongCoBan;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}