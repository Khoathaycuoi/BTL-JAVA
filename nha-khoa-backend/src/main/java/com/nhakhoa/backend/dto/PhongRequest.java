package com.nhakhoa.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PhongRequest {
    private String maPhong;
    private String tenPhong;
    private String trangThai;
    private String maBacSiLeader;
}
