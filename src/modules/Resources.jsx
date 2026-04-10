import { COLORS } from "../theme/colors.js";
import { RESOURCES } from "../data/content.js";
import Badge from "../components/ui/Badge.jsx";

export default function Resources() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      {RESOURCES.map((r, i) => (
        <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", display: "block" }}>
          <div
            style={{
              background: "#0d1527",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 10,
              padding: 16,
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
              transition: "border-color 0.2s",
              cursor: "pointer"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = COLORS.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = COLORS.border)}
          >
            <div style={{ fontSize: 24 }}>{r.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text }}>{r.title}</div>
                <Badge text={r.tag} color={COLORS.accent} />
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted }}>{r.desc}</div>
            </div>
            <div style={{ color: COLORS.textMuted, fontSize: 18 }}>↗</div>
          </div>
        </a>
      ))}
    </div>
  );
}

