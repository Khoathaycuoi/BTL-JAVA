import { useTheme } from "../../context/ThemeContext";

export default function Logo({ subtitle = "Hệ thống quản lý phòng khám" }) {
  const { theme } = useTheme();
  return (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          background: "linear-gradient(135deg,#6366f1,#818cf8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 26,
          margin: "0 auto 12px",
          boxShadow: "0 4px 20px rgba(99,102,241,0.25)",
        }}
      >
        🦷
      </div>
      <div style={{ fontSize: 22, fontWeight: 800, color: theme.text }}>
        Nha Khoa Management
      </div>
      <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
        {subtitle}
      </div>
    </div>
  );
}
