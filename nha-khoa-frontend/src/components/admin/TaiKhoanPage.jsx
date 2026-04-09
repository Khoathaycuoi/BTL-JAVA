import { useState, useEffect, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../ui/Modal";
import {
  getBacSiHoatDongAPI,
  getBacSiKhongHoatDongAPI,
  getNhanVienHoatDongAPI,
  getNhanVienKhongHoatDongAPI,
  getKhachHangHoatDongAPI,
  getKhachHangKhongHoatDongAPI,
  xoaTaiKhoanAPI,
  khoiPhucTaiKhoanAPI,
} from "../../api/User";
import UserDetailModal from "../shared/UserDetailModal";

function ConfirmModal({ title, message, onConfirm, onClose, type = "danger" }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const color = type === "danger" ? "#ef4444" : "#22c55e";
  return (
    <Modal title={title} onClose={onClose} width={400}>
      <div
        style={{
          fontSize: 13,
          color: C.textMuted,
          lineHeight: 1.7,
          marginBottom: 20,
        }}
      >
        {message}
      </div>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
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
          Hủy
        </button>
        <button
          onClick={async () => {
            setLoading(true);
            await onConfirm();
            setLoading(false);
          }}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: color,
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Đang xử lý..." : "Xác nhận"}
        </button>
      </div>
    </Modal>
  );
}

const ROLE_TAB_LABEL = {
  BAC_SI: "Bác sĩ",
  NHAN_VIEN: "Nhân viên",
  KHACH_HANG: "Khách hàng",
};

export default function TaiKhoanPage({ S }) {
  const { theme: C } = useTheme();
  const [tab, setTab] = useState("bacsi");
  const [filter, setFilter] = useState("hoat-dong");
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchDebounceRef = useRef(null);
  const [confirm, setConfirm] = useState(null);
  const [detailUserId, setDetailUserId] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [refreshKey, setRefreshKey] = useState(0);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const TABS = [
    {
      id: "bacsi",
      label: "👨‍⚕️ Bác sĩ",
      color: "#0ea5e9",
    },
    {
      id: "nhanvien",
      label: "👥 Nhân viên",
      color: "#10b981",
    },
    {
      id: "khachhang",
      label: "👤 Khách hàng",
      color: "#f59e0b",
    },
  ];

  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);
    return () => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, [search]);

  useEffect(() => {
    setLoading(true);
    const loaders = {
      bacsi: {
        "hoat-dong": getBacSiHoatDongAPI,
        "khong-hoat-dong": getBacSiKhongHoatDongAPI,
      },
      nhanvien: {
        "hoat-dong": getNhanVienHoatDongAPI,
        "khong-hoat-dong": getNhanVienKhongHoatDongAPI,
      },
      khachhang: {
        "hoat-dong": getKhachHangHoatDongAPI,
        "khong-hoat-dong": getKhachHangKhongHoatDongAPI,
      },
    };
    loaders[tab][filter](debouncedSearch)
      .then(setAllData)
      .catch((e) => showToast(e.message, "error"))
      .finally(() => setLoading(false));
  }, [tab, filter, refreshKey, debouncedSearch]);

  const resetSearch = () => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    setSearch("");
    setDebouncedSearch("");
  };

  const handleAction = async () => {
    const { row, action } = confirm;
    try {
      if (action === "xoa") {
        await xoaTaiKhoanAPI(row.sdt);
        showToast(`Đã vô hiệu hóa: ${row.ten}`);
      } else {
        await khoiPhucTaiKhoanAPI(row.sdt);
        showToast(`Đã khôi phục: ${row.ten}`);
      }
      setConfirm(null);
      setRefreshKey((k) => k + 1);
    } catch (e) {
      showToast(e.message, "error");
      setConfirm(null);
    }
  };

  const th = {
    padding: "9px 12px",
    textAlign: "left",
    fontSize: 10,
    fontWeight: 700,
    color: C.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    borderBottom: `1px solid ${C.border}`,
  };
  const td = {
    padding: "10px 12px",
    borderBottom: `1px solid ${C.border}`,
    fontSize: 13,
  };

  const STATUS_COL = {
    key: "trangThai",
    label: "Trạng thái",
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
            v === "Hoạt động" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
          color: v === "Hoạt động" ? "#22c55e" : "#ef4444",
        }}
      >
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: v === "Hoạt động" ? "#22c55e" : "#ef4444",
            display: "inline-block",
          }}
        />
        {v || "—"}
      </span>
    ),
  };

  const columns = [
    {
      key: "id",
      label: "Mã",
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
        <span style={{ fontWeight: 600, color: C.text }}>{v}</span>
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
        <span style={{ color: C.textMuted, fontSize: 12 }}>
          {ROLE_TAB_LABEL[v] || v || "—"}
        </span>
      ),
    },
    STATUS_COL,
  ];

  return (
    <div>
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
        Quản lý tài khoản
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
        Vô hiệu hóa hoặc khôi phục tài khoản người dùng
      </div>

      {/* Tab loại */}
      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              resetSearch();
              setTab(t.id);
            }}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: tab === t.id ? t.color : C.surface,
              color: tab === t.id ? "#fff" : C.textMuted,
              border: tab !== t.id ? `1px solid ${C.border}` : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filter hoạt động / không hoạt động */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { id: "hoat-dong", label: "✅ Đang hoạt động" },
          { id: "khong-hoat-dong", label: "🚫 Không hoạt động" },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => {
              resetSearch();
              setFilter(f.id);
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "7px 16px",
              borderRadius: 20,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: filter === f.id ? C.accent + "18" : "transparent",
              color: filter === f.id ? C.accent : C.textMuted,
              border: `1px solid ${filter === f.id ? C.accent : C.border}`,
            }}
          >
            {f.label}
            {filter === f.id && (
              <span
                style={{
                  padding: "1px 7px",
                  borderRadius: 10,
                  fontSize: 10,
                  fontWeight: 700,
                  background: C.accent,
                  color: "#fff",
                }}
              >
                {loading ? "..." : allData.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Card bảng */}
      <div
        style={{
          background: C.surface,
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          padding: 18,
        }}
      >
        <div
          style={{
            marginBottom: 14,
            display: "flex",
            gap: 10,
            alignItems: "center",
          }}
        >
          <input
            placeholder="🔍  Tìm tên, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "8px 12px",
              color: C.text,
              fontSize: 13,
              outline: "none",
              width: 280,
            }}
          />
          <span style={{ fontSize: 12, color: C.textMuted }}>
            {allData.length} kết quả
          </span>
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

        {!loading && (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                <th style={{ ...th, width: 40 }}>#</th>
                {columns.map((c) => (
                  <th key={c.key} style={th}>
                    {c.label}
                  </th>
                ))}
                <th style={th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {allData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + 2}
                    style={{
                      textAlign: "center",
                      padding: "40px 0",
                      color: C.textMuted,
                    }}
                  >
                    📭{" "}
                    {debouncedSearch
                      ? "Không tìm thấy kết quả"
                      : filter === "hoat-dong"
                        ? "Không có tài khoản đang hoạt động"
                        : "Không có tài khoản bị vô hiệu hóa"}
                  </td>
                </tr>
              ) : (
                allData.map((row, idx) => (
                  <tr
                    key={row.id || idx}
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
                    {columns.map((c) => (
                      <td key={c.key} style={td}>
                        {c.render(row[c.key], row)}
                      </td>
                    ))}
                    <td style={td}>
                      <div
                        style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
                      >
                        <button
                          style={{
                            padding: "4px 10px",
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            cursor: "pointer",
                            background: C.accentSoft || C.bg,
                            color: C.accent,
                            border: `1px solid ${C.border}`,
                          }}
                          onClick={() => setDetailUserId(String(row.id))}
                        >
                          👁 Chi tiết
                        </button>
                        {/* Chỉ hiện nút tương ứng theo filter */}
                        {filter === "hoat-dong" && (
                          <button
                            style={{
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              background: "rgba(239,68,68,0.1)",
                              color: "#ef4444",
                              border: "1px solid rgba(239,68,68,0.25)",
                            }}
                            onClick={() => setConfirm({ row, action: "xoa" })}
                          >
                            🚫 Vô hiệu
                          </button>
                        )}
                        {filter === "khong-hoat-dong" && (
                          <button
                            style={{
                              padding: "4px 10px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              background: "rgba(34,197,94,0.1)",
                              color: "#22c55e",
                              border: "1px solid rgba(34,197,94,0.25)",
                            }}
                            onClick={() =>
                              setConfirm({ row, action: "khoi-phuc" })
                            }
                          >
                            ✓ Khôi phục
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {confirm && (
        <ConfirmModal
          title={
            confirm.action === "xoa"
              ? "🚫 Vô hiệu hóa tài khoản"
              : "✓ Khôi phục tài khoản"
          }
          message={
            confirm.action === "xoa"
              ? `Vô hiệu hóa tài khoản "${confirm.row.ten}" (${confirm.row.sdt})? Người dùng sẽ không thể đăng nhập.`
              : `Khôi phục tài khoản "${confirm.row.ten}" (${confirm.row.sdt})?`
          }
          type={confirm.action === "xoa" ? "danger" : "success"}
          onConfirm={handleAction}
          onClose={() => setConfirm(null)}
        />
      )}

      {detailUserId && (
        <UserDetailModal
          userId={detailUserId}
          titlePrefix="Chi tiết"
          onClose={() => setDetailUserId(null)}
        />
      )}
    </div>
  );
}
