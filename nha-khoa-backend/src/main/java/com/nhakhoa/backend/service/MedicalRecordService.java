package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.CreateMedicalRecordRequest;
import com.nhakhoa.backend.entity.HoSoKham;
import com.nhakhoa.backend.repository.HoSoKhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class MedicalRecordService {

    @Autowired
    private HoSoKhamRepository hoSoKhamRepository;

    public HoSoKham create(CreateMedicalRecordRequest request) {

        // 🔥 1. VALIDATE DATA
        if (request.getMaKH() == null || request.getMaKH().isBlank()) {
            throw new RuntimeException("Mã khách hàng không được để trống");
        }

        if (request.getMaBacSi() == null || request.getMaBacSi().isBlank()) {
            throw new RuntimeException("Mã bác sĩ không được để trống");
        }

        // 🔥 2. TẠO HỒ SƠ
        HoSoKham hsk = new HoSoKham();

        // generate ID
        hsk.setMaHoSo("HSK_" + UUID.randomUUID().toString().substring(0, 8));

        // ngày khám (fallback nếu null)
        hsk.setNgayKham(LocalDate.now());

        // dữ liệu chính
        hsk.setTrieuChung(request.getTrieuChung());
        hsk.setChuanDoan(request.getChuanDoan());
        hsk.setNgayTaiKham(request.getNgayTaiKham());

        // liên kết
        hsk.setMaBacSi(request.getMaBacSi());
        hsk.setMaKH(request.getMaKH());
        hsk.setMaLichHen(request.getMaLichHen());

        // 🔥 3. SAVE
        return hoSoKhamRepository.save(hsk);
    }


    //18
    //18
    public List<HoSoKham> getHistoryByCustomer(String maKH) {

        List<HoSoKham> list = hoSoKhamRepository.findByMaKHOrderByNgayKhamDesc(maKH);

        if (list.isEmpty()) {
            throw new RuntimeException("Không có lịch sử khám cho khách hàng này");
        }

        return list;
    }


}
