package com.nhakhoa.backend.dto;

import jakarta.validation.constraints.Pattern;
import lombok.Data;
import java.time.LocalDate;
import com.nhakhoa.backend.validation.TuoiHopLe;


@Data
public class RegisterBacSiRequest {
    @Pattern(regexp = "^\\d{12}$", message = "Mã định danh/CCCD phải bao gồm chính xác 12 chữ số")
    private String maDinhDanh;
    private String ten;
    @Pattern(regexp = "^0[0-9]{9}$", message = "Số điện thoại phải bắt đầu bằng số 0 và có đúng 10 chữ số")    private String sdt;
    private String gioiTinh;
    @TuoiHopLe
    private LocalDate ngaySinh;
    private String diaChi;
    private String chungChi;
    private String bangCap;
    private Integer namKinhNghiem;
    @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d@$!%*?&]{8,}$", message = "Mật khẩu phải từ 8 ký tự, gồm ít nhất 1 chữ cái và 1 chữ số")
    private String matKhau;
}