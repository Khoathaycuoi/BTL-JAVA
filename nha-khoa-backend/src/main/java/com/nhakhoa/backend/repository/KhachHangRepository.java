package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, String> {
    Optional<KhachHang> findByMaDinhDanh(String maDinhDanh);
}