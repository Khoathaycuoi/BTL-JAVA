import { useTheme } from "../../context/ThemeContext";

export default function ConfirmDialog({
  title = "Xác nhận",
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Xác nhận",
  type = "danger",
}) {
  const { theme: C } = useTheme();

  const COLOR = {
    danger: {
      bg: "rgba(239,68,68,0.1)",
      border: "rgba(239,68,68,0.3)",
      btn: "#ef4444",
      icon: "⚠️",
    },
    warning: {
      bg: "rgba(245,158,11,0.1)",
      border: "rgba(245,158,11,0.3)",
      btn: "#f59e0b",
      icon: "⚠️",
    },
    info: {
      bg: "rgba(99,102,241,0.1)",
      border: "rgba(99,102,241,0.3)",
      btn: C.accent,
      icon: "ℹ️",
    },
  }[type];

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          background: C.surface,
          borderRadius: 14,
          border: `1px solid ${C.border}`,
          width: "100%",
          maxWidth: 380,
          padding: 28,
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        }}
      >
        {/* Icon + Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: COLOR.bg,
              border: `1px solid ${COLOR.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              flexShrink: 0,
            }}
          >
            {COLOR.icon}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>
            {title}
          </div>
        </div>

        {/* Message */}
        <div
          style={{
            fontSize: 13,
            color: C.textMuted,
            lineHeight: 1.7,
            marginBottom: 22,
          }}
        >
          {message}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: "transparent",
              color: C.textMuted,
              border: `1px solid ${C.border}`,
            }}
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 18px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: COLOR.btn,
              color: "#fff",
              border: "none",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
