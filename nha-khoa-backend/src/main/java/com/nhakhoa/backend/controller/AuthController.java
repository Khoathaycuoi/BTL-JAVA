package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.RegisterBacSiRequest;
import com.nhakhoa.backend.dto.RegisterKhachHangRequest;
import com.nhakhoa.backend.dto.RegisterNhanVienRequest;
import com.nhakhoa.backend.entity.*;
import com.nhakhoa.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

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

    //ĐĂNG KÝ KHÁCH HÀNG
    @PostMapping("/register/khach-hang")
    public ResponseEntity<?> registerKhachHang(@RequestBody RegisterKhachHangRequest request) {
        try {
            if (conNguoiRepo.existsById(request.getMaDinhDanh())) {
                return ResponseEntity.badRequest().body("Lỗi: Mã định danh đã tồn tại!");
            }

            if (conNguoiRepo.existsBySdt(request.getSdt())) {
                return ResponseEntity.badRequest().body("Lỗi: Số điện thoại đã được sử dụng!");
            }

            ConNguoi cn = saveConNguoi(request.getMaDinhDanh(), request.getTen(), request.getSdt(),
                    request.getGioiTinh(), request.getNgaySinh(), request.getDiaChi());

            String maKH = String.format("KH_%04d", khachHangRepo.count() + 1);
            KhachHang kh = new KhachHang();
            kh.setMaKH(maKH);
            kh.setMaDinhDanh(cn.getMaDinhDanh());
            kh.setNgayDangKy(LocalDate.now());
            kh.setTienSuBenh(request.getTienSuBenh());
            khachHangRepo.save(kh);

            //username là sdt, password từ request
            saveTaiKhoan(request.getSdt(), request.getMatKhau(), "ROLE_USER", cn.getMaDinhDanh());

            return ResponseEntity.ok("Đăng ký Khách hàng thành công! \nUsername: " + request.getSdt() + "\npassword: " + request.getMatKhau());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    //ĐĂNG KÝ NHÂN VIÊN
    @PostMapping("/register/nhan-vien")
    public ResponseEntity<?> registerNhanVien(@RequestBody RegisterNhanVienRequest request) {
        try {
            if (conNguoiRepo.existsById(request.getMaDinhDanh())) {
                return ResponseEntity.badRequest().body("Lỗi: Mã định danh đã tồn tại!");
            }

            if (conNguoiRepo.existsBySdt(request.getSdt())) {
                return ResponseEntity.badRequest().body("Lỗi: Số điện thoại đã được sử dụng!");
            }

            ConNguoi cn = saveConNguoi(request.getMaDinhDanh(), request.getTen(), request.getSdt(),
                    request.getGioiTinh(), request.getNgaySinh(), request.getDiaChi());

            String idNV = String.format("NV_%04d", nhanVienRepo.count() + 1);
            NhanVien nv = new NhanVien();
            nv.setIdNhanVien(idNV);
            nv.setMaDinhDanh(cn.getMaDinhDanh());
            nv.setTrangThai("Đang làm việc");
            nhanVienRepo.save(nv);

            saveTaiKhoan(request.getSdt(), request.getMatKhau(), "ROLE_NHANVIEN", cn.getMaDinhDanh());

            return ResponseEntity.ok("Đăng ký Nhân viên thành công! \nUsername: " + request.getSdt() + "\npassword: " + request.getMatKhau());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    // ĐĂNG KÝ BÁC SĨ
    @PostMapping("/register/bac-si")
    public ResponseEntity<?> registerBacSi(@RequestBody RegisterBacSiRequest request) {
        try {
            if (conNguoiRepo.existsById(request.getMaDinhDanh())) {
                return ResponseEntity.badRequest().body("Lỗi: Mã định danh đã tồn tại!");
            }

            if (conNguoiRepo.existsBySdt(request.getSdt())) {
                return ResponseEntity.badRequest().body("Lỗi: Số điện thoại đã được sử dụng!");
            }

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
            bs.setNamKinhNghiem(request.getNamKinhNghiem());
            bacSiRepo.save(bs);

            saveTaiKhoan(request.getSdt(), request.getMatKhau(), "ROLE_BACSI", cn.getMaDinhDanh());

            return ResponseEntity.ok("Đăng ký Bác sĩ thành công! \nUsername: " + request.getSdt() + "\npassword: " + request.getMatKhau());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi: " + e.getMessage());
        }
    }

    //lưu tài khoản
    private void saveTaiKhoan(String username, String password, String role, String maDinhDanh) {
        TaiKhoan tk = new TaiKhoan();
        tk.setTenDangNhap(username);
        tk.setMatKhau(password);
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