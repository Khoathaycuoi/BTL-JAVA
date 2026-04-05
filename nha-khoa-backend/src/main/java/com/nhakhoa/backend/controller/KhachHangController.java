package com.nhakhoa.backend.controller;


import com.nhakhoa.backend.dto.*;
import com.nhakhoa.backend.entity.KhachHang;
import com.nhakhoa.backend.service.KhachHangService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thongtin")
public class KhachHangController {

    @Autowired
    private KhachHangService khachHangService;

    @PostMapping("/add")
    public ResponseEntity<?> addKhachHang(@Valid @RequestBody AddKhachHangRequest request) {
        try {
            String response = khachHangService.addKhachHang(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
    //All khach hàng
    @GetMapping("/khach-hang")
    public ResponseEntity<List<KhachHangResponse>> getKhachHang() {
        return ResponseEntity.ok(khachHangService.getAllKhachHang());
    }
    //Update khách hàng
    @PutMapping("/update/{maKH}")
    public ResponseEntity<?> updateKhachHang(@PathVariable String maKH, @RequestBody UpdateKhachHangRequest request) {
        try {
            String result = khachHangService.updateKhachHang(maKH, request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi cập nhật: " + e.getMessage());
        }
    }
}
