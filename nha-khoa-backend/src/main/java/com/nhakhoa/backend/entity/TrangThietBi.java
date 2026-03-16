package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Trang_thiet_bi")
public class TrangThietBi {
    @Id
    @Column(name = "Ma_thiet_bi", length = 20)
    private String maThietBi;

    @Column(name = "Ten_thiet_bi", nullable = false, length = 100)
    private String tenThietBi;

    @Column(name = "Loai_thiet_bi", length = 100)
    private String loaiThietBi;

    @Column(name = "Ngay_mua")
    private LocalDate ngayMua;

    @Column(name = "Tinh_trang", length = 50)
    private String tinhTrang;

    @Column(name = "Ma_phong", length = 20)
    private String maPhong;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}