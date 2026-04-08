package com.nhakhoa.backend.security;

import com.nhakhoa.backend.entity.HoaDon;
import com.nhakhoa.backend.repository.HoaDonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component("invoiceSecurity")
public class InvoiceSecurity {

    @Autowired
    private HoaDonRepository hoaDonRepo;


    public boolean isOwner(String id) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        HoaDon hoaDon = hoaDonRepo.findById(id).orElse(null);
        if (hoaDon == null) return false;

        return currentUsername.equals(hoaDon.getMaHoSo());


    }
}