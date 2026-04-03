package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "Nhan_vien")
public class NhanVien {

    @Id
    @Column(name = "ID_nhan_vien", length = 20)
    private String idNhanVien;

    @Column(name = "Ma_dinh_danh", nullable = false, unique = true, length = 20)
    private String maDinhDanh;

    @Column(name = "Trang_thai", nullable = false, length = 50)
    private String trangThai;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "nhanVien", cascade = CascadeType.ALL)
    private List<ChamCong> danhSachChamCong;
}