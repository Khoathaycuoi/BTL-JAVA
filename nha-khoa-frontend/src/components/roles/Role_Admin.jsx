import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../ui/ThemeToggle";
import BacSiPage from "../admin/BacSiPage";
import NhanVienPage from "../admin/NhanVienPage";
import KhachHangPage from "../admin/KhachHangPage";
import TaiKhoanPage from "../admin/TaiKhoanPage";
import DichVuPage from "../admin/DichVuPage";
import ProfilePage from "../shared/ProfilePage";
import LichHenPage from "../pages/LichHenPage";
import DatLichPage from "../pages/DatLichPage";
import HoSoKhamPage from "../pages/HoSoKhamPage";
import DonThuocPage from "../pages/DonThuocPage";
import ChamCongPage from "../pages/ChamCongPage";
import LuongPage from "../pages/LuongPage";
import PhongPage from "../pages/PhongPage";
import ThietBiPage from "../pages/ThietBiPage";
import HoaDonPage from "../pages/HoaDonPage";
import { getMyInfoAPI } from "../../api/User";
const NAV = [
  {
    group: "Tổng quan",
    items: [{ id: "dashboard", icon: "📊", label: "Dashboard" }],
  },
  {
    group: "Vận hành",
    items: [
      { id: "lich-hen", icon: "📅", label: "Lịch hẹn" },
      { id: "ho-so", icon: "📋", label: "Hồ sơ khám" },
      { id: "don-thuoc", icon: "💊", label: "Đơn thuốc" },
      { id: "dich-vu", icon: "🦷", label: "Dịch vụ" },
    ],
  },
  {
    group: "Quản lý",
    items: [
      { id: "khach-hang", icon: "👤", label: "Khách hàng" },
      { id: "nhan-su", icon: "🧑‍⚕️", label: "Bác sĩ & NV" },
      { id: "tai-khoan", icon: "🔐", label: "Tài khoản" },
      { id: "cham-cong", icon: "⏱️ ", label: "Chấm công" },
    ],
  },
  {
    group: "Tài chính",
    items: [
      { id: "hoa-don", icon: "🧾", label: "Hóa đơn" },
      { id: "luong", icon: "💵", label: "Bảng lương" },
    ],
  },
  {
    group: "Cơ sở vật chất",
    items: [
      { id: "phong", icon: "🚪", label: "Phòng khám" },
      { id: "thiet-bi", icon: "🔧", label: "Thiết bị" },
    ],
  },
];

const pageTitle = {
  dashboard: "Dashboard Tổng quan",
  "lich-hen": "Lịch hẹn",
  "dat-lich": "Đặt lịch hẹn",
  "khach-hang": "Khách hàng",
  "hoa-don": "Hóa đơn",
  "ho-so": "Hồ sơ khám",
  "don-thuoc": "Đơn thuốc",
  "dich-vu": "Quản lý dịch vụ",
  "nhan-su": "Bác sĩ & Nhân viên",
  "tai-khoan": "Quản lý tài khoản",
  "cham-cong": "Chấm công",
  luong: "Bảng lương",
  phong: "Phòng khám",
  "thiet-bi": "Thiết bị",
  profile: "Hồ sơ của tôi",
};

const statusColor = (s, C) =>
  s === "Đã xác nhận" || s === "Đã thanh toán" || s === "Hoàn thành"
    ? C.success
    : s === "Hủy" || s === "Chưa TT"
      ? C.danger
      : C.warning;

export default function AdminDashboard({ onLogout, user }) {
  const { theme: C } = useTheme();
  const [page, setPage] = useState("dashboard");

  const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
    getMyInfoAPI().then(setUserInfo).catch(console.log);
  }, []);
  const displayName = userInfo?.ten || "Admin";
  const avatarLetter = userInfo?.ten?.split(" ").pop()[0]?.toUpperCase() || "A";

  const S = {
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
      background: a ? C.accentSoft : "transparent",
      color: a ? C.accent : C.textMuted,
      borderLeft: a ? `2px solid ${C.accent}` : "2px solid transparent",
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
      background: v === "primary" ? C.accent : "transparent",
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

  return (
    <div style={S.app}>
      {/* SIDEBAR */}
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
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
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
            Quản trị viên
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
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
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
                {userInfo ? userInfo.ten : "Admin"}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted }}>
                Xem hồ sơ →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN */}
      {/* MAIN */}
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
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              A
            </div>
          </div>
        </div>
        <div style={S.content}>
          {page === "dashboard" && (
            <DashboardPage
              C={C}
              S={S}
              statusColor={statusColor}
              setPage={setPage}
            />
          )}
          {page === "lich-hen" && (
            <LichHenPage
              S={S}
              role="admin"
              onDatLich={() => setPage("dat-lich")}
            />
          )}
          {page === "dat-lich" && (
            <DatLichPage
              S={S}
              role="admin"
              onBack={() => setPage("lich-hen")}
            />
          )}
          {page === "khach-hang" && <KhachHangPage S={S} />}
          {page === "hoa-don" && (
            <HoaDonPage C={C} S={S} statusColor={statusColor} />
          )}
          {page === "nhan-su" && <NhanSuPage C={C} S={S} />}
          {page === "tai-khoan" && <TaiKhoanPage S={S} />}
          {page === "ho-so" && <HoSoKhamPage S={S} />}
          {page === "don-thuoc" && <DonThuocPage S={S} />}
          {page === "dich-vu" && <DichVuPage S={S} />}
          {page === "cham-cong" && <ChamCongPage S={S} isAdmin={true} />}
          {page === "luong" && <LuongPage S={S} />}
          {page === "phong" && <PhongPage S={S} />}
          {page === "thiet-bi" && <ThietBiPage S={S} />}
          {page === "profile" && <ProfilePage onLogout={onLogout} />}
          {![
            "dashboard",
            "lich-hen",
            "dat-lich",
            "khach-hang",
            "hoa-don",
            "nhan-su",
            "tai-khoan",
            "ho-so",
            "don-thuoc",
            "dich-vu",
            "cham-cong",
            "luong",
            "phong",
            "thiet-bi",
            "profile",
          ].includes(page) && <Placeholder title={pageTitle[page]} C={C} />}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ C, S, statusColor, setPage, userInfo }) {
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
        Xin chào, {userInfo ? userInfo.ten : "Admin"} 👋
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
            change: 8,
            color: "#6366f1",
            icon: "◷",
          },
          {
            label: "Bệnh nhân mới T3",
            value: "47",
            change: 15,
            color: "#22c55e",
            icon: "◎",
          },
          {
            label: "Doanh thu tháng",
            value: "68.5M",
            change: -3,
            color: "#f59e0b",
            icon: "◈",
          },
          { label: "Chờ xác nhận", value: "5", color: "#ef4444", icon: "⚠" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              ...S.card,
              borderTop: `3px solid ${s.color}`,
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>
              {s.label}
            </div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                marginBottom: 4,
                color: C.text,
              }}
            >
              {s.value}
            </div>
            {s.change && (
              <div
                style={{
                  fontSize: 11,
                  color: s.change > 0 ? "#22c55e" : "#ef4444",
                }}
              >
                {s.change > 0 ? "▲" : "▼"} {Math.abs(s.change)}% so với tháng
                trước
              </div>
            )}
            <div
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 26,
                opacity: 0.15,
              }}
            >
              {s.icon}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
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
            📅 Lịch hẹn hôm nay
            <span
              style={{ fontSize: 12, color: C.accent, cursor: "pointer" }}
              onClick={() => setPage("lich-hen")}
            >
              Xem tất cả →
            </span>
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                {["Giờ", "Khách hàng", "Bác sĩ", "Dịch vụ", "Trạng thái"].map(
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
                  "09:00",
                  "Nguyễn Văn An",
                  "BS. Trần Minh",
                  "Nhổ răng",
                  "Chờ xác nhận",
                ],
                [
                  "10:30",
                  "Lê Thị Bình",
                  "BS. Nguyễn Hoa",
                  "Trám răng",
                  "Đã xác nhận",
                ],
                [
                  "14:00",
                  "Phạm Quốc Cường",
                  "BS. Trần Minh",
                  "Tẩy trắng",
                  "Đã xác nhận",
                ],
                [
                  "15:30",
                  "Hoàng Thị Dung",
                  "BS. Lê Nam",
                  "X-quang",
                  "Chờ xác nhận",
                ],
              ].map(([g, kh, bs, dv, st], i) => (
                <tr
                  key={i}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.surfaceHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ ...S.td, color: C.accent, fontWeight: 700 }}>
                    {g}
                  </td>
                  <td style={{ ...S.td, fontWeight: 600, color: C.text }}>
                    {kh}
                  </td>
                  <td style={{ ...S.td, color: C.textMuted }}>{bs}</td>
                  <td style={{ ...S.td, color: C.textMuted }}>{dv}</td>
                  <td style={S.td}>
                    <span style={S.badge(statusColor(st, C))}>{st}</span>
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
              marginBottom: 14,
              fontSize: 14,
              color: C.text,
            }}
          >
            📊 Doanh thu dịch vụ
          </div>
          {[
            ["Niềng răng", 78, "#6366f1", "21.7M"],
            ["Nhổ răng", 72, "#0ea5e9", "18.2M"],
            ["Tẩy trắng", 60, "#10b981", "14.1M"],
            ["Trám răng", 55, "#f59e0b", "12.0M"],
            ["X-quang", 35, "#ef4444", "7.5M"],
          ].map(([n, p, c, v]) => (
            <div key={n} style={{ marginBottom: 12 }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                <span style={{ color: C.textMuted }}>{n}</span>
                <span style={{ color: c, fontWeight: 700 }}>{v}</span>
              </div>
              <div style={{ background: C.bg, borderRadius: 4, height: 6 }}>
                <div
                  style={{
                    width: `${p}%`,
                    height: "100%",
                    borderRadius: 4,
                    background: c,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
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
            👨‍⚕️ Hiệu suất bác sĩ
          </div>
          {[
            {
              n: "Trần Minh Khoa",
              s: "Nha khoa tổng quát",
              bn: 42,
              c: "#6366f1",
            },
            { n: "Nguyễn Thị Hoa", s: "Thẩm mỹ răng", bn: 56, c: "#0ea5e9" },
            { n: "Lê Văn Nam", s: "Chỉnh nha", bn: 28, c: "#10b981" },
          ].map((d) => (
            <div
              key={d.n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 0",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: d.c + "20",
                  color: d.c,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {d.n.split(" ").slice(-1)[0][0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>
                  BS. {d.n}
                </div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{d.s}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{ fontSize: 14, fontWeight: 700, color: "#22c55e" }}
                >
                  {d.bn}
                </div>
                <div style={{ fontSize: 10, color: C.textMuted }}>
                  bệnh nhân
                </div>
              </div>
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
            ["Phòng 101 — BS. Trần", "Đang khám"],
            ["Phòng 102 — BS. Nguyễn", "Đang khám"],
            ["Phòng 103 — BS. Lê", "Trống"],
            ["Phòng 104", "Bảo trì"],
            ["Phòng 105", "Trống"],
          ].map(([p, st]) => (
            <div
              key={p}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 0",
                borderBottom: `1px solid ${C.border}`,
                fontSize: 13,
              }}
            >
              <span style={{ color: C.textMuted }}>{p}</span>
              <span
                style={S.badge(
                  st === "Trống"
                    ? "#22c55e"
                    : st === "Bảo trì"
                      ? "#ef4444"
                      : "#f59e0b",
                )}
              >
                {st}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function HoaDonPageLegacy({ C, S, statusColor }) {
  const data = [
    {
      id: "HD001",
      kh: "Nguyễn Văn An",
      ngay: "20/03",
      dv: "Nhổ răng, X-quang",
      tong: "850.000đ",
      st: "Đã thanh toán",
    },
    {
      id: "HD002",
      kh: "Lê Thị Bình",
      ngay: "18/03",
      dv: "Trám răng",
      tong: "500.000đ",
      st: "Chưa TT",
    },
    {
      id: "HD003",
      kh: "Phạm Quốc Cường",
      ngay: "15/03",
      dv: "Tẩy trắng răng",
      tong: "2.500.000đ",
      st: "Đã thanh toán",
    },
    {
      id: "HD004",
      kh: "Hoàng Thị Dung",
      ngay: "22/03",
      dv: "X-quang toàn hàm",
      tong: "300.000đ",
      st: "Chờ xác nhận",
    },
  ];
  return (
    <div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 16,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Tổng hóa đơn", value: data.length + "", color: "#6366f1" },
          {
            label: "Đã thanh toán",
            value: data.filter((d) => d.st === "Đã thanh toán").length + "",
            color: "#22c55e",
          },
          {
            label: "Chưa thanh toán",
            value: data.filter((d) => d.st !== "Đã thanh toán").length + "",
            color: "#ef4444",
          },
          { label: "Doanh thu hôm nay", value: "3.35M", color: "#f59e0b" },
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
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 14,
        }}
      >
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
                "Ngày",
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
                <td style={{ ...S.td, color: C.textMuted }}>{h.ngay}</td>
                <td style={{ ...S.td, fontSize: 12, color: C.textMuted }}>
                  {h.dv}
                </td>
                <td style={{ ...S.td, fontWeight: 700, color: "#22c55e" }}>
                  {h.tong}
                </td>
                <td style={S.td}>
                  <span style={S.badge(statusColor(h.st, C))}>{h.st}</span>
                </td>
                <td style={S.td}>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button
                      style={{
                        ...S.btn("ghost"),
                        padding: "4px 8px",
                        fontSize: 12,
                      }}
                    >
                      👁
                    </button>
                    {h.st !== "Đã thanh toán" && (
                      <button
                        style={{ ...S.btn(), padding: "4px 8px", fontSize: 11 }}
                      >
                        Thanh toán
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NhanSuPage({ C, S }) {
  const [tab, setTab] = useState("bacsi"); // "bacsi" | "nhanvien"
  return (
    <div>
      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[
          { id: "bacsi", label: "👨‍⚕️ Bác sĩ" },
          { id: "nhanvien", label: "👥 Nhân viên" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              background: tab === t.id ? C.accent : C.surface,
              color: tab === t.id ? "#fff" : C.textMuted,
              border: tab !== t.id ? `1px solid ${C.border}` : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "bacsi" && <BacSiPage S={S} />}
      {tab === "nhanvien" && <NhanVienPage S={S} />}
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
