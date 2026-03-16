package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Con_nguoi")
public class ConNguoi {
    @Id
    @Column(name = "Ma_dinh_danh", length = 20)
    private String maDinhDanh;

    @Column(name = "Ten", nullable = false, length = 100)
    private String ten;

    @Column(name = "SDT", nullable = false, unique = true, length = 15)
    private String sdt;

    @Column(name = "Gioi_tinh", length = 10)
    private String gioiTinh;

    @Column(name = "Ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "Dia_chi", length = 255)
    private String diaChi;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}