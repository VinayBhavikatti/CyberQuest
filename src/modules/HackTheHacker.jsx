import { useState } from "react";
import { COLORS } from "../theme/colors.js";
import { HACK_CHALLENGES } from "../data/content.js";
import Badge from "../components/ui/Badge.jsx";

export default function HackTheHacker({ onXP }) {
  const [idx, setIdx] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [solved, setSolved] = useState([]);
  const [done, setDone] = useState(false);

  const ch = HACK_CHALLENGES[idx];

  function check() {
    if (input.trim().toUpperCase() === ch.answer) {
      setFeedback({ ok: true });
      setSolved((s) => [...s, idx]);
      if (idx + 1 >= HACK_CHALLENGES.length) {
        setTimeout(() => {
          setDone(true);
          onXP(90);
        }, 1200);
      } else {
        setTimeout(() => {
          setIdx((i) => i + 1);
          setInput("");
          setFeedback(null);
        }, 1200);
      }
    } else {
      setFeedback({ ok: false });
    }
  }

  if (done)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48 }}>🕵️</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.danger, margin: "12px 0" }}>Hacker Defeated!</div>
        <div style={{ color: COLORS.textDim, marginBottom: 24 }}>You cracked all {HACK_CHALLENGES.length} challenges.</div>
        <Badge text="+90 XP earned" color={COLORS.danger} />
      </div>
    );

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {HACK_CHALLENGES.map((c, i) => (
          <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: solved.includes(i) ? COLORS.danger : i === idx ? COLORS.accent : "#1e2d4d", transition: "all 0.3s" }} />
        ))}
      </div>
      <div style={{ background: "#1a0000", border: `1px solid ${COLORS.danger}44`, borderRadius: 12, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>{ch.icon}</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.danger, marginBottom: 10 }}>
          Challenge {idx + 1}: {ch.title}
        </div>
        <div style={{ color: COLORS.textDim, fontSize: 13, lineHeight: 1.8, fontFamily: "monospace", whiteSpace: "pre-line" }}>{ch.desc}</div>
      </div>
      <details style={{ marginBottom: 16, cursor: "pointer" }}>
        <summary style={{ color: COLORS.warn, fontSize: 13 }}>💡 Hint</summary>
        <div style={{ marginTop: 8, color: COLORS.textMuted, fontSize: 13 }}>{ch.hint}</div>
      </details>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder="Your answer..."
          style={{
            flex: 1,
            background: "#0d1527",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 8,
            padding: "10px 14px",
            color: COLORS.text,
            fontSize: 14,
            fontFamily: "monospace",
            outline: "none"
          }}
        />
        <button
          onClick={check}
          style={{
            background: COLORS.danger,
            color: "#fff",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          Crack
        </button>
      </div>
      {feedback && (
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 8,
            background: feedback.ok ? "#10b98115" : "#ef444415",
            color: feedback.ok ? COLORS.accent3 : COLORS.danger,
            fontSize: 13
          }}
        >
          {feedback.ok ? "✅ Correct! Moving to next challenge..." : "❌ Incorrect. Try again."}
        </div>
      )}
    </div>
  );
}

