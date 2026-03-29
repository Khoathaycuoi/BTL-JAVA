package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.UserResponse;
import com.nhakhoa.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    // Chỉ ADMIN mới xem được danh sách Bác sĩ
    @GetMapping("/bac-si")
    public ResponseEntity<List<UserResponse>> getBacSi() {
        return ResponseEntity.ok(userService.getAllBacSi());
    }

    // Chỉ ADMIN mới xem được danh sách Nhân viên
    @GetMapping("/nhan-vien")
    public ResponseEntity<List<UserResponse>> getNhanVien() {
        return ResponseEntity.ok(userService.getAllNhanVien());
    }

    // ADMIN và NHANVIEN đều xem được danh sách Khách hàng
    @GetMapping("/khach-hang")
    public ResponseEntity<List<UserResponse>> getKhachHang() {
        return ResponseEntity.ok(userService.getAllKhachHang());
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        UserResponse myInfo = userService.getMyInfo();
        if (myInfo == null) {
            return ResponseEntity.status(404).body("Không tìm thấy thông tin người dùng");
        }
        return ResponseEntity.ok(myInfo);
    }
}