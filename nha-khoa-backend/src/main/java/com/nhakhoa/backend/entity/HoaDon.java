package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Hoa_don")
public class HoaDon {
    @Id
    @Column(name = "Ma_hoa_don", length = 20)
    private String maHoaDon;

    @Column(name = "Ngay_thanh_lap", nullable = false)
    private LocalDate ngayThanhLap;

    @Column(name = "Tong_tien")
    private BigDecimal tongTien;

    @Column(name = "Trang_Thai", nullable = false, length = 50)
    private String trangThai;

    @Column(name = "Ma_ho_so", nullable = false, length = 20)
    private String maHoSo;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}