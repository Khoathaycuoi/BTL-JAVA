package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.CreateMedicalRecordRequest;
import com.nhakhoa.backend.entity.HoSoKham;
import com.nhakhoa.backend.service.MedicalRecordService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/medical-records")
public class MedicalRecordController {

    @Autowired
    private MedicalRecordService medicalRecordService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody CreateMedicalRecordRequest request) {
        HoSoKham result = medicalRecordService.create(request);
        return ResponseEntity.ok(result);
    }

    //18
    @GetMapping("/history/{customer_id}")
    public ResponseEntity<?> getHistory(@PathVariable("customer_id") String customerId) {
        try {
            return ResponseEntity.ok(medicalRecordService.getHistoryByCustomer(customerId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }


    //19

}
