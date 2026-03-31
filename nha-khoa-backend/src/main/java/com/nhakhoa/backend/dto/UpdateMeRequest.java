package com.nhakhoa.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import com.nhakhoa.backend.validation.TuoiHopLe;

@Data
public class UpdateMeRequest {
    @NotBlank(message = "Tên không được để trống")
    private String ten;
    private String gioiTinh;
    @TuoiHopLe
    private LocalDate ngaySinh;
    private String diaChi;
    private String bangCap;
    private String chungChi;
    private Integer soNamKinhNghiem;
    private String tienSuBenh;
}