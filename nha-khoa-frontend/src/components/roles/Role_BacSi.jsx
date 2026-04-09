import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";
import ChamCongCaNhan from "../pages/ChamCongCaNhan";
import LuongCaNhan from "../pages/LuongCaNhan";
import LichHenPage from "../pages/LichHenPage";
import ProfilePage from "../shared/ProfilePage";
import { getMyInfoAPI } from "../../api/User";

const ACCENT = "#0ea5e9";

const NAV = [
  {
    group: "Tổng quan",
    items: [{ id: "dashboard", icon: "📊", label: "Dashboard" }],
  },
  {
    group: "Làm việc",
    items: [
      { id: "lich-kham", icon: "📅", label: "Lịch hẹn" },
      { id: "ho-so", icon: "📋", label: "Hồ sơ bệnh nhân" },
      { id: "don-thuoc", icon: "💊", label: "Kê đơn thuốc" },
    ],
  },
  {
    group: "Cá nhân",
    items: [
      { id: "cham-cong", icon: "⏱️", label: "Chấm công" },
      { id: "luong", icon: "💵", label: "Lương của tôi" },
    ],
  },
];

const pageTitle = {
  dashboard: "Dashboard",
  "lich-kham": "Lịch hẹn",
  "ho-so": "Hồ sơ bệnh nhân",
  "don-thuoc": "Kê đơn thuốc",
  "cham-cong": "Chấm công",
  luong: "Lương của tôi",
};

function makeS(C) {
  return {
    app: {
      display: "flex",
      height: "100vh",
      background: C.bg,
      color: C.text,
      fontFamily: "'DM Sans','Segoe UI',sans-serif",
      overflow: "hidden",
      transition: "background .3s",
    },
    sidebar: {
      width: 230,
      background: C.surface,
      borderRight: `1px solid ${C.border}`,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
      transition: "background .3s",
    },
    navItem: (a) => ({
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "9px 12px",
      margin: "2px 8px",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 13,
      background: a ? ACCENT + "20" : "transparent",
      color: a ? ACCENT : C.textMuted,
      borderLeft: a ? `2px solid ${ACCENT}` : "2px solid transparent",
      transition: "all .15s",
    }),
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    topbar: {
      height: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 24px",
      borderBottom: `1px solid ${C.border}`,
      background: C.surface,
      transition: "background .3s",
    },
    content: { flex: 1, overflow: "auto", padding: 20 },
    card: {
      background: C.surface,
      borderRadius: 12,
      borderStyle: "solid",
      borderColor: C.border,
      borderWidth: 1,
      padding: 18,
    },
    badge: (color) => ({
      display: "inline-block",
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 11,
      fontWeight: 600,
      background: color + "22",
      color: color,
    }),
    btn: (v = "primary") => ({
      padding: "8px 14px",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 600,
      background: v === "primary" ? ACCENT : "transparent",
      color: v === "primary" ? "#fff" : C.text,
      border: v === "ghost" ? `1px solid ${C.border}` : "none",
    }),
    th: {
      padding: "9px 12px",
      textAlign: "left",
      fontSize: 10,
      fontWeight: 700,
      color: C.textMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      borderBottom: `1px solid ${C.border}`,
    },
    td: {
      padding: "10px 12px",
      borderBottom: `1px solid ${C.border}`,
      fontSize: 13,
    },
  };
}

export default function BacSiDashboard({ onLogout, user }) {
  const { theme: C } = useTheme();
  const S = makeS(C);
  const [page, setPage] = useState("dashboard");

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getMyInfoAPI()
      .then(setUserInfo)
      .catch((e) => console.log(e));
  }, []);

  const displayName = userInfo?.ten || "Đang tải...";
  const avatarLetter =
    userInfo?.ten?.split(" ").pop()[0]?.toUpperCase() || "BS";

  return (
    <div style={S.app}>
      <div style={S.sidebar}>
        <div
          style={{
            padding: "20px 16px 16px",
            borderBottom: `1px solid ${C.border}`,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: `linear-gradient(135deg,${ACCENT},#38bdf8)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
              marginBottom: 10,
            }}
          >
            🦷
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>
            Nha Khoa Management
          </div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>
            Cổng thông tin Bác sĩ
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {NAV.map((g) => (
            <div key={g.group}>
              <div
                style={{
                  padding: "8px 12px 4px",
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.textDim,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                {g.group}
              </div>
              {g.items.map((item) => (
                <div
                  key={item.id}
                  style={S.navItem(page === item.id)}
                  onClick={() => setPage(item.id)}
                >
                  <span style={{ fontSize: 14 }}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{ padding: "12px 16px", borderTop: `1px solid ${C.border}` }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px",
              borderRadius: 8,
              background: C.bg,
              cursor: "pointer",
            }}
            onClick={() => setPage("profile")}
          >
            <div
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${ACCENT},#38bdf8)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {avatarLetter}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>
                BS.{displayName}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted }}>
                Xem hồ sơ →
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={S.main}>
        <div style={S.topbar}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
            {pageTitle[page] || page}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12, color: C.textMuted }}>
              CN, 22/03/2026
            </div>
            <ThemeToggle />
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${ACCENT},#38bdf8)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              {avatarLetter}
            </div>
          </div>
        </div>
        <div style={S.content}>
          {page === "dashboard" && (
            <DashboardPage C={C} S={S} setPage={setPage} userInfo={userInfo} />
          )}
          {page === "lich-kham" && <LichHenPage S={S} role="bacsi" />}
          {page === "ho-so" && <HoSoPage C={C} S={S} />}
          {page === "don-thuoc" && <DonThuocPage C={C} S={S} />}
          {page === "cham-cong" && <ChamCongCaNhan user={user} />}
          {page === "luong" && <LuongCaNhan user={user} />}
          {page === "profile" && <ProfilePage onLogout={onLogout} />}
          {![
            "dashboard",
            "lich-kham",
            "ho-so",
            "don-thuoc",
            "cham-cong",
            "luong",
            "profile",
          ].includes(page) && <Placeholder title={pageTitle[page]} C={C} />}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ C, S, setPage, userInfo }) {
  const lichKham = [
    {
      t: "09:00",
      n: "Nguyễn Văn An",
      s: "Nhổ răng khôn",
      note: "Hẹn lần 2 • Không dị ứng",
      c: "#6366f1",
      warn: false,
    },
    {
      t: "10:30",
      n: "Lê Thị Bình",
      s: "Trám răng",
      note: "Bệnh nhân cũ • Lần 3",
      c: "#10b981",
      warn: false,
    },
    {
      t: "14:00",
      n: "Phạm Quốc Cường",
      s: "Tẩy trắng răng",
      note: "⚠ Dị ứng Penicillin",
      c: "#ef4444",
      warn: true,
    },
  ];
  return (
    <div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 800,
          marginBottom: 4,
          color: C.text,
        }}
      >
        Xin chào, {userInfo ? userInfo.ten : "Bác sĩ"} 👨‍⚕️
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}></div>
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
            label: "Ca khám hôm nay",
            value: "8",
            sub: "5 xác nhận • 3 chờ",
            color: ACCENT,
            icon: "◷",
          },
          {
            label: "Ca tiếp theo",
            value: "09:00",
            sub: "Nguyễn Văn An — Nhổ răng",
            color: "#22c55e",
            icon: "▶",
          },
          {
            label: "Bệnh nhân T3",
            value: "42",
            sub: "▲ 6 so với tháng trước",
            color: "#6366f1",
            icon: "◎",
          },
          {
            label: "Đơn thuốc đã kê",
            value: "18",
            sub: "Tháng 3/2026",
            color: "#f59e0b",
            icon: "⊕",
          },
        ].map((s) => (
          <div
            key={s.label}
            style={{ ...S.card, borderTop: `3px solid ${s.color}` }}
          >
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>
              {s.label}
            </div>
            <div
              style={{
                fontSize: 26,
                fontWeight: 800,
                color: C.text,
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted }}>{s.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={S.card}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 14,
              fontSize: 14,
              color: C.text,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            📋 Lịch khám hôm nay
            <button
              style={{ ...S.btn("ghost"), padding: "4px 10px", fontSize: 11 }}
              onClick={() => setPage("lich-kham")}
            >
              Xem đầy đủ →
            </button>
          </div>
          {lichKham.map(({ t, n, s, note, c, warn }) => (
            <div
              key={t}
              style={{
                display: "flex",
                gap: 12,
                padding: "12px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: c + "20",
                  color: c,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  flexShrink: 0,
                }}
              >
                ◷
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 3,
                  }}
                >
                  <span
                    style={{ fontSize: 13, fontWeight: 600, color: C.text }}
                  >
                    {n}
                  </span>
                  <span style={S.badge(ACCENT)}>{t}</span>
                  {warn && <span style={S.badge("#ef4444")}>⚠ Dị ứng</span>}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>{s}</div>
                <div style={{ fontSize: 11, color: C.textDim, marginTop: 2 }}>
                  {note}
                </div>
              </div>
              <button
                style={{
                  ...S.btn(),
                  padding: "5px 10px",
                  fontSize: 11,
                  alignSelf: "center",
                }}
              >
                Khám
              </button>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.card}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 14,
                fontSize: 14,
                color: C.text,
              }}
            >
              📁 Hồ sơ gần đây
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12,
              }}
            >
              <thead>
                <tr>
                  {["Bệnh nhân", "Ngày", "Chẩn đoán"].map((h) => (
                    <th key={h} style={S.th}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Trần Văn B", "20/03", "Viêm lợi độ 2"],
                  ["Nguyễn Thị C", "19/03", "Sâu răng R36"],
                  ["Lê Văn D", "18/03", "Nhổ răng R48"],
                  ["Phạm Thị E", "15/03", "Điều trị tủy"],
                ].map(([n, d, cd], i) => (
                  <tr
                    key={i}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = C.surfaceHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ ...S.td, fontWeight: 600, color: C.text }}>
                      {n}
                    </td>
                    <td style={{ ...S.td, color: C.textMuted }}>{d}</td>
                    <td style={{ ...S.td, fontSize: 11, color: C.textMuted }}>
                      {cd}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={S.card}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 12,
                fontSize: 14,
                color: C.text,
              }}
            >
              📊 Thống kê cá nhân T3
            </div>
            {[
              ["Tổng ca khám", "42", ACCENT],
              ["Ca hoàn thành", "38", "#22c55e"],
              ["Tái khám", "12", "#f59e0b"],
              ["Ca mới", "30", "#6366f1"],
            ].map(([l, v, c]) => (
              <div
                key={l}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "7px 0",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 13,
                }}
              >
                <span style={{ color: C.textMuted }}>{l}</span>
                <span style={{ fontWeight: 700, color: c }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function HoSoPage({ C, S }) {
  const data = [
    {
      id: "HS001",
      n: "Nguyễn Văn An",
      ngay: "20/03",
      td: "Nhổ răng khôn R38",
      cd: "Viêm lợi quanh thân răng",
      tt: "Hoàn thành",
    },
    {
      id: "HS002",
      n: "Lê Thị Bình",
      ngay: "18/03",
      td: "Đau nhức răng hàm",
      cd: "Sâu răng độ 3 R46",
      tt: "Đang điều trị",
    },
    {
      id: "HS003",
      n: "Phạm Quốc Cường",
      ngay: "15/03",
      td: "Tẩy trắng định kỳ",
      cd: "Không có bệnh lý",
      tt: "Hoàn thành",
    },
    {
      id: "HS004",
      n: "Hoàng Thị Dung",
      ngay: "10/03",
      td: "Chảy máu lợi",
      cd: "Viêm lợi độ 1",
      tt: "Tái khám",
    },
  ];
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
            Hồ sơ bệnh nhân
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
            {data.length} hồ sơ gần đây
          </div>
        </div>
        <button style={S.btn()}>+ Tạo hồ sơ mới</button>
      </div>
      <div style={S.card}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {[
                "Mã HS",
                "Bệnh nhân",
                "Ngày khám",
                "Triệu chứng",
                "Chẩn đoán",
                "Tình trạng",
                "",
              ].map((h) => (
                <th key={h} style={S.th}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
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
                <td style={{ ...S.td, fontWeight: 600, color: C.text }}>
                  {r.n}
                </td>
                <td style={{ ...S.td, color: C.textMuted }}>{r.ngay}</td>
                <td style={{ ...S.td, fontSize: 12, color: C.textMuted }}>
                  {r.td}
                </td>
                <td style={{ ...S.td, fontSize: 12, color: C.text }}>{r.cd}</td>
                <td style={S.td}>
                  <span
                    style={S.badge(
                      r.tt === "Hoàn thành"
                        ? "#22c55e"
                        : r.tt === "Tái khám"
                          ? "#f59e0b"
                          : ACCENT,
                    )}
                  >
                    {r.tt}
                  </span>
                </td>
                <td style={S.td}>
                  <button
                    style={{
                      ...S.btn("ghost"),
                      padding: "4px 8px",
                      fontSize: 12,
                    }}
                  >
                    Xem →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DonThuocPage({ C, S }) {
  const [thuoc, setThuoc] = useState([
    { ten: "Amoxicillin 500mg", sl: 10, lieu: "2 viên/ngày sau ăn" },
    { ten: "Ibuprofen 400mg", sl: 6, lieu: "1 viên/lần khi đau" },
  ]);
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
        Kê đơn thuốc
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
        Bệnh nhân: Nguyễn Văn An • HS001 • 22/03/2026
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={S.card}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 14,
              fontSize: 14,
              color: C.text,
            }}
          >
            💊 Chi tiết đơn thuốc
          </div>
          {thuoc.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {t.ten}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                  SL: {t.sl} • {t.lieu}
                </div>
              </div>
              <button
                style={{
                  ...S.btn("ghost"),
                  padding: "4px 8px",
                  fontSize: 12,
                  color: "#ef4444",
                }}
                onClick={() => setThuoc(thuoc.filter((_, j) => j !== i))}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            style={{
              ...S.btn("ghost"),
              width: "100%",
              marginTop: 12,
              textAlign: "center",
              padding: "8px",
            }}
          >
            + Thêm thuốc
          </button>
        </div>
        <div style={S.card}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: 14,
              fontSize: 14,
              color: C.text,
            }}
          >
            📝 Ghi chú & Lưu ý
          </div>
          <textarea
            style={{
              width: "100%",
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "10px 12px",
              color: C.text,
              fontSize: 13,
              height: 120,
              resize: "vertical",
              outline: "none",
              boxSizing: "border-box",
              transition: "background .3s",
            }}
            defaultValue="Súc miệng nước muối 2 lần/ngày. Tránh ăn đồ cứng trong 3 ngày. Tái khám sau 7 ngày nếu đau kéo dài."
          />
          <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
            <button style={{ ...S.btn(), flex: 1, padding: 10 }}>
              ✓ Lưu đơn thuốc
            </button>
            <button style={{ ...S.btn("ghost"), flex: 1, padding: 10 }}>
              🖨 In đơn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Placeholder({ title, C }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "60vh",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 48 }}>🦷</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>
        {title}
      </div>
      <div style={{ fontSize: 13, color: C.textMuted }}>
        Trang đang phát triển
      </div>
    </div>
  );
}
