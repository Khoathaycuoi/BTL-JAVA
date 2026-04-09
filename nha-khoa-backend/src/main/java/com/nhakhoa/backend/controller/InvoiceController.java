package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.entity.HoaDon;
import com.nhakhoa.backend.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping
    public ResponseEntity<HoaDon> createInvoice(@RequestBody Map<String, Object> data) {
        return ResponseEntity.ok(invoiceService.createInvoice(data));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<HoaDon> updateStatus(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.updatePaymentStatus(id));
    }
}