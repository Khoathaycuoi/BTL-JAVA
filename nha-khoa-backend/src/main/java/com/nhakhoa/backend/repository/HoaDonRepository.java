package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.HoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, String> {

    // Tính tổng doanh thu từ các hóa đơn đã thanh toán trong khoảng thời gian
    @Query("SELECT SUM(h.tongTien) FROM HoaDon h " +
            "WHERE h.ngayThanhLap BETWEEN :startDate AND :endDate " +
            "AND h.trangThai = 'Đã thanh toán'")
    BigDecimal getTotalRevenue(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
