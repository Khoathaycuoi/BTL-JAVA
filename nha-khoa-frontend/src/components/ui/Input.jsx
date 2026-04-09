import { useTheme } from "../../context/ThemeContext";

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  rightSlot,
  required = false,
  style = {},
}) {
  const { theme } = useTheme();
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label
          style={{
            fontSize: 12,
            color: theme.textMuted,
            display: "block",
            marginBottom: 6,
            fontWeight: 600,
          }}
        >
          {label}
          {required && <span style={{ color: theme.danger }}> *</span>}
        </label>
      )}
      <div style={{ position: "relative" }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            background: theme.bg,
            border: `1px solid ${theme.border}`,
            borderRadius: 8,
            padding: rightSlot ? "10px 40px 10px 14px" : "10px 14px",
            color: theme.text,
            fontSize: 13,
            outline: "none",
            transition: "background .3s, border .3s",
            ...style,
          }}
        />
        {rightSlot && (
          <div
            style={{
              position: "absolute",
              right: 10,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            {rightSlot}
          </div>
        )}
      </div>
    </div>
  );
}
