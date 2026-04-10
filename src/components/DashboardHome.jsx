import { useEffect, useMemo, useState } from "react";
import { COLORS } from "../theme/colors.js";
import { MODULES } from "../data/content.js";
import XPBar from "./ui/XPBar.jsx";
import { useCountUp } from "../utils/useCountUp.js";

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function Footer() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${COLORS.border}`,
        marginTop: 32,
        padding: "18px 8px 10px",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      {/* Left — branding */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 18 }}>🛡️</span>
        <div>
          <div
            style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              fontSize: 11,
              letterSpacing: 3,
              color: COLORS.accent,
            }}
          >
            CYBERQUEST
          </div>
          <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, marginTop: 1 }}>
            Gamified Cybersecurity Learning Platform
          </div>
        </div>
      </div>

      {/* Center — links */}
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        {["About", "Privacy Policy", "Terms of Use", "Support"].map((link) => (
          <span
            key={link}
            style={{
              fontSize: 11,
              color: COLORS.textMuted,
              cursor: "pointer",
              letterSpacing: 0.5,
              transition: "color 150ms ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.accent)}
            onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
          >
            {link}
          </span>
        ))}
      </div>

      {/* Right — copyright */}
      <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.5 }}>
        © {new Date().getFullYear()} CyberQuest. All rights reserved.
      </div>
    </footer>
  );
}

export default function DashboardHome({
  user,
  xp,
  completedModules,
  active,
  mod,
  onOpenModule,
  onBack,
  sidebarCollapsed = false,
  onToggleSidebar,
  onNavigate
}) {
  const collapsed = sidebarCollapsed;
  const level = Math.floor(xp / 100) + 1;
  const xpProgress = xp % 100;
  const totalXp = useCountUp(xp);
  const levelCount = useCountUp(level);
  const modulesDoneCount = useCountUp(completedModules.length);

  const [glitching, setGlitching] = useState(false);
  const [activeNav, setActiveNav] = useState("modules");
  const [hoveredModule, setHoveredModule] = useState(null);

  useEffect(() => {
    let timer = null;
    let off = null;
    function schedule() {
      const next = 2200 + Math.random() * 2600;
      timer = setTimeout(() => {
        setGlitching(true);
        off = setTimeout(() => setGlitching(false), 260);
        schedule();
      }, next);
    }
    schedule();
    return () => {
      if (timer) clearTimeout(timer);
      if (off) clearTimeout(off);
    };
  }, []);

  useEffect(() => {
    if (active) setActiveNav("modules");
  }, [active]);

  const stats = useMemo(
    () => [
      {
        label: "TOTAL XP",
        value: totalXp,
        color: COLORS.warn,
        icon: "⚡",
        sub: `+${xp > 0 ? Math.min(xp, 50) : 0} this week`
      },
      {
        label: "MODULES",
        value: `${modulesDoneCount}/${MODULES.length}`,
        color: COLORS.accent,
        icon: "🧩",
        sub: `${Math.round((completedModules.length / MODULES.length) * 100)}% complete`,
        progress: completedModules.length / MODULES.length
      },
      {
        label: "LEVEL",
        value: levelCount,
        color: COLORS.accent3,
        icon: "🏆",
        sub: `${xpProgress}/100 XP to next`,
        progress: xpProgress / 100
      }
    ],
    [totalXp, modulesDoneCount, levelCount, xp, xpProgress, completedModules.length]
  );

  const sidebarItems = [
    { id: "modules", label: "Training Modules", icon: "🧩", count: MODULES.length },
    { id: "quick", label: "Quick Access", icon: "⚡", count: null }
  ];

  const quickAccessItems = [
    { id: "progress", icon: "📊", label: "My Progress", desc: "View your learning stats" },
    { id: "daily", icon: "🎯", label: "Daily Challenge", desc: "Complete today's mission" },
    { id: "achievements", icon: "🏅", label: "Achievements", desc: "View earned badges" }
  ];

  const handleNavClick = (id) => {
    setActiveNav(id);
    if (active && id === "modules") onBack();
  };

  const renderModuleGrid = () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
        gap: 14
      }}
    >
      {MODULES.map((m, idx) => {
        const done = completedModules.includes(m.id);
        const isHovered = hoveredModule === m.id;
        const delay = 360 + idx * 70;
        return (
          <button
            key={m.id}
            onClick={() => onOpenModule(m.id)}
            onMouseEnter={() => setHoveredModule(m.id)}
            onMouseLeave={() => setHoveredModule(null)}
            className="cq-revealUp cq-hoverLift"
            style={{
              animationDelay: `${delay}ms`,
              background: done
                ? `linear-gradient(160deg, ${m.color}18, rgba(15,22,41,0.88))`
                : "rgba(15,22,41,0.82)",
              border: `1px solid ${isHovered ? m.color : done ? m.color + "55" : COLORS.border}`,
              borderRadius: 14,
              padding: "18px 18px 16px",
              textAlign: "left",
              cursor: "pointer",
              fontFamily: "inherit",
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(14px)",
              transition: "border-color 160ms ease, box-shadow 160ms ease",
              boxShadow: isHovered ? `0 14px 40px ${m.color}22` : "none"
            }}
          >
            {isHovered && (
              <div
                style={{
                  position: "absolute",
                  top: -20,
                  right: -20,
                  width: 80,
                  height: 80,
                  borderRadius: 999,
                  background: `radial-gradient(circle, ${m.color}22, transparent 70%)`,
                  pointerEvents: "none"
                }}
              />
            )}
            <div style={{ fontSize: 28, marginBottom: 10 }}>{m.icon}</div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 900,
                color: m.color,
                marginBottom: 5,
                letterSpacing: 1,
                fontFamily: "'Orbitron', monospace"
              }}
            >
              {m.label}
            </div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, lineHeight: 1.4, marginBottom: 12 }}>
              {m.desc}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: 11,
                  color: done ? COLORS.accent3 : COLORS.textMuted,
                  letterSpacing: 0.5,
                  fontWeight: done ? 700 : 400
                }}
              >
                {done ? "COMPLETED" : "NOT STARTED"}
              </span>
              <span
                style={{
                  fontSize: 12,
                  color: isHovered ? m.color : COLORS.textMuted,
                  fontWeight: 900,
                  transition: "color 160ms ease, transform 160ms ease",
                  transform: isHovered ? "translateX(3px)" : "none",
                  display: "inline-block"
                }}
              >
                OPEN →
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  const renderQuickAccess = () => (
    <div className="cq-revealUp" style={{ animationDelay: "160ms" }}>
      <div style={{ marginBottom: 18 }}>
        <div
          style={{
            fontSize: 11,
            color: COLORS.accent,
            letterSpacing: 3,
            textTransform: "uppercase",
            marginBottom: 6
          }}
        >
          Quick Access
        </div>
        <div style={{ fontSize: 20, fontWeight: 900, fontFamily: "'Orbitron', monospace", color: COLORS.text }}>
          SHORTCUTS
        </div>
      </div>
      <div style={{ display: "grid", gap: 10 }}>
        {quickAccessItems.map((item, idx) => (
          <button
            key={idx}
            className="cq-hoverLift"
            style={{
              background: "rgba(15,22,41,0.82)",
              border: `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 14,
              cursor: "pointer",
              fontFamily: "inherit",
              textAlign: "left",
              transition: "border-color 160ms ease"
            }}
            onClick={() => {
              if (item.id === "progress") {
                window.scrollTo({ top: 0, behavior: "smooth" });
                setActiveNav("modules");
                return;
              }
              if (item.id === "achievements") {
                onNavigate?.("achievements");
                return;
              }
              if (item.id === "daily") {
                const next = MODULES.find((m) => !completedModules.includes(m.id)) ?? MODULES[0];
                if (next) onOpenModule(next.id);
              }
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = COLORS.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = COLORS.border; }}
          >
            <span style={{ fontSize: 22 }}>{item.icon}</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: COLORS.text, letterSpacing: 0.3 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{item.desc}</div>
            </div>
            <span style={{ marginLeft: "auto", color: COLORS.accent, fontWeight: 900, fontSize: 14 }}>→</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ position: "relative", zIndex: 1 }}>
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto",
          padding: "18px 16px 0",
          display: "grid",
          gridTemplateColumns: collapsed ? "84px 1fr" : "240px 1fr",
          gap: 16,
          alignItems: "start",
          transition: "grid-template-columns 220ms ease"
        }}
      >
        {/* ── SIDEBAR ── */}
        <aside
          className="cq-slideInLeft"
          style={{
            position: "sticky",
            top: 76,
            alignSelf: "start",
            background: "rgba(15, 22, 41, 0.88)",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 14,
            padding: 12,
            backdropFilter: "blur(14px)",
            overflow: "hidden",
            transition: "width 220ms ease"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 10,
              padding: "2px 4px"
            }}
          >
            {!collapsed ? (
              <div
                style={{
                  fontFamily: "'Orbitron', monospace",
                  fontWeight: 900,
                  letterSpacing: 2,
                  fontSize: 11,
                  color: COLORS.accent
                }}
              >
                DASHBOARD
              </div>
            ) : (
              <div style={{ width: 1 }} />
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: COLORS.accent3,
                  boxShadow: `0 0 14px ${COLORS.accent3}99`
                }}
                className="cq-glowPulse"
                title="Online"
              />
              <button
                type="button"
                onClick={onToggleSidebar}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                style={{
                  background: "transparent",
                  border: `1px solid ${COLORS.border}`,
                  color: COLORS.textMuted,
                  cursor: "pointer",
                  borderRadius: 10,
                  width: 28,
                  height: 28,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "border-color 160ms ease, color 160ms ease, transform 220ms ease",
                  transform: collapsed ? "rotate(180deg)" : "none"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = COLORS.accent;
                  e.currentTarget.style.color = COLORS.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = COLORS.border;
                  e.currentTarget.style.color = COLORS.textMuted;
                }}
              >
                ◀
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: "10px 10px",
              borderRadius: 12,
              border: `1px solid ${COLORS.border}`,
              background: "#0b1224",
              marginBottom: 12
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 17,
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
                flexShrink: 0
              }}
            >
              {user?.avatar ?? "🦊"}
            </div>
            {!collapsed ? (
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontWeight: 900,
                    letterSpacing: 0.3,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    fontSize: 13
                  }}
                >
                  {user?.name}
                </div>
                <div style={{ color: COLORS.textMuted, fontSize: 11, letterSpacing: 0.5, marginTop: 1 }}>
                  Level {level} · {xp} XP
                </div>
              </div>
            ) : null}
          </div>

          <div style={{ padding: "0 2px", marginBottom: 14, display: collapsed ? "none" : "block" }}>
            <div
              style={{
                height: 3,
                borderRadius: 999,
                background: `${COLORS.border}88`,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${xpProgress}%`,
                  background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent2})`,
                  borderRadius: 999,
                  transition: "width 800ms cubic-bezier(0.4,0,0.2,1)"
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 4,
                fontSize: 10,
                color: COLORS.textMuted,
                letterSpacing: 0.5
              }}
            >
              <span>LVL {level}</span>
              <span>{xpProgress}/100 XP</span>
            </div>
          </div>

          <div style={{ display: "grid", gap: 6 }}>
            {sidebarItems.map((it, idx) => {
              const isModulesActive = it.id === "modules" && activeNav === "modules";
              const highlight = isModulesActive || (it.id === activeNav && !active);
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => handleNavClick(it.id)}
                  className="cq-hoverLift cq-slideInLeft"
                  style={{
                    animationDelay: `${120 + idx * 90}ms`,
                    background: highlight
                      ? `linear-gradient(90deg, ${COLORS.accent}18, transparent)`
                      : "transparent",
                    border: `1px solid ${highlight ? COLORS.accent + "55" : COLORS.border}`,
                    color: highlight ? COLORS.text : COLORS.textMuted,
                    borderRadius: 10,
                    padding: "9px 12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    transition: "background 160ms ease, border-color 160ms ease, color 160ms ease",
                    width: "100%"
                  }}
                  onMouseEnter={(e) => {
                    if (!highlight) {
                      e.currentTarget.style.background = `${COLORS.accent}0d`;
                      e.currentTarget.style.color = COLORS.text;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!highlight) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = COLORS.textMuted;
                    }
                  }}
                >
                  <span style={{ display: "flex", gap: 9, alignItems: "center", fontWeight: 800, fontSize: 13 }}>
                    <span style={{ fontSize: 15 }}>{it.icon}</span>
                    {!collapsed ? it.label : null}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    {it.count != null && (
                      <span
                        style={{
                          display: collapsed ? "none" : "inline-block",
                          fontSize: 10,
                          color: highlight ? COLORS.accent : COLORS.textMuted,
                          background: highlight ? `${COLORS.accent}22` : `${COLORS.border}44`,
                          borderRadius: 999,
                          padding: "1px 7px",
                          fontWeight: 700,
                          letterSpacing: 0.3
                        }}
                      >
                        {it.count}
                      </span>
                    )}
                    <span
                      style={{
                        display: collapsed ? "none" : "inline-block",
                        color: highlight ? COLORS.accent : COLORS.textMuted,
                        fontSize: 14,
                        fontWeight: 900,
                        transition: "transform 160ms ease",
                        transform: highlight ? "translateX(2px)" : "none"
                      }}
                    >
                      ›
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 14,
              padding: "10px 12px",
              borderRadius: 10,
              border: `1px solid ${COLORS.border}`,
              background: "#0b1224",
              display: collapsed ? "none" : "block"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 7
              }}
            >
              <span style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>
                Progress
              </span>
              <span style={{ fontSize: 11, fontWeight: 800, color: COLORS.accent }}>
                {completedModules.length}/{MODULES.length}
              </span>
            </div>
            <div
              style={{
                height: 4,
                borderRadius: 999,
                background: `${COLORS.border}66`,
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(completedModules.length / MODULES.length) * 100}%`,
                  background: `linear-gradient(90deg, ${COLORS.accent}, ${COLORS.accent3})`,
                  borderRadius: 999,
                  transition: "width 800ms cubic-bezier(0.4,0,0.2,1)"
                }}
              />
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main>
          <div className="cq-revealUp" style={{ animationDelay: "80ms" }}>
            <XPBar xp={xp} />
          </div>

          {active ? (
            <div className="cq-revealUp" style={{ animationDelay: "160ms", marginTop: 14 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 18,
                  flexWrap: "wrap"
                }}
              >
                <button
                  onClick={onBack}
                  style={{
                    background: "transparent",
                    border: `1px solid ${COLORS.border}`,
                    color: COLORS.textMuted,
                    cursor: "pointer",
                    borderRadius: 10,
                    padding: "7px 12px",
                    fontWeight: 900,
                    fontSize: 14,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    transition: "border-color 140ms ease, color 140ms ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = COLORS.accent;
                    e.currentTarget.style.color = COLORS.text;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = COLORS.border;
                    e.currentTarget.style.color = COLORS.textMuted;
                  }}
                >
                  ← Back
                </button>
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>Modules</span>
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>›</span>
                <span style={{ fontSize: 12, color: mod?.color, fontWeight: 700 }}>{mod?.label}</span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "18px 20px",
                  background: `linear-gradient(135deg, ${mod?.color}12, rgba(15,22,41,0.82))`,
                  border: `1px solid ${mod?.color + "44"}`,
                  borderRadius: 14,
                  marginBottom: 14,
                  backdropFilter: "blur(14px)"
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 26,
                    background: `${mod?.color}22`,
                    border: `1px solid ${mod?.color + "44"}`,
                    flexShrink: 0
                  }}
                >
                  {mod?.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 16,
                      fontWeight: 900,
                      color: mod?.color,
                      fontFamily: "'Orbitron', monospace",
                      letterSpacing: 1
                    }}
                  >
                    {mod?.label}
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 3 }}>{mod?.desc}</div>
                </div>
                {completedModules.includes(mod?.id) && (
                  <div
                    style={{
                      fontSize: 11,
                      color: COLORS.accent3,
                      background: `${COLORS.accent3}18`,
                      border: `1px solid ${COLORS.accent3}44`,
                      borderRadius: 999,
                      padding: "4px 10px",
                      fontWeight: 800,
                      letterSpacing: 1
                    }}
                  >
                    ✓ COMPLETED
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div
                className="cq-revealUp"
                style={{ textAlign: "left", padding: "20px 8px 16px", animationDelay: "140ms" }}
              >
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.accent,
                    letterSpacing: 3,
                    textTransform: "uppercase"
                  }}
                >
                  Welcome back,{" "}
                  <span style={{ color: COLORS.text, fontWeight: 900 }}>{user?.name}</span>
                  <span className="cq-cursor" />
                </div>

                <div
                  className={`cq-heroTitle ${glitching ? "cq-glitching" : ""}`}
                  data-text="DEFEND. LEARN. CONQUER."
                  style={{
                    fontSize: 32,
                    fontWeight: 900,
                    lineHeight: 1.15,
                    marginTop: 8,
                    fontFamily: "'Orbitron', monospace"
                  }}
                >
                  <span style={{ color: COLORS.accent }}>DEFEND.</span>{" "}
                  <span style={{ color: COLORS.accent2 }}>LEARN.</span>{" "}
                  <span style={{ color: COLORS.accent3 }}>CONQUER.</span>
                </div>

                {/* ✅ Updated tagline */}
                <div
                  style={{ color: COLORS.textMuted, fontSize: 13, maxWidth: 520, marginTop: 8, lineHeight: 1.5 }}
                >
                  Gamified Cybersecurity Learning Platform
                </div>
              </div>

              <div
                style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 20 }}
              >
                {stats.map((s, i) => (
                  <div
                    key={s.label}
                    className="cq-revealUp cq-hoverLift"
                    style={{
                      animationDelay: `${220 + i * 90}ms`,
                      background: "rgba(15, 22, 41, 0.82)",
                      border: `1px solid ${COLORS.border}`,
                      borderRadius: 14,
                      padding: "14px 16px",
                      backdropFilter: "blur(14px)"
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: 8
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: 22,
                            fontWeight: 900,
                            color: s.color,
                            fontFamily: "'Orbitron', monospace",
                            lineHeight: 1
                          }}
                        >
                          {s.value}
                        </div>
                        <div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 3, letterSpacing: 2 }}>
                          {s.label}
                        </div>
                      </div>
                      <span style={{ fontSize: 18, opacity: 0.7 }}>{s.icon}</span>
                    </div>
                    {s.progress != null && (
                      <div>
                        <div
                          style={{
                            height: 3,
                            borderRadius: 999,
                            background: `${COLORS.border}66`,
                            overflow: "hidden",
                            marginBottom: 4
                          }}
                        >
                          <div
                            style={{
                              height: "100%",
                              width: `${clamp(s.progress * 100, 0, 100)}%`,
                              background: s.color,
                              borderRadius: 999,
                              transition: "width 900ms cubic-bezier(0.4,0,0.2,1)"
                            }}
                          />
                        </div>
                        <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.3 }}>{s.sub}</div>
                      </div>
                    )}
                    {s.progress == null && (
                      <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 0.3 }}>{s.sub}</div>
                    )}
                  </div>
                ))}
              </div>

              {activeNav === "modules" && (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 12,
                      padding: "0 2px"
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        color: COLORS.textMuted,
                        letterSpacing: 2,
                        textTransform: "uppercase",
                        fontWeight: 700
                      }}
                    >
                      All Modules
                    </div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted }}>
                      {completedModules.length} of {MODULES.length} completed
                    </div>
                  </div>
                  {renderModuleGrid()}
                </>
              )}

              {activeNav === "quick" && renderQuickAccess()}
            </>
          )}

        </main>
      </div>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 16px 24px" }}>
        <Footer />
      </div>
    </div>
  );
}
