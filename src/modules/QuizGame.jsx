import { useState } from "react";
import { COLORS } from "../theme/colors.js";
import { QUIZ_QUESTIONS } from "../data/content.js";
import Badge from "../components/ui/Badge.jsx";

export default function QuizGame({ onXP }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showExp, setShowExp] = useState(false);

  const q = QUIZ_QUESTIONS[idx];

  function pick(i) {
    if (selected !== null) return;
    setSelected(i);
    setShowExp(true);
    if (i === q.answer) setScore((s) => s + 1);
  }

  function next() {
    if (idx + 1 >= QUIZ_QUESTIONS.length) {
      setDone(true);
      onXP(score * 15 + 10);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setShowExp(false);
    }
  }

  if (done)
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div style={{ fontSize: 48 }}>🏆</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: COLORS.accent, margin: "12px 0" }}>
          {score}/{QUIZ_QUESTIONS.length}
        </div>
        <div style={{ color: COLORS.textDim, marginBottom: 24 }}>
          {score >= 6
            ? "Excellent! You're a social engineering expert."
            : score >= 4
              ? "Good effort! Keep learning."
              : "Keep practicing to improve your skills."}
        </div>
        <Badge text={`+${score * 15 + 10} XP earned`} color={COLORS.accent3} />
      </div>
    );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, alignItems: "center" }}>
        <span style={{ color: COLORS.textMuted, fontSize: 13 }}>
          Question {idx + 1} of {QUIZ_QUESTIONS.length}
        </span>
        <span style={{ color: COLORS.accent, fontWeight: 700 }}>{score} correct</span>
      </div>
      <div style={{ background: "#0d1527", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 20, marginBottom: 20 }}>
        <div style={{ fontSize: 17, fontWeight: 600, color: COLORS.text, lineHeight: 1.5 }}>{q.q}</div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {q.options.map((opt, i) => {
          let bg = "#0d1527",
            border = COLORS.border,
            color = COLORS.text;
          if (selected !== null) {
            if (i === q.answer) {
              bg = "#10b98122";
              border = COLORS.accent3;
              color = COLORS.accent3;
            } else if (i === selected) {
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
                cursor: selected === null ? "pointer" : "default",
                fontSize: 14,
                transition: "all 0.2s",
                fontFamily: "inherit"
              }}
            >
              <span style={{ color: COLORS.textMuted, marginRight: 10 }}>{["A", "B", "C", "D"][i]}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {showExp && (
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
          💡 {q.explanation}
        </div>
      )}
      {selected !== null && (
        <button
          onClick={next}
          style={{
            marginTop: 20,
            background: COLORS.accent,
            color: "#000",
            border: "none",
            borderRadius: 8,
            padding: "12px 28px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
            fontFamily: "inherit"
          }}
        >
          {idx + 1 >= QUIZ_QUESTIONS.length ? "See Results" : "Next Question →"}
        </button>
      )}
    </div>
  );
}

