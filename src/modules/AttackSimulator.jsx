import { useState } from "react";
import { COLORS } from "../theme/colors.js";
import { ATTACK_SCENARIOS } from "../data/content.js";
import Badge from "../components/ui/Badge.jsx";

export default function AttackSimulator({ onXP }) {
  const [idx, setIdx] = useState(0);
  const [chosen, setChosen] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const s = ATTACK_SCENARIOS[idx];

  function pick(i) {
    if (chosen !== null) return;
    setChosen(i);
    if (i === s.correct) setScore((sc) => sc + 1);
  }

  function next() {
    if (idx + 1 >= ATTACK_SCENARIOS.length) {
      setDone(true);
      onXP(score * 20 + 10);
    } else {
      setIdx((i) => i + 1);
      setChosen(null);
    }
  }

  if (done)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48 }}>⚡</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.warn, margin: "12px 0" }}>
          {score}/{ATTACK_SCENARIOS.length} Threats Handled
        </div>
        <div style={{ color: COLORS.textDim, marginBottom: 24 }}>{score >= 3 ? "Outstanding threat response!" : "Good effort. Review the scenarios to improve."}</div>
        <Badge text={`+${score * 20 + 10} XP earned`} color={COLORS.warn} />
      </div>
    );

  return (
    <div>
      <div style={{ background: "#1a0a00", border: `1px solid ${COLORS.warn}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.warn, marginBottom: 10 }}>⚠️ THREAT ALERT: {s.title}</div>
        <div style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.7 }}>{s.desc}</div>
      </div>
      <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 12 }}>How do you respond?</div>
      <div style={{ display: "grid", gap: 10 }}>
        {s.options.map((opt, i) => {
          let bg = "#0d1527",
            border = COLORS.border,
            color = COLORS.text;
          if (chosen !== null) {
            if (i === s.correct) {
              bg = "#10b98122";
              border = COLORS.accent3;
              color = COLORS.accent3;
            } else if (i === chosen) {
              bg = "#ef444422";
              border = COLORS.danger;
              color = COLORS.danger;
            }
          }
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              style={{
                background: bg,
                border: `1px solid ${border}`,
                borderRadius: 8,
                padding: "12px 16px",
                color,
                textAlign: "left",
                cursor: chosen === null ? "pointer" : "default",
                fontSize: 14,
                fontFamily: "inherit",
                transition: "all 0.2s"
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {chosen !== null && (
        <>
          <div
            style={{
              background: "#10b98115",
              border: `1px solid ${COLORS.accent3}44`,
              borderRadius: 8,
              padding: 14,
              marginTop: 16,
              color: COLORS.accent3,
              fontSize: 13
            }}
          >
            💡 {s.explanation}
          </div>
          <button
            onClick={next}
            style={{
              marginTop: 16,
              background: COLORS.warn,
              color: "#000",
              border: "none",
              borderRadius: 8,
              padding: "12px 28px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "inherit"
            }}
          >
            {idx + 1 >= ATTACK_SCENARIOS.length ? "See Results" : "Next Scenario →"}
          </button>
        </>
      )}
    </div>
  );
}

