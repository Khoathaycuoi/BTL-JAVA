package com.nhakhoa.backend.service;

import com.nhakhoa.backend.entity.ChamCong;
import com.nhakhoa.backend.entity.NhanVien;
import com.nhakhoa.backend.entity.TaiKhoan;
import com.nhakhoa.backend.repository.ChamCongRepository;
import com.nhakhoa.backend.repository.NhanVienRepository;
import com.nhakhoa.backend.repository.TaiKhoanRepository;
import com.nhakhoa.backend.utils.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalTime;

@Service
@RequiredArgsConstructor
public class ChamCongService {

    private final ChamCongRepository chamCongRepo;
    private final NhanVienRepository nhanVienRepo;
    private final TaiKhoanRepository taiKhoanRepo;

    @Transactional
    public String checkIn() {
        String username = SecurityUtils.getCurrentUsername();
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        NhanVien nv = nhanVienRepo.findByMaDinhDanh(tk.getMaDinhDanh())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin nhân viên!"));

        LocalDate homNay = LocalDate.now();
        LocalTime gioHienTai = LocalTime.now();

        if (chamCongRepo.existsByNhanVienAndNgayChamCong(nv, homNay)) {
            throw new RuntimeException("Hôm nay bạn đã check-in rồi!");
        }

        LocalTime gioQuyDinh = LocalTime.of(8, 0);
        String trangThai = "Đúng giờ";
        int soPhutTre = 0;

        if (gioHienTai.isAfter(gioQuyDinh)) {
            trangThai = "Đi muộn";
            soPhutTre = (int) Duration.between(gioQuyDinh, gioHienTai).toMinutes();
        }

        long count = chamCongRepo.count();
        String maChamCong = String.format("CC_%06d", count + 1);

        ChamCong chamCong = new ChamCong();
        chamCong.setMaChamCong(maChamCong);
        chamCong.setNhanVien(nv);
        chamCong.setNgayChamCong(homNay);
        chamCong.setGioVaoThucTe(gioHienTai);
        chamCong.setTrangThai(trangThai);
        chamCong.setSoPhutTre(soPhutTre);
        chamCong.setTrangThaiDuyet("Chờ duyệt");

        chamCongRepo.save(chamCong);

        String thongBao = "Check-in thành công lúc " + gioHienTai.toString().substring(0, 5) + ". Trạng thái: " + trangThai;
        if (soPhutTre > 0) thongBao += " (Trễ " + soPhutTre + " phút)";
        return thongBao;
    }

    @Transactional
    public String checkOut() {
        String username = SecurityUtils.getCurrentUsername();
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        NhanVien nv = nhanVienRepo.findByMaDinhDanh(tk.getMaDinhDanh())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin nhân viên!"));

        LocalDate homNay = LocalDate.now();
        LocalTime gioHienTai = LocalTime.now();

        ChamCong chamCong = chamCongRepo.findByNhanVienAndNgayChamCong(nv, homNay)
                .orElseThrow(() -> new RuntimeException("Bạn chưa check-in ngày hôm nay nên không thể check-out!"));

        if (chamCong.getGioRaThucTe() != null) {
            throw new RuntimeException("Hôm nay bạn đã check-out rồi!");
        }

        chamCong.setGioRaThucTe(gioHienTai);
        chamCongRepo.save(chamCong);

        return "Check-out thành công lúc " + gioHienTai.toString().substring(0, 5);
    }

    @Transactional
    public String duyetChamCong(String maChamCong, String trangThaiDuyetMoi, String trangThaiDiLamThucTe, Integer soPhutTreThucTe) {
        String username = SecurityUtils.getCurrentUsername();
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);

        if (!"ROLE_ADMIN".equals(tk.getVaiTro())) {
            throw new RuntimeException("Chỉ Admin mới có quyền duyệt chấm công!");
        }

        ChamCong chamCong = chamCongRepo.findById(maChamCong)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi chấm công!"));

        if (trangThaiDuyetMoi != null && !trangThaiDuyetMoi.isEmpty()) {
            if (!java.util.List.of("Đã duyệt", "Từ chối", "Chờ duyệt").contains(trangThaiDuyetMoi)) {
                throw new RuntimeException("Trạng thái duyệt không hợp lệ!");
            }
            chamCong.setTrangThaiDuyet(trangThaiDuyetMoi);
        }

        if (trangThaiDiLamThucTe != null && !trangThaiDiLamThucTe.isEmpty()) {
            if (!java.util.List.of("Đúng giờ", "Đi muộn").contains(trangThaiDiLamThucTe)) {
                throw new RuntimeException("Trạng thái đi làm không hợp lệ!");
            }
            chamCong.setTrangThai(trangThaiDiLamThucTe);

            if ("Đi muộn".equals(trangThaiDiLamThucTe) && soPhutTreThucTe != null) {
                chamCong.setSoPhutTre(soPhutTreThucTe);
            }
        }

        chamCongRepo.save(chamCong);

        return "Đã cập nhật bản ghi chấm công thành công!";
    }


}