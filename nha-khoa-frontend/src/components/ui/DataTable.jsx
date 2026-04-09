import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function DataTable({
  fetchFn,
  columns,
  title,
  subtitle,
  actions,
  searchKeys,
  searchKey,
  searchPlaceholder = "🔍  Tìm kiếm...",
  onAdd,
  addLabel = "+ Thêm mới",
  refreshKey = 0,
}) {
  const { theme: C } = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const keys = searchKeys || (searchKey ? [searchKey] : []);

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchFn()
      .then((res) => setData(res))
      .catch((err) => setError(err.message || "Không thể tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [fetchFn, refreshKey]);

  const filtered =
    keys.length > 0
      ? data.filter((row) =>
          keys.some((k) =>
            String(row[k] || "")
              .toLowerCase()
              .includes(search.toLowerCase()),
          ),
        )
      : data;

  const S = {
    card: {
      background: C.surface,
      borderRadius: 12,
      border: `1px solid ${C.border}`,
      padding: 18,
    },
    th: {
      padding: "9px 12px",
      textAlign: "left",
      fontSize: 10,
      fontWeight: 700,
      color: C.textMuted,
      letterSpacing: 0.8,
      textTransform: "uppercase",
      borderBottom: `1px solid ${C.border}`,
    },
    td: {
      padding: "10px 12px",
      borderBottom: `1px solid ${C.border}`,
      fontSize: 13,
    },
    input: {
      background: C.bg,
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      padding: "8px 12px",
      color: C.text,
      fontSize: 13,
      outline: "none",
      width: 280,
    },
    btn: (v = "primary") => ({
      padding: "8px 14px",
      borderRadius: 8,
      cursor: "pointer",
      fontSize: 12,
      fontWeight: 600,
      background: v === "primary" ? C.accent : "transparent",
      color: v === "primary" ? "#fff" : C.text,
      border: v === "ghost" ? `1px solid ${C.border}` : "none",
    }),
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 20,
        }}
      >
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, color: C.text }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 3 }}>
              {subtitle}
            </div>
          )}
        </div>
        {onAdd && (
          <button style={S.btn()} onClick={onAdd}>
            {addLabel}
          </button>
        )}
      </div>

      <div style={S.card}>
        {keys.length > 0 && (
          <div
            style={{
              marginBottom: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <input
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={S.input}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  padding: "7px 10px",
                  borderRadius: 8,
                  border: `1px solid ${C.border}`,
                  background: "transparent",
                  color: C.textMuted,
                  cursor: "pointer",
                  fontSize: 12,
                }}
              >
                ✕
              </button>
            )}
            <span style={{ fontSize: 12, color: C.textMuted, marginLeft: 4 }}>
              {filtered.length}/{data.length}
            </span>
          </div>
        )}

        {loading && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: C.textMuted,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>⏳</div>
            <div style={{ fontSize: 13 }}>Đang tải dữ liệu...</div>
          </div>
        )}

        {!loading && error && (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
            <div style={{ fontSize: 13, color: "#ef4444", marginBottom: 12 }}>
              {error}
            </div>
            <button
              style={S.btn()}
              onClick={() => {
                setLoading(true);
                fetchFn()
                  .then(setData)
                  .catch((e) => setError(e.message))
                  .finally(() => setLoading(false));
              }}
            >
              Thử lại
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "40px 0",
              color: C.textMuted,
            }}
          >
            <div style={{ fontSize: 28, marginBottom: 10 }}>📭</div>
            <div style={{ fontSize: 13 }}>
              {search ? "Không tìm thấy kết quả" : "Chưa có dữ liệu"}
            </div>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                <th style={{ ...S.th, width: 40 }}>#</th>
                {columns.map((col) => (
                  <th key={col.key} style={S.th}>
                    {col.label}
                  </th>
                ))}
                {actions && <th style={S.th}>Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filtered.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = C.surfaceHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td style={{ ...S.td, color: C.textMuted, fontSize: 11 }}>
                    {idx + 1}
                  </td>
                  {columns.map((col) => (
                    <td key={col.key} style={S.td}>
                      {col.render ? (
                        col.render(row[col.key], row, C)
                      ) : (
                        <span style={{ color: C.text }}>
                          {row[col.key] ?? "—"}
                        </span>
                      )}
                    </td>
                  ))}
                  {actions && <td style={S.td}>{actions(row, C, S)}</td>}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && data.length > 0 && (
          <div
            style={{
              marginTop: 12,
              fontSize: 11,
              color: C.textMuted,
              textAlign: "right",
            }}
          >
            Hiển thị {filtered.length}/{data.length} bản ghi
          </div>
        )}
      </div>
    </div>
  );
}
