package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.UpdateMeRequest;
import com.nhakhoa.backend.dto.UserResponse;
import com.nhakhoa.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.nhakhoa.backend.dto.ChangePasswordRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/bac-si")
    public ResponseEntity<List<UserResponse>> getBacSi() {
        return ResponseEntity.ok(userService.getAllBacSi());
    }

    @GetMapping("/nhan-vien")
    public ResponseEntity<List<UserResponse>> getNhanVien() {
        return ResponseEntity.ok(userService.getAllNhanVien());
    }

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
    // Xóa mềm
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{username}/xoa")
    public ResponseEntity<?> xoaTaiKhoan(@PathVariable String username) {
        try {
            userService.xoaMemTaiKhoan(username);
            return ResponseEntity.ok("Đã vô hiệu hóa tài khoản thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Khôi phục
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{username}/khoi-phuc")
    public ResponseEntity<?> khoiPhucTaiKhoan(@PathVariable String username) {
        try {
            userService.khoiPhucTaiKhoan(username);
            return ResponseEntity.ok("Đã khôi phục tài khoản thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @PutMapping("/me")
    public ResponseEntity<?> updateMyInfo(@Valid @RequestBody UpdateMeRequest request) {
        try {
            userService.updateMyInfo(request);
            return ResponseEntity.ok("Cập nhật thông tin thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    @PutMapping("/me/password")
    public ResponseEntity<?> changeMyPassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            userService.changeMyPassword(request);
            return ResponseEntity.ok("Đổi mật khẩu thành công!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}