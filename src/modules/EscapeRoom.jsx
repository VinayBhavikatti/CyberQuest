import { useState } from "react";
import { COLORS } from "../theme/colors.js";
import { ESCAPE_ROOM_PUZZLES } from "../data/content.js";
import Badge from "../components/ui/Badge.jsx";

export default function EscapeRoom({ onXP }) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [solved, setSolved] = useState([]);
  const [done, setDone] = useState(false);

  const puzzle = ESCAPE_ROOM_PUZZLES[step];

  function check() {
    const norm = input.trim().toUpperCase();
    if (norm === puzzle.answer) {
      setFeedback({ ok: true, msg: "✅ Correct! You've unlocked the next clue." });
      setSolved((s) => [...s, step]);
      if (step + 1 >= ESCAPE_ROOM_PUZZLES.length) {
        setTimeout(() => {
          setDone(true);
          onXP(80);
        }, 1200);
      } else {
        setTimeout(() => {
          setStep((s) => s + 1);
          setInput("");
          setFeedback(null);
        }, 1200);
      }
    } else {
      setFeedback({ ok: false, msg: "❌ Not quite. Try again or use a hint." });
    }
  }

  if (done)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48 }}>🎉</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.accent, margin: "12px 0" }}>You Escaped!</div>
        <div style={{ color: COLORS.textDim, marginBottom: 24 }}>
          You solved all {ESCAPE_ROOM_PUZZLES.length} puzzles and defeated the hacker.
        </div>
        <Badge text="+80 XP earned" color={COLORS.accent3} />
      </div>
    );

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {ESCAPE_ROOM_PUZZLES.map((p, i) => (
          <div
            key={i}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              background: solved.includes(i) ? COLORS.accent3 : i === step ? COLORS.accent : "#1e2d4d",
              color: solved.includes(i) || i === step ? "#000" : COLORS.textMuted,
              fontWeight: 700,
              transition: "all 0.3s"
            }}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div style={{ background: "#0d1527", border: `1px solid ${COLORS.borderGlow}33`, borderRadius: 12, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 24, marginBottom: 8 }}>{puzzle.icon}</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.accent, marginBottom: 12 }}>{puzzle.title}</div>
        <div style={{ color: COLORS.textDim, fontSize: 14, whiteSpace: "pre-line", lineHeight: 1.8 }}>{puzzle.desc}</div>
      </div>
      <details style={{ color: COLORS.textMuted, fontSize: 13, marginBottom: 16, cursor: "pointer" }}>
        <summary style={{ color: COLORS.warn }}>💡 Need a hint?</summary>
        <div style={{ marginTop: 8, color: COLORS.textDim }}>{puzzle.hint}</div>
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
            fontFamily: "inherit",
            outline: "none"
          }}
        />
        <button
          onClick={check}
          style={{
            background: COLORS.accent,
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "10px 20px",
            fontWeight: 700,
            cursor: "pointer",
            fontFamily: "inherit"
          }}
        >
          Check
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
          {feedback.msg}
        </div>
      )}
    </div>
  );
}

