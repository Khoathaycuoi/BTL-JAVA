package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "Chi_tiet_hoa_don")
@IdClass(ChiTietHoaDonId.class)
public class ChiTietHoaDon {
    @Id
    @Column(name = "Ma_hoa_don", length = 20)
    private String maHoaDon;

    @Id
    @Column(name = "Ma_dich_vu", length = 20)
    private String maDichVu;

    @Column(name = "So_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "Don_gia", nullable = false)
    private BigDecimal donGia;

    @Column(name = "Thanh_tien", insertable = false, updatable = false)
    private BigDecimal thanhTien;
}