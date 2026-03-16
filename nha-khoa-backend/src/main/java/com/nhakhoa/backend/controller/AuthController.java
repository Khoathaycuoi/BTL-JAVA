package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.RegisterRequest;
import com.nhakhoa.backend.entity.ConNguoi;
import com.nhakhoa.backend.entity.KhachHang;
import com.nhakhoa.backend.repository.ConNguoiRepository;
import com.nhakhoa.backend.repository.KhachHangRepository;
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

    @PostMapping("/register")
    public ResponseEntity<?> registerKhachHang(@RequestBody RegisterRequest request) {
        try {
            //CCCD đã tồn tại chưa
            if (conNguoiRepo.existsById(request.getMaDinhDanh())) {
                return ResponseEntity.badRequest().body("Lỗi: Mã định danh (CCCD) đã tồn tại!");
            }

            // 2. Lưu thông tin cơ bản vào bảng Con_nguoi
            ConNguoi cn = new ConNguoi();
            cn.setMaDinhDanh(request.getMaDinhDanh());
            cn.setTen(request.getTen());
            cn.setSdt(request.getSdt());
            cn.setGioiTinh(request.getGioiTinh());
            cn.setNgaySinh(request.getNgaySinh());
            cn.setDiaChi(request.getDiaChi());
            conNguoiRepo.save(cn);

            // 3. TỰ ĐỘNG SINH MÃ KHÁCH HÀNG (Format: KH_0001, KH_0002...)
            long count = khachHangRepo.count(); // Đếm xem DB đang có bao nhiêu khách
            String newMaKH = String.format("KH_%04d", count + 1); // Format thành chuỗi 4 số

            // 4. Lưu vào bảng Khach_hang
            KhachHang kh = new KhachHang();
            kh.setMaKH(newMaKH); // Gắn mã tự động vào
            kh.setMaDinhDanh(request.getMaDinhDanh());
            kh.setNgayDangKy(LocalDate.now());
            kh.setTienSuBenh(request.getTienSuBenh());
            khachHangRepo.save(kh);


            return ResponseEntity.ok("Đăng ký thành công! Mã khách hàng mới là: " + newMaKH);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}