package com.nhakhoa.backend.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
public class BaoTriRequest {
    private BigDecimal chiPhi;
    private LocalDate ngayBaoTri;
    private String noiDungBaoTri;
    private List<String> danhSachMaThietBi;
}
