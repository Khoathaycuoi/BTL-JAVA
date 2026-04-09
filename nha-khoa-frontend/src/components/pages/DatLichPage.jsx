import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getAllKhachHangAPI, getBacSiHoatDongAPI } from "../../api/User";
import { searchDichVuAPI } from "../../api/DichVu";
import { datLichHenAPI, getCaTrongAPI } from "../../api/LichHen";

const GIO_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
];

const normalizeGioHen = (value) => {
  if (!value) return "";
  const raw = String(value).trim();
  const hhmm = raw.match(/^(\d{2}):(\d{2})/);
  return hhmm ? `${hhmm[1]}:${hhmm[2]}` : "";
};

const STEP_LABELS = {
  admin: ["Chọn khách hàng", "Chọn dịch vụ & bác sĩ", "Xác nhận"],
  letan: ["Chọn khách hàng", "Chọn dịch vụ & bác sĩ", "Xác nhận"],
  benhnhan: ["Chọn dịch vụ & bác sĩ", "Xác nhận"],
};

const fmt = (v) => (v ? new Intl.NumberFormat("vi-VN").format(v) + "đ" : "");

const normalizeText = (v = "") =>
  String(v)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const isDichVuHoatDong = (dv) => {
  const raw = dv?.trangThai;
  if (raw == null || raw === "") return true;
  const st = normalizeText(raw);
  return !(
    st.includes("ngung hoat dong") ||
    st === "inactive" ||
    st === "disabled" ||
    st === "false" ||
    st === "0"
  );
};

export default function DatLichPage({ S, role = "benhnhan", onBack }) {
  const { theme: C } = useTheme();
  const steps = STEP_LABELS[role] || STEP_LABELS.benhnhan;
  const hasKHStep = role === "admin" || role === "letan";
  const dvStepIdx = hasKHStep ? 1 : 0;
  const confStepIdx = hasKHStep ? 2 : 1;

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const [khSearch, setKhSearch] = useState("");
  const [khList, setKhList] = useState([]);
  const [khLoading, setKhLoading] = useState(false);
  const [selectedKH, setSelectedKH] = useState(null);

  const [dvList, setDvList] = useState([]);
  const [dvLoading, setDvLoading] = useState(true);
  const [selectedDV, setSelectedDV] = useState([]);
  const [dvSearch, setDvSearch] = useState("");
  const [bsList, setBsList] = useState([]);
  const [selectedBS, setSelectedBS] = useState("");
  const [bsSearch, setBsSearch] = useState("");
  const [ngayHen, setNgayHen] = useState("");
  const [gioHen, setGioHen] = useState("09:00");
  const [gioTrongList, setGioTrongList] = useState(GIO_LIST);
  const [gioLoading, setGioLoading] = useState(false);

  useEffect(() => {
    searchDichVuAPI({ status: "Hoạt động" })
      .then((list) =>
        setDvList((list || []).filter((d) => isDichVuHoatDong(d))),
      )
      .catch(() => setDvList([]))
      .finally(() => setDvLoading(false));

    getBacSiHoatDongAPI()
      .then(setBsList)
      .catch(() => setBsList([]));
  }, []);

  useEffect(() => {
    if (!hasKHStep || !khSearch.trim()) {
      setKhList([]);
      return;
    }
    const t = setTimeout(() => {
      setKhLoading(true);
      getAllKhachHangAPI(khSearch)
        .then(setKhList)
        .catch(() => setKhList([]))
        .finally(() => setKhLoading(false));
    }, 400);
    return () => clearTimeout(t);
  }, [khSearch]);

  const toggleDV = (id) =>
    setSelectedDV((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
    );

  const dvFiltered = dvList.filter((dv) => {
    const q = normalizeText(dvSearch);
    if (!q) return true;
    return (
      normalizeText(dv.tenDichVu).includes(q) ||
      normalizeText(dv.maDichVu).includes(q)
    );
  });

  const bsFiltered = bsList.filter((bs) => {
    const q = normalizeText(bsSearch);
    if (!q) return true;
    return (
      normalizeText(bs.ten).includes(q) ||
      normalizeText(bs.id).includes(q) ||
      normalizeText(bs.sdt).includes(q)
    );
  });

  useEffect(() => {
    if (!selectedBS || !ngayHen) {
      setGioTrongList(GIO_LIST);
      return;
    }

    setGioLoading(true);
    getCaTrongAPI({ maBacSi: selectedBS, ngay: ngayHen })
      .then((list) => {
        const normalized = (Array.isArray(list) ? list : [])
          .map((item) => normalizeGioHen(item))
          .filter(Boolean);
        setGioTrongList(normalized.length ? normalized : []);
      })
      .catch(() => setGioTrongList([]))
      .finally(() => setGioLoading(false));
  }, [selectedBS, ngayHen]);

  useEffect(() => {
    if (gioTrongList.length && !gioTrongList.includes(gioHen)) {
      setGioHen(gioTrongList[0]);
      return;
    }
    if (!gioTrongList.length) setGioHen("");
  }, [gioTrongList, gioHen]);

  const handleSubmit = async () => {
    if (!selectedDV.length) {
      setError("Vui lòng chọn ít nhất 1 dịch vụ");
      return;
    }
    if (!ngayHen) {
      setError("Vui lòng chọn ngày hẹn");
      return;
    }
    if (hasKHStep && !selectedKH) {
      setError("Vui lòng chọn khách hàng");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const body = {
        danhSachMaDichVu: selectedDV,
        maBacSi: selectedBS || null,
        ngayHen,
        gioHen,
        ...(hasKHStep ? { maKhachHang: selectedKH.id } : {}),
      };
      const res = await datLichHenAPI(body);
      const match =
        typeof res === "string" ? res.match(/Mã lịch hẹn:\s*(\S+)/) : null;
      setSuccess({ maLichHen: match ? match[1] : "—" });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSuccess(null);
    setStep(0);
    setSelectedDV([]);
    setSelectedBS("");
    setNgayHen("");
    setSelectedKH(null);
    setKhSearch("");
    setKhList([]);
    setError("");
  };

  const Stepper = () => (
    <div style={{ display: "flex", marginBottom: 24 }}>
      {steps.map((s, i) => (
        <div key={i} style={{ flex: 1, textAlign: "center" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              margin: "0 auto 6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              background:
                step > i ? "#22c55e" : step === i ? C.accent : C.border,
              color: step >= i ? "#fff" : C.textMuted,
            }}
          >
            {step > i ? "✓" : i + 1}
          </div>
          <div
            style={{ fontSize: 11, color: step === i ? C.accent : C.textMuted }}
          >
            {s}
          </div>
        </div>
      ))}
    </div>
  );

  if (success)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "60vh",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "rgba(34,197,94,0.15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
          Đặt lịch thành công!
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.textMuted,
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          Mã lịch hẹn: <b style={{ color: C.accent }}>{success.maLichHen}</b>
          <br />
          Trạng thái:{" "}
          <b style={{ color: hasKHStep ? "#22c55e" : "#f59e0b" }}>
            {hasKHStep ? "Đã xác nhận" : "Chờ xác nhận"}
          </b>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button style={S.btn()} onClick={onBack}>
            📋 Xem lịch hẹn
          </button>
          <button style={S.btn("ghost")} onClick={reset}>
            + Đặt lịch khác
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      {/* Back button */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 4,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: C.textMuted,
            cursor: "pointer",
            fontSize: 18,
            padding: "4px 8px",
          }}
        >
          ←
        </button>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
          Đặt lịch hẹn
        </div>
      </div>
      <div
        style={{
          fontSize: 12,
          color: C.textMuted,
          marginBottom: 20,
          paddingLeft: 36,
        }}
      >
        Bước {step + 1}/{steps.length}
        {hasKHStep && (
          <span style={{ marginLeft: 8, color: "#22c55e", fontWeight: 600 }}>
            — Lịch đặt hộ sẽ được tự động xác nhận
          </span>
        )}
      </div>
      <Stepper />

      {/* ── STEP 0: Chọn KH (admin/letan) ── */}
      {hasKHStep && step === 0 && (
        <div style={S.card}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: C.text,
              marginBottom: 6,
            }}
          >
            🔍 Tìm khách hàng
          </div>
          <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>
            Tìm theo tên, SĐT hoặc mã KH
          </div>

          <input
            placeholder="Nguyễn Văn A / 0901234567 / KH_0001"
            value={khSearch}
            onChange={(e) => {
              setKhSearch(e.target.value);
              setSelectedKH(null);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              background: C.bg,
              border: `1px solid ${C.border}`,
              borderRadius: 8,
              padding: "9px 12px",
              color: C.text,
              fontSize: 13,
              outline: "none",
              marginBottom: 12,
            }}
          />

          {khLoading && (
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>
              ⏳ Đang tìm...
            </div>
          )}

          {/* Danh sách kết quả */}
          {!selectedKH && khList.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div
                style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}
              >
                {khList.length} kết quả
              </div>
              {khList.slice(0, 6).map((kh) => (
                <div
                  key={kh.id}
                  onClick={() => {
                    setSelectedKH(kh);
                    setKhSearch(kh.ten);
                    setKhList([]);
                  }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${C.border}`,
                    marginBottom: 6,
                    cursor: "pointer",
                    background: C.bg,
                    transition: "border .15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = C.accent)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = C.border)
                  }
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: C.accent + "20",
                      color: C.accent,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {kh.ten?.charAt(0)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: C.text }}
                    >
                      {kh.ten}
                    </div>
                    <div style={{ fontSize: 11, color: C.textMuted }}>
                      {kh.sdt} • {kh.id}
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: C.accent }}>Chọn →</span>
                </div>
              ))}
            </div>
          )}

          {/* Đã chọn */}
          {selectedKH && (
            <div
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 8,
                padding: "12px 16px",
                marginBottom: 14,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  color: "#22c55e",
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                ✓ Đã chọn bệnh nhân
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  fontSize: 13,
                }}
              >
                {[
                  ["Mã KH", selectedKH.id],
                  ["Họ tên", selectedKH.ten],
                  ["SĐT", selectedKH.sdt],
                ].map(([k, v]) => (
                  <div key={k}>
                    <span style={{ color: C.textMuted }}>{k}: </span>
                    <span style={{ fontWeight: 600, color: C.text }}>{v}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  setSelectedKH(null);
                  setKhSearch("");
                }}
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: C.textMuted,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textDecoration: "underline",
                }}
              >
                Chọn lại
              </button>
            </div>
          )}

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingTop: 14,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            <button
              style={{ ...S.btn(), opacity: selectedKH ? 1 : 0.4 }}
              disabled={!selectedKH}
              onClick={() => setStep(1)}
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP Dịch vụ & Bác sĩ ── */}
      {step === dvStepIdx && (
        <div style={S.card}>
          {hasKHStep && (
            <div
              style={{
                marginBottom: 14,
                padding: "10px 14px",
                background: C.bg,
                borderRadius: 8,
                border: `1px solid ${C.border}`,
              }}
            >
              <span style={{ fontSize: 12, color: C.textMuted }}>
                Bệnh nhân:{" "}
              </span>
              <span style={{ fontWeight: 700, color: C.text }}>
                {selectedKH?.ten}
              </span>
              <span style={{ marginLeft: 8, fontSize: 11, color: C.textMuted }}>
                ({selectedKH?.id})
              </span>
            </div>
          )}

          {/* [MỚI] Dịch vụ từ API thật */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.textMuted,
                marginBottom: 10,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Dịch vụ <span style={{ color: "#ef4444" }}>*</span>
              {selectedDV.length > 0 && (
                <span
                  style={{
                    color: C.accent,
                    fontWeight: 400,
                    marginLeft: 8,
                    fontSize: 11,
                    textTransform: "none",
                  }}
                >
                  ({selectedDV.length} đã chọn)
                </span>
              )}
            </div>
            {dvLoading ? (
              <div style={{ fontSize: 13, color: C.textMuted }}>
                ⏳ Đang tải dịch vụ...
              </div>
            ) : dvList.length === 0 ? (
              <div style={{ fontSize: 13, color: C.textMuted }}>
                Không có dịch vụ nào khả dụng
              </div>
            ) : (
              <>
                <input
                  placeholder="🔍 Tìm dịch vụ theo tên hoặc mã..."
                  value={dvSearch}
                  onChange={(e) => setDvSearch(e.target.value)}
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                    marginBottom: 8,
                  }}
                />
                <div
                  style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}
                >
                  {dvFiltered.length} dịch vụ phù hợp
                </div>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                    maxHeight: 220,
                    overflowY: "auto",
                    paddingRight: 2,
                  }}
                >
                  {dvFiltered.map((dv) => {
                    const sel = selectedDV.includes(dv.maDichVu);
                    return (
                      <div
                        key={dv.maDichVu}
                        onClick={() => toggleDV(dv.maDichVu)}
                        style={{
                          padding: "10px 14px",
                          borderRadius: 8,
                          cursor: "pointer",
                          background: sel ? C.accent + "15" : C.bg,
                          border: `1px solid ${sel ? C.accent : C.border}`,
                          transition: "all .15s",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.text,
                            marginBottom: 2,
                          }}
                        >
                          {dv.tenDichVu}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            color: sel ? C.accent : C.textMuted,
                          }}
                        >
                          {dv.maDichVu} · {fmt(dv.donGia)}
                        </div>
                      </div>
                    );
                  })}
                </div>
                {!dvFiltered.length && (
                  <div
                    style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}
                  >
                    Không tìm thấy dịch vụ phù hợp
                  </div>
                )}
              </>
            )}
          </div>

          {/* [MỚI] Bác sĩ từ API thật */}
          <div style={{ marginBottom: 18 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.textMuted,
                marginBottom: 10,
                letterSpacing: 0.5,
                textTransform: "uppercase",
              }}
            >
              Bác sĩ (không bắt buộc)
            </div>
            <input
              placeholder="🔍 Tìm bác sĩ theo tên, mã hoặc SĐT..."
              value={bsSearch}
              onChange={(e) => setBsSearch(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                background: C.bg,
                border: `1px solid ${C.border}`,
                borderRadius: 8,
                padding: "9px 12px",
                color: C.text,
                fontSize: 13,
                outline: "none",
                marginBottom: 8,
              }}
            />
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>
              {bsFiltered.length} bác sĩ phù hợp
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
                maxHeight: 160,
                overflowY: "auto",
                paddingRight: 2,
              }}
            >
              <div
                onClick={() => setSelectedBS("")}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 12,
                  background: !selectedBS ? C.accent + "15" : C.bg,
                  border: `1px solid ${!selectedBS ? C.accent : C.border}`,
                  color: !selectedBS ? C.accent : C.textMuted,
                }}
              >
                Bất kỳ
              </div>
              {bsFiltered.map((bs) => (
                <div
                  key={bs.id}
                  onClick={() => setSelectedBS(bs.id)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 12,
                    background: selectedBS === bs.id ? C.accent + "15" : C.bg,
                    border: `1px solid ${selectedBS === bs.id ? C.accent : C.border}`,
                    color: selectedBS === bs.id ? C.accent : C.textMuted,
                  }}
                >
                  {bs.ten}
                </div>
              ))}
            </div>
            {!bsFiltered.length && (
              <div style={{ fontSize: 12, color: C.textMuted, marginTop: 8 }}>
                Không tìm thấy bác sĩ phù hợp
              </div>
            )}
          </div>

          {/* Ngày & Giờ */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: C.textMuted,
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Ngày hẹn <span style={{ color: "#ef4444" }}>*</span>
              </div>
              <div
                style={{ fontSize: 11, marginBottom: 6, visibility: "hidden" }}
              >
                .
              </div>
              <input
                type="date"
                value={ngayHen}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setNgayHen(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontSize: 12,
                  color: C.textMuted,
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Giờ hẹn
              </div>
              {selectedBS && ngayHen && (
                <div
                  style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}
                >
                  {gioLoading
                    ? "Đang tải ca trống..."
                    : `${gioTrongList.length} ca trống`}
                </div>
              )}
              {!(selectedBS && ngayHen) && (
                <div
                  style={{
                    fontSize: 11,
                    marginBottom: 6,
                    visibility: "hidden",
                  }}
                >
                  .
                </div>
              )}
              <select
                value={gioHen}
                onChange={(e) => setGioHen(e.target.value)}
                disabled={!gioTrongList.length}
                style={{
                  width: "100%",
                  background: C.bg,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: C.text,
                  fontSize: 13,
                  outline: "none",
                }}
              >
                {!gioTrongList.length && (
                  <option value="">Không còn ca trống</option>
                )}
                {gioTrongList.map((g) => (
                  <option key={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#ef4444",
                marginBottom: 14,
              }}
            >
              ⚠ {error}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {hasKHStep ? (
              <button
                style={S.btn("ghost")}
                onClick={() => {
                  setStep(0);
                  setError("");
                }}
              >
                ← Quay lại
              </button>
            ) : (
              <span />
            )}
            <button
              style={{
                ...S.btn(),
                opacity: selectedDV.length && ngayHen && gioHen ? 1 : 0.4,
              }}
              disabled={!selectedDV.length || !ngayHen || !gioHen}
              onClick={() => {
                setError("");
                setStep(confStepIdx);
              }}
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* ── STEP Xác nhận ── */}
      {step === confStepIdx && (
        <div style={S.card}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: C.text,
              marginBottom: 16,
            }}
          >
            Xác nhận thông tin đặt lịch
          </div>
          <div
            style={{
              background: C.bg,
              borderRadius: 10,
              padding: 16,
              marginBottom: 16,
            }}
          >
            {[
              ...(hasKHStep
                ? [
                    ["Khách hàng", selectedKH?.ten],
                    ["Mã KH", selectedKH?.id],
                  ]
                : []),
              [
                "Dịch vụ",
                dvList
                  .filter((d) => selectedDV.includes(d.maDichVu))
                  .map((d) => d.tenDichVu)
                  .join(", "),
              ],
              [
                "Bác sĩ",
                selectedBS
                  ? bsList.find((b) => b.id === selectedBS)?.ten || selectedBS
                  : "Bất kỳ",
              ],
              ["Ngày hẹn", ngayHen],
              ["Giờ hẹn", gioHen],
              [
                "Trạng thái sau đặt",
                hasKHStep ? "Đã xác nhận ✅" : "Chờ xác nhận ⏳",
              ],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div
                  key={k}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "8px 0",
                    borderBottom: `1px solid ${C.border}`,
                    fontSize: 13,
                  }}
                >
                  <span style={{ color: C.textMuted }}>{k}</span>
                  <span
                    style={{
                      fontWeight: 600,
                      color: C.text,
                      maxWidth: "60%",
                      textAlign: "right",
                    }}
                  >
                    {v}
                  </span>
                </div>
              ))}
          </div>
          <div
            style={{
              padding: 10,
              background: "rgba(245,158,11,0.1)",
              borderRadius: 8,
              fontSize: 12,
              color: C.textMuted,
              marginBottom: 16,
            }}
          >
            ⚠ Vui lòng đến trước 10 phút. Mang theo CCCD và sổ khám bệnh (nếu
            có).
          </div>
          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.25)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: "#ef4444",
                marginBottom: 14,
              }}
            >
              ⚠ {error}
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button
              style={S.btn("ghost")}
              onClick={() => {
                setStep(dvStepIdx);
                setError("");
              }}
            >
              ← Quay lại
            </button>
            <button style={S.btn()} onClick={handleSubmit} disabled={loading}>
              {loading ? "Đang gửi..." : "✓ Xác nhận đặt lịch"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
