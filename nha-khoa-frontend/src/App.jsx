import { useState, useEffect } from "react";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import AdminDashboard from "./components/roles/Role_Admin";
import BacSiDashboard from "./components/roles/Role_BacSi";
import LeTanDashboard from "./components/roles/Role_LeTan";
import BenhNhanPortal from "./components/roles/Role_BenhNhan";
import {
  loginAPI,
  logoutAPI,
  parseRole,
  decodeToken,
  isTokenExpired,
  TokenStorage,
} from "./api/Auth";
import { getMyInfoAPI } from "./api/User";

const ROLE_MAP = {
  admin: AdminDashboard,
  bacsi: BacSiDashboard,
  letan: LeTanDashboard,
  benhnhan: BenhNhanPortal,
};

function restoreSession() {
  const token = TokenStorage.get();
  if (!token) return null;
  if (isTokenExpired(token)) {
    TokenStorage.clear();
    return null;
  }
  const payload = decodeToken(token);
  const role = parseRole(token);
  if (!role) return null;
  return { role, username: payload.sub, name: payload.sub, id: null, token };
}

export default function App() {
  const [session, setSession] = useState(() => restoreSession());
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState("login");

  useEffect(() => {
    if (!session) return;
    getMyInfoAPI()
      .then((info) => {
        setSession((prev) => ({
          ...prev,
          name: info.ten,
          id: info.id,
          sdt: info.sdt,
          gioiTinh: info.gioiTinh,
        }));
      })
      .catch(() => {
        handleLogout();
      });
  }, [session?.token]);

  useEffect(() => {
    if (!session?.token) return;
    const payload = decodeToken(session.token);
    if (!payload?.exp) return;
    const msLeft = payload.exp * 1000 - Date.now();
    if (msLeft <= 0) {
      handleLogout();
      return;
    }
    const timer = setTimeout(handleLogout, msLeft);
    return () => clearTimeout(timer);
  }, [session?.token]);

  const handleLogin = async (username, password) => {
    try {
      setLoginError("");
      setLoading(true);
      const token = await loginAPI(username, password);
      const payload = decodeToken(token);
      const role = parseRole(token);
      if (!role) throw new Error("Không xác định được vai trò trong token.");
      setSession({
        role,
        username: payload.sub,
        name: payload.sub,
        id: null,
        token,
      });
    } catch (err) {
      setLoginError(
        err.message === "Failed to fetch"
          ? "Không kết nối được server. Kiểm tra backend đang chạy tại localhost:8080"
          : err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAPI();
    setSession(null);
    setLoginError("");
    setPage("login");
  };

  if (!session) {
    if (page === "register") {
      return <RegisterPage onBack={() => setPage("login")} />;
    }
    return (
      <LoginPage
        onLogin={handleLogin}
        onRegister={() => setPage("register")}
        error={loginError}
        loading={loading}
      />
    );
  }

  const RoleComponent = ROLE_MAP[session.role];
  if (!RoleComponent) return <div>Role không hợp lệ: {session.role}</div>;
  return <RoleComponent onLogout={handleLogout} user={session} />;
}
