package com.nhakhoa.backend.controller;


import com.nhakhoa.backend.dto.*;
import com.nhakhoa.backend.entity.DichVu;
import com.nhakhoa.backend.service.AuthService;
import com.nhakhoa.backend.service.DichVuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dichvu")
public class DichVuController {

    @Autowired
    private DichVuService dichVuService;

    @PostMapping("/add")
    public ResponseEntity<?> addDichVu(@Valid @RequestBody AddDichVuRequest request) {
        try {
            String response = dichVuService.addDichVu(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllDichVu() {
        // Gọi service để lấy danh sách dịch vụ
        List<DichVuResponse> listDichVu = dichVuService.getAllDichVu();

        // Kiểm tra nếu danh sách trống hoặc null (tương tự logic kiểm tra myInfo == null)
        if (listDichVu == null || listDichVu.isEmpty()) {
            return ResponseEntity.status(404).body("Không tìm thấy danh sách dịch vụ");
        }

        // Trả về danh sách dịch vụ với mã 200 OK
        return ResponseEntity.ok(listDichVu);
    }
    @PutMapping("/dv")
    public ResponseEntity<?> updateDichVu(@Valid @RequestBody UpdateDichVuRequest request) {
        try {
            dichVuService.updateDichVu(request);
            return ResponseEntity.ok("Cập nhật thông tin thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}