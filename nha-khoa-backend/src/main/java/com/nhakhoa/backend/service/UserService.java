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
import java.util.Objects;
import java.util.stream.Collectors;
import com.nhakhoa.backend.dto.UpdateMeRequest;
import com.nhakhoa.backend.dto.ChangePasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.nhakhoa.backend.entity.BacSi;
import com.nhakhoa.backend.entity.KhachHang;


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
    @Autowired
    private PasswordEncoder passwordEncoder;

    private String getTrangThaiTaiKhoan(String maDinhDanh) {
        return taiKhoanRepo.findByMaDinhDanh(maDinhDanh)
                .map(TaiKhoan::getTrangThai)
                .orElse("CHUA_CO_TAI_KHOAN");
    }

    public List<UserResponse> getAllBacSi() {
        return bacSiRepo.findAll().stream().map(bs -> {
            NhanVien nv = nhanVienRepo.findById(bs.getIdNhanVien()).orElse(null);
            if (nv == null) return null;
            ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);

            return new UserResponse(bs.getMaBacSi(),
                    cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A",
                    cn != null ? cn.getGioiTinh() : "N/A",
                    "BAC_SI",
                    cn != null ? cn.getDiaChi() : "N/A",
                    bs.getBangCap(), bs.getChungChi(),
                    cn != null ? cn.getNgaySinh() : null,
                    null, bs.getSoNamKinhNghiem(),
                    getTrangThaiTaiKhoan(nv.getMaDinhDanh())); // Lấy trạng thái
        }).filter(Objects::nonNull).collect(Collectors.toList());
    }

    public List<UserResponse> getAllNhanVien() {
        return nhanVienRepo.findAll().stream()
                .filter(nv -> !bacSiRepo.existsByIdNhanVien(nv.getIdNhanVien())) // Loại bỏ bác sĩ
                .map(nv -> {
                    ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
                    return new UserResponse(
                            nv.getIdNhanVien(),
                            cn != null ? cn.getTen() : "N/A",
                            cn != null ? cn.getSdt() : "N/A",
                            cn != null ? cn.getGioiTinh() : "N/A",
                            "NHAN_VIEN",
                            cn != null ? cn.getDiaChi() : "N/A",
                            null, null,
                            cn != null ? cn.getNgaySinh() : null,
                            null, null,
                            getTrangThaiTaiKhoan(nv.getMaDinhDanh()) // Thêm trạng thái
                    );
                }).collect(Collectors.toList());
    }

    public List<UserResponse> getAllKhachHang() {
        return khachHangRepo.findAll().stream().map(kh -> {
            ConNguoi cn = conNguoiRepo.findById(kh.getMaDinhDanh()).orElse(null);
            return new UserResponse(
                    kh.getMaKH(),
                    cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A",
                    cn != null ? cn.getGioiTinh() : "N/A",
                    "KHACH_HANG",
                    cn != null ? cn.getDiaChi() : "N/A",
                    null, null,
                    cn != null ? cn.getNgaySinh() : null,
                    kh.getTienSuBenh(), null,
                    getTrangThaiTaiKhoan(kh.getMaDinhDanh()) // Thêm trạng thái
            );
        }).collect(Collectors.toList());
    }

    public UserResponse getMyInfo() {
        String username = SecurityUtils.getCurrentUsername();
        if (username == null) return null;

        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) return null;

        ConNguoi cn = conNguoiRepo.findById(tk.getMaDinhDanh()).orElse(null);
        if (cn == null) return null;

        String role = tk.getVaiTro();
        String id = "N/A";
        String bangCap = null;
        String chungChi = null;
        String tienSuBenh = null;
        Integer soNamKinhNghiem = null;

        if ("ROLE_ADMIN".equals(role)) {
            id = cn.getMaDinhDanh();
        } else if ("ROLE_BACSI".equals(role)) {
            var nv = nhanVienRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (nv != null) {
                var bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).orElse(null);
                if (bs != null) {
                    id = bs.getMaBacSi();
                    bangCap = bs.getBangCap();
                    chungChi = bs.getChungChi();
                    soNamKinhNghiem = bs.getSoNamKinhNghiem();
                }
            }
        } else if ("ROLE_NHANVIEN".equals(role)) {
            var nv = nhanVienRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (nv != null) id = nv.getIdNhanVien();
        } else if ("ROLE_USER".equals(role)) {
            var kh = khachHangRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (kh != null) {
                id = kh.getMaKH();
                tienSuBenh = kh.getTienSuBenh();
            }
        }

        return new UserResponse(
                id,
                cn.getTen(),
                cn.getSdt(),
                cn.getGioiTinh(),
                role,
                cn.getDiaChi(),
                bangCap,
                chungChi,
                cn.getNgaySinh(),
                tienSuBenh,
                soNamKinhNghiem,
                tk.getTrangThai()
        );
    }

    @Transactional
    public void updateMyInfo(UpdateMeRequest request) {
        String username = SecurityUtils.getCurrentUsername();
        if (username == null) throw new RuntimeException("Chưa xác thực người dùng");

        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) throw new RuntimeException("Không tìm thấy tài khoản");

        ConNguoi cn = conNguoiRepo.findById(tk.getMaDinhDanh())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu người dùng"));


        cn.setTen(request.getTen());
        cn.setGioiTinh(request.getGioiTinh());
        cn.setNgaySinh(request.getNgaySinh());
        cn.setDiaChi(request.getDiaChi());
        conNguoiRepo.save(cn);

        String role = tk.getVaiTro();

        if ("ROLE_BACSI".equals(role)) {
            NhanVien nv = nhanVienRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (nv != null) {
                BacSi bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).orElse(null);
                if (bs != null) {
                    bs.setBangCap(request.getBangCap());
                    bs.setChungChi(request.getChungChi());
                    bs.setSoNamKinhNghiem(request.getSoNamKinhNghiem());
                    bacSiRepo.save(bs);
                }
            }
        }
        else if ("ROLE_USER".equals(role)) {
            KhachHang kh = khachHangRepo.findByMaDinhDanh(cn.getMaDinhDanh()).orElse(null);
            if (kh != null) {
                kh.setTienSuBenh(request.getTienSuBenh());
                khachHangRepo.save(kh);
            }
        }
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

    @Transactional
    public void changeMyPassword(ChangePasswordRequest request) {
        String username = SecurityUtils.getCurrentUsername();
        if (username == null) throw new RuntimeException("Chưa xác thực người dùng");

        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) throw new RuntimeException("Không tìm thấy tài khoản");

        if (!passwordEncoder.matches(request.getOldPassword(), tk.getMatKhau())) {
            throw new RuntimeException("Mật khẩu cũ không chính xác");
        }

        tk.setMatKhau(passwordEncoder.encode(request.getNewPassword()));
        taiKhoanRepo.save(tk);
    }
}