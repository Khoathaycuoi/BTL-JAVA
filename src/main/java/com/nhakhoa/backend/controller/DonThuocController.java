package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.CreateDonThuocRequest;
import com.nhakhoa.backend.dto.DonThuocDetailDTO;
import com.nhakhoa.backend.entity.DonThuoc;


import com.nhakhoa.backend.service.DonThuocService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/prescriptions")
public class DonThuocController {

    @Autowired
    private DonThuocService donThuocService;

    @PostMapping("/create-donthuoc")
    public ResponseEntity<?> create(@RequestBody CreateDonThuocRequest request) {
        try {
            DonThuoc result = donThuocService.create(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    //tim don thuoc

    //API 21: GET chi tiết đơn thuốc + liều dùng
    @GetMapping("/{id}")
    public ResponseEntity<?> getDonThuocDetail(@PathVariable("id") String maDonThuoc) {
        try {
            DonThuocDetailDTO result = donThuocService.getDonThuocDetail(maDonThuoc);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }
}



