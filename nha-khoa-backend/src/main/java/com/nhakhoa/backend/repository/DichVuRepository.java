package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.DichVu;
import com.nhakhoa.backend.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DichVuRepository extends JpaRepository<DichVu, String> {
    boolean existsByTenDichVu(String tenDichVu);
    DichVu findByTenDichVu(String tenDichVu);
}
