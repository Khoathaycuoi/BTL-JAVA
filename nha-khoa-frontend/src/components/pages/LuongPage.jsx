/**
 * views/shared/LuongPage.jsx
 * Bảng lương toàn bộ nhân viên — Admin
 * (Mock data — API lương chưa có endpoint GET all)
 */
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

const fmt = (v) => (v ? new Intl.NumberFormat("vi-VN").format(v) + "đ" : "—");

const mockLuong = [
  {
    id: "NV_001",
    ten: "BS. Trần Minh Khoa",
    thang: 4,
    nam: 2026,
    luongCB: 18000000,
    ngayCong: 22,
    ngayTre: 0,
    thuong: 2000000,
    phat: 0,
    phuCap: 1000000,
  },
  {
    id: "NV_002",
    ten: "BS. Nguyễn Thị Hoa",
    thang: 4,
    nam: 2026,
    luongCB: 18000000,
    ngayCong: 21,
    ngayTre: 2,
    thuong: 0,
    phat: 400000,
    phuCap: 1000000,
  },
  {
    id: "NV_003",
    ten: "BS. Lê Văn Nam",
    thang: 4,
    nam: 2026,
    luongCB: 16000000,
    ngayCong: 22,
    ngayTre: 1,
    thuong: 0,
    phat: 200000,
    phuCap: 800000,
  },
  {
    id: "NV_004",
    ten: "Nguyễn Thu Hà",
    thang: 4,
    nam: 2026,
    luongCB: 10000000,
    ngayCong: 22,
    ngayTre: 0,
    thuong: 1000000,
    phat: 0,
    phuCap: 500000,
  },
  {
    id: "NV_005",
    ten: "Trần Văn Bình",
    thang: 4,
    nam: 2026,
    luongCB: 10000000,
    ngayCong: 19,
    ngayTre: 3,
    thuong: 0,
    phat: 600000,
    phuCap: 500000,
  },
];

const calcNet = (r) => r.luongCB + r.thuong + r.phuCap - r.phat;

export default function LuongPage({ S }) {
  const { theme: C } = useTheme();
  const [thang, setThang] = useState(4);
  const [nam, setNam] = useState(2026);

  const filtered = mockLuong.filter((r) => r.thang === thang && r.nam === nam);
  const tongQuy = filtered.reduce((s, r) => s + calcNet(r), 0);

  return (
    <div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 4,
          color: C.text,
        }}
      >
        Bảng lương
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
        Tổng quỹ lương: <b style={{ color: C.accent }}>{fmt(tongQuy)}</b>
      </div>

      {/* Filter tháng */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <div style={{ fontSize: 12, color: C.textMuted, fontWeight: 600 }}>
          Tháng:
        </div>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m) => (
          <button
            key={m}
            onClick={() => setThang(m)}
            style={{
              padding: "5px 11px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: thang === m ? C.accent : "transparent",
              color: thang === m ? "#fff" : C.textMuted,
              border: thang !== m ? `1px solid ${C.border}` : "none",
            }}
          >
            {m}
          </button>
        ))}
        <select
          value={nam}
          onChange={(e) => setNam(Number(e.target.value))}
          style={{
            marginLeft: 8,
            background: C.bg,
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            padding: "6px 10px",
            color: C.text,
            fontSize: 13,
            outline: "none",
          }}
        >
          {[2024, 2025, 2026].map((y) => (
            <option key={y}>{y}</option>
          ))}
        </select>
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
          { label: "Tổng quỹ lương", value: fmt(tongQuy), color: C.accent },
          {
            label: "Tổng thưởng",
            value: fmt(filtered.reduce((s, r) => s + r.thuong, 0)),
            color: "#22c55e",
          },
          {
            label: "Tổng phạt",
            value: fmt(filtered.reduce((s, r) => s + r.phat, 0)),
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
            <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div style={S.card}>
        {filtered.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: C.textMuted,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 13 }}>
              Không có dữ liệu lương tháng {thang}/{nam}
            </div>
          </div>
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                {[
                  "Mã",
                  "Họ tên",
                  "Ngày công",
                  "Trễ",
                  "Lương CB",
                  "Thưởng",
                  "Phụ cấp",
                  "Phạt",
                  "Thực nhận",
                ].map((h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => {
                const net = calcNet(r);
                return (
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
                      {r.id}
                    </td>
                    <td style={{ ...S.td, fontWeight: 700, color: C.text }}>
                      {r.ten}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        textAlign: "center",
                        fontWeight: 600,
                        color: C.text,
                      }}
                    >
                      {r.ngayCong}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        textAlign: "center",
                        color: r.ngayTre > 0 ? "#f59e0b" : C.textDim,
                        fontWeight: r.ngayTre > 0 ? 700 : 400,
                      }}
                    >
                      {r.ngayTre > 0 ? r.ngayTre : "—"}
                    </td>
                    <td style={{ ...S.td, color: C.textMuted }}>
                      {fmt(r.luongCB)}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        color: "#22c55e",
                        fontWeight: r.thuong > 0 ? 700 : 400,
                      }}
                    >
                      {r.thuong > 0 ? fmt(r.thuong) : "—"}
                    </td>
                    <td style={{ ...S.td, color: C.textMuted }}>
                      {fmt(r.phuCap)}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        color: r.phat > 0 ? "#ef4444" : C.textDim,
                        fontWeight: r.phat > 0 ? 700 : 400,
                      }}
                    >
                      {r.phat > 0 ? `-${fmt(r.phat)}` : "—"}
                    </td>
                    <td
                      style={{
                        ...S.td,
                        fontWeight: 800,
                        color: C.accent,
                        fontSize: 14,
                      }}
                    >
                      {fmt(net)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
