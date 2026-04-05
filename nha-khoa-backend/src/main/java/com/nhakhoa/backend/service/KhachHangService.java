package com.nhakhoa.backend.service;


import com.nhakhoa.backend.dto.*;
import com.nhakhoa.backend.entity.*;
import com.nhakhoa.backend.repository.ConNguoiRepository;
import com.nhakhoa.backend.repository.KhachHangRepository;
import com.nhakhoa.backend.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KhachHangService {
    @Autowired
    private KhachHangRepository khachHangRepo;
    @Autowired
    private ConNguoiRepository conNguoiRepo;



    private String getTrangThaiKhachHang(String maDinhDanh) {
        // Nếu tìm thấy khách hàng thì trả về trạng thái mong muốn, nếu không thì báo chưa có
        return khachHangRepo.existsByMaDinhDanh(maDinhDanh) ? "DA_CO_HO_SO" : "CHUA_CO_HO_SO";
    }
    @jakarta.transaction.Transactional
    public String addKhachHang(AddKhachHangRequest request) {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || (!role.equals("ROLE_ADMIN") && !role.equals("ROLE_BACSI"))) {
            throw new RuntimeException("Bạn không có quyền cập nhật thông tin này!");
        }
        checkKhachHang(request.getMaDinhDanh());

    String maKH = String.format("KH_%04d", khachHangRepo.count() + 1);

        ConNguoi cn = saveConNguoi(request.getMaDinhDanh(), request.getTen(), request.getSdt(),
                request.getGioiTinh(), request.getNgaySinh(), request.getDiaChi());

    KhachHang kh = new KhachHang();
        kh.setMaKH(maKH);
        kh.setMaDinhDanh(request.getMaDinhDanh());

        kh.setTienSuBenh(request.getTienSuBenh());
        kh.setNgayDangKy(request.getNgayDangKy());
        khachHangRepo.save(kh);


        return "Thên thông tin khách hàng thành công! \nTên khách hang: " + request.getTen() + "\nSố điện thoại: " + request.getSdt()
    + "\nGioi tính: " + request.getGioiTinh() + "\nNgày sinh: " + request.getNgaySinh() + "\nĐịa chỉ: " + request.getDiaChi() + "\nTiền sử bệnh: "
                + request.getTienSuBenh() + "\nNgay dang ki: " + request.getNgayDangKy();
    }

    private void checkKhachHang(String maDinhDanh){
        if (khachHangRepo.existsByMaDinhDanh(maDinhDanh)) {
            throw new RuntimeException("Mã định danh đã tồn tại!");
        }
    }

    //all khach hang
    public List<KhachHangResponse> getAllKhachHang() {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || (!role.equals("ROLE_ADMIN") && !role.equals("ROLE_BACSI"))) {
            throw new RuntimeException("Bạn không có quyền cập nhật thông tin này!");
        }
        return khachHangRepo.findAll().stream().map(kh -> {
            ConNguoi cn = conNguoiRepo.findById(kh.getMaDinhDanh()).orElse(null);
            return new KhachHangResponse(
                    kh.getMaKH(),
                    kh.getTienSuBenh(),
                    kh.getNgayDangKy(),
                    cn != null ? cn.getTen() : "N/A",
                    cn != null ? cn.getSdt() : "N/A",
                    cn != null ? cn.getGioiTinh() : "N/A",
                    cn != null ? cn.getDiaChi() : "N/A",
                    cn != null ? cn.getNgaySinh() : null,
                    getTrangThaiKhachHang(kh.getMaDinhDanh()) // Thêm trạng thái
            );
        }).collect(Collectors.toList());
    }

    //Update tt khách hàng
    @jakarta.transaction.Transactional
    public String updateKhachHang(String maKH, UpdateKhachHangRequest request) {
        // 1. Kiểm tra quyền hạn (Chỉ Admin hoặc chính chủ, ở đây tôi để Admin)
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || (!role.equals("ROLE_ADMIN") && !role.equals("ROLE_BACSI"))) {
            throw new RuntimeException("Bạn không có quyền cập nhật thông tin này!");
        }

        // 2. Tìm Khách hàng theo mã KH
        KhachHang kh = khachHangRepo.findById(maKH)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với mã: " + maKH));

        // 3. Tìm thông tin "Con người" tương ứng dựa trên mã định danh của khách hàng đó
        ConNguoi cn = conNguoiRepo.findById(kh.getMaDinhDanh())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liệu định danh tương ứng!"));

        // 4. Cập nhật bảng thông tin chung (ConNguoi)
        cn.setTen(request.getTen());
        cn.setSdt(request.getSdt());
        cn.setGioiTinh(request.getGioiTinh());
        cn.setNgaySinh(request.getNgaySinh());
        cn.setDiaChi(request.getDiaChi());
        conNguoiRepo.save(cn);

        // 5. Cập nhật bảng thông tin riêng (KhachHang)
        kh.setTienSuBenh(request.getTienSuBenh());
        kh.setNgayDangKy(request.getNgayDangKy());
        khachHangRepo.save(kh);

        return "Cập nhật thông tin khách hàng " + maKH + " thành công!";
    }




    private ConNguoi saveConNguoi(String maDinhDanh, String ten, String sdt, String gioiTinh, LocalDate ngaySinh, String diaChi) {
        ConNguoi cn = new ConNguoi();
        cn.setMaDinhDanh(maDinhDanh);
        cn.setTen(ten);
        cn.setSdt(sdt);
        cn.setGioiTinh(gioiTinh);
        cn.setNgaySinh(ngaySinh);
        cn.setDiaChi(diaChi);
        return conNguoiRepo.save(cn);
    }

}


