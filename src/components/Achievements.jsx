import { useMemo, useState } from "react";
import { COLORS } from "../theme/colors.js";
import { DEFAULT_BADGES } from "../data/social.js";
import { MODULES } from "../data/content.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

export default function Achievements({ xp, completedModules }) {
  const [spinId, setSpinId] = useState(null);

  const level = Math.floor(xp / 100) + 1;
  const doneCount = completedModules.length;

  const earned = useMemo(() => {
    const earnedIds = new Set();
    if (doneCount >= 1) earnedIds.add("first");
    if (completedModules.includes("quiz")) earnedIds.add("quiz");
    if (completedModules.includes("password")) earnedIds.add("keys");
    if (doneCount >= MODULES.length) earnedIds.add("hacker");
    return earnedIds;
  }, [doneCount, completedModules]);

  const achievements = useMemo(() => {
    const pctMods3 = clamp(Math.round((doneCount / 3) * 100), 0, 100);
    const pctAll = clamp(Math.round((doneCount / MODULES.length) * 100), 0, 100);
    const pctXp1000 = clamp(Math.round((xp / 1000) * 100), 0, 100);
    return [
      { id: "first-steps", icon: "🎯", name: "First Steps", desc: "Complete your first module", pct: doneCount >= 1 ? 100 : 0 },
      { id: "knowledge", icon: "📖", name: "Knowledge Seeker", desc: "Complete 3 modules", pct: pctMods3 },
      { id: "ranked", icon: "🏆", name: "Climb the Ranks", desc: "Reach level 5", pct: clamp(Math.round((level / 5) * 100), 0, 100) },
      { id: "grinder", icon: "⚡", name: "XP Grinder", desc: "Earn 1000 XP", pct: pctXp1000 },
      { id: "finisher", icon: "💻", name: "Elite Hacker", desc: "Finish all modules", pct: pctAll }
    ];
  }, [doneCount, xp, level]);

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "24px 16px", fontFamily: "'Rajdhani', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 18 }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, letterSpacing: 3, fontSize: 22, background: `linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.accent})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
          🏅 BADGES & ACHIEVEMENTS
        </div>
        <div style={{ color: COLORS.textMuted, marginTop: 4, letterSpacing: 1 }}>Collect them all, agent</div>
      </div>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center", marginBottom: 18 }}>
        {[
          { label: "LEVEL", value: level, color: COLORS.accent3 },
          { label: "XP", value: xp, color: COLORS.warn },
          { label: "MODULES", value: `${doneCount}/${MODULES.length}`, color: COLORS.accent }
        ].map((s) => (
          <div key={s.label} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 999, padding: "8px 14px", display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, color: s.color }}>{s.value}</span>
            <span style={{ color: COLORS.textMuted, letterSpacing: 2, fontSize: 11 }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 800, letterSpacing: 2, fontSize: 12, margin: "18px 0 10px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: COLORS.text }}>YOUR BADGE COLLECTION</span>
        <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${COLORS.border}, transparent)` }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 18 }}>
        {DEFAULT_BADGES.map((b) => {
          const isEarned = earned.has(b.id);
          const spinning = spinId === b.id;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => {
                if (!isEarned) return;
                setSpinId(b.id);
                setTimeout(() => setSpinId(null), 900);
              }}
              style={{
                textAlign: "center",
                cursor: isEarned ? "pointer" : "default",
                background: COLORS.bgCard,
                border: `1px solid ${isEarned ? `${COLORS.accent}55` : COLORS.border}`,
                borderRadius: 14,
                padding: 14,
                opacity: isEarned ? 1 : 0.55,
                filter: isEarned ? "none" : "grayscale(0.7)",
                transition: "transform 160ms ease, box-shadow 160ms ease",
                transform: spinning ? "scale(1.02)" : "none",
                boxShadow: isEarned ? `0 10px 30px ${COLORS.accent}14` : "none",
                color: COLORS.text,
                fontFamily: "inherit"
              }}
            >
              <div style={{ fontSize: 34, transform: spinning ? "rotate(8deg) scale(1.08)" : "none", transition: "transform 220ms ease" }}>{b.icon}</div>
              <div style={{ marginTop: 8, fontFamily: "'Orbitron', monospace", fontWeight: 800, fontSize: 11, letterSpacing: 1, color: COLORS.accent }}>{b.name}</div>
              <div style={{ marginTop: 6, color: COLORS.textMuted, fontSize: 12, lineHeight: 1.3 }}>{b.desc}</div>
              <div style={{ marginTop: 10, fontSize: 11, fontWeight: 800, letterSpacing: 1, color: isEarned ? COLORS.accent3 : COLORS.textMuted }}>
                {isEarned ? "✓ EARNED" : "🔒 LOCKED"}
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 800, letterSpacing: 2, fontSize: 12, margin: "18px 0 10px", display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ color: COLORS.text }}>ACHIEVEMENTS</span>
        <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${COLORS.border}, transparent)` }} />
      </div>

      <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: "hidden" }}>
        {achievements.map((a, i) => (
          <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderTop: i === 0 ? "none" : `1px solid ${COLORS.border}` }}>
            <div style={{ width: 44, textAlign: "center", fontSize: 22, opacity: a.pct >= 100 ? 1 : 0.45, filter: a.pct >= 100 ? "none" : "grayscale(1)" }}>{a.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 800 }}>{a.name}</div>
              <div style={{ color: COLORS.textMuted, fontSize: 12 }}>{a.desc}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, color: COLORS.warn, fontSize: 12 }}>{a.pct}%</div>
              <div style={{ height: 4, width: 90, background: "#0b1224", borderRadius: 999, overflow: "hidden", marginTop: 6 }}>
                <div style={{ height: "100%", width: `${a.pct}%`, background: `linear-gradient(90deg, ${COLORS.warn}, ${COLORS.accent})` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

