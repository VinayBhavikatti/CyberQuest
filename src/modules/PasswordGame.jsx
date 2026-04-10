import { useEffect, useState } from "react";
import { COLORS } from "../theme/colors.js";
import { PASSWORD_CHECKS } from "../data/content.js";
import Badge from "../components/ui/Badge.jsx";

export default function PasswordGame({ onXP }) {
  const [pw, setPw] = useState("");
  const [xpGiven, setXpGiven] = useState(false);
  const checks = PASSWORD_CHECKS.map((c) => ({ ...c, pass: pw.length > 0 && c.test(pw) }));
  const score = checks.filter((c) => c.pass).length;
  const strength =
    score <= 1
      ? { label: "Very Weak", color: COLORS.danger }
      : score <= 3
        ? { label: "Weak", color: "#f59e0b" }
        : score <= 4
          ? { label: "Moderate", color: "#eab308" }
          : score <= 5
            ? { label: "Strong", color: COLORS.accent3 }
            : { label: "Very Strong", color: COLORS.accent };

  useEffect(() => {
    if (score === 6 && !xpGiven) {
      onXP(50);
      setXpGiven(true);
    }
  }, [score, xpGiven, onXP]);

  const crackTime =
    score <= 2 ? "< 1 second" : score === 3 ? "~1 hour" : score === 4 ? "~1 month" : score === 5 ? "~10 years" : "~centuries";

  return (
    <div>
      <div style={{ background: "#0d1527", borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 8 }}>Enter a password to analyze:</div>
        <input
          type="text"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Try creating a strong password..."
          style={{
            width: "100%",
            background: "#060c19",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: "12px 14px",
            color: COLORS.text,
            fontSize: 15,
            fontFamily: "monospace",
            outline: "none",
            boxSizing: "border-box"
          }}
        />
        {pw.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ color: strength.color, fontWeight: 700, fontSize: 14 }}>{strength.label}</span>
              <span style={{ color: COLORS.textMuted, fontSize: 13 }}>
                Crack time: <span style={{ color: strength.color }}>{crackTime}</span>
              </span>
            </div>
            <div style={{ height: 8, background: "#1e2d4d", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${(score / 6) * 100}%`, height: "100%", background: strength.color, borderRadius: 4, transition: "width 0.4s" }} />
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {checks.map((c, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              background: c.pass ? "#10b98110" : "#0d1527",
              borderRadius: 8,
              border: `1px solid ${c.pass ? COLORS.accent3 + "44" : COLORS.border}`,
              transition: "all 0.3s"
            }}
          >
            <span style={{ fontSize: 16 }}>{c.pass ? "✅" : "⭕"}</span>
            <span style={{ fontSize: 13, color: c.pass ? COLORS.accent3 : COLORS.textDim }}>{c.label}</span>
          </div>
        ))}
      </div>
      {score === 6 && (
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Badge text="🏆 Perfect Password! +50 XP" color={COLORS.accent3} />
        </div>
      )}
    </div>
  );
}

