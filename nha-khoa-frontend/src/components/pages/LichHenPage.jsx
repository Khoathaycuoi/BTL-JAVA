import { useState, useEffect, useCallback, useRef } from "react";
import { useTheme } from "../../context/ThemeContext";
import ConfirmDialog from "../ui/ConfirmDialog";
import Modal from "../ui/Modal";
import {
  getAllLichHenAPI,
  timKiemLichHenAPI,
  xacNhanLichHenAPI,
  hoanThanhLichHenAPI,
  huyLichHenAPI,
} from "../../api/LichHen";

const ST_COLOR = {
  "Chờ xác nhận": "#f59e0b",
  "Đã xác nhận": "#22c55e",
  "Đã hủy": "#ef4444",
  "Đã hoàn thành": "#6366f1",
};

function StatusBadge({ v }) {
  const c = ST_COLOR[v] || "#607090";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 10px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 600,
        background: c + "22",
        color: c,
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: c,
          display: "inline-block",
        }}
      />
      {v}
    </span>
  );
}

function DetailModal({ lh, onClose, C }) {
  const ghiChu = (lh.ghiChu || lh.ghi_chu || "").trim();
  const khachLine =
    lh.tenKH && lh.maKH
      ? `${lh.tenKH} · ${lh.maKH}`
      : lh.tenKH || lh.maKH || "—";
  const bacSiLine =
    lh.tenBacSi && lh.maBacSi
      ? `${lh.tenBacSi} · ${lh.maBacSi}`
      : lh.tenBacSi || lh.maBacSi || "Chưa phân công";
  const stColor = ST_COLOR[lh.trangThai] || C.textMuted;
  const metaCreated = lh.createdAt
    ? new Date(lh.createdAt).toLocaleString("vi-VN")
    : "—";
  const metaUpdated = lh.updatedAt
    ? new Date(lh.updatedAt).toLocaleString("vi-VN")
    : "—";

  const rowStyle = {
    display: "grid",
    gridTemplateColumns: "120px 1fr",
    gap: "8px 16px",
    padding: "12px 0",
    borderBottom: `1px solid ${C.border}`,
    fontSize: 13,
    alignItems: "start",
  };
  const labelStyle = {
    fontSize: 11,
    fontWeight: 700,
    color: C.textMuted,
    textTransform: "uppercase",
    letterSpacing: "0.04em",
    paddingTop: 2,
  };
  const valueStyle = {
    color: C.text,
    fontWeight: 600,
    lineHeight: 1.45,
    wordBreak: "break-word",
  };

  return (
    <Modal title="Chi tiết lịch hẹn" onClose={onClose} width={540}>
      <div
        style={{
          borderRadius: 12,
          padding: "16px 18px",
          marginBottom: 8,
          background: `linear-gradient(135deg, ${C.accent}14 0%, ${C.accent}06 100%)`,
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 15,
                fontWeight: 800,
                color: C.text,
                letterSpacing: "-0.02em",
              }}
            >
              {lh.maLichHen}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>
              {lh.ngayHen || "—"} · {lh.gioHen || "—"}
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "6px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
                background: stColor + "22",
                color: stColor,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: stColor,
                }}
              />
              {lh.trangThai || "—"}
            </span>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 4 }}>
        <div style={rowStyle}>
          <div style={labelStyle}>Khách hàng</div>
          <div style={valueStyle}>{khachLine}</div>
        </div>
        <div style={rowStyle}>
          <div style={labelStyle}>Bác sĩ</div>
          <div style={valueStyle}>{bacSiLine}</div>
        </div>
        <div
          style={{
            ...rowStyle,
            borderBottom: "none",
            paddingBottom: 4,
          }}
        >
          <div style={labelStyle}>Ngày & giờ</div>
          <div style={valueStyle}>
            {lh.ngayHen || "—"}{" "}
            <span style={{ color: C.textMuted, fontWeight: 500 }}>lúc</span>{" "}
            {lh.gioHen || "—"}
          </div>
        </div>
      </div>

      <div
        style={{
          marginBottom: 16,
          padding: "12px 14px",
          borderRadius: 10,
          background: C.bg,
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ ...labelStyle, marginBottom: 8, paddingTop: 0 }}>
          Ghi chú
        </div>
        <div
          style={{
            fontSize: 13,
            color: ghiChu ? C.text : C.textMuted,
            fontWeight: ghiChu ? 500 : 400,
            fontStyle: ghiChu ? "normal" : "italic",
            lineHeight: 1.5,
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}
        >
          {ghiChu || "Không có ghi chú."}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 20px",
          fontSize: 11,
          color: C.textMuted,
          marginBottom: 20,
          paddingTop: 4,
        }}
      >
        <span>
          <b style={{ color: C.textDim }}>Tạo:</b> {metaCreated}
        </span>
        <span>
          <b style={{ color: C.textDim }}>Cập nhật:</b> {metaUpdated}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          type="button"
          onClick={onClose}
          style={{
            padding: "9px 20px",
            borderRadius: 10,
            border: "none",
            background: C.accent,
            color: "#fff",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
}

function HuyLichModal({ lh, onClose, onSuccess, C }) {
  const [lyDo, setLyDo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleHuy = async () => {
    if (!lyDo.trim()) {
      setError("Vui lòng nhập lý do hủy");
      return;
    }
    try {
      setLoading(true);
      await huyLichHenAPI({ maLichHen: lh.maLichHen, lyDo });
      onSuccess(`Đã hủy lịch hẹn ${lh.maLichHen}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="🚫 Hủy lịch hẹn" onClose={onClose} width={440}>
      <div
        style={{
          marginBottom: 14,
          padding: "10px 14px",
          background: C.bg,
          borderRadius: 8,
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 3 }}>
          Lịch hẹn sẽ bị hủy:
        </div>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
          {lh.maLichHen}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
          {lh.tenKH || lh.maKH} — {lh.ngayHen} {lh.gioHen}
        </div>
      </div>
      <div style={{ marginBottom: 14 }}>
        <label
          style={{
            fontSize: 12,
            color: C.textMuted,
            fontWeight: 600,
            display: "block",
            marginBottom: 6,
          }}
        >
          Lý do hủy <span style={{ color: "#ef4444" }}>*</span>
        </label>
        <textarea
          value={lyDo}
          onChange={(e) => setLyDo(e.target.value)}
          rows={3}
          placeholder="Nhập lý do hủy lịch hẹn..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "9px 12px",
            color: C.text,
            fontSize: 13,
            outline: "none",
            resize: "vertical",
          }}
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
            marginBottom: 14,
          }}
        >
          ⚠ {error}
        </div>
      )}
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
          Quay lại
        </button>
        <button
          onClick={handleHuy}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            border: "none",
            background: "#ef4444",
            color: "#fff",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Đang hủy..." : "🚫 Xác nhận hủy"}
        </button>
      </div>
    </Modal>
  );
}

/**
 * LichHenPage — API: LichHenController (/api/lich-hen/all, /tim-kiem, …)
 * Props:
 *   S         – styles từ role parent
 *   role      – khớp parseRole Auth.js: "admin" | "letan" | "bacsi" | "benhnhan"
 *   onDatLich – mở trang đặt lịch (admin/letan)
 */
export default function LichHenPage({ S, role = "admin", onDatLich }) {
  const { theme: C } = useTheme();

  /** Toàn bộ lịch (theo quyền) — chỉ dùng cho thống kê 4 ô; không đổi khi lọc bảng */
  const [allForStats, setAllForStats] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const [search, setSearch] = useState("");
  const [stFilter, setStFilter] = useState("all");
  const [ngayFilter, setNgayFilter] = useState("");
  const debounceRef = useRef(null);

  const [detailLh, setDetailLh] = useState(null);
  const [huyLh, setHuyLh] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); 

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const buildTimKiemParams = (q, st, ngay) => ({
    trangThai: st !== "all" ? st : undefined,
    ngayHen: ngay || undefined,
    ...(q
      ? q.startsWith("KH_")
        ? { maKH: q }
        : q.startsWith("BS_")
          ? { maBacSi: q }
          : q.startsWith("LH_")
            ? {}
            : { tenKH: q }
      : {}),
  });

  const doLoad = useCallback(
    (q = "", st = "all", ngay = "", refreshStats = true) => {
      setLoading(true);
      setError("");
      const hasFilter = Boolean(q || st !== "all" || ngay);

      (async () => {
        try {
          let snapshot = null;
          if (refreshStats) {
            snapshot = await getAllLichHenAPI();
            setAllForStats(snapshot);
          }

          if (!hasFilter) {
            if (snapshot) {
              setTableData(snapshot);
            } else {
              const all = await getAllLichHenAPI();
              setAllForStats(all);
              setTableData(all);
            }
            return;
          }

          let rows = await timKiemLichHenAPI(buildTimKiemParams(q, st, ngay));
          if (q?.startsWith("LH_")) {
            const qq = q.toLowerCase();
            rows = rows.filter((r) =>
              (r.maLichHen || "").toLowerCase().includes(qq),
            );
          }
          setTableData(rows);
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
    doLoad("", "all", "", true);
  }, [doLoad]);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(
      () => doLoad(val, stFilter, ngayFilter, false),
      400,
    );
  };
  const handleStFilter = (val) => {
    setStFilter(val);
    doLoad(search, val, ngayFilter, false);
  };
  const handleNgayFilter = (val) => {
    setNgayFilter(val);
    doLoad(search, stFilter, val, false);
  };
  const clearFilter = () => {
    setSearch("");
    setStFilter("all");
    setNgayFilter("");
    doLoad("", "all", "", true);
  };

  const handleXacNhan = async () => {
    const { lh } = confirmAction;
    try {
      await xacNhanLichHenAPI(lh.maLichHen);
      showToast(`Đã xác nhận lịch hẹn ${lh.maLichHen}`);
      setConfirmAction(null);
      doLoad(search, stFilter, ngayFilter, true);
    } catch (e) {
      showToast(e.message, "error");
      setConfirmAction(null);
    }
  };

  const handleHoanThanh = async () => {
    const { lh } = confirmAction;
    try {
      await hoanThanhLichHenAPI(lh.maLichHen);
      showToast(`Đã hoàn thành lịch hẹn ${lh.maLichHen}`);
      setConfirmAction(null);
      doLoad(search, stFilter, ngayFilter, true);
    } catch (e) {
      showToast(e.message, "error");
      setConfirmAction(null);
    }
  };

  /** Dashboard: luôn từ GET /all (LichHenService.getDanhSachLichHen), không phụ thuộc bảng đã lọc */
  const stats = {
    total: allForStats.length,
    cho: allForStats.filter((r) => r.trangThai === "Chờ xác nhận").length,
    xn: allForStats.filter((r) => r.trangThai === "Đã xác nhận").length,
    xong: allForStats.filter((r) => r.trangThai === "Đã hoàn thành").length,
  };

  /* Khớp backend: ROLE_USER không xác nhận / hoàn thành; ADMIN/NHANVIEN/BACSI được (BS chỉ lịch của mình — server chặn) */
  const canXacNhanHoanThanh =
    role === "admin" || role === "letan" || role === "bacsi";
  const canHuy =
    role === "admin" ||
    role === "letan" ||
    role === "bacsi" ||
    role === "benhnhan";

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

      {/* Header */}
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
            Lịch hẹn
          </div>
        
        </div>
        {(role === "admin" || role === "letan") && onDatLich && (
          <button style={S.btn()} onClick={onDatLich}>
            + Đặt lịch hẹn
          </button>
        )}
      </div>

      {/* [SỬA] Stats — 4 ô, thêm Hoàn thành */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Tổng lịch hẹn", value: stats.total, color: "#6366f1" },
          { label: "Chờ xác nhận", value: stats.cho, color: "#f59e0b" },
          { label: "Đã xác nhận", value: stats.xn, color: "#22c55e" },
          { label: "Đã hoàn thành", value: stats.xong, color: "#0ea5e9" },
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
        {/* [SỬA] Toolbar — thêm lọc ngày, tìm kiếm server-side */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 12,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative" }}>
            <input
              placeholder="🔍  Tên KH, mã LH, mã KH, mã BS..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
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
            {loading && search && (
              <span
                style={{
                  position: "absolute",
                  right: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: 12,
                  color: C.textMuted,
                }}
              >
                ⏳
              </span>
            )}
          </div>
          <input
            type="date"
            value={ngayFilter}
            onChange={(e) => handleNgayFilter(e.target.value)}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "7px 12px",
              color: C.text,
              fontSize: 13,
              outline: "none",
            }}
          />
          {(search || ngayFilter || stFilter !== "all") && (
            <button
              onClick={clearFilter}
              style={{
                padding: "7px 10px",
                borderRadius: 8,
                border: `1px solid ${C.border}`,
                background: "transparent",
                color: C.textMuted,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              ✕ Xóa lọc
            </button>
          )}
          <button
            onClick={() => doLoad(search, stFilter, ngayFilter, true)}
            style={{
              ...S.btn("ghost"),
              padding: "7px 12px",
              fontSize: 12,
              marginLeft: "auto",
            }}
          >
            🔄 Tải lại
          </button>
          <span style={{ fontSize: 12, color: C.textMuted }}>
            {tableData.length} kết quả
          </span>
        </div>

        {/* Status filter chips */}
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 14,
            flexWrap: "wrap",
          }}
        >
          {[
            { id: "all", label: "Tất cả" },
            { id: "Chờ xác nhận", label: "⏳ Chờ xác nhận" },
            { id: "Đã xác nhận", label: "✅ Đã xác nhận" },
            { id: "Đã hoàn thành", label: "✔ Hoàn thành" },
            { id: "Đã hủy", label: "🚫 Đã hủy" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => handleStFilter(f.id)}
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

        {/* Loading */}
        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: C.textMuted,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
            <div style={{ fontSize: 13 }}>Đang tải dữ liệu...</div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 10 }}>
              ⚠ {error}
            </div>
            <button style={S.btn()} onClick={() => doLoad("", "all", "", true)}>
              Thử lại
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && tableData.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: C.textMuted,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 13 }}>
              {search || ngayFilter || stFilter !== "all"
                ? "Không tìm thấy kết quả"
                : "Chưa có lịch hẹn nào"}
            </div>
          </div>
        )}

        {/* [SỬA] Table — thêm tenKH, tenBacSi, ghi chú, thao tác */}
        {!loading && !error && tableData.length > 0 && (
          <div style={{ overflowX: "auto" }}>
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
                    "#",
                    "Mã LH",
                    "Khách hàng",
                    "Bác sĩ",
                    "Ngày hẹn",
                    "Giờ hẹn",
                    "Trạng thái",
                    "Thao tác",
                  ].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((r, idx) => {
                  const isDone = r.trangThai === "Đã hoàn thành";
                  const isHuy = r.trangThai === "Đã hủy";
                  const isCho = r.trangThai === "Chờ xác nhận";
                  const isXN = r.trangThai === "Đã xác nhận";

                  return (
                    <tr
                      key={r.maLichHen || idx}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = C.surfaceHover)
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <td style={{ ...S.td, color: C.textMuted, fontSize: 11 }}>
                        {idx + 1}
                      </td>

                      {/* Mã LH — click xem chi tiết */}
                      <td
                        style={{
                          ...S.td,
                          fontFamily: "monospace",
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        <span
                          style={{
                            color: C.accent,
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => setDetailLh(r)}
                        >
                          {r.maLichHen}
                        </span>
                      </td>

                      {/* [MỚI] Tên KH + mã */}
                      <td style={S.td}>
                        {r.tenKH ? (
                          <div>
                            <div style={{ fontWeight: 600, color: C.text }}>
                              {r.tenKH}
                            </div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>
                              {r.maKH}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: C.textMuted }}>
                            {r.maKH || "—"}
                          </span>
                        )}
                      </td>

                      {/* [MỚI] Tên BS + mã */}
                      <td style={S.td}>
                        {r.tenBacSi ? (
                          <div>
                            <div style={{ fontWeight: 600, color: C.text }}>
                              {r.tenBacSi}
                            </div>
                            <div style={{ fontSize: 11, color: C.textMuted }}>
                              {r.maBacSi}
                            </div>
                          </div>
                        ) : (
                          <span style={{ color: C.textDim, fontSize: 12 }}>
                            {r.maBacSi || "Chưa phân công"}
                          </span>
                        )}
                      </td>

                      <td style={{ ...S.td, color: C.textMuted }}>
                        {r.ngayHen || "—"}
                      </td>
                      <td style={{ ...S.td, color: C.accent, fontWeight: 700 }}>
                        {r.gioHen || "—"}
                      </td>
                      <td style={S.td}>
                        <StatusBadge v={r.trangThai} />
                      </td>

                      <td style={S.td}>
                        <div
                          style={{
                            display: "flex",
                            gap: 6,
                            flexWrap: "wrap",
                            alignItems: "center",
                          }}
                        >
                          <button
                            type="button"
                            style={{
                              padding: "5px 10px",
                              borderRadius: 6,
                              fontSize: 11,
                              fontWeight: 600,
                              cursor: "pointer",
                              background: C.accentSoft || C.bg,
                              color: C.accent,
                              border: `1px solid ${C.border}`,
                            }}
                            onClick={() => setDetailLh(r)}
                          >
                            Xem chi tiết
                          </button>

                          {canXacNhanHoanThanh && isCho && (
                            <button
                              type="button"
                              style={{
                                padding: "5px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                background: "rgba(34,197,94,0.1)",
                                color: "#22c55e",
                                border: "1px solid rgba(34,197,94,0.25)",
                              }}
                              onClick={() =>
                                setConfirmAction({ lh: r, action: "xac-nhan" })
                              }
                            >
                              Xác nhận
                            </button>
                          )}

                          {canXacNhanHoanThanh && isXN && (
                            <button
                              type="button"
                              style={{
                                padding: "5px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                background: "rgba(99,102,241,0.1)",
                                color: "#6366f1",
                                border: "1px solid rgba(99,102,241,0.25)",
                              }}
                              onClick={() =>
                                setConfirmAction({
                                  lh: r,
                                  action: "hoan-thanh",
                                })
                              }
                            >
                              Hoàn thành
                            </button>
                          )}

                          {canHuy && !isDone && !isHuy && (
                            <button
                              type="button"
                              style={{
                                padding: "5px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 600,
                                cursor: "pointer",
                                background: "rgba(239,68,68,0.1)",
                                color: "#ef4444",
                                border: "1px solid rgba(239,68,68,0.25)",
                              }}
                              onClick={() => setHuyLh(r)}
                            >
                              Hủy lịch
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* [MỚI] Modals */}
      {detailLh && (
        <DetailModal lh={detailLh} onClose={() => setDetailLh(null)} C={C} />
      )}

      {huyLh && (
        <HuyLichModal
          lh={huyLh}
          C={C}
          onClose={() => setHuyLh(null)}
          onSuccess={(msg) => {
            setHuyLh(null);
            showToast(msg);
            doLoad(search, stFilter, ngayFilter, true);
          }}
        />
      )}

      {confirmAction && (
        <ConfirmDialog
          title={
            confirmAction.action === "xac-nhan"
              ? "✅ Xác nhận lịch hẹn"
              : "✔ Hoàn thành lịch hẹn"
          }
          message={
            confirmAction.action === "xac-nhan"
              ? `Xác nhận lịch hẹn ${confirmAction.lh.maLichHen} của ${confirmAction.lh.tenKH || confirmAction.lh.maKH}?`
              : `Đánh dấu hoàn thành lịch hẹn ${confirmAction.lh.maLichHen}?`
          }
          type="info"
          confirmLabel={
            confirmAction.action === "xac-nhan" ? "Xác nhận" : "Hoàn thành"
          }
          onConfirm={
            confirmAction.action === "xac-nhan"
              ? handleXacNhan
              : handleHoanThanh
          }
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  );
}
