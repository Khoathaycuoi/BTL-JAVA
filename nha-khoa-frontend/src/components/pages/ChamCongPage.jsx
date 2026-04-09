import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Modal from "../../components/ui/Modal";
import {
  duyetChamCongAPI,
  getDanhSachChamCongAPI,
  searchChamCongAPI,
} from "../../api/ChamCong";

const ST_COLOR = {
  "Đúng giờ": "#22c55e",
  "Đi muộn": "#f59e0b",
  "Vắng mặt": "#ef4444",
  "Chờ duyệt": "#0ea5e9",
};

const normalizeTime = (value) => {
  if (!value) return null;
  const text = String(value);
  return text.length >= 5 ? text.slice(0, 5) : text;
};

const normalizeRecord = (record) => ({
  maChamCong: record.maChamCong,
  ten:
    record?.tenNhanVien ||
    record?.nhanVien?.hoTen ||
    record?.nhanVien?.tenNhanVien ||
    record?.hoTenNhanVien ||
    "Không rõ",
  ngay: record.ngayChamCong || record.ngay || "",
  gioVao: normalizeTime(record.gioVaoThucTe || record.gioVao),
  gioRa: normalizeTime(record.gioRaThucTe || record.gioRa),
  trangThaiDiLam: record.trangThai || record.trangThaiDiLam || "Chờ duyệt",
  trangThaiDuyet: record.trangThaiDuyet || "Chờ duyệt",
  soPhutTre: Number(record.soPhutTre || 0),
});

// ─── Modal duyệt chấm công ────────────────────────────────
function DuyetModal({ record, onClose, onSuccess }) {
  const { theme: C } = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [trangThaiDuyet, setTTDuyet] = useState("Đã duyệt");
  const [trangThaiDiLam, setTTDiLam] = useState(
    record.trangThaiDiLam || "Đúng giờ",
  );
  const [soPhutTre, setSoPhutTre] = useState(record.soPhutTre || 0);

  const handleDuyet = async () => {
    setLoading(true);
    setError("");
    try {
      const soPhutTreSafe = Math.min(
        480,
        Math.max(0, Number.isFinite(Number(soPhutTre)) ? Number(soPhutTre) : 0),
      );
      const isApproved = trangThaiDuyet === "Đã duyệt";
      await duyetChamCongAPI(record.maChamCong, {
        trangThaiDuyet,
        // Chỉ cập nhật trạng thái đi làm khi duyệt.
        trangThaiDiLam: isApproved ? trangThaiDiLam || undefined : undefined,
        soPhutTre:
          isApproved && trangThaiDiLam === "Đi muộn"
            ? soPhutTreSafe
            : undefined,
      });
      await onSuccess(`Đã duyệt chấm công ${record.maChamCong}`);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const selectSt = {
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: C.text,
    fontSize: 13,
    outline: "none",
    width: "100%",
  };

  return (
    <Modal
      title={`✓ Duyệt chấm công: ${record.maChamCong}`}
      onClose={onClose}
      width={440}
    >
      {/* Thông tin bản ghi */}
      <div
        style={{
          background: C.bg,
          borderRadius: 8,
          padding: "12px 14px",
          marginBottom: 16,
          border: `1px solid ${C.border}`,
        }}
      >
        <div style={{ fontWeight: 600, color: C.text, marginBottom: 6 }}>
          {record.ten}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted }}>
          {record.ngay} • Vào: {record.gioVao || "—"} • Ra:{" "}
          {record.gioRa || "—"}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <div
            style={{
              fontSize: 12,
              color: C.textMuted,
              fontWeight: 600,
              marginBottom: 6,
            }}
          >
            Quyết định duyệt
          </div>
          <select
            value={trangThaiDuyet}
            onChange={(e) => setTTDuyet(e.target.value)}
            style={selectSt}
          >
            <option value="Đã duyệt">✓ Đã duyệt</option>
            <option value="Từ chối">✗ Từ chối</option>
          </select>
        </div>

        {trangThaiDuyet === "Đã duyệt" && (
          <div>
            <div
              style={{
                fontSize: 12,
                color: C.textMuted,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Tình trạng đi làm
            </div>
            <select
              value={trangThaiDiLam}
              onChange={(e) => setTTDiLam(e.target.value)}
              style={selectSt}
            >
              <option value="Đúng giờ">Đúng giờ</option>
              <option value="Đi muộn">Đi muộn</option>
            </select>
          </div>
        )}
        {trangThaiDuyet === "Đã duyệt" && trangThaiDiLam === "Đi muộn" && (
          <div>
            <div
              style={{
                fontSize: 12,
                color: C.textMuted,
                fontWeight: 600,
                marginBottom: 6,
              }}
            >
              Số phút trễ
            </div>
            <input
              type="number"
              min={1}
              max={480}
              value={soPhutTre}
              onChange={(e) =>
                setSoPhutTre(
                  Math.min(480, Math.max(0, Number(e.target.value || 0))),
                )
              }
              style={{ ...selectSt, width: "unset", minWidth: 120 }}
            />
          </div>
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
          onClick={handleDuyet}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            background: C.accent,
            color: "#fff",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 600,
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "Đang lưu..." : "✓ Xác nhận duyệt"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Main ChamCongPage ────────────────────────────────────
export default function ChamCongPage({ S }) {
  const { theme: C } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tenNVFilter, setTenNVFilter] = useState("");
  const [ngayFilter, setNgayFilter] = useState("");
  const [trangThaiDuyetFilter, setTrangThaiDuyetFilter] = useState("");
  const [duyetRecord, setDuyetRecord] = useState(null);
  const [toast, setToast] = useState({ msg: "", type: "success" });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const hasFilter = Boolean(
        tenNVFilter || ngayFilter || trangThaiDuyetFilter,
      );
      const res = hasFilter
        ? await searchChamCongAPI({
            tenNV: tenNVFilter,
            ngay: ngayFilter,
            trangThaiDuyet: trangThaiDuyetFilter,
          })
        : await getDanhSachChamCongAPI();
      setData(Array.isArray(res) ? res.map(normalizeRecord) : []);
    } catch (e) {
      showToast(e.message || "Không tải được dữ liệu chấm công", "error");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [tenNVFilter, ngayFilter, trangThaiDuyetFilter]);

  const filtered = useMemo(() => data, [data]);

  const choDuyet = data.filter((r) => r.trangThaiDuyet === "Chờ duyệt").length;

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
            Quản lý chấm công
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
            {loading && (
              <span style={{ color: C.textMuted, fontWeight: 600 }}>
                Đang tải dữ liệu thật... •{" "}
              </span>
            )}
            {choDuyet > 0 && (
              <span style={{ color: "#f59e0b", fontWeight: 600 }}>
                ⚠ {choDuyet} bản ghi chờ duyệt •{" "}
              </span>
            )}
            {data.length} bản ghi
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          {
            label: "Chờ duyệt",
            value: data.filter((r) => r.trangThaiDuyet === "Chờ duyệt").length,
            color: "#f59e0b",
          },
          {
            label: "Đã duyệt",
            value: data.filter((r) => r.trangThaiDuyet === "Đã duyệt").length,
            color: "#22c55e",
          },
          {
            label: "Đi muộn",
            value: data.filter((r) => r.trangThaiDiLam === "Đi muộn").length,
            color: "#f59e0b",
          },
          {
            label: "Vắng mặt",
            value: data.filter((r) => r.trangThaiDiLam === "Vắng mặt").length,
            color: "#ef4444",
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

      <div style={S.card}>
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginBottom: 14,
            alignItems: "center",
          }}
        >
          <input
            placeholder="🔍  Tìm tên nhân viên..."
            value={tenNVFilter}
            onChange={(e) => setTenNVFilter(e.target.value)}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "8px 12px",
              color: C.text,
              fontSize: 13,
              outline: "none",
              width: 240,
            }}
          />
          <select
            value={trangThaiDuyetFilter}
            onChange={(e) => setTrangThaiDuyetFilter(e.target.value)}
            style={{
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "8px 12px",
              color: C.text,
              fontSize: 13,
              outline: "none",
            }}
          >
            <option value="">Tất cả</option>
            <option value="Chờ duyệt">Chờ duyệt</option>
            <option value="Đã duyệt">Đã duyệt</option>
            <option value="Từ chối">Từ chối</option>
          </select>
          <input
            type="date"
            value={ngayFilter}
            onChange={(e) => setNgayFilter(e.target.value)}
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
          {(tenNVFilter || ngayFilter || trangThaiDuyetFilter) && (
            <button
              onClick={() => {
                setTenNVFilter("");
                setNgayFilter("");
                setTrangThaiDuyetFilter("");
              }}
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
              ✕
            </button>
          )}
          <span
            style={{ marginLeft: "auto", fontSize: 12, color: C.textMuted }}
          >
            {filtered.length} kết quả
          </span>
        </div>

        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {[
                "Mã CC",
                "Nhân viên",
                "Ngày",
                "Giờ vào",
                "Giờ ra",
                "Tình trạng",
                "Phút trễ",
                "Duyệt",
                "",
              ].map((h) => (
                <th key={h} style={S.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
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
                  {r.maChamCong}
                </td>
                <td style={{ ...S.td, fontWeight: 600, color: C.text }}>
                  {r.ten}
                </td>
                <td style={{ ...S.td, color: C.textMuted }}>{r.ngay}</td>
                <td style={{ ...S.td, color: "#22c55e", fontWeight: 600 }}>
                  {r.gioVao || "—"}
                </td>
                <td style={{ ...S.td, color: "#0ea5e9", fontWeight: 600 }}>
                  {r.gioRa || "—"}
                </td>
                <td style={S.td}>
                  {r.trangThaiDiLam ? (
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
                          (ST_COLOR[r.trangThaiDiLam] || "#607090") + "22",
                        color: ST_COLOR[r.trangThaiDiLam] || "#607090",
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          background: ST_COLOR[r.trangThaiDiLam] || "#607090",
                          display: "inline-block",
                        }}
                      />
                      {r.trangThaiDiLam}
                    </span>
                  ) : (
                    <span style={{ color: C.textDim }}>—</span>
                  )}
                </td>
                <td
                  style={{
                    ...S.td,
                    color: r.soPhutTre > 0 ? "#f59e0b" : C.textDim,
                    fontWeight: r.soPhutTre > 0 ? 700 : 400,
                  }}
                >
                  {r.soPhutTre > 0 ? `+${r.soPhutTre}ph` : "—"}
                </td>
                <td style={S.td}>
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color:
                        r.trangThaiDuyet === "Đã duyệt"
                          ? "#22c55e"
                          : r.trangThaiDuyet === "Từ chối"
                            ? "#ef4444"
                            : "#f59e0b",
                    }}
                  >
                    {r.trangThaiDuyet}
                  </span>
                </td>
                <td style={S.td}>
                  {r.trangThaiDuyet === "Chờ duyệt" && (
                    <button
                      style={{
                        ...S.btn("ghost"),
                        padding: "4px 8px",
                        fontSize: 11,
                        color: C.accent,
                        borderColor: C.accent + "40",
                      }}
                      onClick={() => setDuyetRecord(r)}
                    >
                      ✓ Duyệt
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  style={{ ...S.td, textAlign: "center", color: C.textMuted }}
                  colSpan={9}
                >
                  Chưa có dữ liệu chấm công thực tế.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {duyetRecord && (
        <DuyetModal
          record={duyetRecord}
          onClose={() => setDuyetRecord(null)}
          onSuccess={async (msg) => {
            await loadData();
            setDuyetRecord(null);
            showToast(msg);
          }}
        />
      )}
    </div>
  );
}
