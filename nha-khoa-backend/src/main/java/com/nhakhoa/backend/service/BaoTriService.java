package com.nhakhoa.backend.service;

import com.nhakhoa.backend.dto.BaoTriRequest;
import com.nhakhoa.backend.dto.BaoTriResponse;
import com.nhakhoa.backend.dto.CapNhatBaoTriDTO;
import com.nhakhoa.backend.dto.ThietBiTrongBaoTriDTO;
import com.nhakhoa.backend.entity.BaoTri;
import com.nhakhoa.backend.entity.ThucHien;
import com.nhakhoa.backend.entity.TrangThietBi;
import com.nhakhoa.backend.exception.ResourceNotFoundException;
import com.nhakhoa.backend.repository.BaoTriRepository;
import com.nhakhoa.backend.repository.ThucHienRepository;
import com.nhakhoa.backend.repository.TrangThietBiRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
    
@Service
@RequiredArgsConstructor
public class BaoTriService {
    @Autowired
    private BaoTriRepository baoTriRepo;
    @Autowired
    private ThucHienRepository thucHienRepo;
    @Autowired
    private TrangThietBiRepository trangThietBiRepo;

    //tạo phiếu bảo trì
    @Transactional
    public BaoTriResponse taoPhieuBaoTri(BaoTriRequest request) {
        //tự tạo mã bảo trì
        String maBaoTri = generateMaBaoTri();
        BaoTri baoTri = new BaoTri();
        baoTri.setMaBaoTri(maBaoTri);
        baoTri.setChiPhi(request.getChiPhi());
        baoTri.setNgayBaoTri(request.getNgayBaoTri());
        baoTri.setNoiDungBaoTri(request.getNoiDungBaoTri());
        baoTri = baoTriRepo.save(baoTri);

        //lưu danh sách thiết bị
        if (request.getDanhSachMaThietBi() != null && !request.getDanhSachMaThietBi().isEmpty()) {
            List<TrangThietBi> thietBiList = trangThietBiRepo.findAllById(request.getDanhSachMaThietBi());
            if (thietBiList.size() != request.getDanhSachMaThietBi().size()) {
                throw new ResourceNotFoundException("Một hoặc nhiều thiết bị không tồn tại");
            }
            final String maBaoTriFinal = baoTri.getMaBaoTri();
            List<ThucHien> thucHienList = request.getDanhSachMaThietBi().stream()
                    .map(maThietBi -> {
                        ThucHien th = new ThucHien();
                        th.setMaBaoTri(maBaoTriFinal);
                        th.setMaThietBi(maThietBi);
                        return th;
                    }).collect(Collectors.toList());
            thucHienRepo.saveAll(thucHienList);
        }
        return convertToDTO(baoTri, request.getDanhSachMaThietBi());
    }

    //lấy tất cả phiếu bảo trì
    public List<BaoTriResponse> layDanhSachTatCa() {
        List<BaoTri> baoTriList = baoTriRepo.findAll();
        return baoTriList.stream()
                .map(bt -> {
                    List<String> maThietBiList = thucHienRepo.findByMaBaoTri(bt.getMaBaoTri())
                            .stream().map(ThucHien::getMaThietBi).collect(Collectors.toList());
                    return convertToDTO(bt, maThietBiList);
                }).collect(Collectors.toList());
    }

    //lấy chi tiết 1 phiếu bảo trì
    public BaoTriResponse layChiTiet(String maBaoTri) {
        BaoTri baoTri = baoTriRepo.findById(maBaoTri)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu bảo trì với mã: " + maBaoTri));
        List<String> maThietBiList = thucHienRepo.findByMaBaoTri(maBaoTri)
                .stream().map(ThucHien::getMaThietBi).collect(Collectors.toList());
        return convertToDTO(baoTri, maThietBiList);
    }

    //cập nhật phiếu bảo trì
    @Transactional
    public BaoTriResponse capNhatPhieuBaoTri(String maBaoTri, CapNhatBaoTriDTO updateDTO) {
        BaoTri baoTri = baoTriRepo.findById(maBaoTri)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phiếu bảo trì với mã: " + maBaoTri));

        if (updateDTO.getChiPhi() != null) {
            baoTri.setChiPhi(updateDTO.getChiPhi());
        }
        if (updateDTO.getNgayBaoTri() != null) {
            baoTri.setNgayBaoTri(updateDTO.getNgayBaoTri());
        }
        if (updateDTO.getNoiDungBaoTri() != null) {
            baoTri.setNoiDungBaoTri(updateDTO.getNoiDungBaoTri());
        }
        baoTri = baoTriRepo.save(baoTri);

        // Nếu client có gửi danh sách thiết bị → xử lý
        if (updateDTO.getDanhSachMaThietBi() != null) {
            // Xóa hết thiết bị cũ
            thucHienRepo.deleteByMaBaoTri(maBaoTri);
            // Nếu danh sách mới không rỗng
            if (!updateDTO.getDanhSachMaThietBi().isEmpty()) {
                //Check thiết bị có tồn tại không
                List<TrangThietBi> thietBiList = trangThietBiRepo.findAllById(updateDTO.getDanhSachMaThietBi());
                if (thietBiList.size() != updateDTO.getDanhSachMaThietBi().size()) {
                    throw new ResourceNotFoundException("Một hoặc nhiều thiết bị không tồn tại");
                }
                //Tạo lại danh sách liên kết (ThucHien)
                final String maBaoTriFinal = maBaoTri;
                List<ThucHien> thucHienList = updateDTO.getDanhSachMaThietBi().stream()
                        .map(maTB -> {
                            ThucHien th = new ThucHien();
                            th.setMaBaoTri(maBaoTriFinal);
                            th.setMaThietBi(maTB);
                            return th;
                        }).collect(Collectors.toList());
                thucHienRepo.saveAll(thucHienList);
            }
        }
        //Lấy danh sách thiết bị cuối cùng
        List<String> finalMaThietBiList = thucHienRepo.findByMaBaoTri(maBaoTri)
                .stream().map(ThucHien::getMaThietBi).collect(Collectors.toList());
        return convertToDTO(baoTri, finalMaThietBiList);
    }

    //Tạo mã bảo trì
    private String generateMaBaoTri() {
        return "BT" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private BaoTriResponse convertToDTO(BaoTri baoTri, List<String> maThietBiList) {
        BaoTriResponse dto = new BaoTriResponse();
        dto.setMaBaoTri(baoTri.getMaBaoTri());
        dto.setChiPhi(baoTri.getChiPhi());
        dto.setNgayBaoTri(baoTri.getNgayBaoTri());
        dto.setNoiDungBaoTri(baoTri.getNoiDungBaoTri());
        dto.setCreatedAt(baoTri.getCreatedAt());
        dto.setUpdatedAt(baoTri.getUpdatedAt());

        if (maThietBiList != null && !maThietBiList.isEmpty()) {
            List<TrangThietBi> thietBiList = trangThietBiRepo.findAllById(maThietBiList);
            List<ThietBiTrongBaoTriDTO> thietBiDTOs = thietBiList.stream().map(tb -> {
                ThietBiTrongBaoTriDTO tbDTO = new ThietBiTrongBaoTriDTO();
                tbDTO.setMaThietBi(tb.getMaThietBi());
                tbDTO.setTenThietBi(tb.getTenThietBi());
                tbDTO.setLoaiThietBi(tb.getLoaiThietBi());
                return tbDTO;
            }).collect(Collectors.toList());
            dto.setDanhSachThietBi(thietBiDTOs);
        }
        return dto;
    }
}