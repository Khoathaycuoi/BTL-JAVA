package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Don_thuoc")
public class DonThuoc {
    @Id
    @Column(name = "Ma_don_thuoc", length = 20)
    private String maDonThuoc;

    @Column(name = "Ngay_ke", nullable = false)
    private LocalDate ngayKe;

    @Column(name = "Ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "Ma_ho_so", nullable = false, length = 20)
    private String maHoSo;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}