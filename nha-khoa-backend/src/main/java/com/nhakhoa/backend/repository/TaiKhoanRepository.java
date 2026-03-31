package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.TaiKhoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaiKhoanRepository extends JpaRepository<TaiKhoan, String> {
    TaiKhoan findByTenDangNhap(String tenDangNhap);
    java.util.Optional<TaiKhoan> findByMaDinhDanh(String maDinhDanh);
}