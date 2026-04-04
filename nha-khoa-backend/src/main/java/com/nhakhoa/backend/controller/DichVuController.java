package com.nhakhoa.backend.controller;


import com.nhakhoa.backend.dto.*;
import com.nhakhoa.backend.entity.DichVu;
import com.nhakhoa.backend.service.AuthService;
import com.nhakhoa.backend.service.DichVuService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    // Xóa mềm
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{maDichVu}/xoa")
    public ResponseEntity<?> xoaDichVu(@PathVariable String maDichVu) {
        try {
            dichVuService.xoaMemDichVu(maDichVu);
            return ResponseEntity.ok("Đã vô hiệu hóa dịch vụ thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Khôi phục
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{maDichVu}/khoi-phuc")
    public ResponseEntity<?> khoiPhucDichVu(@PathVariable String maDichVu) {
        try {
            dichVuService.khoiPhucDichVu(maDichVu);
            return ResponseEntity.ok("Đã khôi phục dịch vụ thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
//    //Lọc Theo trạng thái
//    @GetMapping("/filter")
//    public ResponseEntity<List<DichVu>> filterDichVu(
//            @RequestParam(required = false) String status) {
//
//        // Gọi bằng biến 'dichVuService' (viết thường chữ d)
//        List<DichVu> list = dichVuService.getDichVuByFilter(status);
//        return ResponseEntity.ok(list);
//    }
//    //Lọc theo giá
//    @GetMapping("/search-price")
//    public ResponseEntity<List<DichVu>> searchByPrice(
//            @RequestParam(required = false) BigDecimal min,
//            @RequestParam(required = false) BigDecimal max) {
//
//        List<DichVu> result = dichVuService.getDichVuByPriceRange(min, max);
//        return ResponseEntity.ok(result);
//    }
//    //Lọc theo giá và trạng thái
//    @GetMapping("/search")
//    public ResponseEntity<List<DichVu>> search(
//            @RequestParam(required = false) String trangThai,
//            @RequestParam(required = false) BigDecimal min,
//            @RequestParam(required = false) BigDecimal max) {
//
//        // Gọi instance 'dichVuService' (chữ d viết thường)
//        List<DichVu> result = dichVuService.getDichVuByTrangThaiAndDonGiaBetween(trangThai, min, max);
//        return ResponseEntity.ok(result);
//    }
    //Loc ten tt gia
    @GetMapping("/search-all")
    public ResponseEntity<List<DichVu>> searchAll(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal min,
            @RequestParam(required = false) BigDecimal max) {

        List<DichVu> result = dichVuService.searchFullDV(ten, status, min, max);
        return ResponseEntity.ok(result);
    }

}