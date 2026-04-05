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
//      dv.setTrangThai(request.getTrangThai());
        dichVuRepo.save(dv);
        return "Thên dịch vụ thành công! \nTên dịch vụ: " + request.getTenDichVu() + "\nĐơn giá: " + request.getDonGia();
    }
    private void checkDichVu(String tenDichVu){
        if (dichVuRepo.existsByTenDichVu(tenDichVu)) {
            throw new RuntimeException("Tên dịch vụ đã tồn tại!");
        }
    }
    //all dich vu
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
    //update dichvu
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

    @Transactional
    public void xoaMemDichVu(String maDichVu) {
        DichVu dv = dichVuRepo.findByMaDichVu(maDichVu);
        if (dv == null) {
            throw new RuntimeException("Không tìm thấy dich vu: " + maDichVu);
        }

        dv.setTrangThai("Ngừng hoạt động");
        dichVuRepo.save(dv);
    }
    @Transactional
    public void khoiPhucDichVu(String maDichVu) {
        DichVu dv = dichVuRepo.findByMaDichVu(maDichVu);
        if (dv == null) {
            throw new RuntimeException("Không tìm thấy dich vu: " + maDichVu);
        }

        dv.setTrangThai("Hoạt động");
        dichVuRepo.save(dv);
    }
//    //Lọc theo trạng thái
//    public List<DichVu> getDichVuByFilter(String trangThai) {
//        if (trangThai == null || trangThai.isEmpty()) {
//            return dichVuRepo.findAll();
//        }
//        return dichVuRepo.findByTrangThai(trangThai);
//    }
//    //Lọc theo đơn giá
//    public List<DichVu> getDichVuByPriceRange(BigDecimal min, BigDecimal max) {
//        // Nếu không truyền giá, có thể mặc định từ 0 đến một con số rất lớn
//        BigDecimal start = (min != null) ? min : BigDecimal.ZERO;
//        BigDecimal end = (max != null) ? max : new BigDecimal("999999999");
//
//        return dichVuRepo.findByDonGiaBetween(start, end);
//    }
//
//    //Lọc theo gia va trang thai hđ
//    public List<DichVu> getDichVuByTrangThaiAndDonGiaBetween(String trangThai, BigDecimal min, BigDecimal max) {
//        // 1. Xử lý giá trị mặc định cho khoảng giá
//        BigDecimal startPrice = (min != null) ? min : BigDecimal.ZERO;
//        BigDecimal endPrice = (max != null) ? max : new BigDecimal("9999999999");
//
//        // 2. Nếu status trống, bạn có thể gọi hàm findByDonGiaBetween cũ
//        if (trangThai == null || trangThai.isEmpty()) {
//            return dichVuRepo.findByDonGiaBetween(startPrice, endPrice);
//        }
//
//        // 3. Nếu có đủ status và khoảng giá, gọi hàm mới mở rộng
//        return dichVuRepo.findByTrangThaiAndDonGiaBetween(trangThai, startPrice, endPrice);
//    }

    //Lọc theo tên tt gia
    public List<DichVu> searchFullDV(String tenDichVu, String trangThai, BigDecimal min, BigDecimal max) {
        // 1. Xử lý mặc định
        String searchTen = (tenDichVu != null) ? tenDichVu : ""; // Nếu null thì để chuỗi rỗng để tìm tất cả
        BigDecimal startPrice = (min != null) ? min : BigDecimal.ZERO;
        BigDecimal endPrice = (max != null) ? max : new BigDecimal("999999999");

        // 2. Logic lọc (Nếu status null, bạn có thể cần viết thêm hàm search không status)
        if (trangThai == null || trangThai.isEmpty()) {
            return dichVuRepo.findByTenDichVuContainingAndDonGiaBetween(searchTen, startPrice, endPrice);
        }

        return dichVuRepo.findByTenDichVuContainingAndTrangThaiAndDonGiaBetween(
                searchTen, trangThai, startPrice, endPrice);
    }

}
