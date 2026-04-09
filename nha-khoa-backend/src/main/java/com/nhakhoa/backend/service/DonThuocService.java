package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.CreateDonThuocRequest;
import com.nhakhoa.backend.dto.DonThuocDetailDTO;
import com.nhakhoa.backend.entity.DonThuoc;
import com.nhakhoa.backend.entity.HoSoKham;
import com.nhakhoa.backend.repository.ChiTietDonThuocRepository;
import com.nhakhoa.backend.repository.DonThuocRepository;
import com.nhakhoa.backend.repository.HoSoKhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class DonThuocService {

    @Autowired
    private DonThuocRepository donThuocRepository;

    @Autowired
    private HoSoKhamRepository hoSoKhamRepository;

    public DonThuoc create(CreateDonThuocRequest request) {

        // 🔥 1. Validate
        if (request.getMaHoSo() == null || request.getMaHoSo().isBlank()) {
            throw new RuntimeException("Mã hồ sơ không được để trống");
        }

        // 🔥 2. Check hồ sơ tồn tại
        HoSoKham hsk = hoSoKhamRepository.findById(request.getMaHoSo())
                .orElseThrow(() -> new RuntimeException("Hồ sơ khám không tồn tại"));

        // 🔥 3. Tạo đơn thuốc
        DonThuoc dt = new DonThuoc();
        dt.setMaDonThuoc("DT_" + UUID.randomUUID().toString().substring(0, 8));
        dt.setNgayKe(LocalDate.now());
        dt.setGhiChu(request.getGhiChu());
        dt.setMaHoSo(hsk.getMaHoSo());

        return donThuocRepository.save(dt);
    }


    //21
    @Autowired
    private ChiTietDonThuocRepository chiTietDonThuocRepository;

    public DonThuocDetailDTO getDonThuocDetail(String maDonThuoc) {
        // Lấy đơn thuốc
        DonThuoc dt = donThuocRepository.findByMaDonThuoc(maDonThuoc)
                .orElseThrow(() -> new RuntimeException("Đơn thuốc không tồn tại"));

        // Lấy danh sách chi tiết thuốc
        List<DonThuocDetailDTO.ChiTietDonThuocDTO> chiTietList =
                chiTietDonThuocRepository.findByMaDonThuoc(maDonThuoc)
                        .stream()
                        .map(ct -> {
                            DonThuocDetailDTO.ChiTietDonThuocDTO ctDto = new DonThuocDetailDTO.ChiTietDonThuocDTO();
                            ctDto.setMaCTDonThuoc(ct.getMaCTDonThuoc());
                            ctDto.setTenThuoc(ct.getTenThuoc());
                            ctDto.setSoLuong(ct.getSoLuong());
                            ctDto.setLieuDung(ct.getLieuDung());
                            return ctDto;
                        })
                        .toList();

        // Tạo DTO đơn thuốc kèm chi tiết
        DonThuocDetailDTO dto = new DonThuocDetailDTO();
        dto.setMaDonThuoc(dt.getMaDonThuoc());
        dto.setNgayKe(dt.getNgayKe());
        dto.setGhiChu(dt.getGhiChu());
        dto.setMaHoSo(dt.getMaHoSo());
        dto.setChiTietDonThuocList(chiTietList);

        return dto;
    }
}
