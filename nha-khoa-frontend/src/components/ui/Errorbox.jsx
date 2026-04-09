export default function ErrorBox({ message }) {
  if (!message) return null;
  return (
    <div
      style={{
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: 8,
        padding: "10px 14px",
        fontSize: 13,
        color: "#ef4444",
        marginBottom: 14,
      }}
    >
      ⚠ {message}
    </div>
  );
}
