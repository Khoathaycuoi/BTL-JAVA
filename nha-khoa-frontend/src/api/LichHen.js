import { TokenStorage } from "./Auth";

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/lich-hen`
  : "http://localhost:8080/api/lich-hen";

async function lichHenFetch(url, options = {}) {
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

function buildUrl(path, params = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== "") url.searchParams.set(k, v);
  });
  return url.toString();
}

export const getAllLichHenAPI = () => lichHenFetch(`${BASE_URL}/all`);

export const timKiemLichHenAPI = (params = {}) =>
  lichHenFetch(buildUrl("/tim-kiem", params));

export const datLichHenAPI = (data) =>
  lichHenFetch(`${BASE_URL}/dat-lich`, {
    method: "POST",
    body: JSON.stringify({
      ...data,

      ngayHen: data.ngayHen,
      gioHen: data.gioHen,
    }),
  });

export const getCaTrongAPI = ({ maBacSi, ngay }) =>
  lichHenFetch(buildUrl("/ca-trong", { maBacSi, ngay }));

export const xacNhanLichHenAPI = (maLichHen) =>
  lichHenFetch(`${BASE_URL}/xac-nhan/${maLichHen}`, { method: "PUT" });

export const hoanThanhLichHenAPI = (maLichHen) =>
  lichHenFetch(`${BASE_URL}/hoan-thanh/${maLichHen}`, { method: "PUT" });

export const huyLichHenAPI = (data) =>
  lichHenFetch(`${BASE_URL}/huy-lich`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
