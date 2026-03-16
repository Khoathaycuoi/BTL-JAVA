package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Phong")
public class Phong {
    @Id
    @Column(name = "Ma_phong", length = 20)
    private String maPhong;

    @Column(name = "Ten_phong", nullable = false, unique = true, length = 100)
    private String tenPhong;

    @Column(name = "Trang_thai", length = 50)
    private String trangThai;

    @Column(name = "Ma_bac_si_leader", length = 20)
    private String maBacSiLeader;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}