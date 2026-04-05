package com.nhakhoa.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserListResponse {
    private String id;
    private String ten;
    private String sdt;
    private String gioiTinh;
    private String vaiTro;
    private String trangThai;
}