package com.nhakhoa.backend.service;

import com.nhakhoa.backend.entity.HoaDon;
import com.nhakhoa.backend.entity.DichVu;
import com.nhakhoa.backend.repository.HoaDonRepository;
import com.nhakhoa.backend.repository.DichVuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class InvoiceService {

    @Autowired
    private HoaDonRepository hoaDonRepo;

    @Autowired
    private DichVuRepository dichVuRepo;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_NHANVIEN')")
    @Transactional
    public HoaDon createInvoice(Map<String, Object> data) {
        // 1. Lấy mã hồ sơ và danh sách dịch vụ từ Map
        String maHoSo = (String) data.get("maHoSo");
        List<Map<String, Object>> dsDichVu = (List<Map<String, Object>>) data.get("dsDichVu");

        BigDecimal tongTien = BigDecimal.ZERO;

        // 2. Tính tiền dựa trên đơn giá lấy từ Database
        if (dsDichVu != null) {
            for (Map<String, Object> item : dsDichVu) {
                String maDV = (String) item.get("maDichVu");
                Integer soLuong = (Integer) item.get("soLuong");

                // Tìm dịch vụ trong DB để lấy giá chuẩn
                DichVu dv = dichVuRepo.findByMaDichVu(maDV);
                if (dv != null) {
                    BigDecimal thanhTien = dv.getDonGia().multiply(new BigDecimal(soLuong));
                    tongTien = tongTien.add(thanhTien);
                }
            }
        }

        // 3. Tạo và lưu hóa đơn
        HoaDon hoaDon = new HoaDon();
        hoaDon.setMaHoaDon("HD-" + System.currentTimeMillis());
        hoaDon.setMaHoSo(maHoSo);
        hoaDon.setNgayThanhLap(LocalDate.now());
        hoaDon.setTrangThai("Chưa thanh toán");
        hoaDon.setTongTien(tongTien);

        return hoaDonRepo.save(hoaDon);
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_NHANVIEN')")
    @Transactional
    public HoaDon updatePaymentStatus(String id) {
        HoaDon hoaDon = hoaDonRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));
        hoaDon.setTrangThai("Đã thanh toán");
        return hoaDonRepo.save(hoaDon);
    }
}