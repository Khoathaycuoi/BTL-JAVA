package com.nhakhoa.backend.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDate;

@Data
public class RegisterKhachHangRequest {
    @Pattern(regexp = "^\\d{12}$", message = "Mã định danh/CCCD phải bao gồm chính xác 12 chữ số")
    private String maDinhDanh;
    private String ten;
    @Pattern(regexp = "^0[3|5|7|8|9]\\d{8}$", message = "Số điện thoại không hợp lệ (phải bắt đầu bằng 03,05,07,08,09 và có 10 số)")
    private String sdt;
    private String gioiTinh;
    private LocalDate ngaySinh;
    private String diaChi;
    private String tienSuBenh;
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$", message = "Mật khẩu phải từ 8 ký tự, gồm ít nhất 1 chữ cái và 1 chữ số")
    private String matKhau;
}