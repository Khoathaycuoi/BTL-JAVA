package com.nhakhoa.backend.entity;

import lombok.Data;
import java.io.Serializable;

@Data
public class LuongId implements Serializable {
    private String idNhanVien;
    private Integer thang;
    private Integer nam;
}