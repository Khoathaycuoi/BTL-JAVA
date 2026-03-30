package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.BacSi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface BacSiRepository extends JpaRepository<BacSi, String> {
    boolean existsByIdNhanVien(String idNhanVien);
    Optional<BacSi> findByIdNhanVien(String idNhanVien);
}
