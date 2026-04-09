import { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import {
  checkInAPI,
  checkOutAPI,
  getLichSuChamCongCaNhanAPI,
} from "../../api/ChamCong";

const ST_COLOR = {
  "Đúng giờ": "#22c55e",
  "Đi trễ": "#f59e0b",
  "Đi muộn": "#f59e0b",
  "Vắng mặt": "#ef4444",
  "Chờ duyệt": "#0ea5e9",
};

const toHHmm = (timeValue) => {
  if (!timeValue) return null;
  const text = String(timeValue);
  return text.length >= 5 ? text.slice(0, 5) : text;
};

const mapChamCong = (row) => ({
  maChamCong: row.maChamCong,
  ngay: row.ngayChamCong || row.ngay || "",
  gioVao: toHHmm(row.gioVaoThucTe || row.gioVao),
  gioRa: toHHmm(row.gioRaThucTe || row.gioRa),
  trangThaiDiLam: row.trangThai || row.trangThaiDiLam || null,
  trangThaiDuyet: row.trangThaiDuyet || null,
  soPhutTre: Number(row.soPhutTre || 0),
});

export default function ChamCongCaNhan() {
  const { theme: C } = useTheme();
  const didInitFetch = useRef(false);
  const [data, setData] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ msg: "", type: "success" });
  const [confirm, setConfirm] = useState(null);

  const today = new Date().toISOString().split("T")[0];
  const todayRecord = data.find((r) => r.ngay === today);
  const hasCheckedIn = !!todayRecord?.gioVao;
  const hasCheckedOut = !!todayRecord?.gioRa;

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: "", type: "success" }), 3000);
  };

  const loadChamCong = async () => {
    setIsLoadingData(true);
    try {
      const res = await getLichSuChamCongCaNhanAPI();
      setData(Array.isArray(res) ? res.map(mapChamCong) : []);
    } catch (e) {
      showToast(e.message || "Không tải được dữ liệu chấm công", "error");
      setData([]);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    if (didInitFetch.current) return;
    didInitFetch.current = true;
    loadChamCong();
  }, []);

  const handleAction = async () => {
    const action = confirm;
    setConfirm(null);
    setLoading(true);
    try {
      if (action === "checkin") {
        const res = await checkInAPI();
        showToast(typeof res === "string" ? res : "Chấm công vào thành công!");
      } else {
        const res = await checkOutAPI();
        showToast(typeof res === "string" ? res : "Chấm công ra thành công!");
      }
      await loadChamCong();
    } catch (e) {
      showToast(e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const thangHienTai = new Date().getMonth() + 1;
  const namHienTai = new Date().getFullYear();
  const inThisMonth = data.filter((r) => {
    const [y, m] = r.ngay.split("-").map(Number);
    return y === namHienTai && m === thangHienTai;
  });
  const stats = useMemo(
    () => ({
      diLam: inThisMonth.filter((r) => r.gioVao).length,
      dungGio: inThisMonth.filter((r) => r.trangThaiDiLam === "Đúng giờ")
        .length,
      diTre: inThisMonth.filter(
        (r) => r.trangThaiDiLam === "Đi trễ" || r.trangThaiDiLam === "Đi muộn",
      ).length,
      vang: inThisMonth.filter((r) => r.trangThaiDiLam === "Vắng mặt").length,
    }),
    [inThisMonth],
  );

  const now = new Date();
  const nowStr = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

  return (
    <div>
      {/* Toast */}
      {toast.msg && (
        <div
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
            background: toast.type === "error" ? "#ef4444" : "#22c55e",
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 10,
            fontSize: 13,
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          {toast.type === "error" ? "⚠" : "✓"} {toast.msg}
        </div>
      )}

      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 4,
          color: C.text,
        }}
      >
        Chấm công
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
        Hôm nay: {today} • Hiện tại: {nowStr}
        {isLoadingData ? " • Đang tải dữ liệu thật..." : ""}
      </div>

      {/* Card chấm công hôm nay */}
      <div
        style={{
          background: C.surface,
          borderRadius: 14,
          border: `1px solid ${C.border}`,
          padding: 24,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: C.text,
            marginBottom: 16,
          }}
        >
          📅 Hôm nay — {today}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 20,
          }}
        >
          {[
            ["Giờ vào", todayRecord?.gioVao || "—", "#22c55e"],
            ["Giờ ra", todayRecord?.gioRa || "—", "#0ea5e9"],
          ].map(([k, v, c]) => (
            <div
              key={k}
              style={{
                background: C.bg,
                borderRadius: 10,
                padding: "14px 16px",
                border: `1px solid ${C.border}`,
                textAlign: "center",
              }}
            >
              <div
                style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}
              >
                {k}
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: v === "—" ? C.textDim : c,
                }}
              >
                {v}
              </div>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 12 }}>
          <button
            disabled={loading || hasCheckedIn}
            onClick={() => setConfirm("checkin")}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              cursor: loading || hasCheckedIn ? "not-allowed" : "pointer",
              background: hasCheckedIn ? "rgba(34,197,94,0.1)" : "#22c55e",
              color: hasCheckedIn ? "#22c55e" : "#fff",
              border: hasCheckedIn ? "1px solid rgba(34,197,94,0.3)" : "none",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {hasCheckedIn ? "✓ Đã chấm vào" : "⬇ Chấm vào"}
          </button>
          <button
            disabled={loading || !hasCheckedIn || hasCheckedOut}
            onClick={() => setConfirm("checkout")}
            style={{
              flex: 1,
              padding: "12px 0",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 14,
              cursor:
                loading || !hasCheckedIn || hasCheckedOut
                  ? "not-allowed"
                  : "pointer",
              background: hasCheckedOut
                ? "rgba(99,102,241,0.1)"
                : !hasCheckedIn
                  ? "rgba(0,0,0,0.05)"
                  : "#6366f1",
              color: hasCheckedOut
                ? "#6366f1"
                : !hasCheckedIn
                  ? C.textDim
                  : "#fff",
              border:
                hasCheckedOut || !hasCheckedIn
                  ? `1px solid ${C.border}`
                  : "none",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {hasCheckedOut ? "✓ Đã chấm ra" : "⬆ Chấm ra"}
          </button>
        </div>

        {todayRecord?.trangThaiDuyet && (
          <div
            style={{
              marginTop: 14,
              textAlign: "center",
              fontSize: 12,
              color: ST_COLOR[todayRecord.trangThaiDuyet] || C.textMuted,
            }}
          >
            Trạng thái duyệt: <b>{todayRecord.trangThaiDuyet}</b>
          </div>
        )}
      </div>

      {/* Stats tháng */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          marginBottom: 20,
        }}
      >
        {[
          { label: "Ngày đi làm", value: stats.diLam, color: "#0ea5e9" },
          { label: "Đúng giờ", value: stats.dungGio, color: "#22c55e" },
          { label: "Đi trễ", value: stats.diTre, color: "#f59e0b" },
          { label: "Vắng mặt", value: stats.vang, color: "#ef4444" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              background: C.surface,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              padding: "14px",
              borderTop: `3px solid ${s.color}`,
            }}
          >
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 4 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: C.text }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Lịch sử */}
      <div
        style={{
          background: C.surface,
          borderRadius: 12,
          border: `1px solid ${C.border}`,
          padding: 18,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: C.text,
            marginBottom: 14,
          }}
        >
          📋 Lịch sử chấm công
        </div>
        <table
          style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
        >
          <thead>
            <tr>
              {[
                "Ngày",
                "Giờ vào",
                "Giờ ra",
                "Tình trạng",
                "Phút trễ",
                "Duyệt",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 12px",
                    textAlign: "left",
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMuted,
                    letterSpacing: 0.8,
                    textTransform: "uppercase",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...data]
              .sort((a, b) => b.ngay.localeCompare(a.ngay))
              .map((r, i) => (
                <tr
                  key={i}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.surfaceHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "9px 12px",
                      borderBottom: `1px solid ${C.border}`,
                      fontWeight: 600,
                      color: C.text,
                    }}
                  >
                    {r.ngay}
                  </td>
                  <td
                    style={{
                      padding: "9px 12px",
                      borderBottom: `1px solid ${C.border}`,
                      color: "#22c55e",
                      fontWeight: 600,
                    }}
                  >
                    {r.gioVao || "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 12px",
                      borderBottom: `1px solid ${C.border}`,
                      color: "#0ea5e9",
                      fontWeight: 600,
                    }}
                  >
                    {r.gioRa || "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 12px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {r.trangThaiDiLam ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "3px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background:
                            (ST_COLOR[r.trangThaiDiLam] || "#607090") + "22",
                          color: ST_COLOR[r.trangThaiDiLam] || "#607090",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: ST_COLOR[r.trangThaiDiLam] || "#607090",
                            display: "inline-block",
                          }}
                        />
                        {r.trangThaiDiLam}
                      </span>
                    ) : (
                      <span style={{ color: C.textDim, fontSize: 12 }}>—</span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "9px 12px",
                      borderBottom: `1px solid ${C.border}`,
                      color: r.soPhutTre > 0 ? "#f59e0b" : C.textDim,
                      fontWeight: r.soPhutTre > 0 ? 700 : 400,
                    }}
                  >
                    {r.soPhutTre > 0 ? `+${r.soPhutTre} phút` : "—"}
                  </td>
                  <td
                    style={{
                      padding: "9px 12px",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color:
                          r.trangThaiDuyet === "Đã duyệt"
                            ? "#22c55e"
                            : r.trangThaiDuyet === "Chờ duyệt"
                              ? "#f59e0b"
                              : "#ef4444",
                      }}
                    >
                      {r.trangThaiDuyet || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            {!isLoadingData && data.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "14px 12px",
                    borderBottom: `1px solid ${C.border}`,
                    color: C.textMuted,
                    textAlign: "center",
                  }}
                >
                  Chưa có dữ liệu chấm công từ API.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm */}
      {confirm && (
        <ConfirmDialog
          title={
            confirm === "checkin" ? "⬇ Xác nhận chấm vào" : "⬆ Xác nhận chấm ra"
          }
          message={
            confirm === "checkin"
              ? `Chấm công VÀO lúc ${nowStr}?`
              : `Chấm công RA lúc ${nowStr}?`
          }
          type="info"
          confirmLabel={confirm === "checkin" ? "Chấm vào" : "Chấm ra"}
          onConfirm={handleAction}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
