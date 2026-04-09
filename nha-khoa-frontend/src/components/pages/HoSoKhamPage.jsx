import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../../components/ui/Modal";
import FormField from "../../components/ui/FormField";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { taoHoSoKhamAPI, getLichSuKhamAPI } from "../../api/Clinical";

const ST_COLOR = {
  "Hoàn thành": "#22c55e",
  "Tái khám": "#f59e0b",
  "Đang điều trị": "#0ea5e9",
};
function TaoHoSoModal({ onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    maKH: "",
    maBacSi: "",
    maLichHen: "",
    trieuChung: "",
    chuanDoan: "",
    ngayTaiKham: "",
  });
  const set = (f) => (v) => setForm((p) => ({ ...p, [f]: v }));

  const handleSubmit = async () => {
    if (!form.maKH) {
      setError("Vui lòng nhập mã khách hàng");
      return;
    }
    if (!form.maBacSi) {
      setError("Vui lòng nhập mã bác sĩ");
      return;
    }
    if (!form.trieuChung) {
      setError("Vui lòng nhập triệu chứng");
      return;
    }
    if (!form.chuanDoan) {
      setError("Vui lòng nhập chẩn đoán");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await taoHoSoKhamAPI({
        maKH: form.maKH,
        maBacSi: form.maBacSi,
        maLichHen: form.maLichHen || null,
        trieuChung: form.trieuChung,
        chuanDoan: form.chuanDoan,
        ngayTaiKham: form.ngayTaiKham || null,
      });
      onSuccess(`Tạo hồ sơ thành công! Mã: ${res.maHoSo || "—"}`);
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
    <Modal title="📋 Tạo hồ sơ khám mới" onClose={onClose} width={540}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <FormField
          label="Mã khách hàng"
          placeholder="KH_0001"
          value={form.maKH}
          onChange={set("maKH")}
          required
        />
        <FormField
          label="Mã bác sĩ"
          placeholder="BS_0001"
          value={form.maBacSi}
          onChange={set("maBacSi")}
          required
        />
        <FormField
          label="Mã lịch hẹn"
          placeholder="LH_0001 (không bắt buộc)"
          value={form.maLichHen}
          onChange={set("maLichHen")}
        />
        <FormField
          label="Ngày tái khám"
          type="date"
          value={form.ngayTaiKham}
          onChange={set("ngayTaiKham")}
        />
        <FormField
          label="Triệu chứng"
          type="textarea"
          placeholder="Mô tả triệu chứng..."
          value={form.trieuChung}
          onChange={set("trieuChung")}
          required
          span={2}
        />
        <FormField
          label="Chẩn đoán"
          type="textarea"
          placeholder="Kết quả chẩn đoán..."
          value={form.chuanDoan}
          onChange={set("chuanDoan")}
          required
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
          {loading ? "Đang lưu..." : "✓ Tạo hồ sơ"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Modal lịch sử khám theo KH ──────────────────────────
function LichSuKhamModal({ onClose }) {
  const { theme: C } = useTheme();
  const [maKH, setMaKH] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!maKH.trim()) {
      setError("Vui lòng nhập mã khách hàng");
      return;
    }
    setLoading(true);
    setError("");
    setData([]);
    try {
      const res = await getLichSuKhamAPI(maKH.trim());
      setData(res || []);
      setSearched(true);
    } catch (e) {
      setError(e.message);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

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
    fontSize: 12,
  };

  return (
    <Modal
      title="🔍 Lịch sử khám theo khách hàng"
      onClose={onClose}
      width={640}
    >
      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input
          placeholder="Nhập mã KH (vd: KH_0001)"
          value={maKH}
          onChange={(e) => {
            setMaKH(e.target.value);
            setError("");
            setSearched(false);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          style={{
            flex: 1,
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "9px 12px",
            color: C.text,
            fontSize: 13,
            outline: "none",
          }}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          style={{
            padding: "9px 16px",
            borderRadius: 8,
            background: C.accent,
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {loading ? "..." : "Tìm"}
        </button>
      </div>
      {error && (
        <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 12 }}>
          ⚠ {error}
        </div>
      )}
      {searched && !loading && data.length === 0 && !error && (
        <div
          style={{
            textAlign: "center",
            padding: "24px 0",
            color: C.textMuted,
            fontSize: 13,
          }}
        >
          📭 Không có lịch sử khám
        </div>
      )}
      {data.length > 0 && (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                {[
                  "Mã HS",
                  "Ngày khám",
                  "BS",
                  "Triệu chứng",
                  "Chẩn đoán",
                  "Tái khám",
                ].map((h) => (
                  <th key={h} style={th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => (
                <tr
                  key={r.maHoSo || i}
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
                    {r.maHoSo}
                  </td>
                  <td style={{ ...td, color: C.textMuted }}>{r.ngayKham}</td>
                  <td style={{ ...td, color: C.textMuted }}>{r.maBacSi}</td>
                  <td style={{ ...td, maxWidth: 160 }}>
                    <span
                      title={r.trieuChung}
                      style={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 150,
                        color: C.textMuted,
                      }}
                    >
                      {r.trieuChung || "—"}
                    </span>
                  </td>
                  <td style={{ ...td, fontWeight: 600, color: C.text }}>
                    {r.chuanDoan}
                  </td>
                  <td
                    style={{
                      ...td,
                      color: r.ngayTaiKham ? "#f59e0b" : C.textDim,
                    }}
                  >
                    {r.ngayTaiKham || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

// ─── Main HoSoKhamPage ────────────────────────────────────
export default function HoSoKhamPage({ S }) {
  const { theme: C } = useTheme();
  const [showTao, setShowTao] = useState(false);
  const [showLichSu, setShowLichSu] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // Mock data hiển thị trước — sẽ thay bằng API khi có endpoint GET all
  const mockData = [
    {
      id: "HSK_001",
      kh: "KH_0001",
      bs: "BS_0001",
      ngay: "2026-03-20",
      trieuChung: "Đau nhức răng hàm trái",
      chuanDoan: "Sâu răng R36 độ 3",
      taiKham: "2026-03-27",
      trangThai: "Tái khám",
    },
    {
      id: "HSK_002",
      kh: "KH_0002",
      bs: "BS_0002",
      ngay: "2026-03-19",
      trieuChung: "Chảy máu lợi",
      chuanDoan: "Viêm lợi độ 1",
      taiKham: "2026-03-26",
      trangThai: "Đang điều trị",
    },
    {
      id: "HSK_003",
      kh: "KH_0003",
      bs: "BS_0001",
      ngay: "2026-03-18",
      trieuChung: "Tẩy trắng định kỳ",
      chuanDoan: "Không có bệnh lý",
      taiKham: null,
      trangThai: "Hoàn thành",
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
            Hồ sơ khám bệnh
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
            Tạo và tra cứu hồ sơ khám
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            style={{ ...S.btn("ghost"), fontSize: 12 }}
            onClick={() => setShowLichSu(true)}
          >
            🔍 Tra cứu theo KH
          </button>
          <button style={S.btn()} onClick={() => setShowTao(true)}>
            + Tạo hồ sơ
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
          {
            label: "Hoàn thành",
            value: mockData.filter((d) => d.trangThai === "Hoàn thành").length,
            color: "#22c55e",
          },
          {
            label: "Đang điều trị",
            value: mockData.filter((d) => d.trangThai === "Đang điều trị")
              .length,
            color: "#0ea5e9",
          },
          {
            label: "Cần tái khám",
            value: mockData.filter((d) => d.trangThai === "Tái khám").length,
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
        <div style={{ marginBottom: 14, display: "flex", gap: 10 }}>
          <input
            placeholder="🔍  Tìm mã HS, mã KH, bác sĩ..."
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
                "Mã HS",
                "Mã KH",
                "Mã BS",
                "Ngày khám",
                "Triệu chứng",
                "Chẩn đoán",
                "Tái khám",
                "Trạng thái",
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
                <td style={{ ...S.td, color: C.textMuted }}>{r.kh}</td>
                <td style={{ ...S.td, color: C.textMuted }}>{r.bs}</td>
                <td style={{ ...S.td, color: C.textMuted }}>{r.ngay}</td>
                <td
                  style={{
                    ...S.td,
                    fontSize: 12,
                    color: C.textMuted,
                    maxWidth: 150,
                  }}
                >
                  <span
                    title={r.trieuChung}
                    style={{
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: 140,
                    }}
                  >
                    {r.trieuChung}
                  </span>
                </td>
                <td style={{ ...S.td, fontWeight: 600, color: C.text }}>
                  {r.chuanDoan}
                </td>
                <td
                  style={{
                    ...S.td,
                    fontSize: 12,
                    color: r.taiKham ? "#f59e0b" : C.textDim,
                  }}
                >
                  {r.taiKham || "—"}
                </td>
                <td style={S.td}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: 20,
                      fontSize: 11,
                      fontWeight: 600,
                      background: (ST_COLOR[r.trangThai] || "#607090") + "22",
                      color: ST_COLOR[r.trangThai] || "#607090",
                    }}
                  >
                    {r.trangThai}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showTao && (
        <TaoHoSoModal
          onClose={() => setShowTao(false)}
          onSuccess={(msg) => {
            setShowTao(false);
            showToast(msg);
          }}
        />
      )}
      {showLichSu && <LichSuKhamModal onClose={() => setShowLichSu(false)} />}
    </div>
  );
}
