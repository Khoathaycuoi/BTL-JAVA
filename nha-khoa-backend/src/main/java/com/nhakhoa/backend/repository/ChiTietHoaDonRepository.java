package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.ChiTietHoaDon;
import com.nhakhoa.backend.entity.ChiTietHoaDonId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChiTietHoaDonRepository extends JpaRepository<ChiTietHoaDon, ChiTietHoaDonId> {
    List<ChiTietHoaDon> findByMaHoaDon(String maHoaDon);
}
