package com.nhakhoa.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PhongResponse {
    private String maPhong;
    private String tenPhong;
    private String trangThai;
    private String maBacSiLeader;
}
