package com.nhakhoa.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class UpdateDichVuRequest {
    @NotBlank(message = "Tên dich vu không được để trống")
    private String tenDichVu;
    private String moTa;
    private BigDecimal donGia;
}