package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.BaoTri;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BaoTriRepository extends JpaRepository<BaoTri, String> {
}