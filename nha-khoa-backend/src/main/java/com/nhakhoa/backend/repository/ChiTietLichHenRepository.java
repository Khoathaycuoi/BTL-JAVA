package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.ChiTietLichHen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChiTietLichHenRepository extends JpaRepository<ChiTietLichHen, Long> {

    // Thêm dòng này để Spring Data JPA tự động tạo câu truy vấn:
    List<ChiTietLichHen> findByLichHen(String LichHen);
}