import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import ConfirmDialog from "../ui/ConfirmDialog";
import {
  getMyInfoAPI,
  updateMyInfoAPI,
  changePasswordAPI,
} from "../../api/User";
import { REGEX, MSG } from "../../utils/Validate";

const ROLE_LABEL = {
  ROLE_ADMIN: { label: "Quản trị viên", color: "#6366f1" },
  ROLE_BACSI: { label: "Bác sĩ", color: "#0ea5e9" },
  ROLE_NHANVIEN: { label: "Lễ tân / NV", color: "#10b981" },
  ROLE_USER: { label: "Bệnh nhân", color: "#f59e0b" },
};

const getAvatarLetter = (name) => {
  const normalized = (name || "").trim();
  if (!normalized) return "?";
  const parts = normalized.split(/\s+/);
  return parts[parts.length - 1].charAt(0).toUpperCase();
};

// ─── Đổi mật khẩu ────────────────────────────────────────
function ChangePasswordModal({ onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const set = (f) => (v) => setForm((p) => ({ ...p, [f]: v }));

  const validate = () => {
    if (!form.oldPassword) return "Vui lòng nhập mật khẩu cũ";
    if (!REGEX.matKhau.test(form.newPassword)) return MSG.matKhau;
    if (form.newPassword !== form.confirmPassword)
      return "Mật khẩu xác nhận không khớp";
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setConfirm(true); // Mở popup xác nhận
  };

  const handleConfirmed = async () => {
    setConfirm(false);
    try {
      setLoading(true);
      setError("");
      await changePasswordAPI({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      onSuccess("Đổi mật khẩu thành công!");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const btn = (v = "primary") => ({
    padding: "9px 18px",
    borderRadius: 8,
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: 13,
    fontWeight: 600,
    opacity: loading ? 0.6 : 1,
    background: v === "primary" ? C.accent : "transparent",
    color: v === "primary" ? "#fff" : C.textMuted,
    border: v !== "primary" ? `1px solid ${C.border}` : "none",
  });

  return (
    <>
      <Modal title="🔑 Đổi mật khẩu" onClose={onClose} width={420}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <FormField
            label="Mật khẩu hiện tại"
            type="password"
            placeholder="Nhập mật khẩu cũ"
            value={form.oldPassword}
            onChange={set("oldPassword")}
            required
          />
          <FormField
            label="Mật khẩu mới"
            type="password"
            placeholder="8+ ký tự, có chữ và số"
            value={form.newPassword}
            onChange={set("newPassword")}
            required
          />
          <FormField
            label="Xác nhận mật khẩu mới"
            type="password"
            placeholder="Nhập lại mật khẩu mới"
            value={form.confirmPassword}
            onChange={set("confirmPassword")}
            required
          />
        </div>
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#ef4444",
              marginTop: 14,
            }}
          >
            ⚠ {error}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <button style={btn("ghost")} onClick={onClose}>
            Hủy
          </button>
          <button style={btn()} onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "🔑 Đổi mật khẩu"}
          </button>
        </div>
      </Modal>

      {confirm && (
        <ConfirmDialog
          title="Xác nhận đổi mật khẩu"
          message="Bạn có chắc muốn đổi mật khẩu? Sau khi đổi, hãy dùng mật khẩu mới để đăng nhập."
          confirmLabel="Xác nhận đổi"
          type="warning"
          onConfirm={handleConfirmed}
          onCancel={() => setConfirm(false)}
        />
      )}
    </>
  );
}

// ─── Chỉnh sửa thông tin ─────────────────────────────────
function EditInfoModal({ info, onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const isBacSi = info?.role === "ROLE_BACSI";
  const isBenhNhan = info?.role === "ROLE_USER";

  const [form, setForm] = useState({
    ten: info?.ten || "",
    gioiTinh: info?.gioiTinh || "Nam",
    ngaySinh: info?.ngaySinh || "",
    diaChi: info?.diaChi || "",
    bangCap: info?.bangCap || "",
    chungChi: info?.chungChi || "",
    soNamKinhNghiem: info?.soNamKinhNghiem ?? "",
    tienSuBenh: info?.tienSuBenh || "",
  });
  const set = (f) => (v) => setForm((p) => ({ ...p, [f]: v }));

  const validate = () => {
    if (!form.ten) return "Vui lòng nhập họ tên";
    if (!form.ngaySinh) return "Vui lòng chọn ngày sinh";
    const yr = new Date(form.ngaySinh).getFullYear();
    if (yr < 1900 || yr >= 2026) return "Năm sinh phải từ 1900 đến 2025";
    if (isBacSi && !form.chungChi) return "Vui lòng nhập chứng chỉ hành nghề";
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setConfirm(true);
  };

  const handleConfirmed = async () => {
    setConfirm(false);
    try {
      setLoading(true);
      setError("");
      await updateMyInfoAPI({
        ten: form.ten,
        gioiTinh: form.gioiTinh,
        ngaySinh: form.ngaySinh,
        diaChi: form.diaChi,
        ...(isBacSi
          ? {
              bangCap: form.bangCap,
              chungChi: form.chungChi,
              soNamKinhNghiem: Number(form.soNamKinhNghiem) || 0,
            }
          : {}),
        ...(isBenhNhan ? { tienSuBenh: form.tienSuBenh } : {}),
      });
      onSuccess("Cập nhật thông tin thành công!");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const btn = (v = "primary") => ({
    padding: "9px 18px",
    borderRadius: 8,
    cursor: loading ? "not-allowed" : "pointer",
    fontSize: 13,
    fontWeight: 600,
    opacity: loading ? 0.6 : 1,
    background: v === "primary" ? C.accent : "transparent",
    color: v === "primary" ? "#fff" : C.textMuted,
    border: v !== "primary" ? `1px solid ${C.border}` : "none",
  });

  return (
    <>
      <Modal title="✏️ Chỉnh sửa thông tin" onClose={onClose} width={520}>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <FormField
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={form.ten}
            onChange={set("ten")}
            required
            span={2}
          />
          <FormField
            label="Giới tính"
            value={form.gioiTinh}
            onChange={set("gioiTinh")}
            options={["Nam", "Nữ", "Khác"]}
          />
          <FormField
            label="Ngày sinh"
            type="date"
            value={form.ngaySinh}
            onChange={set("ngaySinh")}
            required
          />
          <FormField
            label="Địa chỉ"
            placeholder="123 Đường ABC, Quận 1"
            value={form.diaChi}
            onChange={set("diaChi")}
            span={2}
          />
          {isBacSi && (
            <>
              <div
                style={{
                  gridColumn: "1/-1",
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 14,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.textMuted,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Thông tin chuyên môn
                </div>
              </div>
              <FormField
                label="Chứng chỉ hành nghề"
                placeholder="BS Nha khoa, Thạc sĩ..."
                value={form.chungChi}
                onChange={set("chungChi")}
                required
              />
              <FormField
                label="Bằng cấp"
                placeholder="Đại học Y Dược TP.HCM"
                value={form.bangCap}
                onChange={set("bangCap")}
              />
              <FormField
                label="Năm kinh nghiệm"
                type="number"
                placeholder="5"
                value={form.soNamKinhNghiem}
                onChange={set("soNamKinhNghiem")}
              />
            </>
          )}
          {isBenhNhan && (
            <>
              <div
                style={{
                  gridColumn: "1/-1",
                  borderTop: `1px solid ${C.border}`,
                  paddingTop: 14,
                  marginTop: 4,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: C.textMuted,
                    letterSpacing: 0.5,
                    textTransform: "uppercase",
                    marginBottom: 12,
                  }}
                >
                  Thông tin sức khoẻ
                </div>
              </div>
              <FormField
                label="Tiền sử bệnh"
                type="textarea"
                placeholder="Dị ứng thuốc, bệnh nền..."
                value={form.tienSuBenh}
                onChange={set("tienSuBenh")}
                span={2}
              />
            </>
          )}
        </div>
        {error && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 8,
              padding: "10px 14px",
              fontSize: 13,
              color: "#ef4444",
              marginTop: 14,
            }}
          >
            ⚠ {error}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 10,
            justifyContent: "flex-end",
            marginTop: 20,
          }}
        >
          <button style={btn("ghost")} onClick={onClose}>
            Hủy
          </button>
          <button style={btn()} onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang lưu..." : "✓ Lưu thay đổi"}
          </button>
        </div>
      </Modal>

      {confirm && (
        <ConfirmDialog
          title="Xác nhận cập nhật"
          message="Bạn có chắc muốn lưu thay đổi thông tin cá nhân?"
          confirmLabel="Lưu thay đổi"
          type="info"
          onConfirm={handleConfirmed}
          onCancel={() => setConfirm(false)}
        />
      )}
    </>
  );
}

// ─── Main ProfilePage ─────────────────────────────────────
export default function ProfilePage({ onLogout }) {
  const { theme: C } = useTheme();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const loadInfo = () => {
    setLoading(true);
    getMyInfoAPI()
      .then(setInfo)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInfo();
  }, []);

  const roleInfo = ROLE_LABEL[info?.role] || {
    label: info?.role || "N/A",
    color: C.accent,
  };
  const isBacSi = info?.role === "ROLE_BACSI";
  const isBenhNhan = info?.role === "ROLE_USER";

  const card = {
    background: C.surface,
    borderRadius: 12,
    border: `1px solid ${C.border}`,
    padding: 20,
  };
  const btn = (v = "primary") => ({
    padding: "8px 16px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 12,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background:
      v === "primary"
        ? C.accent
        : v === "danger"
          ? "rgba(239,68,68,0.1)"
          : "transparent",
    color: v === "primary" ? "#fff" : v === "danger" ? "#ef4444" : C.textMuted,
    border:
      v !== "primary"
        ? `1px solid ${v === "danger" ? "rgba(239,68,68,0.3)" : C.border}`
        : "none",
  });

  const infoRow = (label, value) =>
    value ? (
      <div
        key={label}
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 0",
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>
          {label}
        </span>
        <span
          style={{
            fontSize: 13,
            color: C.text,
            fontWeight: 500,
            maxWidth: "60%",
            textAlign: "right",
          }}
        >
          {value}
        </span>
      </div>
    ) : null;

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 12,
          color: C.textMuted,
        }}
      >
        <div style={{ fontSize: 32 }}>⏳</div>
        <div style={{ fontSize: 13 }}>Đang tải thông tin...</div>
      </div>
    );

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {/* Toast */}
      {toast.msg && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {toast.type === "error" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}

      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 4,
          color: C.text,
        }}
      >
        Hồ sơ của tôi
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
        Xem và cập nhật thông tin tài khoản
      </div>

      {/* Avatar + tên */}
      <div
        style={{
          ...card,
          display: "flex",
          alignItems: "center",
          gap: 20,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: `linear-gradient(135deg,${roleInfo.color},${roleInfo.color}88)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {getAvatarLetter(info?.ten)}
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: C.text,
              marginBottom: 4,
            }}
          >
            {info?.ten || "N/A"}
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "3px 10px",
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 600,
                background: roleInfo.color + "22",
                color: roleInfo.color,
              }}
            >
              {roleInfo.label}
            </span>
            <span style={{ fontSize: 12, color: C.textMuted }}>
              Mã: {info?.id || "N/A"}
            </span>
          </div>
        </div>
        <button style={btn()} onClick={() => setShowEdit(true)}>
          ✏️ Chỉnh sửa
        </button>
      </div>

      {/* Thông tin cá nhân */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginBottom: 12,
          }}
        >
          📋 Thông tin cá nhân
        </div>
        {infoRow("Họ và tên", info?.ten)}
        {infoRow("Số điện thoại", info?.sdt)}
        {infoRow("Giới tính", info?.gioiTinh)}
        {infoRow("Ngày sinh", info?.ngaySinh)}
        {infoRow("Địa chỉ", info?.diaChi)}
      </div>

      {/* Chuyên môn — Bác sĩ */}
      {isBacSi && (
        <div style={{ ...card, marginBottom: 16 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.text,
              marginBottom: 12,
            }}
          >
            🏥 Thông tin chuyên môn
          </div>
          {infoRow("Chứng chỉ hành nghề", info?.chungChi)}
          {infoRow("Bằng cấp", info?.bangCap)}
          {infoRow(
            "Năm kinh nghiệm",
            info?.soNamKinhNghiem != null
              ? `${info.soNamKinhNghiem} năm`
              : null,
          )}
        </div>
      )}

      {/* Sức khoẻ — Bệnh nhân */}
      {isBenhNhan && (
        <div style={{ ...card, marginBottom: 16 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.text,
              marginBottom: 12,
            }}
          >
            ⚕️ Thông tin sức khoẻ
          </div>
          {infoRow("Tiền sử bệnh", info?.tienSuBenh || "Không có")}
        </div>
      )}

      {/* Bảo mật */}
      <div style={{ ...card, marginBottom: 16 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginBottom: 12,
          }}
        >
          🔐 Bảo mật
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
              Mật khẩu
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              Thay đổi mật khẩu đăng nhập
            </div>
          </div>
          <button style={btn("ghost")} onClick={() => setShowPwd(true)}>
            🔑 Đổi mật khẩu
          </button>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 0",
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
              Tên đăng nhập
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              SĐT: {info?.sdt}
            </div>
          </div>
        </div>
      </div>

      {/* Đăng xuất */}
      <div style={card}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginBottom: 12,
          }}
        >
          ⚙️ Tài khoản
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>
              Đăng xuất
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              Thoát khỏi phiên đăng nhập hiện tại
            </div>
          </div>
          <button style={btn("danger")} onClick={() => setShowLogout(true)}>
            🚪 Đăng xuất
          </button>
        </div>
      </div>

      {/* Modals */}
      {showEdit && (
        <EditInfoModal
          info={info}
          onClose={() => setShowEdit(false)}
          onSuccess={(msg) => {
            setShowEdit(false);
            showToast(msg);
            loadInfo();
          }}
        />
      )}
      {showPwd && (
        <ChangePasswordModal
          onClose={() => setShowPwd(false)}
          onSuccess={(msg) => {
            setShowPwd(false);
            showToast(msg);
          }}
        />
      )}

      {/* Popup xác nhận đăng xuất */}
      {showLogout && (
        <ConfirmDialog
          title="Xác nhận đăng xuất"
          message="Bạn có chắc muốn đăng xuất khỏi hệ thống? Phiên làm việc hiện tại sẽ kết thúc."
          confirmLabel="Đăng xuất"
          type="danger"
          onConfirm={onLogout}
          onCancel={() => setShowLogout(false)}
        />
      )}
    </div>
  );
}
