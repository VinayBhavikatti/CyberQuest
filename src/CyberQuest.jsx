import { useEffect, useState } from "react";
import { COLORS } from "./theme/colors.js";
import { MODULES } from "./data/content.js";
import { loadProgress, saveProgress, loadSession, saveSession } from "./utils/progress.js";

import Badge from "./components/ui/Badge.jsx";
import Confetti from "./components/ui/Confetti.jsx";
import XPBar from "./components/ui/XPBar.jsx";
import Particles from "./components/ui/Particles.jsx";

import Login from "./components/Login.jsx";
import Leaderboard from "./components/Leaderboard.jsx";
import Achievements from "./components/Achievements.jsx";
import DashboardHome, { Footer } from "./components/DashboardHome.jsx";

import QuizGame from "./modules/QuizGame.jsx";
import EscapeRoom from "./modules/EscapeRoom.jsx";
import PasswordGame from "./modules/PasswordGame.jsx";
import AttackSimulator from "./modules/AttackSimulator.jsx";
import HackTheHacker from "./modules/HackTheHacker.jsx";
import Resources from "./modules/Resources.jsx";
import ThreatMap from "./modules/ThreatMap.jsx";
import PhishingEmailCatcher from "./modules/phishingEmailCatcher.jsx";

export default function CyberQuest() {
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("home"); // home | leaderboard | achievements
  const [user, setUser] = useState(() => loadSession());
  const [xp, setXp] = useState(0);
  const [completedModules, setCompleted] = useState([]);
  const [loading, setLoading] = useState(() => {
    try { return !!sessionStorage.getItem("cq_session_user"); } catch { return false; }
  });
  const [confetti, setConfetti] = useState(false);
  const [key, setKey] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("cq_sidebar_collapsed") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cq_sidebar_collapsed", sidebarCollapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [sidebarCollapsed]);

  useEffect(() => {
    let mounted = true;
    if (user && user.name) {
      setLoading(true);
      loadProgress(user.name).then(data => {
        if (!mounted) return;
        setXp(data.xp || 0);
        setCompleted(data.completed || []);
        setTimeout(() => {
          if (mounted) setLoading(false);
        }, 1500);
      });
    } else {
      setXp(0);
      setCompleted([]);
    }
    return () => { mounted = false; };
  }, [user]);

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

  const gameComponents = {
    quiz: <QuizGame key={key} onXP={addXP} />,
    escape: <EscapeRoom key={key} onXP={addXP} />,
    password: <PasswordGame key={key} onXP={addXP} />,
    attack: <AttackSimulator key={key} onXP={addXP} />,
    hack: <HackTheHacker key={key} onXP={addXP} />,
    resources: <Resources key={key} />,
    threatmap: <ThreatMap key={key} />,
    phishing: <PhishingEmailCatcher key={key} onXP={addXP} />
  };

  const mod = MODULES.find((m) => m.id === active);
  const level = Math.floor(xp / 100) + 1;
  const moduleView = gameComponents[active];

  function handleLogin(profile) {
    setLoading(true);
    setUser(profile);
    saveSession(profile);
  }

  function logout() {
    setUser(null);
    setActive(null);
    setTab("home");
    saveSession(null);
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: COLORS.bg, display: "flex", alignItems: "center", justifyContent: "center", color: COLORS.accent, fontFamily: "'Rajdhani', sans-serif" }}>
        <h2 className="cq-glowPulse" style={{ fontSize: 24, letterSpacing: 2 }}>CONNECTING TO SECURE DATABASE...</h2>
      </div>
    );
  }

  return (
    <div className="cq-app" style={{ minHeight: "100vh", background: COLORS.bg, color: COLORS.text, fontFamily: "'Rajdhani', system-ui, -apple-system, Segoe UI, sans-serif", padding: 0 }}>
      <div className="cq-fx" aria-hidden="true">
        <div className="cq-grid" />
        <div className="cq-scanline" />
        <Particles />
      </div>
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
            <span style={{ fontSize: 20 }} className="cq-glowPulse">🛡️</span>
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
          <span className="cq-glowPulse">
            <Badge text={`LVL ${level}`} color={COLORS.accent3} />
          </span>
          <span className="cq-glowPulse">
            <Badge text={`${xp} XP`} color={COLORS.warn} />
          </span>
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
        <>
          <DashboardHome
            user={user}
            xp={xp}
            completedModules={completedModules}
            active={active}
            mod={mod}
            onOpenModule={openModule}
            onBack={() => setActive(null)}
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed((v) => !v)}
            onNavigate={(dest) => {
              setActive(null);
              setTab(dest);
            }}
          />
          {active ? (
            <div style={{ position: "relative", zIndex: 2, maxWidth: 1180, margin: "0 auto", padding: "0 16px 36px" }}>
              <div style={{ marginLeft: sidebarCollapsed ? 96 : 276, transition: "margin-left 220ms ease" }}>
                <div style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24 }}>{moduleView}</div>
                <div style={{ marginTop: 14, textAlign: "center" }}>
                  <button
                    onClick={() => openModule(active)}
                    style={{ background: "none", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "8px 20px", color: COLORS.textMuted, cursor: "pointer", fontSize: 12, fontFamily: "inherit", fontWeight: 900 }}
                  >
                    🔄 Restart
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 16px 24px" }}>
        <Footer />
      </div>
    </div>
  );
}

