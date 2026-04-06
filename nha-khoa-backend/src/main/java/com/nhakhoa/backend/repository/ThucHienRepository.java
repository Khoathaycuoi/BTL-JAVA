package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.ThucHien;
import com.nhakhoa.backend.entity.ThucHienId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ThucHienRepository extends JpaRepository<ThucHien, ThucHienId> {
    List<ThucHien> findByMaBaoTri(String maBaoTri);
    void deleteByMaBaoTri(String maBaoTri);
}