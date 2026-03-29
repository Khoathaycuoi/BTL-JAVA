package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.UserResponse;
import com.nhakhoa.backend.entity.ConNguoi;
import com.nhakhoa.backend.entity.NhanVien;
import com.nhakhoa.backend.repository.*;
import com.nhakhoa.backend.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    @Autowired
    private BacSiRepository bacSiRepo;
    @Autowired
    private NhanVienRepository nhanVienRepo;
    @Autowired
    private KhachHangRepository khachHangRepo;
    @Autowired
    private ConNguoiRepository conNguoiRepo;

    public List<UserResponse> getAllBacSi() {
        return bacSiRepo.findAll().stream().map(bs -> {
            NhanVien nv = nhanVienRepo.findById(bs.getIdNhanVien()).orElse(null);
            if (nv == null) return null;
            ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
            return new UserResponse(bs.getMaBacSi(), cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A",
                    cn != null ? cn.getGioiTinh() : "N/A", "BAC_SI");
        }).filter(item -> item != null).collect(Collectors.toList());
    }

    public List<UserResponse> getAllNhanVien() {
        return nhanVienRepo.findAll().stream()
                // Lọc bỏ những ông là Bác sĩ, chỉ lấy nhân viên thuần túy (Lễ tân, kế toán...)
                .filter(nv -> !bacSiRepo.existsByIdNhanVien(nv.getIdNhanVien()))
                .map(nv -> {
                    ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
                    return new UserResponse(nv.getIdNhanVien(), cn != null ? cn.getTen() : "N/A",
                            cn != null ? cn.getSdt() : "N/A",
                            cn != null ? cn.getGioiTinh() : "N/A", "NHAN_VIEN");
                }).collect(Collectors.toList());
    }

    public List<UserResponse> getAllKhachHang() {
        return khachHangRepo.findAll().stream().map(kh -> {
            ConNguoi cn = conNguoiRepo.findById(kh.getMaDinhDanh()).orElse(null);
            return new UserResponse(kh.getMaKH(), cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A",
                    cn != null ? cn.getGioiTinh() : "N/A", "KHACH_HANG");
        }).collect(Collectors.toList());
    }
    // Trong UserService.java

    public UserResponse getMyInfo() {
        String sdt = SecurityUtils.getCurrentUsername();
        if (sdt == null) return null;

        ConNguoi cn = conNguoiRepo.findBySdt(sdt).orElse(null);
        if (cn == null) return null;

        String role = SecurityUtils.getCurrentUserRole();
        String id = "N/A";

        if ("ROLE_ADMIN".equals(role)) {
            id = "ADMIN";
        } else if ("ROLE_BACSI".equals(role)) {
            NhanVien nv = nhanVienRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (nv != null) {
                var bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).orElse(null);
                if (bs != null) id = bs.getMaBacSi();
            }
        } else if ("ROLE_NHANVIEN".equals(role)) {
            var nv = nhanVienRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (nv != null) id = nv.getIdNhanVien();
        } else if ("ROLE_USER".equals(role)) {
            var kh = khachHangRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (kh != null) id = kh.getMaKH();
        }

        return new UserResponse(id, cn.getTen(), cn.getSdt(), cn.getGioiTinh(), role);
    }
}