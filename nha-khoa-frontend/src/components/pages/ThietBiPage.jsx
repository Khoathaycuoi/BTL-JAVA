import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  getAllBaoTriAPI,
  getBaoTriChiTietAPI,
  taoBaoTriAPI,
  capNhatBaoTriAPI,
} from "../../api/Clinical";

const fmt = (v) => (v ? new Intl.NumberFormat("vi-VN").format(v) + "đ" : "—");

// ─── Modal tạo phiếu bảo trì ─────────────────────────────
function TaoBaoTriModal({ onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    chiPhi: "",
    ngayBaoTri: "",
    noiDungBaoTri: "",
    danhSachMaThietBi: "",
  });
  const set = (f) => (v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.ngayBaoTri) {
      setError("Vui lòng chọn ngày bảo trì");
      return;
    }
    if (!form.noiDungBaoTri) {
      setError("Vui lòng nhập nội dung bảo trì");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const dsThietBi = form.danhSachMaThietBi
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await taoBaoTriAPI({
        chiPhi: form.chiPhi ? Number(form.chiPhi) : null,
        ngayBaoTri: form.ngayBaoTri,
        noiDungBaoTri: form.noiDungBaoTri,
        danhSachMaThietBi: dsThietBi,
      });
      onSuccess("Tạo phiếu bảo trì thành công!");
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
    <Modal title="🔧 Tạo phiếu bảo trì" onClose={onClose} width={520}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField
          label="Ngày bảo trì"
          type="date"
          value={form.ngayBaoTri}
          onChange={set("ngayBaoTri")}
          required
        />
        <FormField
          label="Chi phí (VNĐ)"
          type="number"
          placeholder="500000"
          value={form.chiPhi}
          onChange={set("chiPhi")}
        />
        <FormField
          label="Nội dung bảo trì"
          type="textarea"
          placeholder="Mô tả công việc bảo trì..."
          value={form.noiDungBaoTri}
          onChange={set("noiDungBaoTri")}
          required
          span={2}
        />
        <FormField
          label="Danh sách mã thiết bị"
          placeholder="TB001, TB002, TB003 (cách nhau bởi dấu phẩy)"
          value={form.danhSachMaThietBi}
          onChange={set("danhSachMaThietBi")}
          span={2}
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
          {loading ? "Đang lưu..." : "✓ Tạo phiếu"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal chi tiết phiếu bảo trì ────────────────────────
function ChiTietBaoTriModal({ maBaoTri, onClose, onUpdated }) {
  const { theme: C } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editErr, setEditErr] = useState("");
  const [form, setForm] = useState({});

  useEffect(() => {
    getBaoTriChiTietAPI(maBaoTri)
      .then((d) => {
        setData(d?.data || d);
        setForm({
          chiPhi: d?.data?.chiPhi || d?.chiPhi || "",
          ngayBaoTri: d?.data?.ngayBaoTri || d?.ngayBaoTri || "",
          noiDungBaoTri: d?.data?.noiDungBaoTri || d?.noiDungBaoTri || "",
          danhSachMaThietBi: (
            d?.data?.danhSachThietBi ||
            d?.danhSachThietBi ||
            []
          )
            .map((t) => t.maThietBi)
            .join(", "),
        });
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [maBaoTri]);

  const set = (f) => (v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSave = async () => {
    if (!form.ngayBaoTri) {
      setEditErr("Vui lòng chọn ngày bảo trì");
      return;
    }
    if (!form.noiDungBaoTri) {
      setEditErr("Vui lòng nhập nội dung");
      return;
    }
    setSaving(true);
    setEditErr("");
    try {
      const dsThietBi = form.danhSachMaThietBi
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      await capNhatBaoTriAPI(maBaoTri, {
        chiPhi: form.chiPhi ? Number(form.chiPhi) : null,
        ngayBaoTri: form.ngayBaoTri,
        noiDungBaoTri: form.noiDungBaoTri,
        danhSachMaThietBi: dsThietBi,
      });
      setEditMode(false);
      onUpdated?.();
      onClose();
    } catch (e) {
      setEditErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  const d = data;
  const thietBiList = d?.danhSachThietBi || [];

  return (
    <Modal
      title={`🔧 Phiếu bảo trì: ${maBaoTri}`}
      onClose={onClose}
      width={560}
    >
      {loading && (
        <div
          style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}
        >
          ⏳ Đang tải...
        </div>
      )}
      {error && (
        <div style={{ fontSize: 13, color: "#ef4444", padding: "12px 0" }}>
          ⚠ {error}
        </div>
      )}

      {d && !editMode && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 14,
            }}
          >
            {[
              ["Mã bảo trì", d.maBaoTri],
              ["Ngày bảo trì", d.ngayBaoTri],
              ["Chi phí", fmt(d.chiPhi)],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  background: C.bg,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}
                >
                  {k}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {v || "—"}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: C.bg,
              padding: "10px 14px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
              marginBottom: 14,
            }}
          >
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
              Nội dung bảo trì
            </div>
            <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
              {d.noiDungBaoTri || "—"}
            </div>
          </div>

          {thietBiList.length > 0 && (
            <>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 10,
                }}
              >
                Thiết bị bảo trì ({thietBiList.length})
              </div>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 13,
                  marginBottom: 14,
                }}
              >
                <thead>
                  <tr>
                    {["Mã TB", "Tên thiết bị", "Loại"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 12px",
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.textMuted,
                          letterSpacing: 0.8,
                          textTransform: "uppercase",
                          borderBottom: `1px solid ${C.border}`,
                          textAlign: "left",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {thietBiList.map((tb, i) => (
                    <tr
                      key={tb.maThietBi || i}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.surfaceHover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td
                        style={{
                          padding: "9px 12px",
                          borderBottom: `1px solid ${C.border}`,
                          fontFamily: "monospace",
                          fontSize: 11,
                          color: C.textMuted,
                        }}
                      >
                        {tb.maThietBi}
                      </td>
                      <td
                        style={{
                          padding: "9px 12px",
                          borderBottom: `1px solid ${C.border}`,
                          fontWeight: 600,
                          color: C.text,
                        }}
                      >
                        {tb.tenThietBi}
                      </td>
                      <td
                        style={{
                          padding: "9px 12px",
                          borderBottom: `1px solid ${C.border}`,
                          color: C.textMuted,
                          fontSize: 12,
                        }}
                      >
                        {tb.loaiThietBi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button
              onClick={() => setEditMode(true)}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: C.accent,
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              ✏️ Chỉnh sửa
            </button>
            <button
              onClick={onClose}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: "transparent",
                color: C.textMuted,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Đóng
            </button>
          </div>
        </>
      )}

      {d && editMode && (
        <>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <FormField
              label="Ngày bảo trì"
              type="date"
              value={form.ngayBaoTri}
              onChange={set("ngayBaoTri")}
              required
            />
            <FormField
              label="Chi phí (VNĐ)"
              type="number"
              value={form.chiPhi}
              onChange={set("chiPhi")}
            />
            <FormField
              label="Nội dung bảo trì"
              type="textarea"
              value={form.noiDungBaoTri}
              onChange={set("noiDungBaoTri")}
              required
              span={2}
            />
            <FormField
              label="Mã thiết bị (cách nhau bởi dấu phẩy)"
              value={form.danhSachMaThietBi}
              onChange={set("danhSachMaThietBi")}
              span={2}
            />
          </div>
          {editErr && (
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
              ⚠ {editErr}
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 8,
              marginTop: 16,
            }}
          >
            <button
              onClick={() => {
                setEditMode(false);
                setEditErr("");
              }}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: "transparent",
                color: C.textMuted,
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                background: C.accent,
                color: "#fff",
                border: "none",
                cursor: saving ? "not-allowed" : "pointer",
                fontSize: 13,
                fontWeight: 600,
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? "Đang lưu..." : "✓ Lưu thay đổi"}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}

// ─── Main ThietBiPage ─────────────────────────────────────
export default function ThietBiPage({ S }) {
  const { theme: C } = useTheme();
  const [tab, setTab] = useState("thiet-bi"); // "thiet-bi" | "bao-tri"
  const [baoTriList, setBaoTriList] = useState([]);
  const [btLoading, setBtLoading] = useState(false);
  const [btError, setBtError] = useState("");
  const [showTaoBT, setShowTaoBT] = useState(false);
  const [selectedBT, setSelectedBT] = useState(null);
  const [toast, setToast] = useState("");
  const [refreshBT, setRefreshBT] = useState(0);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Load phiếu bảo trì khi tab bảo trì
  useEffect(() => {
    if (tab !== "bao-tri") return;
    setBtLoading(true);
    setBtError("");
    getAllBaoTriAPI()
      .then((res) => setBaoTriList(res?.data || res || []))
      .catch((e) => setBtError(e.message))
      .finally(() => setBtLoading(false));
  }, [tab, refreshBT]);

  // Mock thiết bị
  const mockThietBi = [
    {
      id: "TB001",
      ten: "Máy X-Quang Panoramic",
      loai: "Chẩn đoán hình ảnh",
      phong: "P.X-Quang",
      ngayMua: "2022-01-15",
      tinhTrang: "Tốt",
    },
    {
      id: "TB002",
      ten: "Ghế nha khoa điện",
      loai: "Thiết bị chính",
      phong: "P.101",
      ngayMua: "2021-06-20",
      tinhTrang: "Tốt",
    },
    {
      id: "TB003",
      ten: "Ghế nha khoa điện",
      loai: "Thiết bị chính",
      phong: "P.102",
      ngayMua: "2021-06-20",
      tinhTrang: "Tốt",
    },
    {
      id: "TB004",
      ten: "Máy khoan siêu tốc",
      loai: "Dụng cụ điều trị",
      phong: "P.101",
      ngayMua: "2023-03-10",
      tinhTrang: "Hư hỏng",
    },
    {
      id: "TB005",
      ten: "Đèn chiếu quang trùng hợp",
      loai: "Dụng cụ điều trị",
      phong: "P.103",
      ngayMua: "2022-09-05",
      tinhTrang: "Tốt",
    },
    {
      id: "TB006",
      ten: "Máy lấy cao răng",
      loai: "Dụng cụ điều trị",
      phong: "P.102",
      ngayMua: "2023-01-18",
      tinhTrang: "Bảo trì",
    },
  ];

  const stColor = (s) =>
    s === "Tốt" ? "#22c55e" : s === "Hư hỏng" ? "#ef4444" : "#f59e0b";

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

      {/* Header + Tab */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          {[
            { id: "thiet-bi", label: "⚙️ Thiết bị" },
            { id: "bao-tri", label: "🔧 Phiếu bảo trì" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                background: tab === t.id ? C.accent : C.surface,
                color: tab === t.id ? "#fff" : C.textMuted,
                border: tab !== t.id ? `1px solid ${C.border}` : "none",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {tab === "bao-tri" && (
          <button style={S.btn()} onClick={() => setShowTaoBT(true)}>
            + Tạo phiếu bảo trì
          </button>
        )}
      </div>

      {/* ── TAB THIẾT BỊ ── */}
      {tab === "thiet-bi" && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 16,
              marginBottom: 20,
            }}
          >
            {[
              {
                label: "Hoạt động tốt",
                value: mockThietBi.filter((d) => d.tinhTrang === "Tốt").length,
                color: "#22c55e",
              },
              {
                label: "Đang bảo trì",
                value: mockThietBi.filter((d) => d.tinhTrang === "Bảo trì")
                  .length,
                color: "#f59e0b",
              },
              {
                label: "Hư hỏng",
                value: mockThietBi.filter((d) => d.tinhTrang === "Hư hỏng")
                  .length,
                color: "#ef4444",
              },
            ].map((s) => (
              <div
                key={s.label}
                style={{ ...S.card, borderTop: `3px solid ${s.color}` }}
              >
                <div
                  style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}
                >
                  {s.label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>
                  {s.value}
                </div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {[
                    "Mã TB",
                    "Tên thiết bị",
                    "Loại",
                    "Phòng",
                    "Ngày mua",
                    "Tình trạng",
                    "",
                  ].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockThietBi.map((r) => (
                  <tr
                    key={r.id}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.surfaceHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        ...S.td,
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: C.textMuted,
                      }}
                    >
                      {r.id}
                    </td>
                    <td style={{ ...S.td, fontWeight: 700, color: C.text }}>
                      {r.ten}
                    </td>
                    <td style={{ ...S.td, fontSize: 12, color: C.textMuted }}>
                      {r.loai}
                    </td>
                    <td style={S.td}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 8px",
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 600,
                          background: C.accentSoft || C.bg,
                          color: C.accent,
                        }}
                      >
                        {r.phong}
                      </span>
                    </td>
                    <td style={{ ...S.td, color: C.textMuted }}>{r.ngayMua}</td>
                    <td style={S.td}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: stColor(r.tinhTrang) + "22",
                          color: stColor(r.tinhTrang),
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: stColor(r.tinhTrang),
                            display: "inline-block",
                          }}
                        />
                        {r.tinhTrang}
                      </span>
                    </td>
                    <td style={S.td}>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button
                          style={{
                            ...S.btn("ghost"),
                            padding: "4px 8px",
                            fontSize: 12,
                          }}
                        >
                          ✏️
                        </button>
                        {r.tinhTrang === "Hư hỏng" && (
                          <button
                            style={{
                              ...S.btn(),
                              padding: "4px 8px",
                              fontSize: 11,
                            }}
                            onClick={() => {
                              setTab("bao-tri");
                              setShowTaoBT(true);
                            }}
                          >
                            🔧
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ── TAB PHIẾU BẢO TRÌ ── */}
      {tab === "bao-tri" && (
        <div style={S.card}>
          {btLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: C.textMuted,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
              <div style={{ fontSize: 13 }}>Đang tải...</div>
            </div>
          )}
          {btError && (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 10 }}>
                ⚠ {btError}
              </div>
              <button
                style={S.btn()}
                onClick={() => setRefreshBT((k) => k + 1)}
              >
                Thử lại
              </button>
            </div>
          )}
          {!btLoading && !btError && baoTriList.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "40px 0",
                color: C.textMuted,
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
              <div style={{ fontSize: 13 }}>Chưa có phiếu bảo trì nào</div>
            </div>
          )}
          {!btLoading && !btError && baoTriList.length > 0 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {[
                    "Mã BT",
                    "Ngày bảo trì",
                    "Chi phí",
                    "Nội dung",
                    "Số thiết bị",
                    "",
                  ].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {baoTriList.map((r, i) => (
                  <tr
                    key={r.maBaoTri || i}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.surfaceHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        ...S.td,
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: C.textMuted,
                      }}
                    >
                      {r.maBaoTri}
                    </td>
                    <td style={{ ...S.td, color: C.textMuted }}>
                      {r.ngayBaoTri}
                    </td>
                    <td style={{ ...S.td, fontWeight: 700, color: "#6366f1" }}>
                      {fmt(r.chiPhi)}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        fontSize: 12,
                        color: C.textMuted,
                        maxWidth: 200,
                      }}
                    >
                      <span
                        title={r.noiDungBaoTri}
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 190,
                        }}
                      >
                        {r.noiDungBaoTri || "—"}
                      </span>
                    </td>
                    <td
                      style={{
                        ...S.td,
                        color: C.textMuted,
                        textAlign: "center",
                      }}
                    >
                      {(r.danhSachThietBi || []).length}
                    </td>
                    <td style={S.td}>
                      <button
                        style={{
                          ...S.btn("ghost"),
                          padding: "4px 8px",
                          fontSize: 12,
                        }}
                        onClick={() => setSelectedBT(r.maBaoTri)}
                      >
                        👁 Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {showTaoBT && (
        <TaoBaoTriModal
          onClose={() => setShowTaoBT(false)}
          onSuccess={(msg) => {
            setShowTaoBT(false);
            showToast(msg);
            setRefreshBT((k) => k + 1);
          }}
        />
      )}
      {selectedBT && (
        <ChiTietBaoTriModal
          maBaoTri={selectedBT}
          onClose={() => setSelectedBT(null)}
          onUpdated={() => setRefreshBT((k) => k + 1)}
        />
      )}
    </div>
  );
}
