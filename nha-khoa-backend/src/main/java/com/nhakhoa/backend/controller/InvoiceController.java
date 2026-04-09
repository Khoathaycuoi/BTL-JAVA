package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.entity.HoaDon;
import com.nhakhoa.backend.service.InvoiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class InvoiceController {

    @Autowired
    private InvoiceService invoiceService;

    @PostMapping("/invoices")
    public ResponseEntity<?> createInvoice(@RequestParam String maHoSo) {
        return ResponseEntity.ok(invoiceService.createInvoice(maHoSo));
    }

    @GetMapping("/invoices/{id}")
    public ResponseEntity<?> getInvoiceDetail(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.getFullInvoiceInfo(id));
    }

    @PutMapping("/invoices/{id}/pay")
    public ResponseEntity<?> payInvoice(@PathVariable String id) {
        return ResponseEntity.ok(invoiceService.updatePaymentStatus(id));
    }

    @GetMapping("/reports/revenue")
    public ResponseEntity<?> getRevenue(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        BigDecimal total = invoiceService.getRevenue(startDate, endDate);
        Map<String, Object> response = new HashMap<>();
        response.put("totalRevenue", total);

        return ResponseEntity.ok(response);
    }
}
