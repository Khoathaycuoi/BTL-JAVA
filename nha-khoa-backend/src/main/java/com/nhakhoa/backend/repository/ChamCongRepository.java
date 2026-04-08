package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.ChamCong;
import com.nhakhoa.backend.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface ChamCongRepository extends JpaRepository<ChamCong, String> {
    boolean existsByNhanVienAndNgayChamCong(NhanVien nhanVien, LocalDate ngayChamCong);

    Optional<ChamCong> findByNhanVienAndNgayChamCong(NhanVien nhanVien, LocalDate ngayChamCong);
}