package com.nhakhoa.backend.controller;

import com.nhakhoa.backend.dto.ApiResponse;
import com.nhakhoa.backend.dto.BaoTriRequest;
import com.nhakhoa.backend.dto.BaoTriResponse;
import com.nhakhoa.backend.dto.CapNhatBaoTriDTO;
import com.nhakhoa.backend.service.BaoTriService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class BaoTriController {

    @Autowired
    private BaoTriService baoTriService;

    //Tạo phiếu bảo trì mới
    @PreAuthorize("hasAnyRole('ADMIN','BACSI','NHANVIEN')")
    @PostMapping
    public ResponseEntity<ApiResponse<BaoTriResponse>> taoPhieuBaoTri(@RequestBody BaoTriRequest request) {
        BaoTriResponse data = baoTriService.taoPhieuBaoTri(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new ApiResponse<>("Tạo phiếu bảo trì thành công", data));
    }

    //Lấy danh sách tất cả các lần bảo trì
    @PreAuthorize("hasAnyRole('ADMIN','BACSI','NHANVIEN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<BaoTriResponse>>> layDanhSachTatCa() {
        List<BaoTriResponse> data = baoTriService.layDanhSachTatCa();
        return ResponseEntity.ok(new ApiResponse<>("Lấy danh sách phiếu bảo trì thành công", data));
    }

    //Lấy danh sách tất cả các lần bảo trì theo mã bảo trì
    @PreAuthorize("hasAnyRole('ADMIN','BACSI','NHANVIEN')")
    @GetMapping("/{maBaoTri}")
    public ResponseEntity<ApiResponse<BaoTriResponse>> layChiTiet(@PathVariable String maBaoTri) {
        BaoTriResponse data = baoTriService.layChiTiet(maBaoTri);
        return ResponseEntity.ok(new ApiResponse<>("Lấy chi tiết phiếu bảo trì thành công", data));
    }

    //Cập nhật thông tin phiếu bảo trì
    @PreAuthorize("hasAnyRole('ADMIN','BACSI','NHANVIEN')")
    @PutMapping("/{maBaoTri}")
    public ResponseEntity<ApiResponse<BaoTriResponse>> capNhatPhieuBaoTri(@PathVariable String maBaoTri, @RequestBody CapNhatBaoTriDTO updateDTO) {
        BaoTriResponse data = baoTriService.capNhatPhieuBaoTri(maBaoTri, updateDTO);
        return ResponseEntity.ok(new ApiResponse<>("Cập nhật phiếu bảo trì thành công", data));
    }
}