import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Logo from "../ui/Logo";
import Input from "../ui/Input";
import ErrorBox from "../ui/ErrorBox";
import Button from "../ui/Button";
import ThemeToggle from "../ui/ThemeToggle";
import RoleBadges from "./RoleBadges";

export default function LoginPage({ onLogin, onRegister, error, loading }) {
  const { theme } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const togglePassBtn = (
    <button
      type="button"
      onClick={() => setShowPass(!showPass)}
      style={{
        background: "none",
        border: "none",
        color: theme.textMuted,
        cursor: "pointer",
        fontSize: 14,
      }}
    >
      {showPass ? "🙈" : "👁"}
    </button>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: theme.bg,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        transition: "background .3s",
      }}
    >
      <div style={{ position: "fixed", top: 16, right: 16 }}>
        <ThemeToggle />
      </div>

      <div style={{ width: "100%", maxWidth: 400, padding: "0 20px" }}>
        <Logo />

        <div
          style={{
            background: theme.surface,
            borderRadius: 16,
            border: `1px solid ${theme.border}`,
            padding: 28,
            boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            transition: "background .3s, border .3s",
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: theme.text,
              marginBottom: 20,
            }}
          >
            Đăng nhập
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (username && password) onLogin(username.trim(), password);
            }}
          >
            <Input
              label="Tên đăng nhập (SĐT)"
              placeholder="Nhập số điện thoại"
              value={username}
              onChange={setUsername}
            />
            <Input
              label="Mật khẩu"
              type={showPass ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={setPassword}
              rightSlot={togglePassBtn}
            />

            <ErrorBox message={error} />

            <Button
              loading={loading}
              loadingText="Đang đăng nhập..."
              style={{ marginBottom: 12 }}
            >
              Đăng nhập →
            </Button>

            <div
              style={{
                textAlign: "center",
                fontSize: 13,
                color: theme.textMuted,
              }}
            >
              Chưa có tài khoản?{" "}
              <span
                onClick={onRegister}
                style={{
                  color: theme.accent,
                  fontWeight: 600,
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Đăng ký ngay
              </span>
            </div>
          </form>
        </div>

        <RoleBadges />
      </div>
    </div>
  );
}
