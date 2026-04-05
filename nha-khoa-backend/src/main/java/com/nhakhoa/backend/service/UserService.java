package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.UserDetailResponse;
import com.nhakhoa.backend.dto.UserListResponse;
import com.nhakhoa.backend.entity.ConNguoi;
import com.nhakhoa.backend.entity.NhanVien;
import com.nhakhoa.backend.entity.TaiKhoan;
import com.nhakhoa.backend.repository.*;
import com.nhakhoa.backend.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import com.nhakhoa.backend.dto.UpdateMeRequest;
import com.nhakhoa.backend.dto.ChangePasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.nhakhoa.backend.entity.BacSi;
import com.nhakhoa.backend.entity.KhachHang;
import org.springframework.web.server.ResponseStatusException;


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

    public List<UserListResponse> getAllBacSi(String keyword) {
        return bacSiRepo.findAll().stream().map(bs -> {
                    NhanVien nv = nhanVienRepo.findById(bs.getIdNhanVien()).orElse(null);
                    if (nv == null) return null;
                    ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
                    return new UserListResponse(
                            bs.getMaBacSi(), cn != null ? cn.getTen() : "N/A",
                            cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                            "BAC_SI", getTrangThaiTaiKhoan(nv.getMaDinhDanh())
                    );
                }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    public List<UserListResponse> getAllNhanVien(String keyword) {
        return nhanVienRepo.findAll().stream()
                .filter(nv -> !bacSiRepo.existsByIdNhanVien(nv.getIdNhanVien()))
                .map(nv -> {
                    ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
                    return new UserListResponse(
                            nv.getIdNhanVien(), cn != null ? cn.getTen() : "N/A",
                            cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                            "NHAN_VIEN", getTrangThaiTaiKhoan(nv.getMaDinhDanh())
                    );
                }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    public List<UserListResponse> getAllKhachHang(String keyword) {
        return khachHangRepo.findAll().stream().map(kh -> {
                    ConNguoi cn = conNguoiRepo.findById(kh.getMaDinhDanh()).orElse(null);
                    return new UserListResponse(
                            kh.getMaKH(), cn != null ? cn.getTen() : "N/A",
                            cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                            "KHACH_HANG", getTrangThaiTaiKhoan(kh.getMaDinhDanh())
                    );
                }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    public UserDetailResponse getMyInfo() {
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

        return new UserDetailResponse(
                id, cn.getTen(), cn.getSdt(), cn.getGioiTinh(), role,
                cn.getDiaChi(), bangCap, chungChi, cn.getNgaySinh(),
                tienSuBenh, soNamKinhNghiem, tk.getTrangThai()
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
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Chỉ Admin mới có quyền vô hiệu hóa tài khoản!");
        }
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) {
            throw new RuntimeException("Không tìm thấy tài khoản: " + username);
        }

        tk.setTrangThai("Không hoạt động");
        taiKhoanRepo.save(tk);
    }

    @Transactional
    public void khoiPhucTaiKhoan(String username) {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Chỉ Admin mới có quyền khôi phục tài khoản!");
        }
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

    public UserDetailResponse getUserById(String id) {
        var khOpt = khachHangRepo.findById(id);
        if (khOpt.isPresent()) {
            KhachHang kh = khOpt.get();
            ConNguoi cn = conNguoiRepo.findById(kh.getMaDinhDanh()).orElse(null);
            return new UserDetailResponse(
                    kh.getMaKH(), cn != null ? cn.getTen() : "N/A", cn != null ? cn.getSdt() : "N/A",
                    cn != null ? cn.getGioiTinh() : "N/A", "KHACH_HANG", cn != null ? cn.getDiaChi() : "N/A",
                    null, null, cn != null ? cn.getNgaySinh() : null, kh.getTienSuBenh(), null,
                    cn != null ? getTrangThaiTaiKhoan(cn.getMaDinhDanh()) : "N/A"
            );
        }

        var bsOpt = bacSiRepo.findById(id);
        if (bsOpt.isPresent()) {
            BacSi bs = bsOpt.get();
            NhanVien nv = nhanVienRepo.findById(bs.getIdNhanVien()).orElse(null);
            ConNguoi cn = (nv != null) ? conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null) : null;
            return new UserDetailResponse(
                    bs.getMaBacSi(), cn != null ? cn.getTen() : "N/A", cn != null ? cn.getSdt() : "N/A",
                    cn != null ? cn.getGioiTinh() : "N/A", "BAC_SI", cn != null ? cn.getDiaChi() : "N/A",
                    bs.getBangCap(), bs.getChungChi(), cn != null ? cn.getNgaySinh() : null,
                    null, bs.getSoNamKinhNghiem(), cn != null ? getTrangThaiTaiKhoan(cn.getMaDinhDanh()) : "N/A"
            );
        }

        var nvOpt = nhanVienRepo.findById(id);
        if (nvOpt.isPresent()) {
            NhanVien nv = nvOpt.get();
            ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
            return new UserDetailResponse(
                    nv.getIdNhanVien(), cn != null ? cn.getTen() : "N/A", cn != null ? cn.getSdt() : "N/A",
                    cn != null ? cn.getGioiTinh() : "N/A", "NHAN_VIEN", cn != null ? cn.getDiaChi() : "N/A",
                    null, null, cn != null ? cn.getNgaySinh() : null, null, null,
                    cn != null ? getTrangThaiTaiKhoan(cn.getMaDinhDanh()) : "N/A"
            );
        }

        throw new RuntimeException("Không tìm thấy người dùng với ID: " + id);
    }

    public List<UserListResponse> getBacSiHoatDong(String keyword) {
        return bacSiRepo.findAll().stream().map(bs -> {
            NhanVien nv = nhanVienRepo.findById(bs.getIdNhanVien()).orElse(null);
            if (nv == null) return null;
            String trangThai = getTrangThaiTaiKhoan(nv.getMaDinhDanh());
            if (!"Hoạt động".equalsIgnoreCase(trangThai)) return null;
            ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
            return new UserListResponse(
                    bs.getMaBacSi(), cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                    "BAC_SI", trangThai
            );
        }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    public List<UserListResponse> getBacSiKhongHoatDong(String keyword) {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ Admin mới xem được bác sĩ không còn hoạt động!");
        }
        return bacSiRepo.findAll().stream().map(bs -> {
            NhanVien nv = nhanVienRepo.findById(bs.getIdNhanVien()).orElse(null);
            if (nv == null) return null;
            String trangThai = getTrangThaiTaiKhoan(nv.getMaDinhDanh());
            if (!"Không hoạt động".equalsIgnoreCase(trangThai)) return null;
            ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
            return new UserListResponse(
                    bs.getMaBacSi(), cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                    "BAC_SI", trangThai
            );
        }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    public List<UserListResponse> getNhanVienHoatDong(String keyword) {
        return nhanVienRepo.findAll().stream()
                .filter(nv -> !bacSiRepo.existsByIdNhanVien(nv.getIdNhanVien()))
                .map(nv -> {
                    String trangThai = getTrangThaiTaiKhoan(nv.getMaDinhDanh());
                    if (!"Hoạt động".equalsIgnoreCase(trangThai)) return null;
                    ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
                    return new UserListResponse(
                            nv.getIdNhanVien(), cn != null ? cn.getTen() : "N/A",
                            cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                            "NHAN_VIEN", trangThai
                    );
                }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    public List<UserListResponse> getNhanVienKhongHoatDong(String keyword) {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ Admin mới xem được nhân viên không còn hoạt động!");
        }
        return nhanVienRepo.findAll().stream()
                .filter(nv -> !bacSiRepo.existsByIdNhanVien(nv.getIdNhanVien()))
                .map(nv -> {
                    String trangThai = getTrangThaiTaiKhoan(nv.getMaDinhDanh());
                    if (!"Không hoạt động".equalsIgnoreCase(trangThai)) return null;
                    ConNguoi cn = conNguoiRepo.findById(nv.getMaDinhDanh()).orElse(null);
                    return new UserListResponse(
                            nv.getIdNhanVien(), cn != null ? cn.getTen() : "N/A",
                            cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                            "NHAN_VIEN", trangThai
                    );
                }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    public List<UserListResponse> getKhachHangHoatDong(String keyword) {
        return khachHangRepo.findAll().stream().map(kh -> {
            String trangThai = getTrangThaiTaiKhoan(kh.getMaDinhDanh());
            if (!"Hoạt động".equalsIgnoreCase(trangThai)) return null;
            ConNguoi cn = conNguoiRepo.findById(kh.getMaDinhDanh()).orElse(null);
            return new UserListResponse(
                    kh.getMaKH(), cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                    "KHACH_HANG", trangThai
            );
        }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    public List<UserListResponse> getKhachHangKhongHoatDong(String keyword) {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Chỉ Admin mới xem được khách hàng không còn hoạt động!");
        }
        return khachHangRepo.findAll().stream().map(kh -> {
            String trangThai = getTrangThaiTaiKhoan(kh.getMaDinhDanh());
            if (!"Không hoạt động".equalsIgnoreCase(trangThai)) return null;
            ConNguoi cn = conNguoiRepo.findById(kh.getMaDinhDanh()).orElse(null);
            return new UserListResponse(
                    kh.getMaKH(), cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A", cn != null ? cn.getGioiTinh() : "N/A",
                    "KHACH_HANG", trangThai
            );
        }).filter(Objects::nonNull)
                .filter(u -> matchesKeyword(u, keyword))
                .collect(Collectors.toList());
    }

    private boolean matchesKeyword(UserListResponse user, String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) return true;
        String kw = keyword.toLowerCase().trim();
        return (user.getTen() != null && user.getTen().toLowerCase().contains(kw)) ||
                (user.getSdt() != null && user.getSdt().contains(kw)) ||
                (user.getId() != null && user.getId().toLowerCase().contains(kw));
    }
}