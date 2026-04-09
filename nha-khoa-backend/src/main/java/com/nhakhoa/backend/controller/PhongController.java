package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.PhongRequest;
import com.nhakhoa.backend.dto.PhongResponse;
import com.nhakhoa.backend.entity.Phong;
import com.nhakhoa.backend.service.PhongService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/phong")
public class PhongController {
    @Autowired
    private PhongService phongService;

    // 1. Thêm mới hoặc Cập nhật phòng
    @PostMapping("/add")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addPhong(@Valid @RequestBody PhongRequest request) {
        try {
            String result = phongService.addPhong(request);
            return ResponseEntity.ok(result);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    // 2. Lấy tất cả danh sách phòng
    @GetMapping("/all")
    public ResponseEntity<List<PhongResponse>> getAllPhong() {
        return ResponseEntity.ok(phongService.getAllPhong());
    }

    // 3. Cập nhật thông tin phòng
    @PutMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> updatePhong(@Valid @RequestBody PhongRequest request) {
        try {
            phongService.updatePhong(request);
            return ResponseEntity.ok("Cập nhật thông tin phòng thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 4. Ngưng hoạt động phòng (Xóa mềm)
    @PutMapping("/deactivate/{maPhong}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deactivateRoom(@PathVariable String maPhong) {
        try {
            phongService.xoaMemPhong(maPhong);
            return ResponseEntity.ok("Phòng đã được chuyển sang trạng thái Ngừng hoạt động.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 5. Khôi phục hoạt động phòng
    @PutMapping("/activate/{maPhong}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> activateRoom(@PathVariable String maPhong) {
        try {
            phongService.khoiPhucPhong(maPhong);
            return ResponseEntity.ok("Phòng đã hoạt động trở lại.");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 6. Tìm kiếm và lọc nâng cao
    @GetMapping("/search")
    public ResponseEntity<List<Phong>> searchRooms(
            @RequestParam(required = false) String tenPhong,
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String maBacSi) {
        return ResponseEntity.ok(phongService.searchFullPhong(tenPhong, trangThai, maBacSi));
    }
}

