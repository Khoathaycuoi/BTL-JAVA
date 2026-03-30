package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.LoginRequest;
import com.nhakhoa.backend.dto.RegisterBacSiRequest;
import com.nhakhoa.backend.dto.RegisterKhachHangRequest;
import com.nhakhoa.backend.dto.RegisterNhanVienRequest;
import com.nhakhoa.backend.entity.TaiKhoan;
import com.nhakhoa.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register/khach-hang")
    public ResponseEntity<?> registerKhachHang(@Valid @RequestBody RegisterKhachHangRequest request) {
        try {
            String response = authService.registerKhachHang(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/register/nhan-vien")
    public ResponseEntity<?> registerNhanVien(@Valid @RequestBody RegisterNhanVienRequest request) {
        try {
            String response = authService.registerNhanVien(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/register/bac-si")
    public ResponseEntity<?> registerBacSi(@Valid @RequestBody RegisterBacSiRequest request) {
        try {
            String response = authService.registerBacSi(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            String token = authService.login(request);
            return ResponseEntity.ok(token);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Lỗi: " + e.getMessage());
        }
    }
}