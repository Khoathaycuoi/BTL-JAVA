import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle({ style = {} }) {
  const { mode, toggleTheme, theme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={
        mode === "dark"
          ? "Chuyển sang giao diện sáng"
          : "Chuyển sang giao diện tối"
      }
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "6px 12px",
        borderRadius: 20,
        background: theme.accentSoft,
        border: `1px solid ${theme.border}`,
        color: theme.textMuted,
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        transition: "all .2s",
        ...style,
      }}
    >
      {mode === "dark" ? "☀️ Sáng" : "🌙 Tối"}
    </button>
  );
}
