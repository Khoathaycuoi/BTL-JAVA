import { useState } from "react";
import { registerKhachHangAPI } from "../../api/Auth";
import { REGEX, MSG } from "../../utils/Validate";
import Logo from "../ui/Logo";
import Input from "../ui/Input";
import ErrorBox from "../ui/ErrorBox";
import Button from "../ui/Button";

const C = {
  bg: "#0B0F1A",
  surface: "#131929",
  border: "#1e2d45",
  accent: "#6366f1",
  text: "#E8F0FF",
  muted: "#607090",
  dim: "#3a4a65",
  success: "#22c55e",
  danger: "#ef4444",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  background: C.bg,
  border: `1px solid ${C.border}`,
  borderRadius: 8,
  padding: "10px 14px",
  color: C.text,
  fontSize: 13,
  outline: "none",
};

const labelStyle = {
  fontSize: 12,
  color: C.muted,
  display: "block",
  marginBottom: 6,
  fontWeight: 600,
};

function Field({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required,
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: C.danger }}> *</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
}

export default function RegisterPage({ onBack }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    maDinhDanh: "",
    ten: "",
    sdt: "",
    matKhau: "",
    xacNhanMatKhau: "",
    gioiTinh: "Nam",
    ngaySinh: "",
    diaChi: "",
    tienSuBenh: "",
  });

  const set = (field) => (val) => setForm((f) => ({ ...f, [field]: val }));

  const validate = () => {
    if (!form.maDinhDanh) return "Vui lòng nhập CCCD/Hộ chiếu";
    if (!REGEX.maDinhDanh.test(form.maDinhDanh)) return MSG.maDinhDanh;
    if (!form.ten) return "Vui lòng nhập họ tên";
    if (!form.sdt) return "Vui lòng nhập số điện thoại";
    if (!REGEX.sdt.test(form.sdt)) return MSG.sdt;
    if (!form.matKhau) return "Vui lòng nhập mật khẩu";
    if (!REGEX.matKhau.test(form.matKhau)) return MSG.matKhau;
    if (form.matKhau !== form.xacNhanMatKhau)
      return "Mật khẩu xác nhận không khớp";
    if (!form.ngaySinh) return "Vui lòng chọn ngày sinh";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    try {
      setLoading(true);
      const text = await registerKhachHangAPI({
        maDinhDanh: form.maDinhDanh,
        ten: form.ten,
        sdt: form.sdt,
        matKhau: form.matKhau,
        gioiTinh: form.gioiTinh,
        ngaySinh: form.ngaySinh,
        diaChi: form.diaChi,
        tienSuBenh: form.tienSuBenh,
      });
      setSuccess(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        padding: "20px 0",
      }}
    >
      <div style={{ width: "100%", maxWidth: 480, padding: "0 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 13,
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              margin: "0 auto 10px",
            }}
          >
            🦷
          </div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
            NhaKhoa Pro
          </div>
          <div style={{ fontSize: 12, color: C.muted, marginTop: 3 }}>
            Đăng ký tài khoản bệnh nhân
          </div>
        </div>

        <div
          style={{
            background: C.surface,
            borderRadius: 16,
            border: `1px solid ${C.border}`,
            padding: 28,
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: C.text,
              marginBottom: 20,
            }}
          >
            Tạo tài khoản mới
          </div>

          {success ? (
            <div
              style={{
                background: "rgba(34,197,94,0.1)",
                border: `1px solid ${C.success}40`,
                borderRadius: 8,
                padding: "14px",
                fontSize: 13,
                color: C.success,
                lineHeight: 1.6,
              }}
            >
              ✓ {success}
              <div style={{ marginTop: 12 }}>
                <button
                  onClick={onBack}
                  style={{
                    background: C.success,
                    color: "#000",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 18px",
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  Đăng nhập ngay →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "0 14px",
                }}
              >
                <div style={{ gridColumn: "1/-1" }}>
                  <Field
                    label="CCCD / Hộ chiếu"
                    placeholder="012345678901"
                    value={form.maDinhDanh}
                    onChange={set("maDinhDanh")}
                    required
                  />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <Field
                    label="Họ và tên"
                    placeholder="Nguyễn Văn A"
                    value={form.ten}
                    onChange={set("ten")}
                    required
                  />
                </div>
                <Field
                  label="Số điện thoại"
                  placeholder="0901234567"
                  value={form.sdt}
                  onChange={set("sdt")}
                  required
                />
                <Field
                  label="Ngày sinh"
                  type="date"
                  value={form.ngaySinh}
                  onChange={set("ngaySinh")}
                  required
                />
                <Field
                  label="Mật khẩu"
                  type="password"
                  placeholder="Tối thiểu 6 ký tự"
                  value={form.matKhau}
                  onChange={set("matKhau")}
                  required
                />
                <Field
                  label="Xác nhận mật khẩu"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  value={form.xacNhanMatKhau}
                  onChange={set("xacNhanMatKhau")}
                  required
                />

                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Giới tính</label>
                  <select
                    value={form.gioiTinh}
                    onChange={(e) => set("gioiTinh")(e.target.value)}
                    style={inputStyle}
                  >
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Địa chỉ</label>
                  <input
                    placeholder="123 Đường ABC, Quận 1"
                    value={form.diaChi}
                    onChange={(e) => set("diaChi")(e.target.value)}
                    style={inputStyle}
                  />
                </div>
                <div style={{ gridColumn: "1/-1", marginBottom: 14 }}>
                  <label style={labelStyle}>
                    Tiền sử bệnh{" "}
                    <span style={{ color: C.dim, fontWeight: 400 }}>
                      (không bắt buộc)
                    </span>
                  </label>
                  <textarea
                    placeholder="Dị ứng thuốc, bệnh nền..."
                    value={form.tienSuBenh}
                    onChange={(e) => set("tienSuBenh")(e.target.value)}
                    style={{ ...inputStyle, height: 72, resize: "vertical" }}
                  />
                </div>
              </div>

              {error && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: `1px solid ${C.danger}40`,
                    borderRadius: 8,
                    padding: "10px 14px",
                    fontSize: 13,
                    color: C.danger,
                    marginBottom: 14,
                  }}
                >
                  ⚠ {error}
                </div>
              )}

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={onBack}
                  style={{
                    flex: 1,
                    padding: 11,
                    borderRadius: 8,
                    background: "transparent",
                    border: `1px solid ${C.border}`,
                    color: C.muted,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  ← Đăng nhập
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    flex: 2,
                    padding: 11,
                    borderRadius: 8,
                    border: "none",
                    background: loading
                      ? "#2a3050"
                      : "linear-gradient(135deg,#6366f1,#818cf8)",
                    color: loading ? C.muted : "#fff",
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "Đang đăng ký..." : "Đăng ký →"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: 14,
            fontSize: 11,
            color: C.dim,
          }}
        >
          Tài khoản Bác sĩ / Nhân viên do Admin tạo trong hệ thống
        </div>
      </div>
    </div>
  );
}
