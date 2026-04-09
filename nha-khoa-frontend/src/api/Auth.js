const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/auth`
  : "http://localhost:8080/api/auth";

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export function parseRole(token) {
  const payload = decodeToken(token);
  if (!payload) return null;
  const role = payload.role || payload.roles || payload.authorities || "";
  if (role.includes("ROLE_BACSI")) return "bacsi";
  if (role.includes("ROLE_NHANVIEN")) return "letan";
  if (role.includes("ROLE_ADMIN")) return "admin";
  if (role.includes("ROLE_USER")) return "benhnhan";
  return null;
}

export function isTokenExpired(token) {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) return true;
  return Date.now() >= payload.exp * 1000;
}

export const TokenStorage = {
  save: (token) => localStorage.setItem("nhakhoa_token", token),
  get: () => localStorage.getItem("nhakhoa_token"),
  clear: () => localStorage.removeItem("nhakhoa_token"),
};

async function authFetch(url, options = {}) {
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
  return text;
}

export async function loginAPI(username, password) {
  const token = await authFetch(`${BASE_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  TokenStorage.save(token);
  return token;
}

export function logoutAPI() {
  TokenStorage.clear();
}

export async function registerKhachHangAPI(data) {
  return authFetch(`${BASE_URL}/register/khach-hang`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerNhanVienAPI(data) {
  return authFetch(`${BASE_URL}/register/nhan-vien`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function registerBacSiAPI(data) {
  return authFetch(`${BASE_URL}/register/bac-si`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}
