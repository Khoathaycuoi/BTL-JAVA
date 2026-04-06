package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.LichHen;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

public interface LichHenRepository extends JpaRepository<LichHen, String> {
    List<LichHen> findByMaBacSi(String maBacSi);
    List<LichHen> findByMaKH(String maKH);
    boolean existsByMaBacSiAndNgayHenAndGioHenAndTrangThaiNot(
            String maBacSi,
            java.time.LocalDate ngayHen,
            java.time.LocalTime gioHen,
            String trangThai
    );

    @Query("SELECT lh FROM LichHen lh " +
            "WHERE (:trangThai IS NULL OR lh.trangThai = :trangThai) " +
            "AND (:ngayHen IS NULL OR lh.ngayHen = :ngayHen) " +
            "AND (:maKH IS NULL OR lh.maKH = :maKH) " +
            "AND (:tenKH IS NULL OR lh.maKH IN (SELECT k.maKH FROM KhachHang k, ConNguoi c WHERE k.maDinhDanh = c.maDinhDanh AND c.ten LIKE %:tenKH%)) " +
            "AND (:sdtKH IS NULL OR lh.maKH IN (SELECT k.maKH FROM KhachHang k, ConNguoi c WHERE k.maDinhDanh = c.maDinhDanh AND c.sdt LIKE %:sdtKH%)) " +
            "AND (:maBacSi IS NULL OR lh.maBacSi = :maBacSi) " +
            "AND (:tenBacSi IS NULL OR lh.maBacSi IN (SELECT b.maBacSi FROM BacSi b, NhanVien nv, ConNguoi c WHERE b.idNhanVien = nv.idNhanVien AND nv.maDinhDanh = c.maDinhDanh AND c.ten LIKE %:tenBacSi%)) " +
            "AND (:sdtBacSi IS NULL OR lh.maBacSi IN (SELECT b.maBacSi FROM BacSi b, NhanVien nv, ConNguoi c WHERE b.idNhanVien = nv.idNhanVien AND nv.maDinhDanh = c.maDinhDanh AND c.sdt LIKE %:sdtBacSi%))")
    List<LichHen> timKiemLichHen(
            @Param("trangThai") String trangThai,
            @Param("ngayHen") LocalDate ngayHen,
            @Param("maKH") String maKH,
            @Param("tenKH") String tenKH,
            @Param("sdtKH") String sdtKH,
            @Param("maBacSi") String maBacSi,
            @Param("tenBacSi") String tenBacSi,
            @Param("sdtBacSi") String sdtBacSi
    );
}