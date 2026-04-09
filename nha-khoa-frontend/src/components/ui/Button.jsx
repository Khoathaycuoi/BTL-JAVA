const VARIANTS = {
  primary: {
    background: "linear-gradient(135deg,#6366f1,#818cf8)",
    color: "#fff",
    border: "none",
  },
  secondary: {
    background: "#1e2d45",
    color: "#E8F0FF",
    border: "1px solid #2a3a55",
  },
  danger: {
    background: "rgba(239,68,68,0.15)",
    color: "#ef4444",
    border: "1px solid rgba(239,68,68,0.3)",
  },
  ghost: {
    background: "transparent",
    color: "#607090",
    border: "1px solid #1e2d45",
  },
};

export default function Button({
  children,
  loading = false,
  loadingText = "Đang xử lý...",
  variant = "primary",
  type = "submit",
  onClick,
  disabled = false,
  style = {},
}) {
  const isDisabled = loading || disabled;
  return (
    <button
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      style={{
        width: "100%",
        padding: "10px 14px",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 700,
        cursor: isDisabled ? "not-allowed" : "pointer",
        transition: "all .2s",
        opacity: disabled && !loading ? 0.5 : 1,
        ...(VARIANTS[variant] || VARIANTS.primary),
        ...(loading
          ? { background: "#2a3050", color: "#607090", border: "none" }
          : {}),
        ...style,
      }}
    >
      {loading ? loadingText : children}
    </button>
  );
}
