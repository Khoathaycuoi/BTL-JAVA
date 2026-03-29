package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.ConNguoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ConNguoiRepository extends JpaRepository<ConNguoi, String> {

    boolean existsBySdt(String sdt);
    java.util.Optional<ConNguoi> findBySdt(String sdt);

}
