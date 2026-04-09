import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const mockPhong = [
  {
    id: "P101",
    ten: "Phòng 101",
    bs: "BS. Trần Minh Khoa",
    trang_thai: "Đang khám",
    bn_hien_tai: "Nguyễn Văn An",
    so_thiet_bi: 5,
  },
  {
    id: "P102",
    ten: "Phòng 102",
    bs: "BS. Nguyễn Thị Hoa",
    trang_thai: "Đang khám",
    bn_hien_tai: "Lê Thị Bình",
    so_thiet_bi: 5,
  },
  {
    id: "P103",
    ten: "Phòng 103",
    bs: "BS. Lê Văn Nam",
    trang_thai: "Trống",
    bn_hien_tai: null,
    so_thiet_bi: 4,
  },
  {
    id: "P104",
    ten: "Phòng 104",
    bs: "—",
    trang_thai: "Bảo trì",
    bn_hien_tai: null,
    so_thiet_bi: 3,
  },
  {
    id: "P105",
    ten: "Phòng 105",
    bs: "—",
    trang_thai: "Trống",
    bn_hien_tai: null,
    so_thiet_bi: 5,
  },
  {
    id: "P106",
    ten: "Phòng X-Quang",
    bs: "—",
    trang_thai: "Trống",
    bn_hien_tai: null,
    so_thiet_bi: 2,
  },
];

export default function PhongPage({ S }) {
  const { theme: C } = useTheme();

  const stColor = (s) =>
    s === "Đang khám" ? "#f59e0b" : s === "Trống" ? "#22c55e" : "#ef4444";

  const stIcon = (s) =>
    s === "Đang khám" ? "🔴" : s === "Trống" ? "🟢" : "🟡";

  const counts = {
    dang_kham: mockPhong.filter((p) => p.trang_thai === "Đang khám").length,
    trong: mockPhong.filter((p) => p.trang_thai === "Trống").length,
    bao_tri: mockPhong.filter((p) => p.trang_thai === "Bảo trì").length,
  };

  return (
    <div>
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
            Quản lý phòng khám
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
            {mockPhong.length} phòng • {counts.trong} phòng trống
          </div>
        </div>
        <button style={S.btn()}>+ Thêm phòng</button>
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
          { label: "Đang khám", value: counts.dang_kham, color: "#f59e0b" },
          { label: "Phòng trống", value: counts.trong, color: "#22c55e" },
          { label: "Bảo trì", value: counts.bao_tri, color: "#ef4444" },
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

      {/* Card grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3,1fr)",
          gap: 16,
        }}
      >
        {mockPhong.map((p) => (
          <div
            key={p.id}
            style={{
              ...S.card,
              borderTop: `3px solid ${stColor(p.trang_thai)}`,
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
                {p.ten}
              </div>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "3px 10px",
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  background: stColor(p.trang_thai) + "22",
                  color: stColor(p.trang_thai),
                }}
              >
                {stIcon(p.trang_thai)} {p.trang_thai}
              </span>
            </div>
            {[
              ["👨‍⚕️ Bác sĩ", p.bs],
              ["👤 Bệnh nhân", p.bn_hien_tai || "—"],
              ["🔧 Thiết bị", `${p.so_thiet_bi} thiết bị`],
            ].map(([k, v]) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 12,
                }}
              >
                <span style={{ color: C.textMuted }}>{k}</span>
                <span style={{ color: C.text, fontWeight: 500 }}>{v}</span>
              </div>
            ))}
            <div style={{ display: "flex", gap: 6, marginTop: 12 }}>
              <button
                style={{
                  ...S.btn("ghost"),
                  flex: 1,
                  padding: "5px 0",
                  fontSize: 12,
                }}
              >
                ✏️ Sửa
              </button>
              {p.trang_thai === "Bảo trì" && (
                <button
                  style={{
                    ...S.btn(),
                    flex: 1,
                    padding: "5px 0",
                    fontSize: 12,
                  }}
                >
                  ✓ Kích hoạt
                </button>
              )}
              {p.trang_thai === "Trống" && (
                <button
                  style={{
                    ...S.btn("ghost"),
                    flex: 1,
                    padding: "5px 0",
                    fontSize: 12,
                    color: "#f59e0b",
                  }}
                >
                  🔧 Bảo trì
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
