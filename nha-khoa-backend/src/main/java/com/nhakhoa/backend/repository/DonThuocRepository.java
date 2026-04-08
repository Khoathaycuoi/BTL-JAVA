package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.DonThuoc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DonThuocRepository extends JpaRepository<DonThuoc, String> {
    Optional<DonThuoc> findByMaDonThuoc(String maDonThuoc);
}
