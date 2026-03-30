package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.UserResponse;
import com.nhakhoa.backend.entity.ConNguoi;
import com.nhakhoa.backend.entity.NhanVien;
import com.nhakhoa.backend.entity.TaiKhoan;
import com.nhakhoa.backend.repository.*;
import com.nhakhoa.backend.utils.SecurityUtils;
import jakarta.transaction.Transactional;
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
    @Autowired
    private TaiKhoanRepository taiKhoanRepo;
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

    public UserResponse getMyInfo() {
        String username = SecurityUtils.getCurrentUsername();
        if (username == null) return null;

        String role = SecurityUtils.getCurrentUserRole();
        ConNguoi cn = null;

        if ("admin".equalsIgnoreCase(username)) {
            cn = conNguoiRepo.findBySdt("0000000000").orElse(null);
        } else {
            cn = conNguoiRepo.findBySdt(username).orElse(null);
        }

        if (cn == null) return null;

        String id = "N/A";

        if ("ROLE_ADMIN".equals(role)) {
            id = cn.getMaDinhDanh();
        }
        else if ("ROLE_BACSI".equals(role)) {
            var nv = nhanVienRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (nv != null) {
                var bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).orElse(null);
                if (bs != null) id = bs.getMaBacSi();
            }
        }
        else if ("ROLE_NHANVIEN".equals(role)) {
            var nv = nhanVienRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (nv != null) id = nv.getIdNhanVien();
        }
        else if ("ROLE_USER".equals(role)) {
            var kh = khachHangRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (kh != null) id = kh.getMaKH();
        }

        return new UserResponse(id, cn.getTen(), cn.getSdt(), cn.getGioiTinh(), role);
    }
    @Transactional
    public void xoaMemTaiKhoan(String username) {
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) {
            throw new RuntimeException("Không tìm thấy tài khoản: " + username);
        }

        tk.setTrangThai("Không hoạt động");
        taiKhoanRepo.save(tk);
    }

    @Transactional
    public void khoiPhucTaiKhoan(String username) {
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) {
            throw new RuntimeException("Không tìm thấy tài khoản: " + username);
        }

        tk.setTrangThai("Hoạt động");
        taiKhoanRepo.save(tk);
    }
}