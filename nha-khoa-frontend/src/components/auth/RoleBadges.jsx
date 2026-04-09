const ROLE_LABEL = {
  admin: "Quản trị viên",
  bacsi: "Bác sĩ",
  letan: "Lễ tân / Nhân viên",
  benhnhan: "Bệnh nhân",
};
const ROLE_COLOR = {
  admin: "#6366f1",
  bacsi: "#0ea5e9",
  letan: "#10b981",
  benhnhan: "#f59e0b",
};

export default function RoleBadges({ hint = "Username = SĐT đã đăng ký" }) {
  return (
    <div style={{ marginTop: 16, textAlign: "center" }}>
      {Object.entries(ROLE_LABEL).map(([role, label]) => (
        <span
          key={role}
          style={{
            display: "inline-block",
            margin: "3px 4px",
            padding: "3px 10px",
            borderRadius: 20,
            background: ROLE_COLOR[role] + "18",
            color: ROLE_COLOR[role],
            fontSize: 11,
            fontWeight: 600,
          }}
        >
          {label}
        </span>
      ))}
      <div style={{ fontSize: 11, color: "#3a4a65", marginTop: 8 }}>{hint}</div>
    </div>
  );
}
