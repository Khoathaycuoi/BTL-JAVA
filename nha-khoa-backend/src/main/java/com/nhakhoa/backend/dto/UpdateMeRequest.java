package com.nhakhoa.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateMeRequest {
    @NotBlank(message = "Tên không được để trống")
    private String ten;
    private String gioiTinh;
    private LocalDate ngaySinh;
    private String diaChi;
}