import { TokenStorage } from "./Auth";

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/users`
  : "http://localhost:8080/api/Users";

function withKeyword(url, keyword) {
  if (keyword == null || String(keyword).trim() === "") return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}keyword=${encodeURIComponent(String(keyword).trim())}`;
}

async function userFetch(url, options = {}) {
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
    const raw = (text || "").trim();
    const msg = raw || `HTTP ${res.status}`;
    throw new Error(msg.replace(/^Lỗi:\s*/i, ""));
  }
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export const getMyInfoAPI = () => userFetch(`${BASE_URL}/me`);
export const getAllBacSiAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/bac-si`, keyword));
export const getAllNhanVienAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/nhan-vien`, keyword));
export const getAllKhachHangAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/khach-hang`, keyword));

export const getUserByIdAPI = (id) =>
  userFetch(`${BASE_URL}/detail/${encodeURIComponent(id)}`);

export const getBacSiHoatDongAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/bac-si/hoat-dong`, keyword));
export const getBacSiKhongHoatDongAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/bac-si/khong-hoat-dong`, keyword));

export const getNhanVienHoatDongAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/nhan-vien/hoat-dong`, keyword));
export const getNhanVienKhongHoatDongAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/nhan-vien/khong-hoat-dong`, keyword));

export const getKhachHangHoatDongAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/khach-hang/hoat-dong`, keyword));
export const getKhachHangKhongHoatDongAPI = (keyword) =>
  userFetch(withKeyword(`${BASE_URL}/khach-hang/khong-hoat-dong`, keyword));

export const updateMyInfoAPI = (data) =>
  userFetch(`${BASE_URL}/me`, { method: "PUT", body: JSON.stringify(data) });

export const changePasswordAPI = (data) =>
  userFetch(`${BASE_URL}/me/password`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const xoaTaiKhoanAPI = (username) =>
  userFetch(`${BASE_URL}/${username}/xoa`, { method: "PUT" });

export const khoiPhucTaiKhoanAPI = (username) =>
  userFetch(`${BASE_URL}/${username}/khoi-phuc`, { method: "PUT" });
