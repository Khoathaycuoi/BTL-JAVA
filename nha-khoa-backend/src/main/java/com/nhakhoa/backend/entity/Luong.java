package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Luong")
@IdClass(LuongId.class)
public class Luong {
    @Id
    @Column(name = "ID_nhan_vien", length = 20)
    private String idNhanVien;

    @Id
    @Column(name = "Thang")
    private Integer thang;

    @Id
    @Column(name = "Nam")
    private Integer nam;

    @Column(name = "Ma_chuc_vu", length = 20)
    private String maChucVu;

    @Column(name = "So_ngay_cong")
    private Integer soNgayCong;

    @Column(name = "Thuong")
    private BigDecimal thuong;

    @Column(name = "Phu_cap")
    private BigDecimal phuCap;

    @Column(name = "Tong_luong")
    private BigDecimal tongLuong;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}