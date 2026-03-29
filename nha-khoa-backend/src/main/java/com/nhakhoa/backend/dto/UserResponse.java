package com.nhakhoa.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.time.LocalDate;

@Data
@AllArgsConstructor
public class UserResponse {
    private String id;
    private String ten;
    private String sdt;
    private String gioiTinh;
    private String vaiTro;
}