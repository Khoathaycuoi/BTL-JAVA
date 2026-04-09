package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_lich_hen")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietLichHen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chi_tiet")
    private Long idChiTiet;

    @ManyToOne
    @JoinColumn(name = "Ma_lich_hen", nullable = false)
    private LichHen LichHen;

    @ManyToOne
    @JoinColumn(name = "Ma_dich_vu", nullable = false)
    private DichVu dichVu;

    @Column(name = "gia_tien_thoi_diem_dat", nullable = false)
    private BigDecimal giaTienThoiDiemDat;
}