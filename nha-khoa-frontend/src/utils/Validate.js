// ─── Regex ────────────────────────────────────────────────
export const REGEX = {
  sdt: /^0\d{9}$/, // bắt đầu 0, đúng 10 số
  maDinhDanh: /^\d{12}$/,
  matKhau: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
};

export const MSG = {
  sdt: "SĐT phải bắt đầu bằng 0 và có đúng 10 số",
  maDinhDanh: "CCCD phải đúng 12 số",
  matKhau: "Mật khẩu ít nhất 8 ký tự, gồm chữ và số",
};

// ─── Validate chung cho mọi form ─────────────────────────
export function validateCommon(form) {
  if (!form.maDinhDanh) return "Vui lòng nhập CCCD";
  if (!REGEX.maDinhDanh.test(form.maDinhDanh)) return MSG.maDinhDanh;
  if (!form.ten) return "Vui lòng nhập họ tên";
  if (!form.sdt) return "Vui lòng nhập số điện thoại";
  if (!REGEX.sdt.test(form.sdt)) return MSG.sdt;
  if (!form.matKhau) return "Vui lòng nhập mật khẩu";
  if (!REGEX.matKhau.test(form.matKhau)) return MSG.matKhau;
  if (!form.ngaySinh) return "Vui lòng chọn ngày sinh";
  return null;
}

// ─── Parse mã KH từ response backend ─────────────────────
// "Đăng ký Khách hàng thành công! \nMã Khách Hàng: KH_0001\nUsername: ..."
export function parseMaKH(responseText) {
  const match = responseText.match(/Mã Khách Hàng:\s*(\S+)/);
  return match ? match[1] : null;
}
