import { TokenStorage } from "./Auth";

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

export const checkInAPI = () =>
  apiFetch(`${API_BASE}/cham-cong/check-in`, { method: "POST" });

export const checkOutAPI = () =>
  apiFetch(`${API_BASE}/cham-cong/check-out`, { method: "PUT" });

export const duyetChamCongAPI = (maChamCong, params) => {
  const url = new URL(
    `${API_BASE}/cham-cong/duyet/${maChamCong}`,
    window.location.origin,
  );
  const mappedParams = {
    trangThaiDuyet: params?.trangThaiDuyet,
    trangThaiDiLam: params?.trangThaiDiLam,
    soPhutTre: params?.soPhutTre,
    trangThaiDuyetMoi: params?.trangThaiDuyet,
    trangThaiDiLamThucTe: params?.trangThaiDiLam,
    soPhutTreThucTe: params?.soPhutTre,
  };
  Object.entries(mappedParams).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return apiFetch(url.toString(), { method: "PUT" });
};
export const getDanhSachChamCongAPI = () =>
  apiFetch(`${API_BASE}/cham-cong/tat-ca`);

export const searchChamCongAPI = ({ tenNV, ngay, trangThaiDuyet } = {}) => {
  const url = new URL(`${API_BASE}/cham-cong/tim-kiem`, window.location.origin);
  if (tenNV) url.searchParams.set("tenNV", tenNV);
  if (ngay) url.searchParams.set("ngay", ngay);
  if (trangThaiDuyet) url.searchParams.set("trangThaiDuyet", trangThaiDuyet);
  return apiFetch(url.toString());
};

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
      if (e?.status >= 500) throw e;
      if (e?.status !== 404 && e?.status !== 405) throw e;
    }
  }
  throw lastError || new Error("Không lấy được dữ liệu chấm công");
};

export const taoHoaDonAPI = (maHoSo) =>
  apiFetch(`${API_BASE}/invoices?maHoSo=${encodeURIComponent(maHoSo)}`, {
    method: "POST",
  });

export const getHoaDonChiTietAPI = (id) =>
  apiFetch(`${API_BASE}/invoices/${id}`);

export const thanhToanHoaDonAPI = (id) =>
  apiFetch(`${API_BASE}/invoices/${id}/pay`, { method: "PUT" });

export const getDoanhThuAPI = (startDate, endDate) =>
  apiFetch(
    `${API_BASE}/reports/revenue?startDate=${startDate}&endDate=${endDate}`,
  );
