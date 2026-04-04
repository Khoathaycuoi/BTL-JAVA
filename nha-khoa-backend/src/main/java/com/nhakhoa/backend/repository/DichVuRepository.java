package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.DichVu;
import com.nhakhoa.backend.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.math.BigDecimal;
import java.util.List;

public interface DichVuRepository extends JpaRepository<DichVu, String> {
    boolean existsByTenDichVu(String tenDichVu);
    DichVu findByTenDichVu(String tenDichVu);
    DichVu findByMaDichVu(String maDichVu);
//    List<DichVu> findByTrangThai(String trangThai);
//    List<DichVu> findByDonGiaBetween(BigDecimal min, BigDecimal max);
//    List<DichVu> findByTrangThaiAndDonGiaBetween(String trangThai, BigDecimal min, BigDecimal max);
    List<DichVu> findByTenDichVuContainingAndTrangThaiAndDonGiaBetween(
            String tenDichVu, String trangThai, BigDecimal min, BigDecimal max);
    List<DichVu> findByTenDichVuContainingAndDonGiaBetween(String ten, BigDecimal min, BigDecimal max);
}
