import { useEffect, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  taoHoaDonAPI,
  getHoaDonChiTietAPI,
  thanhToanHoaDonAPI,
  getDoanhThuAPI,
} from "../../api/ChamCong";

const fmt = (v) => (v ? new Intl.NumberFormat("vi-VN").format(v) + "đ" : "—");

const ST_COLOR = {
  "Đã thanh toán": "#22c55e",
  "Chưa thanh toán": "#f59e0b",
  "Đã hủy": "#ef4444",
};

const mockHoaDon = [
  {
    maHoaDon: "HD_001",
    maHoSo: "HSK_001",
    maKH: "KH_0001",
    tenKH: "Nguyễn Văn An",
    ngayTao: "2026-03-20",
    tongTien: 850000,
    trangThai: "Đã thanh toán",
  },
  {
    maHoaDon: "HD_002",
    maHoSo: "HSK_002",
    maKH: "KH_0002",
    tenKH: "Lê Thị Bình",
    ngayTao: "2026-03-19",
    tongTien: 200000,
    trangThai: "Chưa thanh toán",
  },
  {
    maHoaDon: "HD_003",
    maHoSo: "HSK_003",
    maKH: "KH_0003",
    tenKH: "Phạm Quốc Cường",
    ngayTao: "2026-03-18",
    tongTien: 3200000,
    trangThai: "Đã thanh toán",
  },
  {
    maHoaDon: "HD_004",
    maHoSo: "HSK_004",
    maKH: "KH_0004",
    tenKH: "Hoàng Thị Dung",
    ngayTao: "2026-03-15",
    tongTien: 1500000,
    trangThai: "Chưa thanh toán",
  },
];

const normalizeHoaDon = (hd) => ({
  maHoaDon: hd?.maHoaDon || hd?.id || "",
  maHoSo: hd?.maHoSo || hd?.hoSoId || "—",
  maKH: hd?.maKH || hd?.khachHangId || "—",
  tenKH: hd?.tenKH || hd?.tenKhachHang || "—",
  ngayTao: hd?.ngayTao || hd?.createdDate || "—",
  tongTien: Number(hd?.tongTien ?? hd?.totalAmount ?? 0),
  trangThai: hd?.trangThai || hd?.status || "Chưa thanh toán",
});

// ─── Modal tạo hóa đơn ───────────────────────────────────
function TaoHoaDonModal({ onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [maHoSo, setMaHoSo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!maHoSo.trim()) {
      setError("Vui lòng nhập mã hồ sơ khám");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await taoHoaDonAPI(maHoSo.trim());
      onSuccess(`Tạo hóa đơn thành công! Mã: ${res?.maHoaDon || res?.id || "—"}`, res);
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
    <Modal title="🧾 Tạo hóa đơn" onClose={onClose} width={420}>
      <FormField
        label="Mã hồ sơ khám"
        placeholder="HSK_xxxxxxxx"
        value={maHoSo}
        onChange={setMaHoSo}
        required
      />
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
          {loading ? "Đang tạo..." : "✓ Tạo hóa đơn"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal chi tiết hóa đơn ──────────────────────────────
function ChiTietHoaDonModal({ maHoaDon, onClose }) {
  const { theme: C } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getHoaDonChiTietAPI(maHoaDon)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [maHoaDon]);

  return (
    <Modal
      title={`🧾 Chi tiết hóa đơn: ${maHoaDon}`}
      onClose={onClose}
      width={500}
    >
      {loading && (
        <div
          style={{ textAlign: "center", padding: "32px 0", color: C.textMuted }}
        >
          ⏳ Đang tải...
        </div>
      )}
      {error && <div style={{ fontSize: 13, color: "#ef4444" }}>⚠ {error}</div>}
      {data && (
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
        >
          {[
            ["Mã hóa đơn", data.maHoaDon],
            ["Mã hồ sơ", data.maHoSo || "—"],
            ["Ngày tạo", data.ngayTao || "—"],
            ["Tổng tiền", fmt(data.tongTien)],
            ["Trạng thái", data.trangThai || "—"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                gridColumn: k === "Tổng tiền" ? "1/-1" : undefined,
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
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color:
                    k === "Tổng tiền"
                      ? C.accent
                      : k === "Trạng thái"
                        ? ST_COLOR[v] || C.text
                        : C.text,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "8px 18px",
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
    </Modal>
  );
}

// ─── Modal báo cáo doanh thu ─────────────────────────────
function DoanhThuModal({ onClose }) {
  const { theme: C } = useTheme();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleQuery = async () => {
    if (!startDate || !endDate) {
      setError("Chọn đầy đủ ngày bắt đầu và kết thúc");
      return;
    }
    if (startDate > endDate) {
      setError("Ngày bắt đầu phải trước ngày kết thúc");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await getDoanhThuAPI(startDate, endDate);
      setResult(res?.totalRevenue ?? res);
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
    <Modal title="📊 Báo cáo doanh thu" onClose={onClose} width={440}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 12,
              color: C.textMuted,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Từ ngày
          </div>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
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
            }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: 12,
              color: C.textMuted,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Đến ngày
          </div>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
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
            }}
          />
        </div>
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
      {result !== null && (
        <div
          style={{
            background: `${C.accent}12`,
            border: `1px solid ${C.accent}30`,
            borderRadius: 10,
            padding: "20px 0",
            textAlign: "center",
            marginBottom: 14,
          }}
        >
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>
            Tổng doanh thu
          </div>
          <div style={{ fontSize: 32, fontWeight: 900, color: C.accent }}>
            {fmt(result)}
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 6 }}>
            {startDate} → {endDate}
          </div>
        </div>
      )}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button style={btn("ghost")} onClick={onClose}>
          Đóng
        </button>
        <button style={btn()} onClick={handleQuery} disabled={loading}>
          {loading ? "Đang tải..." : "📊 Xem doanh thu"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Main HoaDonPage ─────────────────────────────────────
export default function HoaDonPage({ S }) {
  const { theme: C } = useTheme();
  const [data, setData] = useState(mockHoaDon.map(normalizeHoaDon));
  const [showTao, setShowTao] = useState(false);
  const [showDT, setShowDT] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [confirmPay, setConfirmPay] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const handleThanhToan = async () => {
    const id = confirmPay;
    setConfirmPay(null);
    try {
      await thanhToanHoaDonAPI(id);
      setData((prev) =>
        prev.map((r) =>
          r.maHoaDon === id ? { ...r, trangThai: "Đã thanh toán" } : r,
        ),
      );
      showToast(`Xác nhận thanh toán ${id} thành công`);
    } catch (e) {
      showToast(e.message, "error");
    }
  };

  const tongDoanhThu = data
    .filter((r) => r.trangThai === "Đã thanh toán")
    .reduce((s, r) => s + r.tongTien, 0);
  const choThanhToan = data.filter(
    (r) => r.trangThai === "Chưa thanh toán",
  ).length;

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
            Quản lý hóa đơn
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
            {choThanhToan > 0 && (
              <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                ⚠ {choThanhToan} chờ thanh toán •{" "}
              </span>
            )}
            Doanh thu đã thu:{" "}
            <b style={{ color: "#22c55e" }}>{fmt(tongDoanhThu)}</b>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{ ...S.btn("ghost"), fontSize: 12 }}
            onClick={() => setShowDT(true)}
          >
            📊 Doanh thu
          </button>
          <button style={S.btn()} onClick={() => setShowTao(true)}>
            + Tạo hóa đơn
          </button>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Tổng hóa đơn", value: data.length, color: "#6366f1" },
          {
            label: "Đã thanh toán",
            value: data.filter((r) => r.trangThai === "Đã thanh toán").length,
            color: "#22c55e",
          },
          {
            label: "Chưa thanh toán",
            value: data.filter((r) => r.trangThai === "Chưa thanh toán").length,
            color: "#f59e0b",
          },
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

      {/* Table */}
      <div style={S.card}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {[
                "Mã HĐ",
                "Mã HS",
                "Khách hàng",
                "Ngày tạo",
                "Tổng tiền",
                "Trạng thái",
                "",
              ].map((h) => (
                <th key={h} style={S.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r, i) => (
              <tr
                key={i}
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
                  {r.maHoaDon}
                </td>
                <td
                  style={{
                    ...S.td,
                    fontFamily: "monospace",
                    fontSize: 11,
                    color: C.textMuted,
                  }}
                >
                  {r.maHoSo}
                </td>
                <td style={S.td}>
                  <div style={{ fontWeight: 600, color: C.text }}>
                    {r.tenKH}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {r.maKH}
                  </div>
                </td>
                <td style={{ ...S.td, color: C.textMuted }}>{r.ngayTao}</td>
                <td style={{ ...S.td, fontWeight: 800, color: C.accent }}>
                  {fmt(r.tongTien)}
                </td>
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
                      background: (ST_COLOR[r.trangThai] || "#607090") + "22",
                      color: ST_COLOR[r.trangThai] || "#607090",
                    }}
                  >
                    <span
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: ST_COLOR[r.trangThai] || "#607090",
                        display: "inline-block",
                      }}
                    />
                    {r.trangThai}
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
                      onClick={() => setSelectedId(r.maHoaDon)}
                    >
                      👁
                    </button>
                    {r.trangThai === "Chưa thanh toán" && (
                      <button
                        style={{
                          ...S.btn("ghost"),
                          padding: "4px 8px",
                          fontSize: 11,
                          color: "#22c55e",
                          borderColor: "rgba(34,197,94,0.3)",
                        }}
                        onClick={() => setConfirmPay(r.maHoaDon)}
                      >
                        💳 TT
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTao && (
        <TaoHoaDonModal
          onClose={() => setShowTao(false)}
          onSuccess={(msg, createdInvoice) => {
            setShowTao(false);
            if (createdInvoice) {
              setData((prev) => [normalizeHoaDon(createdInvoice), ...prev]);
            }
            showToast(msg);
          }}
        />
      )}
      {selectedId && (
        <ChiTietHoaDonModal
          maHoaDon={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
      {showDT && <DoanhThuModal onClose={() => setShowDT(false)} />}
      {confirmPay && (
        <ConfirmDialog
          title="💳 Xác nhận thanh toán"
          message={`Xác nhận đã thu tiền hóa đơn ${confirmPay}?`}
          type="info"
          confirmLabel="Xác nhận thu tiền"
          onConfirm={handleThanhToan}
          onCancel={() => setConfirmPay(null)}
        />
      )}
    </div>
  );
}
