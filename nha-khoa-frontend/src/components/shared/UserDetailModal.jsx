import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import Modal from "../ui/Modal";
import { getUserByIdAPI } from "../../api/User";

const ROLE_LABEL = {
  BAC_SI: "Bác sĩ",
  NHAN_VIEN: "Nhân viên",
  KHACH_HANG: "Khách hàng",
  ROLE_ADMIN: "Quản trị",
  ROLE_BACSI: "Bác sĩ",
  ROLE_NHANVIEN: "Nhân viên",
  ROLE_USER: "Khách hàng",
};

function labelRole(r) {
  return ROLE_LABEL[r] || r || "—";
}

export default function UserDetailModal({
  userId,
  onClose,
  titlePrefix = "Chi tiết",
}) {
  const { theme: C } = useTheme();
  const [u, setU] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setErr("");
    getUserByIdAPI(userId)
      .then(setU)
      .catch((e) => setErr(e.message || "Không tải được chi tiết"))
      .finally(() => setLoading(false));
  }, [userId]);

  const Cell = ({ label, value, full }) =>
    value != null && value !== "" ? (
      <div
        style={{
          gridColumn: full ? "1/-1" : "span 1",
          padding: "10px 14px",
          background: C.bg,
          borderRadius: 8,
          minWidth: 0,
        }}
      >
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: C.text,
            wordBreak: "break-word",
            overflowWrap: "break-word",
          }}
        >
          {value}
        </div>
      </div>
    ) : null;

  const title = u?.ten != null ? `${titlePrefix}: ${u.ten}` : `${titlePrefix}`;

  return (
    <Modal title={title} onClose={onClose} width={520}>
      {loading && (
        <div
          style={{ textAlign: "center", padding: "24px 0", color: C.textMuted }}
        >
          Đang tải...
        </div>
      )}
      {err && !loading && (
        <div
          style={{
            padding: "12px 14px",
            borderRadius: 8,
            background: "rgba(239,68,68,0.1)",
            color: "#ef4444",
            fontSize: 13,
            marginBottom: 12,
          }}
        >
          {err}
        </div>
      )}
      {!loading && u && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <Cell label="Mã" value={u.id} />
            <Cell label="Vai trò" value={labelRole(u.role)} />
            <Cell label="Họ tên" value={u.ten} />
            <Cell label="Số điện thoại" value={u.sdt} />
            <Cell label="Giới tính" value={u.gioiTinh} />
            <Cell label="Ngày sinh" value={u.ngaySinh} />
            <Cell label="Trạng thái TK" value={u.trangThai} full />
            <Cell label="Địa chỉ" value={u.diaChi} full />
            {(u.role === "BAC_SI" || u.role === "ROLE_BACSI") && (
              <>
                <Cell label="Bằng cấp" value={u.bangCap} full />
                <Cell label="Chứng chỉ" value={u.chungChi} full />
                <Cell
                  label="Số năm kinh nghiệm"
                  value={(() => {
                    const n = u.soNamKinhNghiem ?? u.namKinhNghiem;
                    if (n == null || n === "") return null;
                    return `${n} năm`;
                  })()}
                  full
                />
              </>
            )}
            {(u.role === "KHACH_HANG" || u.role === "ROLE_USER") && (
              <Cell
                label="Tiền sử bệnh"
                value={u.tienSuBenh || "Không có"}
                full
              />
            )}
          </div>
        </>
      )}
      <div
        style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}
      >
        <button
          onClick={onClose}
          style={{
            padding: "8px 18px",
            borderRadius: 8,
            border: `1px solid ${C.border}`,
            background: "transparent",
            color: C.textMuted,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
}
