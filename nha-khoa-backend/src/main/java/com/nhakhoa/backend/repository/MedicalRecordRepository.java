package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.HoSoKham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<HoSoKham, String> {

    List<HoSoKham> findByMaKHOrderByNgayKhamDesc(String maKH);

}
