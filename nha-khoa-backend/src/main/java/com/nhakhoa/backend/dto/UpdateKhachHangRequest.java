package com.nhakhoa.backend.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.nhakhoa.backend.validation.TuoiHopLe;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UpdateKhachHangRequest {
    private String tienSuBenh;
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngayDangKy;

    private String ten;
    @Pattern(regexp = "^0[3|5|7|8|9]\\d{8}$", message = "Số điện thoại không hợp lệ (phải bắt đầu bằng 03,05,07,08,09 và có 10 số)")
    private String sdt;
    private String gioiTinh;
    private String diaChi;
    @TuoiHopLe
    @JsonFormat(pattern = "dd/MM/yyyy")
    private LocalDate ngaySinh;
}