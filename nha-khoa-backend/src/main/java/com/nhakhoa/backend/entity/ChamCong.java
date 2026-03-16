package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "Cham_cong")
public class ChamCong {
    @Id
    @Column(name = "Ma_cham_cong", length = 20)
    private String maChamCong;

    @Column(name = "Trang_thai", length = 50)
    private String trangThai;

    @Column(name = "Gio_vao_thuc_te")
    private LocalTime gioVaoThucTe;

    @Column(name = "Gio_ra_thuc_te")
    private LocalTime gioRaThucTe;

    @Column(name = "So_phut_tre")
    private Integer soPhutTre;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;
}