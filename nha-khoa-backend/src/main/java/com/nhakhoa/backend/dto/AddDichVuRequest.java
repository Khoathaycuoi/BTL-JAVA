package com.nhakhoa.backend.dto;


import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddDichVuRequest {
    @NotBlank(message = "Tên dich vu không được để trống")
    private String tenDichVu;
    private String moTa;
    private BigDecimal donGia;
    private String trangThai;
}
