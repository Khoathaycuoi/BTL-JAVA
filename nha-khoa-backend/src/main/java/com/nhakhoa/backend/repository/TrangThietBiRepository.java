package com.nhakhoa.backend.repository;

import com.nhakhoa.backend.entity.TrangThietBi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrangThietBiRepository extends JpaRepository<TrangThietBi, String> {
    List<TrangThietBi> findAllById(Iterable<String> ids);
}