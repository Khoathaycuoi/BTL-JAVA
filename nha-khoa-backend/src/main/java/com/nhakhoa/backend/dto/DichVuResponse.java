package com.nhakhoa.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DichVuResponse {
    private String maDichVu;
    private String tenDichVu;
    private String moTa;
    private BigDecimal donGia;
}