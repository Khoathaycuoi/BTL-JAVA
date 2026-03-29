package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, String> {
    Optional<NhanVien> findByMaDinhDanh(String maDinhDanh);

}