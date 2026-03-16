package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Bac_si")
public class BacSi {
    @Id
    @Column(name = "Ma_bac_si", length = 20)
    private String maBacSi;

    @Column(name = "ID_nhan_vien", nullable = false, unique = true, length = 20)
    private String idNhanVien;

    @Column(name = "Chung_chi", length = 255)
    private String chungChi;

    @Column(name = "Bang_cap", length = 255)
    private String bangCap;

    @Column(name = "Nam_kinh_nghiem")
    private Integer namKinhNghiem;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}