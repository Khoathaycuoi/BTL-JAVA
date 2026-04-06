package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.DatLichRequest;
import com.nhakhoa.backend.entity.*;
import com.nhakhoa.backend.repository.*;
import com.nhakhoa.backend.utils.SecurityUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.nhakhoa.backend.dto.HuyLichRequest;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.time.LocalDateTime;
import java.time.Duration;
import com.nhakhoa.backend.dto.LichHenResponse;

@Service
public class LichHenService {

    @Autowired
    private BacSiRepository bacSiRepo;

    @Autowired
    private LichHenRepository lichHenRepo;

    @Autowired
    private ChiTietLichHenRepository chiTietLichHenRepo;

    @Autowired
    private DichVuRepository dichVuRepo;

    @Autowired
    private TaiKhoanRepository taiKhoanRepo;

    @Autowired
    private KhachHangRepository khachHangRepo;

    @Autowired
    private NhanVienRepository nhanVienRepo;

    @Autowired
    private ConNguoiRepository conNguoiRepo;
    @Transactional
    public String datLichHen(DatLichRequest request) {
        LocalDate ngayHienTai = LocalDate.now();
        LocalTime gioHienTai = LocalTime.now();

        if (request.getNgayHen().isBefore(ngayHienTai)) {
            throw new RuntimeException("Ngày hẹn không được trong quá khứ!");
        }

        if (request.getNgayHen().isEqual(ngayHienTai) && request.getGioHen().isBefore(gioHienTai)) {
            throw new RuntimeException("Giờ hẹn không hợp lệ (đã qua giờ này)!");
        }


        String username = SecurityUtils.getCurrentUsername();
        if (username == null) throw new RuntimeException("Bạn cần đăng nhập để đặt lịch!");

        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) throw new RuntimeException("Không tìm thấy tài khoản!");

        String role = tk.getVaiTro();
        String maKHToSave = null;
        String trangThaiBanDau = "Chờ xác nhận";


        if ("ROLE_USER".equals(role)) {

            KhachHang kh = khachHangRepo.findByMaDinhDanh(tk.getMaDinhDanh())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin khách hàng!"));
            maKHToSave = kh.getMaKH();
        } else if ("ROLE_NHANVIEN".equals(role) || "ROLE_ADMIN".equals(role)) {

            if (request.getMaKhachHang() == null || request.getMaKhachHang().trim().isEmpty()) {
                throw new RuntimeException("Nhân viên đặt lịch hộ vui lòng chọn/truyền mã khách hàng!");
            }
            KhachHang kh = khachHangRepo.findById(request.getMaKhachHang())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với mã: " + request.getMaKhachHang()));
            maKHToSave = kh.getMaKH();
            trangThaiBanDau = "Đã xác nhận";
        } else {
            throw new RuntimeException("Bạn không có quyền thực hiện chức năng này!");
        }


        if (request.getDanhSachMaDichVu() == null || request.getDanhSachMaDichVu().isEmpty()) {
            throw new RuntimeException("Vui lòng chọn ít nhất 1 dịch vụ!");
        }

        long count = lichHenRepo.count();
        String maLichHen = String.format("LH_%04d", count + 1);

        LichHen lichHen = new LichHen();
        lichHen.setMaLichHen(maLichHen);
        lichHen.setNgayHen(request.getNgayHen());
        lichHen.setGioHen(request.getGioHen());
        lichHen.setTrangThai(trangThaiBanDau);
        lichHen.setMaKH(maKHToSave);

        if (request.getMaBacSi() != null && !request.getMaBacSi().trim().isEmpty()) {
            boolean isBacSiExist = bacSiRepo.existsById(request.getMaBacSi());
            if (!isBacSiExist) {
                throw new RuntimeException("Không tìm thấy bác sĩ với mã: " + request.getMaBacSi());
            }

            boolean isKinLich = lichHenRepo.existsByMaBacSiAndNgayHenAndGioHenAndTrangThaiNot(
                    request.getMaBacSi(), request.getNgayHen(), request.getGioHen(), "Đã hủy"
            );

            if (isKinLich) {
                throw new RuntimeException("Bác sĩ này đã có lịch bận vào thời gian này. Vui lòng chọn giờ khác hoặc bác sĩ khác!");
            }

            lichHen.setMaBacSi(request.getMaBacSi());
        }

        lichHenRepo.save(lichHen);

        for (String maDV : request.getDanhSachMaDichVu()) {
            DichVu dv = dichVuRepo.findByMaDichVu(maDV);
            if (dv == null) {
                throw new RuntimeException("Không tìm thấy dịch vụ có mã: " + maDV);
            }

            ChiTietLichHen chiTiet = new ChiTietLichHen();
            chiTiet.setLichHen(lichHen);
            chiTiet.setDichVu(dv);
            chiTiet.setGiaTienThoiDiemDat(dv.getDonGia());

            chiTietLichHenRepo.save(chiTiet);
        }

        return "Đặt lịch hẹn thành công! Mã lịch hẹn: " + maLichHen;
    }

    public List<LichHenResponse> getDanhSachLichHen() {
        String username = SecurityUtils.getCurrentUsername();
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) throw new RuntimeException("Không tìm thấy tài khoản!");

        String role = tk.getVaiTro();
        List<LichHen> listLichHen = new ArrayList<>();

        if ("ROLE_ADMIN".equals(role) || "ROLE_NHANVIEN".equals(role)) {
            listLichHen = lichHenRepo.findAll();
        } else if ("ROLE_BACSI".equals(role)) {
            NhanVien nv = nhanVienRepo.findByMaDinhDanh(tk.getMaDinhDanh()).get();
            BacSi bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).get();
            listLichHen = lichHenRepo.findByMaBacSi(bs.getMaBacSi());
        } else if ("ROLE_USER".equals(role)) {
            KhachHang kh = khachHangRepo.findByMaDinhDanh(tk.getMaDinhDanh()).get();
            listLichHen = lichHenRepo.findByMaKH(kh.getMaKH());
        }

        List<LichHenResponse> result = new ArrayList<>();
        for (LichHen lh : listLichHen) {
            LichHenResponse dto = new LichHenResponse();
            dto.setMaLichHen(lh.getMaLichHen());
            dto.setNgayHen(lh.getNgayHen());
            dto.setGioHen(lh.getGioHen());
            dto.setTrangThai(lh.getTrangThai());
            dto.setMaKH(lh.getMaKH());
            dto.setMaBacSi(lh.getMaBacSi());
            dto.setGhi_chu(lh.getGhi_chu());
            dto.setCreatedAt(lh.getCreatedAt());
            dto.setUpdatedAt(lh.getUpdatedAt());

            if (lh.getMaKH() != null) {
                khachHangRepo.findById(lh.getMaKH()).ifPresent(kh -> {
                    conNguoiRepo.findById(kh.getMaDinhDanh()).ifPresent(cn -> dto.setTenKH(cn.getTen()));
                });
            }
            if (lh.getMaBacSi() != null) {
                bacSiRepo.findById(lh.getMaBacSi()).ifPresent(bs -> {
                    nhanVienRepo.findById(bs.getIdNhanVien()).ifPresent(nv -> {
                        conNguoiRepo.findById(nv.getMaDinhDanh()).ifPresent(cn -> dto.setTenBacSi(cn.getTen()));
                    });
                });
            }
            result.add(dto);
        }
        return result;
    }


    @Transactional
    public String xacNhanLichHen(String maLichHen) {
        LichHen lh = lichHenRepo.findById(maLichHen)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn!"));

        if (!"Chờ xác nhận".equals(lh.getTrangThai())) {
            throw new RuntimeException("Chỉ có thể xác nhận lịch hẹn đang ở trạng thái 'Chờ xác nhận'!");
        }

        String username = SecurityUtils.getCurrentUsername();
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        String role = tk.getVaiTro();

        if ("ROLE_USER".equals(role)) {
            throw new RuntimeException("Bạn không có quyền thực hiện chức năng này!");
        }

        if ("ROLE_BACSI".equals(role)) {
            NhanVien nv = nhanVienRepo.findByMaDinhDanh(tk.getMaDinhDanh()).get();
            BacSi bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).get();
            if (lh.getMaBacSi() == null || !lh.getMaBacSi().equals(bs.getMaBacSi())) {
                throw new RuntimeException("Bạn chỉ được phép xác nhận lịch hẹn của chính mình!");
            }
        }

        lh.setTrangThai("Đã xác nhận");
        lichHenRepo.save(lh);

        return "Xác nhận lịch hẹn thành công!";
    }

    @Transactional
    public String hoanThanhLichHen(String maLichHen) {
        LichHen lh = lichHenRepo.findById(maLichHen)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn!"));

        if (!"Đã xác nhận".equals(lh.getTrangThai())) {
            throw new RuntimeException("Chỉ có thể hoàn thành lịch hẹn đang ở trạng thái 'Đã xác nhận'!");
        }

        LocalDateTime thoiGianHen = LocalDateTime.of(lh.getNgayHen(), lh.getGioHen());
        if (LocalDateTime.now().isBefore(thoiGianHen)) {
            throw new RuntimeException("Chưa đến hoặc chưa qua thời gian khám, không thể đánh dấu hoàn thành!");
        }

        String username = SecurityUtils.getCurrentUsername();
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        String role = tk.getVaiTro();

        if ("ROLE_USER".equals(role)) {
            throw new RuntimeException("Bạn không có quyền thực hiện chức năng này!");
        }

        if ("ROLE_BACSI".equals(role)) {
            NhanVien nv = nhanVienRepo.findByMaDinhDanh(tk.getMaDinhDanh()).get();
            BacSi bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).get();
            if (lh.getMaBacSi() == null || !lh.getMaBacSi().equals(bs.getMaBacSi())) {
                throw new RuntimeException("Bạn chỉ được phép hoàn thành lịch hẹn của chính mình!");
            }
        }

        lh.setTrangThai("Đã hoàn thành");
        lichHenRepo.save(lh);

        return "Đã đánh dấu hoàn thành lịch hẹn!";
    }

    @Transactional
    public String huyLichHen(HuyLichRequest request) {
        LichHen lh = lichHenRepo.findById(request.getMaLichHen())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch hẹn!"));

        if ("Đã hoàn thành".equals(lh.getTrangThai()) || "Đã hủy".equals(lh.getTrangThai())) {
            throw new RuntimeException("Không thể hủy lịch hẹn đã hoàn thành hoặc đã bị hủy trước đó!");
        }

        String username = SecurityUtils.getCurrentUsername();
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        if (tk == null) throw new RuntimeException("Không tìm thấy tài khoản!");

        ConNguoi nguoiThaoTac = conNguoiRepo.findById(tk.getMaDinhDanh())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông cá nhân của tài khoản này!"));
        String tenNguoiHuy = nguoiThaoTac.getTen();

        String role = tk.getVaiTro();
        String tenChucVu = "";

        if ("ROLE_USER".equals(role)) {
            tenChucVu = "Khách hàng";
            KhachHang kh = khachHangRepo.findByMaDinhDanh(tk.getMaDinhDanh()).get();
            if (!lh.getMaKH().equals(kh.getMaKH())) {
                throw new RuntimeException("Bạn không có quyền hủy lịch hẹn của người khác!");
            }

            LocalDateTime thoiGianHen = LocalDateTime.of(lh.getNgayHen(), lh.getGioHen());
            LocalDateTime thoiGianHienTai = LocalDateTime.now();

            Duration khoangCach = Duration.between(thoiGianHienTai, thoiGianHen);

            if (khoangCach.toHours() < 12) {
                throw new RuntimeException("Chỉ được hủy lịch hẹn trực tuyến trước 12 tiếng. Vui lòng liên hệ Hotline Lễ tân để được hỗ trợ!");
            }
        }
        else if ("ROLE_BACSI".equals(role)) {
            tenChucVu = "Bác sĩ";
            NhanVien nv = nhanVienRepo.findByMaDinhDanh(tk.getMaDinhDanh()).get();
            BacSi bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).get();
            if (lh.getMaBacSi() == null || !lh.getMaBacSi().equals(bs.getMaBacSi())) {
                throw new RuntimeException("Bạn chỉ được phép báo hủy các lịch hẹn do chính mình phụ trách!");
            }
        }
        else if ("ROLE_NHANVIEN".equals(role)) {
            tenChucVu = "Nhân viên";
        }
        else if ("ROLE_ADMIN".equals(role)) {
            tenChucVu = "Quản lý";
        }

        String ghiChuCuoiCung = String.format("[Hủy bởi: %s - %s] Lý do: %s",
                tenNguoiHuy, tenChucVu, request.getLyDo());

        lh.setTrangThai("Đã hủy");
        lh.setGhi_chu(ghiChuCuoiCung);

        lichHenRepo.save(lh);
        return "Đã hủy lịch hẹn thành công!";
    }

    public List<LichHenResponse> timKiemLichHen(String trangThai, LocalDate ngayHen, String maKH, String tenKH, String sdtKH, String maBacSi, String tenBacSi, String sdtBacSi) {
        String username = SecurityUtils.getCurrentUsername();
        TaiKhoan tk = taiKhoanRepo.findByTenDangNhap(username);
        String role = tk.getVaiTro();

        List<LichHen> listLichHen;

        if ("ROLE_USER".equals(role)) {
            KhachHang kh = khachHangRepo.findByMaDinhDanh(tk.getMaDinhDanh()).get();
            listLichHen = lichHenRepo.timKiemLichHen(trangThai, ngayHen, kh.getMaKH(), null, null, maBacSi, tenBacSi, sdtBacSi);
        } else if ("ROLE_BACSI".equals(role)) {
            NhanVien nv = nhanVienRepo.findByMaDinhDanh(tk.getMaDinhDanh()).get();
            BacSi bs = bacSiRepo.findByIdNhanVien(nv.getIdNhanVien()).get();
            listLichHen = lichHenRepo.timKiemLichHen(trangThai, ngayHen, maKH, tenKH, sdtKH, bs.getMaBacSi(), null, null);
        } else {
            listLichHen = lichHenRepo.timKiemLichHen(trangThai, ngayHen, maKH, tenKH, sdtKH, maBacSi, tenBacSi, sdtBacSi);
        }

        List<LichHenResponse> result = new ArrayList<>();
        for (LichHen lh : listLichHen) {
            LichHenResponse dto = new LichHenResponse();
            dto.setMaLichHen(lh.getMaLichHen());
            dto.setNgayHen(lh.getNgayHen());
            dto.setGioHen(lh.getGioHen());
            dto.setTrangThai(lh.getTrangThai());
            dto.setMaKH(lh.getMaKH());
            dto.setMaBacSi(lh.getMaBacSi());
            dto.setGhi_chu(lh.getGhi_chu());
            dto.setCreatedAt(lh.getCreatedAt());
            dto.setUpdatedAt(lh.getUpdatedAt());

            if (lh.getMaKH() != null) {
                khachHangRepo.findById(lh.getMaKH()).ifPresent(kh -> {
                    conNguoiRepo.findById(kh.getMaDinhDanh()).ifPresent(cn -> dto.setTenKH(cn.getTen()));
                });
            }

            if (lh.getMaBacSi() != null) {
                bacSiRepo.findById(lh.getMaBacSi()).ifPresent(bs -> {
                    nhanVienRepo.findById(bs.getIdNhanVien()).ifPresent(nv -> {
                        conNguoiRepo.findById(nv.getMaDinhDanh()).ifPresent(cn -> dto.setTenBacSi(cn.getTen()));
                    });
                });
            }

            result.add(dto);
        }

        return result;
    }
}