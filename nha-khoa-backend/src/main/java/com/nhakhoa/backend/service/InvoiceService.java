package com.nhakhoa.backend.service;

import com.nhakhoa.backend.entity.HoaDon;
import com.nhakhoa.backend.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
public class InvoiceService {

    @Autowired
    private HoaDonRepository hoaDonRepo;

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_NHANVIEN')")
    @Transactional
    public HoaDon createInvoice(String maHoSo) {
        // Logic tạo hóa đơn dựa trên mã hồ sơ khám
        return new HoaDon();
    }

    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_NHANVIEN', 'ROLE_BACSI') " +
            "|| (hasAuthority('ROLE_KHACHHANG') && @invoiceSecurity.isOwner(#id))")
    public HoaDon getFullInvoiceInfo(String id) {
        return hoaDonRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
    }

    // Hàm vừa bổ sung để sửa lỗi ở Controller
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_NHANVIEN')")
    @Transactional
    public HoaDon updatePaymentStatus(String id) {
        HoaDon hoaDon = hoaDonRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Hóa đơn không tồn tại"));
        hoaDon.setTrangThai("Đã thanh toán");
        return hoaDonRepo.save(hoaDon);
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public BigDecimal getRevenue(LocalDate start, LocalDate end) {
        return hoaDonRepo.getTotalRevenue(start, end);
    }
}
