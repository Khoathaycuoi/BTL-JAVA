package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Bao_tri")
public class BaoTri {
    @Id
    @Column(name = "Ma_bao_tri", length = 20)
    private String maBaoTri;

    @Column(name = "Chi_phi")
    private BigDecimal chiPhi;

    @Column(name = "Ngay_bao_tri")
    private LocalDate ngayBaoTri;

    @Column(name = "Noi_dung_bao_tri", columnDefinition = "TEXT")
    private String noiDungBaoTri;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}