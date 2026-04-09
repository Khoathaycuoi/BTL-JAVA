import { useState, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";

const fmt = (v) => (v ? new Intl.NumberFormat("vi-VN").format(v) + "đ" : "—");

const mockLuong = [
  {
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
    thang: 3,
    nam: 2026,
    luongCB: 18000000,
    ngayCong: 21,
    ngayTre: 2,
    thuong: 0,
    phat: 400000,
    phuCap: 1000000,
  },
  {
    thang: 2,
    nam: 2026,
    luongCB: 18000000,
    ngayCong: 20,
    ngayTre: 1,
    thuong: 0,
    phat: 200000,
    phuCap: 1000000,
  },
  {
    thang: 1,
    nam: 2026,
    luongCB: 18000000,
    ngayCong: 23,
    ngayTre: 0,
    thuong: 3000000,
    phat: 0,
    phuCap: 1000000,
  },
  {
    thang: 12,
    nam: 2025,
    luongCB: 15000000,
    ngayCong: 22,
    ngayTre: 3,
    thuong: 5000000,
    phat: 600000,
    phuCap: 800000,
  },
];

const calcNet = (r) => r.luongCB + r.thuong + r.phuCap - r.phat;

export default function LuongCaNhan() {
  const { theme: C } = useTheme();
  const [selected, setSelected] = useState(0);

  const cur = mockLuong[selected];
  const net = calcNet(cur);
  const avg3 = useMemo(() => {
    const last3 = mockLuong.slice(0, 3);
    return Math.round(last3.reduce((s, r) => s + calcNet(r), 0) / last3.length);
  }, []);

  const rows = [
    ["Lương cơ bản", fmt(cur.luongCB), C.text],
    ["Thưởng", fmt(cur.thuong), "#22c55e"],
    ["Phụ cấp", fmt(cur.phuCap), "#0ea5e9"],
    ["Khấu trừ (phạt)", cur.phat > 0 ? `-${fmt(cur.phat)}` : "—", "#ef4444"],
  ];

  return (
    <div style={{ width: "100%", maxWidth: 880, margin: "0 auto" }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 4,
          color: C.text,
        }}
      >
        Lương của tôi
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
        Trung bình 3 tháng gần nhất:{" "}
        <b style={{ color: C.accent }}>{fmt(avg3)}</b>
      </div>

      {/* Chọn tháng */}
      <div
        style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}
      >
        {mockLuong.map((r, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 600,
              background: selected === i ? C.accent : "transparent",
              color: selected === i ? "#fff" : C.textMuted,
              border: selected !== i ? `1px solid ${C.border}` : "none",
            }}
          >
            T{r.thang}/{r.nam}
          </button>
        ))}
      </div>

      {/* Thực nhận nổi bật */}
      <div
        style={{
          background: C.surface,
          borderRadius: 14,
          border: `1px solid ${C.border}`,
          padding: 24,
          marginBottom: 16,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 8 }}>
          Thực nhận tháng {cur.thang}/{cur.nam}
        </div>
        <div style={{ fontSize: 36, fontWeight: 900, color: C.accent }}>
          {fmt(net)}
        </div>
        <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>
          {cur.ngayCong} ngày công •{" "}
          {cur.ngayTre > 0 ? `${cur.ngayTre} ngày trễ` : "Không trễ"}
        </div>
      </div>

      {/* Chi tiết */}
      <div
        style={{
          background: C.surface,
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          padding: 18,
          marginBottom: 16,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginBottom: 12,
          }}
        >
          Chi tiết lương
        </div>
        {rows.map(([k, v, col]) => (
          <div
            key={k}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px 0",
              borderBottom: `1px solid ${C.border}`,
              fontSize: 13,
            }}
          >
            <span style={{ color: C.textMuted }}>{k}</span>
            <span style={{ fontWeight: 700, color: col || C.text }}>{v}</span>
          </div>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "12px 0",
            fontSize: 14,
          }}
        >
          <span style={{ fontWeight: 700, color: C.text }}>Tổng thực nhận</span>
          <span style={{ fontWeight: 900, color: C.accent, fontSize: 16 }}>
            {fmt(net)}
          </span>
        </div>
      </div>

      {/* Lịch sử mini */}
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
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginBottom: 12,
          }}
        >
          Lịch sử lương
        </div>
        {mockLuong.map((r, i) => {
          const n = calcNet(r);
          const pct = Math.round((n / mockLuong[0].luongCB) * 100 * 0.7);
          return (
            <div
              key={i}
              onClick={() => setSelected(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "8px 0",
                cursor: "pointer",
                borderBottom:
                  i < mockLuong.length - 1 ? `1px solid ${C.border}` : "none",
                background: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C.bg)}
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <div
                style={{
                  width: 56,
                  fontSize: 12,
                  color: C.textMuted,
                  flexShrink: 0,
                }}
              >
                T{r.thang}/{r.nam}
              </div>
              <div
                style={{
                  flex: 1,
                  background: C.border,
                  borderRadius: 4,
                  height: 6,
                }}
              >
                <div
                  style={{
                    width: `${Math.min(pct, 100)}%`,
                    height: "100%",
                    borderRadius: 4,
                    background: C.accent,
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: selected === i ? C.accent : C.text,
                  flexShrink: 0,
                  minWidth: 120,
                  textAlign: "right",
                }}
              >
                {fmt(n)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
