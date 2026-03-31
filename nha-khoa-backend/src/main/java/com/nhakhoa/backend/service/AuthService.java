package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.LoginRequest;
import com.nhakhoa.backend.dto.RegisterBacSiRequest;
import com.nhakhoa.backend.dto.RegisterKhachHangRequest;
import com.nhakhoa.backend.dto.RegisterNhanVienRequest;
import com.nhakhoa.backend.entity.*;
import com.nhakhoa.backend.repository.*;
import com.nhakhoa.backend.security.JwtService;
import com.nhakhoa.backend.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class AuthService {

    @Autowired
    private ConNguoiRepository conNguoiRepo;
    @Autowired
    private KhachHangRepository khachHangRepo;
    @Autowired
    private NhanVienRepository nhanVienRepo;
    @Autowired
    private BacSiRepository bacSiRepo;
    @Autowired
    private TaiKhoanRepository taiKhoanRepo;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public String registerKhachHang(RegisterKhachHangRequest request) {
        // Khách hàng thì ai cũng tự đăng ký được, không cần kiểm tra quyền

        checkConNguoi(request.getMaDinhDanh(), request.getSdt());

        ConNguoi cn = saveConNguoi(request.getMaDinhDanh(), request.getTen(), request.getSdt(),
                request.getGioiTinh(), request.getNgaySinh(), request.getDiaChi());

        String maKH = String.format("KH_%04d", khachHangRepo.count() + 1);
        KhachHang kh = new KhachHang();
        kh.setMaKH(maKH);
        kh.setMaDinhDanh(cn.getMaDinhDanh());
        kh.setNgayDangKy(LocalDate.now());
        kh.setTienSuBenh(request.getTienSuBenh());
        khachHangRepo.save(kh);

        saveTaiKhoan(request.getSdt(), request.getMatKhau(), "ROLE_USER", cn.getMaDinhDanh());

        return "Đăng ký Khách hàng thành công! \nUsername: " + request.getSdt() + "\npassword: " + request.getMatKhau();
    }

    @Transactional
    public String registerNhanVien(RegisterNhanVienRequest request) {
        // KIỂM TRA QUYỀN: Chỉ ADMIN mới được tạo Nhân viên
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Chỉ Admin mới có quyền tạo Nhân viên!");
        }

        checkConNguoi(request.getMaDinhDanh(), request.getSdt());

        ConNguoi cn = saveConNguoi(request.getMaDinhDanh(), request.getTen(), request.getSdt(),
                request.getGioiTinh(), request.getNgaySinh(), request.getDiaChi());

        String idNV = String.format("NV_%04d", nhanVienRepo.count() + 1);
        NhanVien nv = new NhanVien();
        nv.setIdNhanVien(idNV);
        nv.setMaDinhDanh(cn.getMaDinhDanh());
        nv.setTrangThai("Đang làm việc");
        nhanVienRepo.save(nv);

        saveTaiKhoan(request.getSdt(), request.getMatKhau(), "ROLE_NHANVIEN", cn.getMaDinhDanh());

        return "Đăng ký Nhân viên thành công! \nUsername: " + request.getSdt() + "\npassword: " + request.getMatKhau();
    }

    @Transactional
    public String registerBacSi(RegisterBacSiRequest request) {
        // KIỂM TRA QUYỀN: Chỉ ADMIN mới được tạo Bác sĩ
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Chỉ Admin mới có quyền tạo Bác sĩ!");
        }

        checkConNguoi(request.getMaDinhDanh(), request.getSdt());

        ConNguoi cn = saveConNguoi(request.getMaDinhDanh(), request.getTen(), request.getSdt(),
                request.getGioiTinh(), request.getNgaySinh(), request.getDiaChi());

        String idNV = String.format("NV_%04d", nhanVienRepo.count() + 1);
        NhanVien nv = new NhanVien();
        nv.setIdNhanVien(idNV);
        nv.setMaDinhDanh(cn.getMaDinhDanh());
        nv.setTrangThai("Đang làm việc");
        nhanVienRepo.save(nv);

        String maBS = String.format("BS_%04d", bacSiRepo.count() + 1);
        BacSi bs = new BacSi();
        bs.setMaBacSi(maBS);
        bs.setIdNhanVien(idNV);
        bs.setChungChi(request.getChungChi());
        bs.setBangCap(request.getBangCap());
        bs.setSoNamKinhNghiem(request.getNamKinhNghiem());
        bacSiRepo.save(bs);

        saveTaiKhoan(request.getSdt(), request.getMatKhau(), "ROLE_BACSI", cn.getMaDinhDanh());

        return "Đăng ký Bác sĩ thành công! \nUsername: " + request.getSdt() + "\npassword: " + request.getMatKhau();
    }

    public String login(LoginRequest request) {
        TaiKhoan tk = taiKhoanRepo.findById(request.getUsername()).orElse(null);

        if (tk == null || !passwordEncoder.matches(request.getPassword(), tk.getMatKhau())) {
            throw new RuntimeException("Lỗi: Sai tên đăng nhập hoặc mật khẩu");
        }

        if ("Không hoạt động".equalsIgnoreCase(tk.getTrangThai())) {
            throw new RuntimeException("Tài khoản này đã bị vô hiệu hóa!");
        }

        return jwtService.generateToken(tk.getTenDangNhap(), tk.getVaiTro());
    }

    private void checkConNguoi(String maDinhDanh, String sdt) {
        if (conNguoiRepo.existsById(maDinhDanh)) {
            throw new RuntimeException("Mã định danh đã tồn tại!");
        }
        if (conNguoiRepo.existsBySdt(sdt)) {
            throw new RuntimeException("Số điện thoại đã được sử dụng!");
        }
    }

    private void saveTaiKhoan(String username, String password, String role, String maDinhDanh) {
        TaiKhoan tk = new TaiKhoan();
        tk.setTenDangNhap(username);
        tk.setMatKhau(passwordEncoder.encode(password));
        tk.setVaiTro(role);
        tk.setTrangThai("Hoạt động");
        tk.setMaDinhDanh(maDinhDanh);
        taiKhoanRepo.save(tk);
    }

    private ConNguoi saveConNguoi(String maDinhDanh, String ten, String sdt, String gioiTinh, LocalDate ngaySinh, String diaChi) {
        ConNguoi cn = new ConNguoi();
        cn.setMaDinhDanh(maDinhDanh);
        cn.setTen(ten);
        cn.setSdt(sdt);
        cn.setGioiTinh(gioiTinh);
        cn.setNgaySinh(ngaySinh);
        cn.setDiaChi(diaChi);
        return conNguoiRepo.save(cn);
    }
}