package com.nhakhoa.backend.entity;

import lombok.Data;
import java.io.Serializable;

@Data
public class ChiTietHoaDonId implements Serializable {
    private String maHoaDon;
    private String maDichVu;
}