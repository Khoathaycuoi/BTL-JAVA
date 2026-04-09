/**
 * views/benhnhan/LienHePage.jsx
 * Trang liên hệ phòng khám dành cho Khách hàng
 */
import { useTheme } from "../../context/ThemeContext";

const CONTACTS = [
  {
    id: "hotline",
    icon: "📞",
    label: "Hotline",
    value: "1900 1234",
    sub: "Miễn phí • 7:00 – 21:00 mỗi ngày",
    color: "#22c55e",
    action: { href: "tel:19001234", text: "Gọi ngay" },
  },
  {
    id: "zalo",
    icon: "💬",
    label: "Zalo",
    value: "0901 234 567",
    sub: "Nhắn tin tư vấn — phản hồi trong 15 phút",
    color: "#0ea5e9",
    action: { href: "https://zalo.me/0901234567", text: "Nhắn Zalo" },
  },
  {
    id: "facebook",
    icon: "👍",
    label: "Fanpage Facebook",
    value: "NhaKhoa Pro",
    sub: "facebook.com/nhakhoapro",
    color: "#6366f1",
    action: { href: "https://facebook.com/nhakhoapro", text: "Mở Fanpage" },
  },
  {
    id: "messenger",
    icon: "💌",
    label: "Messenger",
    value: "NhaKhoa Pro",
    sub: "m.me/nhakhoapro • Chat trực tiếp",
    color: "#f59e0b",
    action: { href: "https://m.me/nhakhoapro", text: "Nhắn Messenger" },
  },
  {
    id: "address",
    icon: "📍",
    label: "Địa chỉ",
    value: "Số 3 phố Cầu Giấy, Phường Láng, TP. Hà Nội.",
    sub: "Thứ 2 – Thứ 7: 7:00 – 20:00 • Chủ nhật: 8:00 – 17:00",
    color: "#ef4444",
    action: {
      href: "https://maps.google.com/?q=Số+3+phố+Cầu+Giấy,+Phường+Láng,+TP.+Hà+Nội",
      text: "Xem bản đồ",
    },
  },
  {
    id: "email",
    icon: "✉️",
    label: "Email",
    value: "contact@nhakhoapro.vn",
    sub: "Phản hồi trong vòng 24 giờ",
    color: "#10b981",
    action: { href: "mailto:contact@nhakhoapro.vn", text: "Gửi email" },
  },
];

export default function LienHePage() {
  const { theme: C } = useTheme();

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
          📞 Liên hệ phòng khám
        </div>
        <div
          style={{
            fontSize: 12,
            color: C.textMuted,
            marginTop: 4,
            lineHeight: 1.6,
          }}
        >
          Chúng tôi luôn sẵn sàng hỗ trợ bạn — hãy liên hệ qua bất kỳ kênh nào
          dưới đây.
        </div>
      </div>

      {/* Contact cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CONTACTS.map((c) => (
          <div
            key={c.id}
            style={{
              background: C.surface,
              borderRadius: 14,
              border: `1px solid ${C.border}`,
              padding: "18px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "border-color .15s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.borderColor = c.color + "60")
            }
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = C.border)}
          >
            {/* Icon */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 14,
                flexShrink: 0,
                background: c.color + "18",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              {c.icon}
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 11,
                  color: C.textMuted,
                  fontWeight: 600,
                  marginBottom: 3,
                  letterSpacing: 0.3,
                }}
              >
                {c.label}
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: C.text,
                  marginBottom: 3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {c.value}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted }}>{c.sub}</div>
            </div>

            {/* Action button */}
            <a
              href={c.action.href}
              target={
                c.id !== "hotline" && c.id !== "email" ? "_blank" : undefined
              }
              rel="noopener noreferrer"
              style={{
                flexShrink: 0,
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 14px",
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
                background: c.color + "18",
                color: c.color,
                border: `1px solid ${c.color}40`,
                transition: "background .15s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = c.color + "30")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = c.color + "18")
              }
            >
              {c.action.text} →
            </a>
          </div>
        ))}
      </div>

      {/* Giờ làm việc card */}
      <div
        style={{
          marginTop: 20,
          background: C.surface,
          borderRadius: 14,
          border: `1px solid ${C.border}`,
          padding: "18px 20px",
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginBottom: 12,
          }}
        >
          🕐 Giờ làm việc
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}
        >
          {[
            ["Thứ 2 – Thứ 6", "07:00 – 20:00", true],
            ["Thứ 7", "07:00 – 18:00", true],
            ["Chủ nhật", "08:00 – 17:00", true],
            ["Lễ, Tết", "Nghỉ", false],
          ].map(([ngay, gio, open]) => (
            <div
              key={ngay}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "8px 0",
                borderBottom: `1px solid ${C.border}`,
                gridColumn: "1/-1",
                fontSize: 13,
              }}
            >
              <span style={{ color: C.textMuted }}>{ngay}</span>
              <span
                style={{ fontWeight: 600, color: open ? C.text : "#ef4444" }}
              >
                {gio}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Lưu ý khẩn cấp */}
      <div
        style={{
          marginTop: 16,
          padding: "12px 16px",
          background: "rgba(239,68,68,0.08)",
          border: "1px solid rgba(239,68,68,0.25)",
          borderRadius: 10,
          fontSize: 12,
          color: C.textMuted,
          lineHeight: 1.7,
        }}
      >
        🚨 Trường hợp <b style={{ color: "#ef4444" }}>khẩn cấp</b> ngoài giờ làm
        việc, vui lòng gọi <b style={{ color: C.text }}>1900 1234</b> để được
        hướng dẫn hoặc đến cơ sở y tế gần nhất.
      </div>
    </div>
  );
}
