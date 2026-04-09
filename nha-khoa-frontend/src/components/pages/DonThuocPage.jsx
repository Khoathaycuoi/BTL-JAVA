import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import { taoDonThuocAPI, getDonThuocChiTietAPI } from "../../api/Clinical";

function TaoDonThuocModal({ onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ maHoSo: "", ghiChu: "" });
  const set = (f) => (v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.maHoSo.trim()) {
      setError("Vui lòng nhập mã hồ sơ");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await taoDonThuocAPI({
        maHoSo: form.maHoSo,
        ghiChu: form.ghiChu || null,
      });
      onSuccess(`Tạo đơn thuốc thành công! Mã: ${res.maDonThuoc || "—"}`);
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
    <Modal title="💊 Tạo đơn thuốc mới" onClose={onClose} width={460}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <FormField
          label="Mã hồ sơ khám"
          placeholder="HSK_xxxxxxxx"
          value={form.maHoSo}
          onChange={set("maHoSo")}
          required
        />
        <FormField
          label="Ghi chú / Hướng dẫn"
          type="textarea"
          placeholder="Uống sau ăn, tránh đồ cứng..."
          value={form.ghiChu}
          onChange={set("ghiChu")}
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
          {loading ? "Đang lưu..." : "✓ Tạo đơn thuốc"}
        </button>
      </div>
    </Modal>
  );
}

function ChiTietDonThuocModal({ maDonThuoc, onClose }) {
  const { theme: C } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useState(() => {
    getDonThuocChiTietAPI(maDonThuoc)
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [maDonThuoc]);

  const th = {
    padding: "8px 12px",
    fontSize: 10,
    fontWeight: 700,
    color: C.textMuted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    borderBottom: `1px solid ${C.border}`,
    textAlign: "left",
  };
  const td = {
    padding: "9px 12px",
    borderBottom: `1px solid ${C.border}`,
    fontSize: 13,
  };

  return (
    <Modal
      title={`💊 Chi tiết đơn thuốc: ${maDonThuoc}`}
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
      {data && (
        <>
          {/* Header info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 16,
            }}
          >
            {[
              ["Mã đơn thuốc", data.maDonThuoc],
              ["Mã hồ sơ", data.maHoSo],
              ["Ngày kê", data.ngayKe],
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
            {data.ghiChu && (
              <div
                style={{
                  gridColumn: "1/-1",
                  background: C.bg,
                  padding: "10px 14px",
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}
                >
                  Ghi chú
                </div>
                <div style={{ fontSize: 13, color: C.text }}>{data.ghiChu}</div>
              </div>
            )}
          </div>

          {/* Danh sách thuốc */}
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: C.text,
              marginBottom: 10,
            }}
          >
            Danh sách thuốc ({data.chiTietDonThuocList?.length || 0} loại)
          </div>
          {!data.chiTietDonThuocList ||
          data.chiTietDonThuocList.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "20px 0",
                color: C.textMuted,
                fontSize: 13,
              }}
            >
              Chưa có thuốc nào
            </div>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  {["Mã CT", "Tên thuốc", "Số lượng", "Liều dùng"].map((h) => (
                    <th key={h} style={th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.chiTietDonThuocList.map((ct, i) => (
                  <tr
                    key={ct.maCTDonThuoc || i}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.surfaceHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        ...td,
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: C.textMuted,
                      }}
                    >
                      {ct.maCTDonThuoc}
                    </td>
                    <td style={{ ...td, fontWeight: 600, color: C.text }}>
                      {ct.tenThuoc}
                    </td>
                    <td
                      style={{
                        ...td,
                        color: "#0ea5e9",
                        fontWeight: 700,
                        textAlign: "center",
                      }}
                    >
                      {ct.soLuong}
                    </td>
                    <td style={{ ...td, fontSize: 12, color: C.textMuted }}>
                      {ct.lieuDung}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: 16,
          gap: 8,
        }}
      >
        <button style={{ ...S_btn(C), padding: "8px 18px" }} onClick={onClose}>
          Đóng
        </button>
      </div>
    </Modal>
  );
}

const S_btn = (C) => ({
  borderRadius: 8,
  border: `1px solid ${C.border}`,
  background: "transparent",
  color: C.textMuted,
  cursor: "pointer",
  fontSize: 13,
});

export default function DonThuocPage({ S }) {
  const { theme: C } = useTheme();
  const [showTao, setShowTao] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const mockData = [
    {
      id: "DT_001",
      hs: "HSK_001",
      ngayKe: "2026-03-20",
      ghiChu: "Uống sau ăn, tránh đồ cứng 3 ngày",
      soThuoc: 3,
    },
    {
      id: "DT_002",
      hs: "HSK_002",
      ngayKe: "2026-03-19",
      ghiChu: "Súc miệng nước muối 2 lần/ngày",
      soThuoc: 2,
    },
    {
      id: "DT_003",
      hs: "HSK_004",
      ngayKe: "2026-03-15",
      ghiChu: "Tránh ăn đồ cứng 5 ngày",
      soThuoc: 4,
    },
  ];

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
            Quản lý đơn thuốc
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
            {mockData.length} đơn thuốc gần đây
          </div>
        </div>
        <button style={S.btn()} onClick={() => setShowTao(true)}>
          + Kê đơn thuốc
        </button>
      </div>

      {/* Table */}
      <div style={S.card}>
        <div style={{ marginBottom: 14 }}>
          <input
            placeholder="🔍  Tìm mã đơn, mã hồ sơ..."
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
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {[
                "Mã ĐT",
                "Mã hồ sơ",
                "Ngày kê",
                "Số loại thuốc",
                "Ghi chú",
                "",
              ].map((h) => (
                <th key={h} style={S.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockData.map((r) => (
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
                <td style={{ ...S.td, color: C.textMuted }}>{r.hs}</td>
                <td style={{ ...S.td, color: C.textMuted }}>{r.ngayKe}</td>
                <td
                  style={{
                    ...S.td,
                    fontWeight: 700,
                    color: "#0ea5e9",
                    textAlign: "center",
                  }}
                >
                  {r.soThuoc} loại
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
                    title={r.ghiChu}
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 190,
                    }}
                  >
                    {r.ghiChu}
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
                      onClick={() => setSelectedId(r.id)}
                    >
                      👁 Chi tiết
                    </button>
                    <button
                      style={{
                        ...S.btn("ghost"),
                        padding: "4px 8px",
                        fontSize: 12,
                      }}
                    >
                      🖨
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTao && (
        <TaoDonThuocModal
          onClose={() => setShowTao(false)}
          onSuccess={(msg) => {
            setShowTao(false);
            showToast(msg);
          }}
        />
      )}
      {selectedId && (
        <ChiTietDonThuocModal
          maDonThuoc={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
    </div>
  );
}
