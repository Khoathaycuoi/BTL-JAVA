package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.*;
import com.nhakhoa.backend.entity.*;
import com.nhakhoa.backend.repository.DichVuRepository;
import com.nhakhoa.backend.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;


@Service
public class DichVuService {
    @Autowired
    private DichVuRepository dichVuRepo;
    public String addDichVu(AddDichVuRequest request) {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Chỉ Admin mới có quyền tạo dịch vụ!");
        }

        checkDichVu(request.getTenDichVu());

        String maDV = String.format("DV_%04d", dichVuRepo.count() + 1);
        DichVu dv = new DichVu();
        dv.setMaDichVu(maDV);
        dv.setTenDichVu(request.getTenDichVu());
        dv.setDonGia(request.getDonGia());
        dv.setMoTa(request.getMoTa());
        dichVuRepo.save(dv);
        return "Thên dịch vụ thành công! \nTên dịch vụ: " + request.getTenDichVu() + "\nĐơn giá: " + request.getDonGia();
    }
    private void checkDichVu(String tenDichVu){
        if (dichVuRepo.existsByTenDichVu(tenDichVu)) {
            throw new RuntimeException("Tên dịch vụ đã tồn tại!");
        }
    }

    public List<DichVuResponse> getAllDichVu() {
        return dichVuRepo.findAll().stream()
                .map(dv -> {
                    // Chuyển đổi từ Entity (DichVu) sang DTO (DichVuResponse)
                    return new DichVuResponse(
                            dv.getMaDichVu(),
                            dv.getTenDichVu(),
                            dv.getMoTa(),
                            dv.getDonGia()
                            // Thêm các trường khác của DichVuResponse vào đây
                    );
                })
                .collect(Collectors.toList());
    }
    @Transactional
    public void updateDichVu(UpdateDichVuRequest request) {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Chỉ Admin mới có quyền tạo dịch vụ!");
        }

        DichVu dv = dichVuRepo.findByTenDichVu(request.getTenDichVu());
        if (dv == null) throw new RuntimeException("Không tìm thấy dịch vụ");



        dv.setMoTa(request.getMoTa());
        dv.setDonGia(request.getDonGia());
        dichVuRepo.save(dv);

    }



}
