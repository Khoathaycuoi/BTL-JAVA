import { useState, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import DataTable from "../ui/DataTable";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import { getAllBacSiAPI } from "../../api/User";
import UserDetailModal from "../shared/UserDetailModal";
import { registerBacSiAPI } from "../../api/Auth";
import { validateCommon, REGEX, MSG } from "../../utils/Validate";

function AddBacSiModal({ onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitErr, setSubmitErr] = useState("");
  const [form, setForm] = useState({
    maDinhDanh: "",
    ten: "",
    sdt: "",
    matKhau: "",
    gioiTinh: "Nam",
    ngaySinh: "",
    diaChi: "",
    chungChi: "",
    bangCap: "",
    namKinhNghiem: "",
  });
  const set = (f) => (v) => {
    setForm((prev) => ({ ...prev, [f]: v }));
    const err =
      f === "maDinhDanh" && v && !REGEX.maDinhDanh.test(v)
        ? MSG.maDinhDanh
        : f === "sdt" && v && !REGEX.sdt.test(v)
          ? MSG.sdt
          : f === "matKhau" && v && !REGEX.matKhau.test(v)
            ? MSG.matKhau
            : "";
    setErrors((prev) => ({ ...prev, [f]: err }));
  };

  const validate = () => {
    const common = validateCommon(form);
    if (common) return common;
    const yr = new Date(form.ngaySinh).getFullYear();
    if (yr < 1900 || yr >= 2026) return "Năm sinh phải từ 1900 đến 2025";
    if (!form.chungChi) return "Vui lòng nhập chứng chỉ hành nghề";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setSubmitErr(err);
      return;
    }
    try {
      setLoading(true);
      setSubmitErr("");
      await registerBacSiAPI({
        ...form,
        namKinhNghiem: Number(form.namKinhNghiem) || 0,
      });
      onSuccess("Thêm bác sĩ thành công!");
    } catch (e) {
      setSubmitErr(e.message);
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
  const fieldErr = (f) =>
    errors[f] ? (
      <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>
        ⚠ {errors[f]}
      </div>
    ) : null;

  return (
    <Modal title="➕ Thêm bác sĩ mới" onClose={onClose} width={560}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ gridColumn: "1/-1" }}>
          <FormField
            label="CCCD / Hộ chiếu"
            placeholder="012345678901 (12 số)"
            value={form.maDinhDanh}
            onChange={set("maDinhDanh")}
            required
          />
          {fieldErr("maDinhDanh")}
        </div>
        <div style={{ gridColumn: "1/-1" }}>
          <FormField
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            value={form.ten}
            onChange={set("ten")}
            required
          />
        </div>
        <div>
          <FormField
            label="Số điện thoại"
            placeholder="0901234567"
            value={form.sdt}
            onChange={set("sdt")}
            required
          />
          {fieldErr("sdt")}
        </div>
        <FormField
          label="Ngày sinh (1900–2025)"
          type="date"
          value={form.ngaySinh}
          onChange={set("ngaySinh")}
          required
        />
        <div>
          <FormField
            label="Mật khẩu"
            type="password"
            placeholder="8+ ký tự, có chữ và số"
            value={form.matKhau}
            onChange={set("matKhau")}
            required
          />
          {fieldErr("matKhau")}
        </div>
        <FormField
          label="Giới tính"
          value={form.gioiTinh}
          onChange={set("gioiTinh")}
          options={["Nam", "Nữ", "Khác"]}
        />
        <div style={{ gridColumn: "1/-1" }}>
          <FormField
            label="Địa chỉ"
            placeholder="123 Đường ABC"
            value={form.diaChi}
            onChange={set("diaChi")}
          />
        </div>
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
        <div>
          <FormField
            label="Chứng chỉ hành nghề"
            placeholder="BS Nha khoa, Thạc sĩ..."
            value={form.chungChi}
            onChange={set("chungChi")}
            required
          />
          {fieldErr("chungChi")}
        </div>
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
          value={form.namKinhNghiem}
          onChange={set("namKinhNghiem")}
        />
      </div>
      {submitErr && (
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
          ⚠ {submitErr}
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
          {loading ? "Đang lưu..." : "✓ Lưu bác sĩ"}
        </button>
      </div>
    </Modal>
  );
}

const ROLE_LABEL = { BAC_SI: "Bác sĩ" };

export default function BacSiPage({ S }) {
  const { theme: C } = useTheme();
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchBacSi = useCallback(() => getAllBacSiAPI(), []);
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const columns = [
    {
      key: "id",
      label: "Mã BS",
      render: (v) => (
        <span
          style={{ fontFamily: "monospace", fontSize: 11, color: C.textMuted }}
        >
          {v}
        </span>
      ),
    },
    {
      key: "ten",
      label: "Họ tên",
      render: (v) => (
        <span style={{ fontWeight: 600, color: C.text }}>BS. {v}</span>
      ),
    },
    {
      key: "sdt",
      label: "SĐT",
      render: (v) => <span style={{ color: C.textMuted }}>{v}</span>,
    },
    {
      key: "gioiTinh",
      label: "Giới tính",
      render: (v) => <span style={{ color: C.textMuted }}>{v}</span>,
    },
    {
      key: "role",
      label: "Vai trò",
      render: (v) => (
        <span
          style={{
            display: "inline-block",
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            background: "#0ea5e922",
            color: "#0ea5e9",
          }}
        >
          {ROLE_LABEL[v] || v || "—"}
        </span>
      ),
    },
    {
      key: "trangThai",
      label: "Trạng thái TK",
      render: (v) => (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            padding: "3px 10px",
            borderRadius: 20,
            fontSize: 11,
            fontWeight: 600,
            background:
              v === "Hoạt động"
                ? "rgba(34,197,94,0.12)"
                : "rgba(239,68,68,0.12)",
            color: v === "Hoạt động" ? "#22c55e" : "#ef4444",
          }}
        >
          {v || "—"}
        </span>
      ),
    },
  ];

  const actions = (row) => (
    <div style={{ display: "flex", gap: 6 }}>
      <button
        style={{ ...S.btn("ghost"), padding: "4px 8px", fontSize: 12 }}
        onClick={() => setSelected(row)}
      >
        👁
      </button>
      <button style={{ ...S.btn("ghost"), padding: "4px 8px", fontSize: 12 }}>
        ✏️
      </button>
      <button
        style={{
          ...S.btn("ghost"),
          padding: "4px 8px",
          fontSize: 12,
          color: "#ef4444",
        }}
      >
        🗑️
      </button>
    </div>
  );

  return (
    <div>
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
            background: "#22c55e",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          ✓ {toast}
        </div>
      )}
      <DataTable
        fetchFn={fetchBacSi}
        columns={columns}
        title="Danh sách Bác sĩ"
        subtitle="Quản lý thông tin bác sĩ"
        searchKeys={["ten", "id", "sdt"]}
        actions={actions}
        onAdd={() => setShowAdd(true)}
        addLabel="+ Thêm bác sĩ"
        refreshKey={refreshKey}
      />
      {showAdd && (
        <AddBacSiModal
          onClose={() => setShowAdd(false)}
          onSuccess={(msg) => {
            setShowAdd(false);
            showToast(msg);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
      {selected && (
        <UserDetailModal
          userId={String(selected.id)}
          titlePrefix="👨‍⚕️ Chi tiết"
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
