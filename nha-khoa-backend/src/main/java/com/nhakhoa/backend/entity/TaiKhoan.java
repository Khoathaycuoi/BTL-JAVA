package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Tai_khoan")
public class TaiKhoan {

    @Id
    @Column(name = "Ten_dang_nhap", length = 50)
    private String tenDangNhap;

    @Column(name = "Mat_khau", nullable = false, length = 255)
    private String matKhau;

    @Column(name = "Vai_tro", nullable = false, length = 50)
    private String vaiTro;

    @Column(name = "Trang_thai", length = 50)
    private String trangThai;

    @Column(name = "Ma_dinh_danh", nullable = false, length = 20)
    private String maDinhDanh;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}