package com.nhakhoa.backend.entity;

import lombok.Data;
import java.io.Serializable;

@Data
public class ThucHienId implements Serializable {
    private String maBaoTri;
    private String maThietBi;
}