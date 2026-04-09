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
  if (!res.ok) throw new Error(text.replace("Lỗi: ", ""));
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

const BASE = import.meta.env.VITE_API_URL || "http://localhost:8080";

export const taoHoSoKhamAPI = (data) =>
  apiFetch(`${BASE}/medical-records`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getLichSuKhamAPI = (maKH) =>
  apiFetch(`${BASE}/medical-records/history/${maKH}`);


export const taoDonThuocAPI = (data) =>
  apiFetch(`${BASE}/prescriptions/create-donthuoc`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getDonThuocChiTietAPI = (maDonThuoc) =>
  apiFetch(`${BASE}/prescriptions/${maDonThuoc}`);


export const taoBaoTriAPI = (data) =>
  apiFetch(`${BASE}/maintenance`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAllBaoTriAPI = () => apiFetch(`${BASE}/maintenance`);

export const getBaoTriChiTietAPI = (maBaoTri) =>
  apiFetch(`${BASE}/maintenance/${maBaoTri}`);

export const capNhatBaoTriAPI = (maBaoTri, data) =>
  apiFetch(`${BASE}/maintenance/${maBaoTri}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
