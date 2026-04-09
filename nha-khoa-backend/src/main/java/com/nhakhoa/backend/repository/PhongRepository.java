package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.Phong;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PhongRepository extends JpaRepository<Phong, String> {
    boolean existsByTenPhong(String tenPhong);
    List<Phong> findByMaBacSiLeader(String maBacSiLeader);
    boolean existsByMaBacSiLeader(String maBacSiLeader);
    List<Phong> findByTenPhongContaining(String ten);

    List<Phong> findByTenPhongContainingAndMaBacSiLeader(String ten, String maBacSi);

    List<Phong> findByTenPhongContainingAndTrangThaiAndMaBacSiLeader(String ten, String trangThai, String maBacSi);
}
