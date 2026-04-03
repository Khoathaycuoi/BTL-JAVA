package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.UpdateMeRequest;
import com.nhakhoa.backend.dto.UserDetailResponse;
import com.nhakhoa.backend.dto.UserListResponse;
import com.nhakhoa.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.nhakhoa.backend.dto.ChangePasswordRequest;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/bac-si")
    public ResponseEntity<List<UserListResponse>> getBacSi(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(userService.getAllBacSi(keyword));
    }

    @GetMapping("/nhan-vien")
    public ResponseEntity<List<UserListResponse>> getNhanVien(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(userService.getAllNhanVien(keyword));
    }

    @GetMapping("/khach-hang")
    public ResponseEntity<List<UserListResponse>> getKhachHang(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(userService.getAllKhachHang(keyword));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile() {
        UserDetailResponse myInfo = userService.getMyInfo();
        if (myInfo == null) {
            return ResponseEntity.status(404).body("Không tìm thấy thông tin người dùng");
        }
        return ResponseEntity.ok(myInfo);
    }
    // Xóa mềm
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

    @GetMapping("/detail/{id}")
    public ResponseEntity<?> getUserById(@PathVariable String id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @GetMapping("/bac-si/hoat-dong")
    public ResponseEntity<List<UserListResponse>> getBacSiHoatDong(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(userService.getBacSiHoatDong(keyword));
    }

    @GetMapping("/bac-si/khong-hoat-dong")
    public ResponseEntity<?> getBacSiKhongHoatDong(@RequestParam(required = false) String keyword) {
        try {
            return ResponseEntity.ok(userService.getBacSiKhongHoatDong(keyword));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/nhan-vien/hoat-dong")
    public ResponseEntity<List<UserListResponse>> getNhanVienHoatDong(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(userService.getNhanVienHoatDong(keyword));
    }

    @GetMapping("/nhan-vien/khong-hoat-dong")
    public ResponseEntity<?> getNhanVienKhongHoatDong(@RequestParam(required = false) String keyword) {
        try {
            return ResponseEntity.ok(userService.getNhanVienKhongHoatDong(keyword));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @GetMapping("/khach-hang/hoat-dong")
    public ResponseEntity<List<UserListResponse>> getKhachHangHoatDong(@RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(userService.getKhachHangHoatDong(keyword));
    }

    @GetMapping("/khach-hang/khong-hoat-dong")
    public ResponseEntity<?> getKhachHangKhongHoatDong(@RequestParam(required = false) String keyword) {
        try {
            return ResponseEntity.ok(userService.getKhachHangKhongHoatDong(keyword));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }
}
