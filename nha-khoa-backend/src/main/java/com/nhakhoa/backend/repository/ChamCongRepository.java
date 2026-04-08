package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.ChamCong;
import com.nhakhoa.backend.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface ChamCongRepository extends JpaRepository<ChamCong, String> {
    boolean existsByNhanVienAndNgayChamCong(NhanVien nhanVien, LocalDate ngayChamCong);

    Optional<ChamCong> findByNhanVienAndNgayChamCong(NhanVien nhanVien, LocalDate ngayChamCong);

    List<ChamCong> findByNhanVienOrderByNgayChamCongDesc(NhanVien nhanVien);

    @Query("SELECT c FROM ChamCong c WHERE " +
            "(:tenNV IS NULL OR c.nhanVien.maDinhDanh IN (SELECT cn.maDinhDanh FROM ConNguoi cn WHERE cn.ten LIKE %:tenNV%)) AND " +
            "(:ngay IS NULL OR c.ngayChamCong = :ngay) AND " +
            "(:trangThaiDuyet IS NULL OR c.trangThaiDuyet = :trangThaiDuyet)")
    List<ChamCong> timKiemChamCong(@Param("tenNV") String tenNV,
                                   @Param("ngay") LocalDate ngay,
                                   @Param("trangThaiDuyet") String trangThaiDuyet);
}