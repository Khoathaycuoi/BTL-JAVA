package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.DatLichRequest;
import com.nhakhoa.backend.dto.HuyLichRequest;
import com.nhakhoa.backend.service.LichHenService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@RestController
@RequestMapping("/api/lich-hen")
public class LichHenController {

    @Autowired
    private LichHenService lichHenService;

    @PreAuthorize("hasAnyRole('USER', 'NHANVIEN', 'ADMIN')")
    @PostMapping("/dat-lich")
    public ResponseEntity<?> datLich(@Valid @RequestBody DatLichRequest request) {
        try {
            String message = lichHenService.datLichHen(request);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasAnyRole('ADMIN', 'NHANVIEN', 'BACSI', 'USER')")
    public ResponseEntity<?> getAllLichHen() {
        try {
            return ResponseEntity.ok(lichHenService.getDanhSachLichHen());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/xac-nhan/{maLichHen}")
    public ResponseEntity<?> xacNhanLichHen(@PathVariable String maLichHen) {
        try {
            return ResponseEntity.ok(lichHenService.xacNhanLichHen(maLichHen));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        }
    }

    @PutMapping("/hoan-thanh/{maLichHen}")
    public ResponseEntity<?> hoanThanhLichHen(@PathVariable String maLichHen) {
        try {
            return ResponseEntity.ok(lichHenService.hoanThanhLichHen(maLichHen));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/huy-lich")
    @PreAuthorize("hasAnyRole('USER', 'NHANVIEN', 'ADMIN', 'BACSI')")
    public ResponseEntity<?> huyLich(@RequestBody HuyLichRequest request) {
        try {
            return ResponseEntity.ok(lichHenService.huyLichHen(request));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<?> timKiemLichHen(
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngayHen,
            @RequestParam(required = false) String maKH,
            @RequestParam(required = false) String tenKH,
            @RequestParam(required = false) String sdtKH,
            @RequestParam(required = false) String maBacSi,
            @RequestParam(required = false) String tenBacSi,
            @RequestParam(required = false) String sdtBacSi) {
        try {
            return ResponseEntity.ok(lichHenService.timKiemLichHen(trangThai, ngayHen, maKH, tenKH, sdtKH, maBacSi, tenBacSi, sdtBacSi));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/ca-trong")
    public ResponseEntity<List<LocalTime>> layCaTrong(
            @RequestParam String maBacSi,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay) {
        return ResponseEntity.ok(lichHenService.getCaTrong(maBacSi, ngay));
    }
}