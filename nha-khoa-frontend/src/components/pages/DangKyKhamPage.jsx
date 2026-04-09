import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import FormField from "../ui/FormField";
import { registerKhachHangAPI } from "../../api/Auth";
import { getAllKhachHangAPI } from "../../api/User";
import { REGEX, MSG, parseMaKH } from "../../utils/Validate";

const STEP_LABELS = [
  "Tìm / Tạo bệnh nhân",
  "Chọn dịch vụ & bác sĩ",
  "Xác nhận",
];

const BS_LIST = [
  {
    id: "BS_0001",
    ten: "BS. Trần Minh Khoa",
    chuyen_khoa: "Nha khoa tổng quát",
    phong: "P.101",
  },
  {
    id: "BS_0002",
    ten: "BS. Nguyễn Thị Hoa",
    chuyen_khoa: "Thẩm mỹ răng",
    phong: "P.102",
  },
  {
    id: "BS_0003",
    ten: "BS. Lê Văn Nam",
    chuyen_khoa: "Chỉnh nha",
    phong: "P.103",
  },
];

const DV_LIST = [
  "Khám tổng quát",
  "Nhổ răng",
  "Trám răng",
  "Tẩy trắng răng",
  "X-quang",
  "Niềng răng",
  "Điều trị tủy",
];

export default function DangKyKhamPage({ S }) {
  const { theme: C } = useTheme();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [isNew, setIsNew] = useState(false);
  const [searchQ, setSearchQ] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [foundKH, setFoundKH] = useState(null);

  const [newForm, setNewForm] = useState({
    maDinhDanh: "",
    ten: "",
    sdt: "",
    matKhau: "",
    gioiTinh: "Nam",
    ngaySinh: "",
    diaChi: "",
    tienSuBenh: "",
  });

  const [selectedDV, setSelectedDV] = useState([]);
  const [selectedBS, setSelectedBS] = useState("");
  const [gio, setGio] = useState("09:00");
  const [ghiChu, setGhiChu] = useState("");

  const [fErrors, setFErrors] = useState({});
  const setField = (f) => (v) => {
    setNewForm((p) => ({ ...p, [f]: v }));
    const err =
      f === "maDinhDanh" && v && !REGEX.maDinhDanh.test(v)
        ? MSG.maDinhDanh
        : f === "sdt" && v && !REGEX.sdt.test(v)
          ? MSG.sdt
          : f === "matKhau" && v && !REGEX.matKhau.test(v)
            ? MSG.matKhau
            : "";
    setFErrors((p) => ({ ...p, [f]: err }));
  };
  const fieldErr = (f) =>
    fErrors[f] ? (
      <div style={{ fontSize: 11, color: "#ef4444", marginTop: 3 }}>
        ⚠ {fErrors[f]}
      </div>
    ) : null;

  const handleSearch = async () => {
    if (!searchQ.trim()) {
      setError("Nhập SĐT, tên hoặc mã KH để tìm kiếm");
      return;
    }
    setSearching(true);
    setError("");
    setSearchResults([]);
    setFoundKH(null);
    try {
      const res = await getAllKhachHangAPI(searchQ.trim());
      if (res.length === 0) {
        setError("Không tìm thấy bệnh nhân. Bạn có thể tạo mới bên dưới.");
      } else if (res.length === 1) {
        setFoundKH(res[0]);
      } else {
        setSearchResults(res);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setSearching(false);
    }
  };

  const handleCreateNew = async () => {
    if (!newForm.maDinhDanh || !REGEX.maDinhDanh.test(newForm.maDinhDanh)) {
      setError(MSG.maDinhDanh);
      return;
    }
    if (!newForm.ten) {
      setError("Vui lòng nhập họ tên");
      return;
    }
    if (!REGEX.sdt.test(newForm.sdt)) {
      setError(MSG.sdt);
      return;
    }
    if (!REGEX.matKhau.test(newForm.matKhau)) {
      setError(MSG.matKhau);
      return;
    }
    if (!newForm.ngaySinh) {
      setError("Vui lòng chọn ngày sinh");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const responseText = await registerKhachHangAPI(newForm);
      const maKH = parseMaKH(responseText) || "—";
      setFoundKH({
        id: maKH,
        ten: newForm.ten,
        sdt: newForm.sdt,
        gioiTinh: newForm.gioiTinh,
      });
      setIsNew(false);
      setError("");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const btn = (v = "primary", extra = {}) => ({
    padding: "9px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 13,
    fontWeight: 600,
    background: v === "primary" ? C.accent : "transparent",
    color: v === "primary" ? "#fff" : C.textMuted,
    border: v !== "primary" ? `1px solid ${C.border}` : "none",
    ...extra,
  });

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
            fontSize: 30,
          }}
        >
          ✓
        </div>
        <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
          Đăng ký khám thành công!
        </div>
        <div
          style={{
            fontSize: 13,
            color: C.textMuted,
            textAlign: "center",
            lineHeight: 1.7,
          }}
        >
          <b style={{ color: C.text }}>{foundKH?.ten}</b> ({foundKH?.id})<br />
          {selectedDV.join(", ")} — {gio}
        </div>
        <button
          style={btn()}
          onClick={() => {
            setStep(0);
            setSuccess(false);
            setFoundKH(null);
            setSelectedDV([]);
            setSelectedBS("");
            setSearchQ("");
            setSearchResults([]);
          }}
        >
          + Đăng ký ca tiếp theo
        </button>
      </div>
    );

  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          marginBottom: 4,
          color: C.text,
        }}
      >
        Đăng ký khám
      </div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 20 }}>
        Bước {step + 1}/{STEP_LABELS.length}
      </div>

      {/* Stepper */}
      <div style={{ display: "flex", marginBottom: 24 }}>
        {STEP_LABELS.map((s, i) => (
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
              style={{
                fontSize: 11,
                color: step === i ? C.accent : C.textMuted,
              }}
            >
              {s}
            </div>
          </div>
        ))}
      </div>

      {/* ── Step 0 ── */}
      {step === 0 && (
        <div style={S.card}>
          {!isNew ? (
            <>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: C.text,
                  marginBottom: 6,
                }}
              >
                🔍 Tìm bệnh nhân
              </div>
              <div
                style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}
              >
                Tìm theo SĐT, tên hoặc mã khách hàng
              </div>

              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                <input
                  placeholder="SĐT, tên hoặc mã KH (vd: KH_0001)"
                  value={searchQ}
                  onChange={(e) => {
                    setSearchQ(e.target.value);
                    setError("");
                    setSearchResults([]);
                    setFoundKH(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  style={{
                    flex: 1,
                    background: C.bg,
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                    padding: "9px 12px",
                    color: C.text,
                    fontSize: 13,
                    outline: "none",
                  }}
                />
                <button
                  style={btn()}
                  onClick={handleSearch}
                  disabled={searching}
                >
                  {searching ? "..." : "Tìm"}
                </button>
              </div>

              {/* Nhiều kết quả → hiển thị danh sách chọn */}
              {searchResults.length > 1 && (
                <div style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textMuted,
                      marginBottom: 8,
                    }}
                  >
                    {searchResults.length} kết quả — chọn bệnh nhân:
                  </div>
                  {searchResults.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => {
                        setFoundKH(r);
                        setSearchResults([]);
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
                        {r.ten?.charAt(0)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: C.text,
                          }}
                        >
                          {r.ten}
                        </div>
                        <div style={{ fontSize: 11, color: C.textMuted }}>
                          {r.sdt} • {r.id}
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: C.accent }}>
                        Chọn →
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Đã tìm thấy 1 */}
              {foundKH && (
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
                      ["Mã KH", foundKH.id],
                      ["Họ tên", foundKH.ten],
                      ["SĐT", foundKH.sdt],
                      ["Giới tính", foundKH.gioiTinh],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <span style={{ color: C.textMuted }}>{k}: </span>
                        <span style={{ fontWeight: 600, color: C.text }}>
                          {v || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setFoundKH(null);
                      setSearchQ("");
                    }}
                    style={{
                      marginTop: 10,
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

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 14,
                  borderTop: `1px solid ${C.border}`,
                }}
              >
                <button
                  onClick={() => {
                    setIsNew(true);
                    setError("");
                    setFoundKH(null);
                    setSearchResults([]);
                  }}
                  style={{ ...btn("ghost"), fontSize: 12 }}
                >
                  + Tạo bệnh nhân mới
                </button>
                <button
                  style={{ ...btn(), opacity: foundKH ? 1 : 0.4 }}
                  disabled={!foundKH}
                  onClick={() => setStep(1)}
                >
                  Tiếp theo →
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 14,
                  color: C.text,
                  marginBottom: 14,
                }}
              >
                ➕ Tạo bệnh nhân mới
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                }}
              >
                <div style={{ gridColumn: "1/-1" }}>
                  <FormField
                    label="CCCD / Hộ chiếu"
                    placeholder="012345678901"
                    value={newForm.maDinhDanh}
                    onChange={setField("maDinhDanh")}
                    required
                  />
                  {fieldErr("maDinhDanh")}
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <FormField
                    label="Họ và tên"
                    placeholder="Nguyễn Văn A"
                    value={newForm.ten}
                    onChange={setField("ten")}
                    required
                  />
                </div>
                <div>
                  <FormField
                    label="Số điện thoại"
                    placeholder="0901234567"
                    value={newForm.sdt}
                    onChange={setField("sdt")}
                    required
                  />
                  {fieldErr("sdt")}
                </div>
                <FormField
                  label="Ngày sinh"
                  type="date"
                  value={newForm.ngaySinh}
                  onChange={setField("ngaySinh")}
                  required
                />
                <div>
                  <FormField
                    label="Mật khẩu"
                    type="password"
                    placeholder="8+ ký tự, có chữ và số"
                    value={newForm.matKhau}
                    onChange={setField("matKhau")}
                    required
                  />
                  {fieldErr("matKhau")}
                </div>
                <FormField
                  label="Giới tính"
                  value={newForm.gioiTinh}
                  onChange={setField("gioiTinh")}
                  options={["Nam", "Nữ", "Khác"]}
                />
                <div style={{ gridColumn: "1/-1" }}>
                  <FormField
                    label="Địa chỉ"
                    placeholder="123 Đường ABC"
                    value={newForm.diaChi}
                    onChange={setField("diaChi")}
                  />
                </div>
                <div style={{ gridColumn: "1/-1" }}>
                  <FormField
                    label="Tiền sử bệnh"
                    type="textarea"
                    placeholder="Dị ứng thuốc, bệnh nền..."
                    value={newForm.tienSuBenh}
                    onChange={setField("tienSuBenh")}
                  />
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
                    marginTop: 12,
                  }}
                >
                  ⚠ {error}
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
                <button
                  style={btn("ghost")}
                  onClick={() => {
                    setIsNew(false);
                    setError("");
                  }}
                >
                  ← Quay lại tìm kiếm
                </button>
                <button
                  style={btn()}
                  onClick={handleCreateNew}
                  disabled={loading}
                >
                  {loading ? "Đang tạo..." : "✓ Tạo & tiếp tục"}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Step 1 ── */}
      {step === 1 && (
        <div style={S.card}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: C.text,
              marginBottom: 14,
            }}
          >
            Bệnh nhân: <span style={{ color: C.accent }}>{foundKH?.ten}</span>
            <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 8 }}>
              ({foundKH?.id})
            </span>
          </div>
          <div style={{ marginBottom: 16 }}>
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
              Dịch vụ
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {DV_LIST.map((dv) => (
                <div
                  key={dv}
                  onClick={() =>
                    setSelectedDV((p) =>
                      p.includes(dv) ? p.filter((x) => x !== dv) : [...p, dv],
                    )
                  }
                  style={{
                    padding: "7px 14px",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 13,
                    fontWeight: 500,
                    background: selectedDV.includes(dv) ? C.accent : C.bg,
                    color: selectedDV.includes(dv) ? "#fff" : C.textMuted,
                    border: `1px solid ${selectedDV.includes(dv) ? C.accent : C.border}`,
                  }}
                >
                  {dv}
                </div>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
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
              Bác sĩ
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {BS_LIST.map((bs) => (
                <div
                  key={bs.id}
                  onClick={() => setSelectedBS(bs.id)}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 10,
                    cursor: "pointer",
                    border: `1px solid ${selectedBS === bs.id ? C.accent : C.border}`,
                    background: selectedBS === bs.id ? C.accent + "15" : C.bg,
                  }}
                >
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: C.text,
                      marginBottom: 3,
                    }}
                  >
                    {bs.ten}
                  </div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>
                    {bs.chuyen_khoa}
                  </div>
                  <div style={{ fontSize: 11, color: C.accent, marginTop: 4 }}>
                    {bs.phong}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 16,
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
                Giờ khám
              </div>
              <select
                value={gio}
                onChange={(e) => setGio(e.target.value)}
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
                {[
                  "08:00",
                  "08:30",
                  "09:00",
                  "09:30",
                  "10:00",
                  "10:30",
                  "14:00",
                  "14:30",
                  "15:00",
                  "15:30",
                ].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
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
                Ghi chú
              </div>
              <input
                placeholder="Dị ứng, yêu cầu đặc biệt..."
                value={ghiChu}
                onChange={(e) => setGhiChu(e.target.value)}
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
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button style={btn("ghost")} onClick={() => setStep(0)}>
              ← Quay lại
            </button>
            <button
              style={{
                ...btn(),
                opacity: selectedDV.length && selectedBS ? 1 : 0.4,
              }}
              disabled={!selectedDV.length || !selectedBS}
              onClick={() => setStep(2)}
            >
              Tiếp theo →
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2 ── */}
      {step === 2 && (
        <div style={S.card}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 14,
              color: C.text,
              marginBottom: 16,
            }}
          >
            Xác nhận thông tin đăng ký
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
              ["Bệnh nhân", foundKH?.ten],
              ["Mã KH", foundKH?.id],
              ["Dịch vụ", selectedDV.join(", ")],
              ["Bác sĩ", BS_LIST.find((b) => b.id === selectedBS)?.ten],
              ["Phòng", BS_LIST.find((b) => b.id === selectedBS)?.phong],
              ["Giờ khám", gio],
              ...(ghiChu ? [["Ghi chú", ghiChu]] : []),
            ].map(([k, v]) => (
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
                <span style={{ fontWeight: 600, color: C.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <button style={btn("ghost")} onClick={() => setStep(1)}>
              ← Quay lại
            </button>
            <button style={btn()} onClick={() => setSuccess(true)}>
              ✓ Xác nhận đăng ký
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
