import { useState } from "react";
import { COLORS } from "./theme/colors.js";
import { MODULES } from "./data/content.js";
import { loadProgress, saveProgress } from "./utils/progress.js";

import Badge from "./components/ui/Badge.jsx";
import Confetti from "./components/ui/Confetti.jsx";
import XPBar from "./components/ui/XPBar.jsx";

import QuizGame from "./modules/QuizGame.jsx";
import EscapeRoom from "./modules/EscapeRoom.jsx";
import PasswordGame from "./modules/PasswordGame.jsx";
import AttackSimulator from "./modules/AttackSimulator.jsx";
import HackTheHacker from "./modules/HackTheHacker.jsx";
import Resources from "./modules/Resources.jsx";

export default function CyberQuest() {
  const [active, setActive] = useState(null);
  const [xp, setXp] = useState(() => loadProgress().xp || 0);
  const [completedModules, setCompleted] = useState(() => loadProgress().completed || []);
  const [confetti, setConfetti] = useState(false);
  const [key, setKey] = useState(0);

  function addXP(amount) {
    const newXp = xp + amount;
    setXp(newXp);
    const newCompleted = completedModules.includes(active) ? completedModules : [...completedModules, active];
    setCompleted(newCompleted);
    saveProgress({ xp: newXp, completed: newCompleted });
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  }

  function openModule(id) {
    setActive(id);
    setKey((k) => k + 1);
  }

  const mod = MODULES.find((m) => m.id === active);

  const gameComponents = {
    quiz: <QuizGame key={key} onXP={addXP} />,
    escape: <EscapeRoom key={key} onXP={addXP} />,
    password: <PasswordGame key={key} onXP={addXP} />,
    attack: <AttackSimulator key={key} onXP={addXP} />,
    hack: <HackTheHacker key={key} onXP={addXP} />,
    resources: <Resources key={key} />
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Courier New', monospace", padding: 0 }}>
      <Confetti active={confetti} />

      <div
        style={{
          background: "#060c19",
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 10
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {active && (
            <button onClick={() => setActive(null)} style={{ background: "none", border: "none", color: COLORS.textMuted, cursor: "pointer", fontSize: 18, padding: "0 4px" }}>
              ←
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>🛡️</span>
            <span style={{ fontWeight: 700, fontSize: 16, color: COLORS.accent, letterSpacing: 1 }}>CYBERQUEST</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>{completedModules.length}/{MODULES.length} modules</span>
          <Badge text={`${xp} XP`} color={COLORS.accent} />
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
        <XPBar xp={xp} />

        {!active ? (
          <>
            <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
              <div style={{ fontSize: 13, color: COLORS.accent, letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>Gamified Cyber Defence Training</div>
              <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 12 }}>
                <span style={{ color: COLORS.accent }}>Defend.</span> <span style={{ color: COLORS.accent2 }}>Learn.</span> <span style={{ color: COLORS.accent3 }}>Conquer.</span>
              </div>
              <div style={{ color: COLORS.textMuted, fontSize: 14, maxWidth: 400, margin: "0 auto" }}>
                Master cybersecurity through interactive challenges, escape rooms, and real-world simulations.
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
              {[
                { label: "Total XP", value: xp, color: COLORS.accent },
                { label: "Modules Done", value: `${completedModules.length}/${MODULES.length}`, color: COLORS.accent3 },
                { label: "Level", value: Math.floor(xp / 100) + 1, color: COLORS.accent2 }
              ].map((s, i) => (
                <div key={i} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {MODULES.map((m) => {
                const done = completedModules.includes(m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => openModule(m.id)}
                    style={{
                      background: COLORS.bgCard,
                      border: `1px solid ${done ? m.color + "66" : COLORS.border}`,
                      borderRadius: 12,
                      padding: 20,
                      textAlign: "left",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      transition: "all 0.2s",
                      position: "relative"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = m.color;
                      e.currentTarget.style.background = COLORS.bgCardHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = done ? m.color + "66" : COLORS.border;
                      e.currentTarget.style.background = COLORS.bgCard;
                    }}
                  >
                    {done && <div style={{ position: "absolute", top: 10, right: 10, fontSize: 14 }}>✅</div>}
                    <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: m.color, marginBottom: 4 }}>{m.label}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <div style={{ marginTop: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <span style={{ fontSize: 28 }}>{mod?.icon}</span>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: mod?.color }}>{mod?.label}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{mod?.desc}</div>
              </div>
            </div>
            <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24 }}>{gameComponents[active]}</div>
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <button
                onClick={() => openModule(active)}
                style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 20px", color: COLORS.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}
              >
                🔄 Restart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

