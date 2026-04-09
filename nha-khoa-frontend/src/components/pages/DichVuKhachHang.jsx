import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getAllDichVuAPI } from "../../api/DichVu";

const fmt = (v) =>
  v ? new Intl.NumberFormat("vi-VN").format(v) + "đ" : "Liên hệ";

const normalizeText = (v = "") =>
  String(v)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const isDichVuHoatDong = (dv) => {
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

const extractDichVuRows = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  if (Array.isArray(payload?.result)) return payload.result;
  if (Array.isArray(payload?.items)) return payload.items;
  return [];
};

const DV_ICONS = {
  khám: "🦷",
  nhổ: "🔧",
  trám: "🔩",
  tẩy: "✨",
  "x-quang": "📸",
  niềng: "⚙️",
  tủy: "💊",
  lợi: "🩺",
};

function getDvIcon(ten = "") {
  const t = ten.toLowerCase();
  for (const [k, v] of Object.entries(DV_ICONS)) {
    if (t.includes(k)) return v;
  }
  return "🦷";
}

export default function DichVuKhachHang({ S }) {
  const { theme: C } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllDichVuAPI()
      .then((payload) =>
        setData(extractDichVuRows(payload).filter((d) => isDichVuHoatDong(d))),
      )
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter(
    (d) =>
      (d.tenDichVu || "").toLowerCase().includes(search.toLowerCase()) ||
      (d.moTa || "").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
          🦷 Dịch vụ phòng khám
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
          {loading ? "Đang tải..." : `${data.length} dịch vụ đang hoạt động`}
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input
          placeholder="🔍  Tìm dịch vụ..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 10,
            padding: "10px 16px",
            color: C.text,
            fontSize: 13,
            outline: "none",
            width: "100%",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Loading */}
      {loading && (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
          <div style={{ fontSize: 13 }}>Đang tải danh sách dịch vụ...</div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 13, color: "#ef4444" }}>{error}</div>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div
          style={{ textAlign: "center", padding: "60px 0", color: C.textMuted }}
        >
          <div style={{ fontSize: 36, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 13 }}>
            {search ? "Không tìm thấy dịch vụ phù hợp" : "Chưa có dịch vụ nào"}
          </div>
        </div>
      )}

      {/* Grid cards */}
      {!loading && !error && filtered.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}
        >
          {filtered.map((dv, i) => (
            <div
              key={dv.maDichVu || i}
              style={{
                background: C.surface,
                borderRadius: 14,
                border: `1px solid ${C.border}`,
                padding: 20,
                transition: "transform .15s, box-shadow .15s",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = `0 8px 24px rgba(0,0,0,0.12)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {/* Icon + tên */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${C.accent}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {getDvIcon(dv.tenDichVu)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
                    {dv.tenDichVu}
                  </div>
                  <div
                    style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}
                  >
                    {dv.maDichVu}
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              {dv.moTa && (
                <div
                  style={{
                    fontSize: 12,
                    color: C.textMuted,
                    lineHeight: 1.6,
                    marginBottom: 14,
                    minHeight: 36,
                  }}
                >
                  {dv.moTa}
                </div>
              )}

              {/* Giá */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 12,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <span
                  style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}
                >
                  Đơn giá
                </span>
                <span
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: C.accent,
                  }}
                >
                  {fmt(dv.donGia)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ghi chú */}
      {!loading && !error && data.length > 0 && (
        <div
          style={{
            marginTop: 24,
            padding: "12px 16px",
            background: `${C.accent}10`,
            border: `1px solid ${C.accent}30`,
            borderRadius: 10,
            fontSize: 12,
            color: C.textMuted,
            lineHeight: 1.6,
          }}
        >
          💡 Giá niêm yết có thể thay đổi tuỳ theo tình trạng thực tế. Vui lòng
          liên hệ phòng khám để được tư vấn chi tiết.
        </div>
      )}
    </div>
  );
}
