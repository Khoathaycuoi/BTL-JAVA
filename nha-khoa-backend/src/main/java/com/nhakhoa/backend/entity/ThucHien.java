package com.nhakhoa.backend.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "Thuc_hien")
@IdClass(ThucHienId.class)
public class ThucHien {
    @Id
    @Column(name = "Ma_bao_tri", length = 20)
    private String maBaoTri;

    @Id
    @Column(name = "Ma_thiet_bi", length = 20)
    private String maThietBi;
}