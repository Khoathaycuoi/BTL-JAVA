import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../ui/Modal";
import FormField from "../ui/FormField";
import ConfirmDialog from "../ui/ConfirmDialog";
import {
  getAllDichVuAPI,
  addDichVuAPI,
  updateDichVuAPI,
  xoaDichVuAPI,
  khoiPhucDichVuAPI,
} from "../../api/DichVu";

const fmt = (v) => {
  if (!v && v !== 0) return "—";
  return new Intl.NumberFormat("vi-VN").format(v) + "đ";
};

const normalizeText = (v = "") =>
  String(v)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();

const isDichVuHoatDong = (dv) => {
  if (dv?.hoatDong === false || dv?.isActive === false || dv?.active === false) {
    return false;
  }
  if (dv?.hoatDong === 0 || dv?.isActive === 0 || dv?.active === 0) {
    return false;
  }

  const raw = dv?.trangThai;
  if (raw == null || raw === "") return true;
  const st = normalizeText(raw);
  return !(
    st.includes("ngung hoat dong") ||
    st === "inactive" ||
    st === "disabled" ||
    st === "false" ||
    st === "0"
  );
};

const mergeInactiveTrangThai = (rows, inactiveIds) =>
  (rows || []).map((dv) =>
    inactiveIds.has(dv.maDichVu) ? { ...dv, trangThai: "Ngừng hoạt động" } : dv,
  );

const toNumberOrNull = (v) => {
  if (v === "" || v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const extractDichVuRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const filterDichVuLocal = (rows, { ten = "", st = "", mn = "", mx = "" } = {}) => {
  const searchText = normalizeText(ten);
  const stNorm = normalizeText(st);
  const minVal = toNumberOrNull(mn);
  const maxVal = toNumberOrNull(mx);

  return (rows || []).filter((dv) => {
    const tenOk =
      !searchText ||
      normalizeText(dv?.tenDichVu || "").includes(searchText) ||
      normalizeText(dv?.moTa || "").includes(searchText);

    const active = isDichVuHoatDong(dv);
    const statusOk =
      !stNorm ||
      (stNorm.includes("hoat dong") && !stNorm.includes("ngung") && active) ||
      (stNorm.includes("ngung hoat dong") && !active);

    const gia = Number(dv?.donGia);
    const minOk = minVal == null || (Number.isFinite(gia) && gia >= minVal);
    const maxOk = maxVal == null || (Number.isFinite(gia) && gia <= maxVal);

    return tenOk && statusOk && minOk && maxOk;
  });
};

function AddDichVuModal({ onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ tenDichVu: "", donGia: "", moTa: "" });
  const set = (f) => (v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.tenDichVu.trim()) {
      setError("Vui lòng nhập tên dịch vụ");
      return;
    }
    if (!form.donGia || Number(form.donGia) <= 0) {
      setError("Đơn giá phải lớn hơn 0");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await addDichVuAPI({ ...form, donGia: Number(form.donGia) });
      onSuccess("Thêm dịch vụ thành công!");
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
    <Modal title="➕ Thêm dịch vụ mới" onClose={onClose} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <FormField
          label="Tên dịch vụ"
          placeholder="Khám tổng quát, Nhổ răng..."
          value={form.tenDichVu}
          onChange={set("tenDichVu")}
          required
        />
        <FormField
          label="Đơn giá (VNĐ)"
          type="number"
          placeholder="100000"
          value={form.donGia}
          onChange={set("donGia")}
          required
        />
        <FormField
          label="Mô tả"
          type="textarea"
          placeholder="Mô tả ngắn về dịch vụ..."
          value={form.moTa}
          onChange={set("moTa")}
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
          {loading ? "Đang lưu..." : "✓ Thêm dịch vụ"}
        </button>
      </div>
    </Modal>
  );
}

function EditDichVuModal({ dv, onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    tenDichVu: dv.tenDichVu || "",
    donGia: dv.donGia || "",
    moTa: dv.moTa || "",
  });
  const set = (f) => (v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.donGia || Number(form.donGia) <= 0) {
      setError("Đơn giá phải lớn hơn 0");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await updateDichVuAPI({ ...form, donGia: Number(form.donGia) });
      onSuccess("Cập nhật dịch vụ thành công!");
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
    <Modal title={`✏️ Sửa: ${dv.tenDichVu}`} onClose={onClose} width={480}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 12,
              color: C.textMuted,
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            Tên dịch vụ
          </div>
          <div
            style={{
              fontSize: 13,
              color: C.text,
              background: C.bg,
              padding: "9px 12px",
              borderRadius: 8,
              border: `1px solid ${C.border}`,
            }}
          >
            {dv.tenDichVu}
          </div>
          <div style={{ fontSize: 11, color: C.textDim, marginTop: 4 }}>
            Tên dịch vụ không thể thay đổi
          </div>
        </div>
        <FormField
          label="Đơn giá (VNĐ)"
          type="number"
          placeholder="100000"
          value={form.donGia}
          onChange={set("donGia")}
          required
        />
        <FormField
          label="Mô tả"
          type="textarea"
          placeholder="Mô tả ngắn..."
          value={form.moTa}
          onChange={set("moTa")}
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
          {loading ? "Đang lưu..." : "✓ Lưu thay đổi"}
        </button>
      </div>
    </Modal>
  );
}

export default function DichVuPage({ S }) {
  const { theme: C } = useTheme();
  const [allForStats, setAllForStats] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tenSearch, setTenSearch] = useState("");
  const [stFilter, setStFilter] = useState("");
  const [minGia, setMinGia] = useState("");
  const [maxGia, setMaxGia] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [editDv, setEditDv] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [refreshKey, setRefreshKey] = useState(0);
  const debounceRef = useRef(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const doSearch = useCallback(
    (ten = "", st = "", mn = "", mx = "", refreshStats = true) => {
      setLoading(true);
      setError("");
      (async () => {
        try {
          // Read full list once, then filter locally to avoid status string mismatch
          // between backend values and UI labels.
          const allRows = extractDichVuRows(await getAllDichVuAPI());
          const normalizedAll = mergeInactiveTrangThai(
            allRows,
            new Set(
              (allRows || [])
                .filter((d) => !isDichVuHoatDong(d))
                .map((d) => d.maDichVu)
                .filter(Boolean),
            ),
          );

          if (refreshStats) setAllForStats(normalizedAll);
          setTableData(filterDichVuLocal(normalizedAll, { ten, st, mn, mx }));
        } catch (e) {
          setError(e.message);
        } finally {
          setLoading(false);
        }
      })();
    },
    [],
  );

  useEffect(() => {
    doSearch(tenSearch, stFilter, minGia, maxGia, true);
  }, [refreshKey]);

  const handleTenChange = (v) => {
    setTenSearch(v);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => doSearch(v, stFilter, minGia, maxGia, false),
      400,
    );
  };

  const handleStChange = (v) => {
    setStFilter(v);
    doSearch(tenSearch, v, minGia, maxGia, false);
  };
  const applyGia = () => doSearch(tenSearch, stFilter, minGia, maxGia, false);
  const clearAll = () => {
    setTenSearch("");
    setStFilter("");
    setMinGia("");
    setMaxGia("");
    doSearch("", "", "", "", true);
  };

  const handleConfirmed = async () => {
    const { dv, action } = confirm;
    try {
      if (action === "xoa") {
        await xoaDichVuAPI(dv.maDichVu);
        showToast(`Đã vô hiệu hóa: ${dv.tenDichVu}`);
      } else {
        await khoiPhucDichVuAPI(dv.maDichVu);
        showToast(`Đã khôi phục: ${dv.tenDichVu}`);
      }
      setConfirm(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showToast(e.message, "error");
      setConfirm(null);
    }
  };
  
  const th = S.th;
  const td = S.td;

  const stats = {
    total: allForStats.length,
    active: allForStats.filter((d) => isDichVuHoatDong(d)).length,
    inactive: allForStats.filter((d) => !isDichVuHoatDong(d)).length,
  };

  return (
    <div>
      
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
            Quản lý dịch vụ
          </div>
        </div>
        <button style={S.btn()} onClick={() => setShowAdd(true)}>
          + Thêm dịch vụ
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Tổng dịch vụ", value: stats.total, color: C.accent },
          { label: "Đang hoạt động", value: stats.active, color: "#22c55e" },
          { label: "Ngừng hoạt động", value: stats.inactive, color: "#ef4444" },
        ].map((s) => (
          <div
            key={s.label}
            style={{ ...S.card, borderTop: `3px solid ${s.color}` }}
          >
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: C.text }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 10,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          
          <div>
            <div
              style={{
                fontSize: 11,
                color: C.textMuted,
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Tên dịch vụ
            </div>
            <input
              placeholder="🔍  Tìm tên dịch vụ..."
              value={tenSearch}
              onChange={(e) => handleTenChange(e.target.value)}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 12px",
                color: C.text,
                fontSize: 13,
                outline: "none",
                width: 220,
              }}
            />
          </div>
          
          <div>
            <div
              style={{
                fontSize: 11,
                color: C.textMuted,
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              Đơn giá từ (VNĐ)
            </div>
            <input
              type="number"
              placeholder="0"
              value={minGia}
              onChange={(e) => setMinGia(e.target.value)}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                color: C.text,
                fontSize: 13,
                outline: "none",
                width: 120,
              }}
            />
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: C.textMuted,
                marginBottom: 4,
                fontWeight: 600,
              }}
            >
              đến (VNĐ)
            </div>
            <input
              type="number"
              placeholder="99999999"
              value={maxGia}
              onChange={(e) => setMaxGia(e.target.value)}
              style={{
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "8px 10px",
                color: C.text,
                fontSize: 13,
                outline: "none",
                width: 120,
              }}
            />
          </div>
          <button
            onClick={applyGia}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              background: C.accent,
              color: "#fff",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            Lọc giá
          </button>
          {(tenSearch || stFilter || minGia || maxGia) && (
            <button
              onClick={clearAll}
              style={{
                padding: "8px 12px",
                borderRadius: 8,
                background: "transparent",
                color: C.textMuted,
                border: `1px solid ${C.border}`,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ✕ Xóa lọc
            </button>
          )}
          <span
            style={{
              marginLeft: "auto",
              fontSize: 12,
              color: C.textMuted,
              alignSelf: "center",
            }}
          >
            {tableData.length} kết quả
          </span>
        </div>

        
        <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
          {[
            { id: "", label: "Tất cả" },
            { id: "Hoạt động", label: "✅ Hoạt động" },
            { id: "Ngừng hoạt động", label: "🚫 Ngừng hoạt động" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => handleStChange(f.id)}
              style={{
                padding: "5px 12px",
                borderRadius: 20,
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                background: stFilter === f.id ? C.accent + "18" : "transparent",
                color: stFilter === f.id ? C.accent : C.textMuted,
                border: `1px solid ${stFilter === f.id ? C.accent : C.border}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        
        {loading && (
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

        
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 10 }}>
              ⚠ {error}
            </div>
            <button
              style={S.btn()}
              onClick={() =>
                doSearch(tenSearch, stFilter, minGia, maxGia, true)
              }
            >
              Thử lại
            </button>
          </div>
        )}

        
        {!loading && !error && tableData.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: C.textMuted,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 13 }}>Không tìm thấy dịch vụ nào</div>
          </div>
        )}

        
        {!loading && !error && tableData.length > 0 && (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                {[
                  "#",
                  "Mã DV",
                  "Tên dịch vụ",
                  "Mô tả",
                  "Đơn giá",
                  "Trạng thái",
                  "Thao tác",
                ].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.map((dv, idx) => {
                const active = isDichVuHoatDong(dv);
                const trangThaiLabel = active
                  ? "Hoạt động"
                  : dv.trangThai || "Ngừng hoạt động";
                return (
                  <tr
                    key={dv.maDichVu || idx}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.surfaceHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ ...td, color: C.textMuted, fontSize: 11 }}>
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        ...td,
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: C.textMuted,
                      }}
                    >
                      {dv.maDichVu}
                    </td>
                    <td style={{ ...td, fontWeight: 700, color: C.text }}>
                      {dv.tenDichVu}
                    </td>
                    <td
                      style={{
                        ...td,
                        fontSize: 12,
                        color: C.textMuted,
                        maxWidth: 200,
                      }}
                    >
                      <span
                        title={dv.moTa}
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          maxWidth: 180,
                        }}
                      >
                        {dv.moTa || "—"}
                      </span>
                    </td>
                    <td style={{ ...td, fontWeight: 700, color: C.accent }}>
                      {fmt(dv.donGia)}
                    </td>
                    <td style={td}>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: active
                            ? "rgba(34,197,94,0.12)"
                            : "rgba(239,68,68,0.12)",
                          color: active ? "#22c55e" : "#ef4444",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: active ? "#22c55e" : "#ef4444",
                            display: "inline-block",
                          }}
                        />
                        {trangThaiLabel}
                      </span>
                    </td>
                    <td style={td}>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          style={{
                            ...S.btn("ghost"),
                            padding: "4px 8px",
                            fontSize: 12,
                          }}
                          onClick={() => setEditDv(dv)}
                        >
                          ✏️
                        </button>
                        {active ? (
                          <button
                            style={{
                              ...S.btn("ghost"),
                              padding: "4px 8px",
                              fontSize: 12,
                              color: "#ef4444",
                            }}
                            onClick={() => setConfirm({ dv, action: "xoa" })}
                          >
                            🚫
                          </button>
                        ) : (
                          <button
                            style={{
                              ...S.btn("ghost"),
                              padding: "4px 8px",
                              fontSize: 12,
                              color: "#22c55e",
                            }}
                            onClick={() =>
                              setConfirm({ dv, action: "khoi-phuc" })
                            }
                          >
                            ✓
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      
      {showAdd && (
        <AddDichVuModal
          onClose={() => setShowAdd(false)}
          onSuccess={(msg) => {
            setShowAdd(false);
            showToast(msg);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
      {editDv && (
        <EditDichVuModal
          dv={editDv}
          onClose={() => setEditDv(null)}
          onSuccess={(msg) => {
            setEditDv(null);
            showToast(msg);
            setRefreshKey((k) => k + 1);
          }}
        />
      )}
      {confirm && (
        <ConfirmDialog
          title={
            confirm.action === "xoa"
              ? "🚫 Vô hiệu hóa dịch vụ"
              : "✓ Khôi phục dịch vụ"
          }
          message={
            confirm.action === "xoa"
              ? `Vô hiệu hóa "${confirm.dv.tenDichVu}"? Dịch vụ này sẽ không thể đặt lịch.`
              : `Khôi phục "${confirm.dv.tenDichVu}"?`
          }
          type={confirm.action === "xoa" ? "danger" : "info"}
          confirmLabel={confirm.action === "xoa" ? "Vô hiệu hóa" : "Khôi phục"}
          onConfirm={handleConfirmed}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
