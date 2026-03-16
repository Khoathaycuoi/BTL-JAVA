package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Khach_hang")
public class KhachHang {
    @Id
    @Column(name = "Ma_KH", length = 20)
    private String maKH;

    @Column(name = "Ma_dinh_danh", nullable = false, unique = true, length = 20)
    private String maDinhDanh;

    @Column(name = "Ngay_dang_ky", nullable = false)
    private LocalDate ngayDangKy;

    @Column(name = "Tien_su_benh", columnDefinition = "TEXT")
    private String tienSuBenh;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}