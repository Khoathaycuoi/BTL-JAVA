package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.PhongRequest;
import com.nhakhoa.backend.dto.PhongResponse;
import com.nhakhoa.backend.entity.DichVu;
import com.nhakhoa.backend.entity.Phong;
import com.nhakhoa.backend.repository.BacSiRepository;
import com.nhakhoa.backend.repository.PhongRepository;
import com.nhakhoa.backend.utils.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PhongService {

    @Autowired
    private PhongRepository phongRepo;

    @Autowired
    private BacSiRepository bacSiRepo; // Kết nối với bảng Bác sĩ

    @Transactional
    public String saveOrUpdateRoom(PhongRequest request) {
        // 1. Kiểm tra Mã Bác sĩ Leader (Phải lấy từ bảng BacSi)
        if (request.getMaBacSiLeader() != null && !request.getMaBacSiLeader().isEmpty()) {
            // Kiểm tra xem mã này có tồn tại trong bảng BacSi hay không
            boolean exists = bacSiRepo.existsById(request.getMaBacSiLeader());
            if (!exists) {
                throw new RuntimeException("Lỗi: Mã bác sĩ " + request.getMaBacSiLeader() + " không tồn tại trong hệ thống!");
            }
            // 2. Kiểm tra bác sĩ này đã làm Leader ở phòng khác chưa (Nếu bạn muốn 1 người - 1 phòng)
            phongRepo.findByMaBacSiLeader(request.getMaBacSiLeader()).stream()
                    .filter(p -> !p.getMaPhong().equals(request.getMaPhong()))
                    .findAny()
                    .ifPresent(p -> {
                        throw new RuntimeException("Bác sĩ này đã là trưởng phòng của: " + p.getTenPhong());
                    });
        }

        // 3. Tìm phòng cũ (Update) hoặc tạo đối tượng mới (Insert)
        // maPhong thường do bạn tự nhập (P01, P02...)
        Phong phong = phongRepo.findById(request.getMaPhong()).orElse(new Phong());

        phong.setMaPhong(request.getMaPhong());
        phong.setTenPhong(request.getTenPhong());
        phong.setTrangThai(request.getTrangThai());
        phong.setMaBacSiLeader(request.getMaBacSiLeader());

        phongRepo.save(phong);
        return "Lưu thông tin phòng " + request.getTenPhong() + " thành công!";
    }
    // 1. Thêm phòng mới
    public String addPhong(PhongRequest request) {
        // Kiểm tra quyền Admin
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Chỉ Admin mới có quyền tạo phòng!");
        }
        // 1. Kiểm tra Mã Bác sĩ Leader (Phải lấy từ bảng BacSi)
        if (request.getMaBacSiLeader() != null && !request.getMaBacSiLeader().isEmpty()) {
            // Kiểm tra xem mã này có tồn tại trong bảng BacSi hay không
            boolean exists = bacSiRepo.existsById(request.getMaBacSiLeader());
            if (!exists) {
                throw new RuntimeException("Lỗi: Mã bác sĩ " + request.getMaBacSiLeader() + " không tồn tại trong hệ thống!");
            }
            // 2. Kiểm tra bác sĩ này đã làm Leader ở phòng khác chưa (Nếu bạn muốn 1 người - 1 phòng)
            phongRepo.findByMaBacSiLeader(request.getMaBacSiLeader()).stream()
                    .filter(p -> !p.getMaPhong().equals(request.getMaPhong()))
                    .findAny()
                    .ifPresent(p -> {
                        throw new RuntimeException("Bác sĩ này đã là trưởng phòng của: " + p.getTenPhong());
                    });
        }

        // Kiểm tra trùng tên phòng
        if (phongRepo.existsByTenPhong(request.getTenPhong())) {
            throw new RuntimeException("Tên phòng đã tồn tại!");
        }

        // Kiểm tra bác sĩ leader có tồn tại không
        if (request.getMaBacSiLeader() != null && !bacSiRepo.existsById(request.getMaBacSiLeader())) {
            throw new RuntimeException("Mã bác sĩ leader không tồn tại!");
        }

        // Tự động sinh mã phòng kiểu P_0001
        String maPhong = String.format("P_%04d", phongRepo.count() + 1);

        Phong phong = new Phong();
        phong.setMaPhong(maPhong);
        phong.setTenPhong(request.getTenPhong());
        phong.setTrangThai("Hoạt động"); // Mặc định khi tạo là Hoạt động
        phong.setMaBacSiLeader(request.getMaBacSiLeader());

        phongRepo.save(phong);
        return "Thêm phòng thành công! \n Mã phòng: " + maPhong + "\n Tên phòng: " + request.getTenPhong();
    }

    // 2. Lấy tất cả danh sách phòng
    public List<PhongResponse> getAllPhong() {
        return phongRepo.findAll().stream()
                .map(p -> new PhongResponse(
                        p.getMaPhong(),
                        p.getTenPhong(),
                        p.getTrangThai(),
                        p.getMaBacSiLeader()
                ))
                .collect(Collectors.toList());
    }

    // 3. Cập nhật thông tin phòng
    @Transactional
    public void updatePhong(PhongRequest request) {
        String role = SecurityUtils.getCurrentUserRole();
        if (role == null || !role.equals("ROLE_ADMIN")) {
            throw new RuntimeException("Chỉ Admin mới có quyền chỉnh sửa phòng!");
        }

        // Tìm theo mã phòng gửi lên
        Phong phong = phongRepo.findById(request.getMaPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng: " + request.getMaPhong()));

        // Kiểm tra bác sĩ leader mới nếu có thay đổi
        if (request.getMaBacSiLeader() != null && !bacSiRepo.existsById(request.getMaBacSiLeader())) {
            throw new RuntimeException("Bác sĩ leader không tồn tại!");
        }

        phong.setTenPhong(request.getTenPhong());
        phong.setTrangThai(request.getTrangThai());
        phong.setMaBacSiLeader(request.getMaBacSiLeader());

        phongRepo.save(phong);
    }

    // 4. Xóa mềm (Ngưng hoạt động)
    @Transactional
    public void xoaMemPhong(String maPhong) {
        Phong phong = phongRepo.findById(maPhong)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng: " + maPhong));

        phong.setTrangThai("Ngừng hoạt động");
        phongRepo.save(phong);
    }

    // 5. Khôi phục hoạt động
    @Transactional
    public void khoiPhucPhong(String maPhong) {
        Phong phong = phongRepo.findById(maPhong)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phòng: " + maPhong));

        phong.setTrangThai("Hoạt động");
        phongRepo.save(phong);
    }

    // 6. Tìm kiếm và lọc nâng cao
    public List<Phong> searchFullPhong(String tenPhong, String trangThai, String maBacSi) {
        String searchTen = (tenPhong != null) ? tenPhong : "";

        if (trangThai == null || trangThai.isEmpty()) {
            if (maBacSi == null || maBacSi.isEmpty()) {
                return phongRepo.findByTenPhongContaining(searchTen);
            }
            return phongRepo.findByTenPhongContainingAndMaBacSiLeader(searchTen, maBacSi);
        }

        return phongRepo.findByTenPhongContainingAndTrangThaiAndMaBacSiLeader(searchTen, trangThai, maBacSi);
    }
}

