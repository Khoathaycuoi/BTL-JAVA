import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../components/ui/ThemeToggle";
import ProfilePage from "../shared/ProfilePage";
import LichHenPage from "../pages/LichHenPage";
import DatLichPage from "../pages/DatLichPage";
import DichVuKhachHang from "../pages/DichVuKhachHang";
import LienHePage from "../pages/LienHePage";
import { getMyInfoAPI } from "../../api/User";

const ACCENT = "#f59e0b";

const NAV = [
  {
    group: "Cá nhân",
    items: [
      { id: "dashboard", icon: "📊", label: "Trang chủ" },
      { id: "lich-hen", icon: "📅", label: "Lịch hẹn của tôi" },
      { id: "ho-so", icon: "📋", label: "Hồ sơ sức khoẻ" },
      { id: "hoa-don", icon: "🧾", label: "Hoá đơn của tôi" },
    ],
  },
  {
    group: "Phòng khám",
    items: [
      { id: "dich-vu", icon: "🦷", label: "Dịch vụ" },
      { id: "dat-lich", icon: "📝", label: "Đặt lịch hẹn mới" },
      { id: "lien-he", icon: "📞", label: "Liên hệ phòng khám" },
    ],
  },
];

const pageTitle = {
  dashboard: "Trang chủ",
  "lich-hen": "Lịch hẹn của tôi",
  "ho-so": "Hồ sơ sức khoẻ",
  "hoa-don": "Hoá đơn",
  "dich-vu": "Dịch vụ phòng khám",
  "dat-lich": "Đặt lịch hẹn mới",
  "lien-he": "Liên hệ phòng khám",
  profile: "Hồ sơ của tôi",
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
      border: `1px solid ${C.border}`,
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
      color: v === "primary" ? "#000" : C.text,
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

export default function BenhNhanPortal({ onLogout }) {
  const { theme: C } = useTheme();
  const S = makeS(C);
  const [page, setPage] = useState("dashboard");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getMyInfoAPI().then(setUserInfo).catch(console.log);
  }, []);

  const displayName = userInfo?.ten || "Bệnh nhân";
  const avatarLetter =
    userInfo?.ten?.split(" ").pop()?.charAt(0)?.toUpperCase() || "BN";

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
              background: `linear-gradient(135deg,${ACCENT},#fbbf24)`,
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
            Cổng thông tin Bệnh nhân
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
                  <span>{item.label}</span>
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
                background: `linear-gradient(135deg,${ACCENT},#fbbf24)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
                fontWeight: 700,
                color: "#000",
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
            <button style={S.btn()} onClick={() => setPage("dat-lich")}>
              + Đặt lịch hẹn
            </button>
          </div>
        </div>
        <div style={S.content}>
          {page === "dashboard" && (
            <DashboardPage C={C} S={S} setPage={setPage} userInfo={userInfo} />
          )}
          {page === "lich-hen" && (
            <LichHenPage
              S={S}
              role="benhnhan"
              onDatLich={() => setPage("dat-lich")}
            />
          )}
          {page === "ho-so" && <HoSoPage C={C} S={S} />}
          {page === "hoa-don" && <HoaDonPage C={C} S={S} />}
          {page === "dich-vu" && <DichVuKhachHang S={S} />}
          {page === "dat-lich" && (
            <DatLichPage
              S={S}
              role="benhnhan"
              onBack={() => setPage("lich-hen")}
            />
          )}
          {page === "lien-he" && <LienHePage />}
          {page === "profile" && <ProfilePage onLogout={onLogout} />}
          {![
            "dashboard",
            "lich-hen",
            "ho-so",
            "hoa-don",
            "dich-vu",
            "dat-lich",
            "lien-he",
            "profile",
          ].includes(page) && <Placeholder title={pageTitle[page]} C={C} />}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ C, S, setPage, userInfo }) {
  const ten = userInfo?.ten || "Bệnh nhân";
  const maBN = userInfo?.maDinhDanh || "Đang tải...";
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
        Xin chào, {ten} 👋
      </div>
      <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 20 }}>
        Mã bệnh nhân: KH004
      </div>
      <div
        style={{
          background: ACCENT + "15",
          border: `1px solid ${ACCENT}40`,
          borderRadius: 12,
          padding: 16,
          marginBottom: 20,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div style={{ fontSize: 28 }}>📅</div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 3,
              color: C.text,
            }}
          >
            Lịch hẹn sắp tới: 15/04/2026 lúc 14:00
          </div>
          <div style={{ fontSize: 13, color: C.textMuted }}>
            BS. Nguyễn Đình Đức • Phòng 101
          </div>
        </div>
        <button style={S.btn()} onClick={() => setPage("lich-hen")}>
          Xem chi tiết
        </button>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          { l: "Tổng lần khám", v: "5", c: "#6366f1", icon: "◎" },
          {
            l: "Bác sĩ phụ trách",
            v: "BS. Nguyễn Đình Đức",
            c: ACCENT,
            icon: "♡",
          },
          { l: "Lần khám gần nhất", v: "01/04", c: "#22c55e", icon: "◫" },
          { l: "Hóa đơn chưa TT", v: "500.000đ", c: "#ef4444", icon: "◈" },
        ].map(({ l, v, c, icon }) => (
          <div key={l} style={{ ...S.card, borderTop: `3px solid ${c}` }}>
            <div style={{ fontSize: 22, opacity: 0.3, marginBottom: 8 }}>
              {icon}
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
              {l}
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
              {v}
            </div>
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
            🕐 Lịch sử khám
            <button
              style={{ ...S.btn("ghost"), padding: "4px 10px", fontSize: 11 }}
              onClick={() => setPage("ho-so")}
            >
              Xem tất cả →
            </button>
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                {["Ngày", "Dịch vụ", "Bác sĩ", "TT"].map((h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["20/03/2026", "Nhổ răng khôn", "BS. Trần Minh", "Hoàn thành"],
                ["05/03/2026", "Trám răng", "BS. Nguyễn Hoa", "Hoàn thành"],
                ["10/01/2026", "X-quang toàn hàm", "BS. Lê Nam", "Hoàn thành"],
              ].map(([n, dv, bs, st], i) => (
                <tr
                  key={i}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.surfaceHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ ...S.td, color: C.textMuted }}>{n}</td>
                  <td style={{ ...S.td, fontWeight: 600, color: C.text }}>
                    {dv}
                  </td>
                  <td style={{ ...S.td, fontSize: 12, color: C.textMuted }}>
                    {bs}
                  </td>
                  <td style={S.td}>
                    <span style={S.badge("#22c55e")}>{st}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.card}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 12,
                fontSize: 14,
                color: C.text,
              }}
            >
              💊 Đơn thuốc đang dùng
            </div>
            {[
              { ten: "Amoxicillin 500mg", lieu: "2 viên/ngày sau ăn", con: 5 },
              { ten: "Ibuprofen 400mg", lieu: "1 viên khi đau", con: 3 },
            ].map((t) => (
              <div
                key={t.ten}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "9px 0",
                  borderBottom: `1px solid ${C.border}`,
                  fontSize: 13,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: C.text }}>{t.ten}</div>
                  <div
                    style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}
                  >
                    {t.lieu}
                  </div>
                </div>
                <span style={S.badge(ACCENT)}>Còn {t.con} viên</span>
              </div>
            ))}
          </div>
          <div
            style={{
              ...S.card,
              background: "rgba(34,197,94,0.05)",
              border: "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div
              style={{
                fontWeight: 700,
                marginBottom: 8,
                fontSize: 14,
                color: "#22c55e",
              }}
            >
              📋 Lưu ý từ bác sĩ
            </div>
            <div style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.6 }}>
              Súc miệng nước muối 2 lần/ngày. Tránh ăn đồ cứng trong 3 ngày. Tái
              khám ngày 25/03 nếu đau kéo dài.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HoSoPage({ C, S }) {
  return (
    <div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 20,
          color: C.text,
        }}
      >
        Hồ sơ sức khoẻ
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div style={S.card}>
          <div style={{ textAlign: "center", padding: "10px 0 16px" }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${ACCENT},#fbbf24)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "#000",
                margin: "0 auto 12px",
              }}
            >
              B
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>
              Nguyễn văn Bách
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
              Bệnh nhân • KH004
            </div>
          </div>
          {[
            ["Ngày sinh", "15/06/1990"],
            ["Giới tính", "Nam"],
            ["SĐT", "0901234567"],
            ["Địa chỉ", "123 Trần Hưng Đạo, Q.1"],
          ].map(([k, v]) => (
            <div
              key={k}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "7px 0",
                borderTop: `1px solid ${C.border}`,
                fontSize: 13,
              }}
            >
              <span style={{ color: C.textMuted }}>{k}</span>
              <span style={{ fontWeight: 500, color: C.text }}>{v}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={S.card}>
            <div
              style={{
                fontWeight: 700,
                marginBottom: 12,
                fontSize: 14,
                color: C.text,
              }}
            >
              ⚕️ Tiền sử bệnh
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                "Không dị ứng thuốc",
                "Không bệnh mãn tính",
                "Không tiểu đường",
                "Không cao huyết áp",
              ].map((t) => (
                <span key={t} style={S.badge("#22c55e")}>
                  {t}
                </span>
              ))}
            </div>
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
              🦷 Tình trạng răng miệng
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              {[
                ["Nhổ răng", "R38 (20/03/2026)"],
                ["Điều trị", "R46 — trám răng"],
                ["Tình trạng chung", "Tốt"],
                ["Lịch tái khám", "25/03/2026"],
              ].map(([k, v]) => (
                <div
                  key={k}
                  style={{ background: C.bg, padding: 12, borderRadius: 8 }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: C.textMuted,
                      marginBottom: 4,
                    }}
                  >
                    {k}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function HoaDonPage({ C, S }) {
  const data = [
    {
      id: "HD001",
      ngay: "20/03/2026",
      dv: "Nhổ răng R38, X-quang",
      tong: "850.000đ",
      st: "Đã thanh toán",
    },
    {
      id: "HD002",
      ngay: "05/03/2026",
      dv: "Trám răng R46",
      tong: "500.000đ",
      st: "Chưa thanh toán",
    },
    {
      id: "HD003",
      ngay: "10/01/2026",
      dv: "X-quang toàn hàm",
      tong: "300.000đ",
      st: "Đã thanh toán",
    },
  ];
  return (
    <div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 20,
          color: C.text,
        }}
      >
        Hoá đơn của tôi
      </div>
      {data
        .filter((d) => d.st === "Chưa thanh toán")
        .map((d) => (
          <div
            key={d.id}
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{ fontWeight: 700, color: "#ef4444", marginBottom: 4 }}
              >
                ⚠ Hoá đơn chưa thanh toán
              </div>
              <div style={{ fontSize: 13, color: C.textMuted }}>
                {d.dv} • {d.ngay}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#ef4444",
                  marginBottom: 6,
                }}
              >
                {d.tong}
              </div>
              <button style={S.btn()}>💳 Thanh toán ngay</button>
            </div>
          </div>
        ))}
      <div style={S.card}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {["Mã HD", "Ngày", "Dịch vụ", "Tổng tiền", "Trạng thái", ""].map(
                (h) => (
                  <th key={h} style={S.th}>
                    {h}
                  </th>
                ),
              )}
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
                <td style={{ ...S.td, color: C.textMuted }}>{h.ngay}</td>
                <td style={{ ...S.td, fontSize: 12, color: C.text }}>{h.dv}</td>
                <td
                  style={{
                    ...S.td,
                    fontWeight: 700,
                    color: h.st === "Đã thanh toán" ? "#22c55e" : "#ef4444",
                  }}
                >
                  {h.tong}
                </td>
                <td style={S.td}>
                  <span
                    style={S.badge(
                      h.st === "Đã thanh toán" ? "#22c55e" : "#ef4444",
                    )}
                  >
                    {h.st}
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
                    🖨
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
        Tính năng đang phát triển
      </div>
    </div>
  );
}
