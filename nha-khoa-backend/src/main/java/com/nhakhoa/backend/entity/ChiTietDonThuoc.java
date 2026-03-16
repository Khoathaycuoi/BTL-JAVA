package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Chi_tiet_don_thuoc")
public class ChiTietDonThuoc {
    @Id
    @Column(name = "Ma_CT_don_thuoc", length = 20)
    private String maCTDonThuoc;

    @Column(name = "Ma_don_thuoc", nullable = false, length = 20)
    private String maDonThuoc;

    @Column(name = "Ten_thuoc", nullable = false, length = 255)
    private String tenThuoc;

    @Column(name = "So_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "Lieu_dung", length = 255)
    private String lieuDung;
}