import { useState } from "react";
import { COLORS } from "./theme/colors.js";
import { MODULES } from "./data/content.js";
import { loadProgress, saveProgress } from "./utils/progress.js";

import Badge from "./components/ui/Badge.jsx";
import Confetti from "./components/ui/Confetti.jsx";
import XPBar from "./components/ui/XPBar.jsx";

import Login from "./components/Login.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Achievements from "./components/Achievements.jsx";

import QuizGame from "./modules/QuizGame.jsx";
import EscapeRoom from "./modules/EscapeRoom.jsx";
import PasswordGame from "./modules/PasswordGame.jsx";
import AttackSimulator from "./modules/AttackSimulator.jsx";
import HackTheHacker from "./modules/HackTheHacker.jsx";
import Resources from "./modules/Resources.jsx";

export default function CyberQuest() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("home"); // home | leaderboard | achievements
  const [user, setUser] = useState(() => loadProgress().user || null);
  const [xp, setXp] = useState(() => loadProgress().xp || 0);
  const [completedModules, setCompleted] = useState(() => loadProgress().completed || []);
  const [confetti, setConfetti] = useState(false);
  const [key, setKey] = useState(0);

  function addXP(amount) {
    const newXp = xp + amount;
    setXp(newXp);
    const newCompleted = completedModules.includes(active) ? completedModules : [...completedModules, active];
    setCompleted(newCompleted);
    saveProgress({ user, xp: newXp, completed: newCompleted });
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  }

  function openModule(id) {
    setActive(id);
    setTab("home");
    setKey((k) => k + 1);
  }

  const mod = MODULES.find((m) => m.id === active);
  const level = Math.floor(xp / 100) + 1;

  const gameComponents = {
    quiz: <QuizGame key={key} onXP={addXP} />,
    escape: <EscapeRoom key={key} onXP={addXP} />,
    password: <PasswordGame key={key} onXP={addXP} />,
    attack: <AttackSimulator key={key} onXP={addXP} />,
    hack: <HackTheHacker key={key} onXP={addXP} />,
    resources: <Resources key={key} />
  };

  function handleLogin(profile) {
    setUser(profile);
    saveProgress({ ...loadProgress(), user: profile });
  }

  function logout() {
    setUser(null);
    setActive(null);
    setTab("home");
    saveProgress({ ...loadProgress(), user: null });
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Rajdhani', system-ui, -apple-system, Segoe UI, sans-serif", padding: 0 }}>
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
            <span style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, fontSize: 15, color: COLORS.accent, letterSpacing: 2 }}>CYBERQUEST</span>
          </div>
          <div style={{ display: "flex", gap: 8, marginLeft: 10 }}>
            {[
              { id: "home", label: "HOME" },
              { id: "leaderboard", label: "RANKS" },
              { id: "achievements", label: "BADGES" }
            ].map((t) => {
              const activeTab = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setActive(null);
                  }}
                  style={{
                    border: `1px solid ${COLORS.border}`,
                    background: activeTab ? `${COLORS.accent}14` : "transparent",
                    color: activeTab ? COLORS.accent : COLORS.textMuted,
                    padding: "6px 10px",
                    borderRadius: 10,
                    cursor: "pointer",
                    fontWeight: 800,
                    letterSpacing: 1,
                    fontSize: 12
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: COLORS.textMuted }}>{completedModules.length}/{MODULES.length} modules</span>
          <Badge text={`LVL ${level}`} color={COLORS.accent3} />
          <Badge text={`${xp} XP`} color={COLORS.warn} />
          <button
            onClick={logout}
            style={{ background: "transparent", border: `1px solid ${COLORS.border}`, color: COLORS.textMuted, cursor: "pointer", borderRadius: 10, padding: "6px 10px", fontSize: 12, fontWeight: 800 }}
            title="Sign out"
          >
            ⏻
          </button>
        </div>
      </div>

      {tab === "leaderboard" ? (
        <Leaderboard user={user} xp={xp} level={level} />
      ) : tab === "achievements" ? (
        <Achievements xp={xp} completedModules={completedModules} />
      ) : (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px 16px" }}>
          <XPBar xp={xp} />

          {!active ? (
            <>
              <div style={{ textAlign: "center", padding: "40px 0 32px" }}>
                <div style={{ fontSize: 13, color: COLORS.accent, letterSpacing: 3, marginBottom: 12, textTransform: "uppercase" }}>
                  Welcome back, <span style={{ color: COLORS.text, fontWeight: 800 }}>{user?.name}</span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.2, marginBottom: 12, fontFamily: "'Orbitron', monospace" }}>
                  <span style={{ color: COLORS.accent }}>Defend.</span> <span style={{ color: COLORS.accent2 }}>Learn.</span> <span style={{ color: COLORS.accent3 }}>Conquer.</span>
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 14, maxWidth: 460, margin: "0 auto" }}>
                  Master cybersecurity through interactive challenges, escape rooms, and real-world simulations.
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
                {[
                  { label: "Total XP", value: xp, color: COLORS.warn },
                  { label: "Modules Done", value: `${completedModules.length}/${MODULES.length}`, color: COLORS.accent },
                  { label: "Level", value: level, color: COLORS.accent3 }
                ].map((s, i) => (
                  <div key={i} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "14px 16px", textAlign: "center" }}>
                    <div style={{ fontSize: 22, fontWeight: 800, color: s.color, fontFamily: "'Orbitron', monospace" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2, letterSpacing: 2 }}>{s.label}</div>
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
                      <div style={{ fontSize: 13, fontWeight: 800, color: m.color, marginBottom: 4, letterSpacing: 1, fontFamily: "'Orbitron', monospace" }}>{m.label}</div>
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
                  <div style={{ fontSize: 18, fontWeight: 800, color: mod?.color, fontFamily: "'Orbitron', monospace" }}>{mod?.label}</div>
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
      )}
    </div>
  );
}

