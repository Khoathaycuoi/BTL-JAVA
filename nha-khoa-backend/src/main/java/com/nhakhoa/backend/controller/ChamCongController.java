package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.service.ChamCongService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cham-cong")
@RequiredArgsConstructor
public class ChamCongController {

    private final ChamCongService chamCongService;

    @PreAuthorize("hasAnyAuthority('ROLE_NHANVIEN', 'ROLE_BACSI')")
    @PostMapping("/check-in")
    public ResponseEntity<?> checkIn() {
        try {
            return ResponseEntity.ok(chamCongService.checkIn());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAnyAuthority('ROLE_NHANVIEN', 'ROLE_BACSI')")
    @PutMapping("/check-out")
    public ResponseEntity<?> checkOut() {
        try {
            return ResponseEntity.ok(chamCongService.checkOut());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    @PutMapping("/duyet/{maChamCong}")
    public ResponseEntity<?> duyetChamCong(
            @PathVariable String maChamCong,
            @RequestParam String trangThaiDuyet,
            @RequestParam(required = false) String trangThaiDiLam,
            @RequestParam(required = false) Integer soPhutTre) {
        try {
            return ResponseEntity.ok(chamCongService.duyetChamCong(maChamCong, trangThaiDuyet, trangThaiDiLam, soPhutTre));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}