package com.nhakhoa.backend.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class BaoTriResponse {
        private String maBaoTri;
        private BigDecimal chiPhi;
        private LocalDate ngayBaoTri;
        private String noiDungBaoTri;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<ThietBiTrongBaoTriDTO> danhSachThietBi;
}


