package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.ChiTietDonThuoc;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChiTietDonThuocRepository extends JpaRepository<ChiTietDonThuoc, String> {
    List<ChiTietDonThuoc> findByMaDonThuoc(String maDonThuoc);
}
