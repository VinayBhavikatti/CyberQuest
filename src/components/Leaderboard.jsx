import { useMemo } from "react";
import { COLORS } from "../theme/colors.js";
import { DEFAULT_LEADERBOARD } from "../data/social.js";

export default function Leaderboard({ user, xp, level }) {
  const list = useMemo(() => {
    const me = user
      ? { name: user.name, avatar: user.avatar ?? "🦊", xp, level, isYou: true }
      : { name: "You", avatar: "🦊", xp, level, isYou: true };

    return [...DEFAULT_LEADERBOARD, me].sort((a, b) => b.xp - a.xp);
  }, [user, xp, level]);

  const top = list.slice(0, 3);
  const order = [1, 0, 2];
  const medals = ["🥇", "🥈", "🥉"];
  const medalColors = [COLORS.warn, "#cbd5e1", "#cd7f32"];
  const columnHeights = [84, 112, 68];

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "24px 16px", fontFamily: "'Rajdhani', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, letterSpacing: 3, fontSize: 22, color: COLORS.warn }}>🏆 CYBER RANKINGS</div>
        <div style={{ color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 }}>Top agents across the globe</div>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 14, alignItems: "flex-end", height: 190, marginBottom: 18 }}>
        {order.map((idx) => {
          const p = top[idx];
          if (!p) return null;
          const color = medalColors[idx];
          const h = columnHeights[idx];
          return (
            <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 120 }}>
              <div
                style={{
                  width: 58,
                  height: 58,
                  borderRadius: 999,
                  border: `3px solid ${color}`,
                  background: COLORS.bgCard,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  boxShadow: `0 0 18px ${color}66`
                }}
                title={p.name}
              >
                {p.avatar}
              </div>
              <div style={{ fontWeight: 800, letterSpacing: 0.3 }}>{p.name}</div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 12, color: COLORS.warn }}>⚡ {p.xp} XP</div>
              <div
                style={{
                  height: h,
                  width: 84,
                  borderRadius: "14px 14px 0 0",
                  border: `1px solid ${color}`,
                  background: `${color}18`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'Orbitron', monospace",
                  fontWeight: 900,
                  fontSize: 22,
                  color
                }}
              >
                {medals[idx]}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
        {list.map((p, i) => {
          const isTop = i < 3;
          const maxXp = list[0]?.xp || 1;
          const pct = Math.max(0, Math.min(100, Math.round((p.xp / maxXp) * 100)));
          return (
            <div
              key={`${p.name}-${i}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 14px",
                borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}`,
                background: p.isYou ? `${COLORS.accent}12` : "transparent",
                borderLeft: p.isYou ? `3px solid ${COLORS.accent}` : "3px solid transparent"
              }}
            >
              <div style={{ width: 40, textAlign: "center", fontFamily: "'Orbitron', monospace", fontWeight: 900, color: isTop ? COLORS.warn : COLORS.textMuted }}>
                {i + 1}
              </div>
              <div style={{ width: 40, height: 40, borderRadius: 999, background: "#0b1224", border: `2px solid ${COLORS.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
                {p.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 800, display: "flex", gap: 8, alignItems: "baseline" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</span>
                  {p.isYou && <span style={{ color: COLORS.accent, fontSize: 12, fontWeight: 700 }}>(YOU)</span>}
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 12, letterSpacing: 1 }}>LEVEL {p.level}</div>
                <div style={{ height: 4, background: "#0b1224", borderRadius: 999, overflow: "hidden", marginTop: 6, width: 140 }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent2})` }} />
                </div>
              </div>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 800, color: COLORS.warn }}>⚡ {p.xp}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

