import { TokenStorage } from "./auth";

async function apiFetch(url, options = {}) {
  const token = TokenStorage.get();
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    const err = new Error(text.replace("Lỗi: ", ""));
    err.status = res.status;
    err.url = url;
    throw err;
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const RAW_BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";
const BASE = RAW_BASE.replace(/\/+$/, "");
const API_BASE = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

// ══════════════════════════════════════════════════════════
// CHẤM CÔNG  /api/cham-cong
// ══════════════════════════════════════════════════════════

// POST /api/cham-cong/check-in  (NHANVIEN, BACSI)
export const checkInAPI = () =>
  apiFetch(`${API_BASE}/cham-cong/check-in`, { method: "POST" });

// PUT /api/cham-cong/check-out  (NHANVIEN, BACSI)
export const checkOutAPI = () =>
  apiFetch(`${API_BASE}/cham-cong/check-out`, { method: "PUT" });

// PUT /api/cham-cong/duyet/{maChamCong}  (ADMIN)
// Params: hỗ trợ cả BE cũ và mới
export const duyetChamCongAPI = (maChamCong, params) => {
  const url = new URL(
    `${API_BASE}/cham-cong/duyet/${maChamCong}`,
    window.location.origin,
  );
  const mappedParams = {
    // BE cũ
    trangThaiDuyet: params?.trangThaiDuyet,
    trangThaiDiLam: params?.trangThaiDiLam,
    soPhutTre: params?.soPhutTre,
    // BE mới
    trangThaiDuyetMoi: params?.trangThaiDuyet,
    trangThaiDiLamThucTe: params?.trangThaiDiLam,
    soPhutTreThucTe: params?.soPhutTre,
  };
  Object.entries(mappedParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return apiFetch(url.toString(), { method: "PUT" });
};

// GET /api/cham-cong/tat-ca  (ADMIN)
export const getDanhSachChamCongAPI = () =>
  apiFetch(`${API_BASE}/cham-cong/tat-ca`);

// GET /api/cham-cong/tim-kiem?tenNV=&ngay=&trangThaiDuyet=  (ADMIN)
export const searchChamCongAPI = ({
  tenNV,
  ngay,
  trangThaiDuyet,
} = {}) => {
  const url = new URL(`${API_BASE}/cham-cong/tim-kiem`, window.location.origin);
  if (tenNV) url.searchParams.set("tenNV", tenNV);
  if (ngay) url.searchParams.set("ngay", ngay);
  if (trangThaiDuyet) url.searchParams.set("trangThaiDuyet", trangThaiDuyet);
  return apiFetch(url.toString());
};

// GET lịch sử chấm công của tài khoản hiện tại
// Backend có thể đặt tên endpoint khác nhau, nên thử lần lượt.
export const getLichSuChamCongCaNhanAPI = async () => {
  const candidates = [
    `${API_BASE}/cham-cong/ca-nhan`,
    `${API_BASE}/cham-cong/lich-su`,
    `${API_BASE}/cham-cong/me`,
    `${API_BASE}/cham-cong/tat-ca`,
  ];

  let lastError = null;
  for (const url of candidates) {
    try {
      const data = await apiFetch(url);
      if (Array.isArray(data)) return data;
    } catch (e) {
      lastError = e;
      // 500+ là backend lỗi xử lý, không nên fallback endpoint để tránh spam log.
      if (e?.status >= 500) throw e;
      // Chỉ fallback khi endpoint không tồn tại/không hỗ trợ.
      if (e?.status !== 404 && e?.status !== 405) throw e;
    }
  }
  throw lastError || new Error("Không lấy được dữ liệu chấm công");
};

// ══════════════════════════════════════════════════════════
// HÓA ĐƠN  /api/invoices
// ══════════════════════════════════════════════════════════

// POST /api/invoices?maHoSo=...  (ADMIN, NHANVIEN)
export const taoHoaDonAPI = (maHoSo) =>
  apiFetch(`${API_BASE}/invoices?maHoSo=${encodeURIComponent(maHoSo)}`, {
    method: "POST",
  });

// GET /api/invoices/{id}
export const getHoaDonChiTietAPI = (id) =>
  apiFetch(`${API_BASE}/invoices/${id}`);

// PUT /api/invoices/{id}/pay  (ADMIN, NHANVIEN)
export const thanhToanHoaDonAPI = (id) =>
  apiFetch(`${API_BASE}/invoices/${id}/pay`, { method: "PUT" });

// GET /api/reports/revenue?startDate=...&endDate=...  (ADMIN)
export const getDoanhThuAPI = (startDate, endDate) =>
  apiFetch(
    `${API_BASE}/reports/revenue?startDate=${startDate}&endDate=${endDate}`,
  );
