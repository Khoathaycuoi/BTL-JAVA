import { TokenStorage } from "./Auth";

const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/dichvu`
  : "http://localhost:8080/api/dichvu";

async function dvFetch(url, options = {}) {
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

export const getAllDichVuAPI = () => dvFetch(`${BASE_URL}/all`);

export const searchDichVuAPI = ({ ten, status, min, max } = {}) => {
  const url = new URL(`${BASE_URL}/search-all`, window.location.origin);
  // Backward compatible: support both old/new request keys.
  if (ten) {
    url.searchParams.set("ten", ten);
    url.searchParams.set("tenDichVu", ten);
  }
  if (status) {
    url.searchParams.set("status", status);
    url.searchParams.set("trangThai", status);
  }
  if (min != null) url.searchParams.set("min", min);
  if (max != null) url.searchParams.set("max", max);
  return dvFetch(url.toString());
};

export const addDichVuAPI = (data) =>
  dvFetch(`${BASE_URL}/add`, { method: "POST", body: JSON.stringify(data) });

export const updateDichVuAPI = (data) =>
  dvFetch(`${BASE_URL}/dv`, { method: "PUT", body: JSON.stringify(data) });

export const xoaDichVuAPI = (maDichVu) =>
  dvFetch(`${BASE_URL}/${maDichVu}/xoa`, { method: "PUT" });

export const khoiPhucDichVuAPI = (maDichVu) =>
  dvFetch(`${BASE_URL}/${maDichVu}/khoi-phuc`, { method: "PUT" });
