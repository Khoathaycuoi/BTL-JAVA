package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.HoSoKham;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HoSoKhamRepository extends JpaRepository<HoSoKham, String> {

    List<HoSoKham> findByMaKHOrderByNgayKhamDesc(String maKH);

}
