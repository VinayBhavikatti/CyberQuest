import { COLORS } from "../../theme/colors.js";
import { useEffect, useState } from "react";

export default function XPBar({ xp }) {
  const level = Math.floor(xp / 100) + 1;
  const progress = xp % 100;
  const titles = ["Rookie", "Scout", "Analyst", "Engineer", "Hunter", "Elite Defender"];
  const title = titles[Math.min(level - 1, titles.length - 1)];
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    setAnimatedProgress(0);
    const t = setTimeout(() => setAnimatedProgress(progress), 30);
    return () => clearTimeout(t);
  }, [progress, level]);

  return (
    <div
      style={{
        background: COLORS.bgCard,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 12,
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap"
      }}
    >
      <div style={{ fontSize: 13, color: COLORS.accent, fontWeight: 700, minWidth: 80 }}>
        Lv.{level} {title}
      </div>
      <div style={{ flex: 1, minWidth: 120 }}>
        <div style={{ height: 6, background: "#1e2d4d", borderRadius: 3, overflow: "hidden" }}>
          <div
            style={{
              width: `${animatedProgress}%`,
              height: "100%",
              background: `linear-gradient(90deg, ${COLORS.accent2}, ${COLORS.accent})`,
              borderRadius: 3,
              transition: "width 900ms cubic-bezier(0.2, 0.9, 0.2, 1)"
            }}
          />
        </div>
      </div>
      <div style={{ fontSize: 12, color: COLORS.textMuted }}>{xp} XP</div>
    </div>
  );
}

