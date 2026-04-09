import { useTheme } from "../../context/ThemeContext";

export default function FormField({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
  options,
  span = 1,
}) {
  const { theme: C } = useTheme();

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",
    background: C.bg,
    border: `1px solid ${C.border}`,
    borderRadius: 8,
    padding: "9px 12px",
    color: C.text,
    fontSize: 13,
    outline: "none",
    transition: "border .15s",
  };

  return (
    <div
      style={{ gridColumn: span === 2 ? "1/-1" : undefined, marginBottom: 2 }}
    >
      <label
        style={{
          fontSize: 12,
          color: C.textMuted,
          display: "block",
          marginBottom: 5,
          fontWeight: 600,
        }}
      >
        {label}
        {required && <span style={{ color: "#ef4444" }}> *</span>}
      </label>
      {options ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        >
          <option value="">-- Chọn --</option>
          {options.map((o) => (
            <option key={o.value ?? o} value={o.value ?? o}>
              {o.label ?? o}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
}
