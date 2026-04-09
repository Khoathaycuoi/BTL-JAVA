import { useState, useEffect } from "react";
import { getMyInfoAPI } from "../../api/User";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";
import ProfilePage from "../shared/ProfilePage";
import KhachHangPage from "../admin/KhachHangPage";
import PhongPage from "../pages/PhongPage";
import DatLichPage from "../pages/DatLichPage";
import ChamCongCaNhan from "../pages/ChamCongCaNhan";
import LuongCaNhan from "../pages/LuongCaNhan";
import LichHenPage from "../pages/LichHenPage";
import DichVuKhachHang from "../pages/DichVuKhachHang";

const ACCENT = "#10b981";

const NAV = [
  {
    group: "Tổng quan",
    items: [{ id: "dashboard", icon: "📊", label: "Dashboard" }],
  },
  {
    group: "Tiếp đón",
    items: [
      { id: "lich-hen", icon: "📅", label: "Lịch hẹn" },
      { id: "dat-lich", icon: "📝", label: "Đặt lịch hẹn" },
      { id: "thu-tien", icon: "🧾", label: "Thu tiền" },
    ],
  },
  {
    group: "Quản lý",
    items: [
      { id: "khach-hang", icon: "👤", label: "Khách hàng" },
      { id: "dich-vu", icon: "🦷", label: "Dịch vụ" },
      { id: "phong", icon: "⬜", label: "Tình trạng phòng" },
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
  "lich-hen": "Lịch hẹn",
  "dat-lich": "Đặt lịch hẹn",
  "thu-tien": "Thu tiền",
  "khach-hang": "Khách hàng",
  "dich-vu": "Danh sách dịch vụ",
  "cham-cong": "Chấm công",
  luong: "Lương của tôi",
  phong: "Tình trạng phòng",
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

const stColor = (s) =>
  s === "Đã xác nhận" || s === "Đã thanh toán"
    ? "#22c55e"
    : s === "Hủy" || s === "Chưa TT"
      ? "#ef4444"
      : "#f59e0b";

export default function LeTanDashboard({ onLogout, user }) {
  const { theme: C } = useTheme();
  const S = makeS(C);
  const [page, setPage] = useState("dashboard");

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    getMyInfoAPI().then(setUserInfo).catch(console.log);
  }, []);
  const displayName = userInfo?.ten || "Lễ tân";
  const avatarLetter =
    userInfo?.ten?.split(" ").pop()[0]?.toUpperCase() || "LT";

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
              background: `linear-gradient(135deg,${ACCENT},#34d399)`,
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
            Cổng thông tin Lễ tân
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
                background: `linear-gradient(135deg,${ACCENT},#34d399)`,
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
                {displayName}
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
                padding: "4px 10px",
                borderRadius: 20,
                background: ACCENT + "20",
                color: ACCENT,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              Lễ Tân
            </div>
          </div>
        </div>
        <div style={S.content}>
          {page === "dashboard" && (
            <DashboardPage C={C} S={S} setPage={setPage} />
          )}
          {page === "lich-hen" && (
            <LichHenPage
              S={S}
              role="letan"
              onDatLich={() => setPage("dat-lich")}
            />
          )}
          {page === "dat-lich" && (
            <DatLichPage
              S={S}
              role="letan"
              onBack={() => setPage("lich-hen")}
            />
          )}
          {page === "thu-tien" && <ThuTienPage C={C} S={S} />}
          {page === "khach-hang" && <KhachHangPage S={S} onlyActiveKhachHang />}
          {page === "dich-vu" && <DichVuKhachHang S={S} />}
          {page === "phong" && <PhongPage S={S} />}
          {page === "profile" && <ProfilePage onLogout={onLogout} />}
          {page === "cham-cong" && <ChamCongCaNhan user={user} />}
          {page === "luong" && <LuongCaNhan user={user} />}
          {![
            "dashboard",
            "lich-hen",
            "dat-lich",
            "thu-tien",
            "khach-hang",
            "dich-vu",
            "phong",
            "cham-cong",
            "luong",
            "profile",
          ].includes(page) && <Placeholder title={pageTitle[page]} C={C} />}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ C, S, setPage }) {
  const queue = [
    { n: "Nguyễn Văn An", dv: "Nhổ răng", gio: "09:00", stt: 1 },
    { n: "Lê Thị Bình", dv: "Trám răng", gio: "10:30", stt: 2 },
    { n: "Phạm Quốc Cường", dv: "Tẩy trắng", gio: "14:00", stt: 3 },
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
        Bảng tiếp đón 🏥
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
            label: "Lịch hẹn hôm nay",
            value: "12",
            sub: "8 đã xác nhận",
            color: ACCENT,
          },
          {
            label: "Đang chờ khám",
            value: "5",
            sub: "Cần gọi vào",
            color: "#f59e0b",
          },
          {
            label: "Thu tiền hôm nay",
            value: "3.35M",
            sub: "▲ 12% so hôm qua",
            color: "#22c55e",
          },
          {
            label: "Bệnh nhân mới",
            value: "4",
            sub: "Đăng ký hôm nay",
            color: "#6366f1",
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
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16,
          marginBottom: 16,
        }}
      >
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
            🔔 Hàng chờ hiện tại
            <button
              style={{ ...S.btn("ghost"), padding: "4px 10px", fontSize: 11 }}
              onClick={() => setPage("lich-hen")}
            >
              Quản lý →
            </button>
          </div>
          {queue.map(({ n, dv, gio, stt }) => (
            <div
              key={stt}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: ACCENT + "20",
                  color: ACCENT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {stt}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  {n}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted }}>
                  {dv} • {gio}
                </div>
              </div>
              <button style={{ ...S.btn(), padding: "5px 10px", fontSize: 11 }}>
                Gọi vào ▶
              </button>
            </div>
          ))}
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
            🏥 Tình trạng phòng
          </div>
          {[
            ["Phòng 101", "BS. Trần Minh", "Đang khám", "#f59e0b"],
            ["Phòng 102", "BS. Nguyễn Hoa", "Đang khám", "#f59e0b"],
            ["Phòng 103", "BS. Lê Nam", "Trống", "#22c55e"],
            ["Phòng 104", "—", "Bảo trì", "#ef4444"],
            ["Phòng 105", "—", "Trống", "#22c55e"],
          ].map(([p, bs, st, c]) => (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 0",
                borderBottom: `1px solid ${C.border}`,
                fontSize: 13,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: c,
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1 }}>
                <span style={{ fontWeight: 600, color: C.text }}>{p}</span>
                {bs !== "—" && (
                  <span style={{ fontSize: 12, color: C.textMuted }}>
                    {" "}
                    • {bs}
                  </span>
                )}
              </div>
              <span style={S.badge(c)}>{st}</span>
            </div>
          ))}
        </div>
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
          💰 Giao dịch hôm nay
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {["Khách hàng", "Dịch vụ", "Số tiền", "Trạng thái", ""].map(
                (h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {[
              [
                "Nguyễn Văn An",
                "Nhổ răng, X-quang",
                "850.000đ",
                "Đã thanh toán",
              ],
              [
                "Phạm Quốc Cường",
                "Tẩy trắng răng",
                "2.500.000đ",
                "Đã thanh toán",
              ],
              ["Lê Thị Bình", "Trám răng", "500.000đ", "Chưa TT"],
            ].map(([n, dv, t, st], i) => (
              <tr
                key={i}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = C.surfaceHover)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <td style={{ ...S.td, fontWeight: 600, color: C.text }}>{n}</td>
                <td style={{ ...S.td, fontSize: 12, color: C.textMuted }}>
                  {dv}
                </td>
                <td style={{ ...S.td, fontWeight: 700, color: "#22c55e" }}>
                  {t}
                </td>
                <td style={S.td}>
                  <span style={S.badge(stColor(st))}>{st}</span>
                </td>
                <td style={S.td}>
                  {st !== "Đã thanh toán" && (
                    <button
                      style={{ ...S.btn(), padding: "4px 10px", fontSize: 11 }}
                    >
                      Thu tiền
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ThuTienPage({ C, S }) {
  const data = [
    {
      id: "HD001",
      kh: "Nguyễn Văn An",
      dv: "Nhổ răng, X-quang",
      tong: "850.000đ",
      st: "Đã thanh toán",
    },
    {
      id: "HD002",
      kh: "Lê Thị Bình",
      dv: "Trám răng",
      tong: "500.000đ",
      st: "Chưa TT",
    },
    {
      id: "HD003",
      kh: "Phạm Quốc Cường",
      dv: "Tẩy trắng răng",
      tong: "2.500.000đ",
      st: "Đã thanh toán",
    },
    {
      id: "HD004",
      kh: "Hoàng Thị Dung",
      dv: "X-quang toàn hàm",
      tong: "300.000đ",
      st: "Chờ xác nhận",
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
            Thu tiền
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
            {data.filter((d) => d.st !== "Đã thanh toán").length} hóa đơn chờ
            thu
          </div>
        </div>
        <button style={S.btn()}>+ Tạo hóa đơn</button>
      </div>
      <div style={S.card}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {[
                "Mã HD",
                "Khách hàng",
                "Dịch vụ",
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
            {data.map((h) => (
              <tr
                key={h.id}
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
                  {h.id}
                </td>
                <td style={{ ...S.td, fontWeight: 600, color: C.text }}>
                  {h.kh}
                </td>
                <td style={{ ...S.td, fontSize: 12, color: C.textMuted }}>
                  {h.dv}
                </td>
                <td style={{ ...S.td, fontWeight: 700, color: "#22c55e" }}>
                  {h.tong}
                </td>
                <td style={S.td}>
                  <span style={S.badge(stColor(h.st))}>{h.st}</span>
                </td>
                <td style={S.td}>
                  {h.st !== "Đã thanh toán" && (
                    <button
                      style={{ ...S.btn(), padding: "6px 12px", fontSize: 12 }}
                    >
                      💳 Thu tiền
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
