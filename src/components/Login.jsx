import { useEffect, useRef, useMemo, useState } from "react";
import { COLORS } from "../theme/colors.js";
import { AVATARS } from "../data/social.js";

function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const FONT_SIZE = 16;
    const CHARS = "アウエカキクサシスタチツABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const INTERVAL = 120;

    let cols, drops, speeds, animId, lastTime = 0;

    function resize() {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols   = Math.floor(canvas.width / FONT_SIZE);
      drops  = Array.from({ length: cols }, () => Math.random() * -(canvas.height / FONT_SIZE) * 2);
      speeds = Array.from({ length: cols }, () => (Math.random() > 0.5 ? 1 : 2));
      ctx.font = `${FONT_SIZE}px monospace`;
    }

    function draw(ts) {
      animId = requestAnimationFrame(draw);
      if (ts - lastTime < INTERVAL) return;
      lastTime = ts;

      ctx.fillStyle = "rgba(4,13,24,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < cols; i++) {
        const y = Math.floor(drops[i]) * FONT_SIZE;
        if (y < 0) { drops[i] += speeds[i]; continue; }

        ctx.fillStyle = Math.random() > 0.92 ? "#e0fff8" : "#00c896";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT_SIZE, y);

        if (y > canvas.height && Math.random() > 0.97)
          drops[i] = -Math.floor(Math.random() * 20);

        drops[i] += speeds[i];
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    animId = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(animId); ro.disconnect(); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        opacity: 0.4,
        pointerEvents: "none",
      }}
    />
  );
}

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Rajdhani:wght@400;600;700&display=swap');

  @keyframes cq-pulse {
    0%, 100% { filter: drop-shadow(0 0 12px #00e5c0) drop-shadow(0 0 24px #00e5c088); }
    50%       { filter: drop-shadow(0 0 22px #00e5c0) drop-shadow(0 0 44px #00e5c0aa); }
  }
  @keyframes cq-flicker {
    0%,95%,100% { opacity: 1; }
    97%         { opacity: 0.82; }
    98%         { opacity: 1; }
    99%         { opacity: 0.9; }
  }
  @keyframes cq-shimmer {
    0%   { transform: translateX(-100%); }
    100% { transform: translateX(220%); }
  }
  @keyframes cq-blink {
    0%, 100% { opacity: 1; }
    50%      { opacity: 0; }
  }
  @keyframes cq-scanpulse {
    0%, 100% { opacity: 0.6; }
    50%      { opacity: 1; }
  }

  .cq-title       { animation: cq-flicker 4s infinite; }
  .cq-logo-icon   { animation: cq-pulse 2.5s ease-in-out infinite; }
  .cq-btn::before { animation: cq-shimmer 2.8s infinite; }
  .cq-blink       { animation: cq-blink 1s step-end infinite; }

  .cq-input:focus {
    border-color: rgba(0,229,192,0.65) !important;
    box-shadow: 0 0 16px rgba(0,229,192,0.18) !important;
  }
  .cq-input:focus ~ .cq-bar {
    background: linear-gradient(90deg, transparent, #00e5c0, transparent) !important;
  }
  .cq-tab-active {
    background: linear-gradient(135deg, rgba(0,229,192,0.18), rgba(0,180,220,0.18)) !important;
    color: #00e5c0 !important;
    border: 1px solid rgba(0,229,192,0.32) !important;
    box-shadow: 0 0 12px rgba(0,229,192,0.2) !important;
  }
  .cq-tab-inactive {
    background: transparent !important;
    color: rgba(0,200,160,0.4) !important;
    border: 1px solid transparent !important;
  }
  .cq-avatar-sel {
    border-color: #00e5c0 !important;
    box-shadow: 0 0 14px rgba(0,229,192,0.55) !important;
    background: rgba(0,229,192,0.1) !important;
  }
`;

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("CyberFox");
  const [password, setPassword] = useState("password");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0] ?? "🦊");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (document.getElementById("cq-styles")) return;
    const s = document.createElement("style");
    s.id = "cq-styles";
    s.textContent = globalStyles;
    document.head.appendChild(s);
    return () => s.remove();
  }, []);

  const accent = "#00e5c0";
  const accent2 = "#0090d0";

  const cardStyle = useMemo(
    () => ({
      position: "relative",
      zIndex: 2,
      width: "100%",
      maxWidth: 360,
      background: "rgba(4,16,32,0.90)",
      border: "1px solid rgba(0,220,180,0.22)",
      borderRadius: 16,
      padding: "24px 22px",
      boxShadow:
        "0 0 60px rgba(0,200,160,0.08), inset 0 0 40px rgba(0,100,80,0.05)",
    }),
    []
  );

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    background: "rgba(0,8,18,0.85)",
    border: "1px solid rgba(0,200,160,0.2)",
    borderRadius: 8,
    color: "#b0fff0",
    fontFamily: "'Rajdhani', sans-serif",
    fontSize: 14,
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  const labelStyle = {
    fontFamily: "'Orbitron', monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    color: accent,
    marginBottom: 7,
  };

  const btnStyle = {
    width: "100%",
    padding: "11px 14px",
    border: "none",
    borderRadius: 10,
    cursor: "pointer",
    background: `linear-gradient(135deg, ${accent}, ${accent2})`,
    color: "#001a14",
    fontFamily: "'Orbitron', monospace",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 3,
    position: "relative",
    overflow: "hidden",
    marginTop: 4,
  };

  const Corner = ({ pos }) => {
    const styles = {
      tl: { top: -1, left: -1, borderWidth: "2px 0 0 2px", borderRadius: "2px 0 0 0" },
      tr: { top: -1, right: -1, borderWidth: "2px 2px 0 0", borderRadius: "0 2px 0 0" },
      bl: { bottom: -1, left: -1, borderWidth: "0 0 2px 2px", borderRadius: "0 0 0 2px" },
      br: { bottom: -1, right: -1, borderWidth: "0 2px 2px 0", borderRadius: "0 0 2px 0" },
    };
    return (
      <div
        style={{
          position: "absolute",
          width: 16,
          height: 16,
          borderStyle: "solid",
          borderColor: accent,
          ...styles[pos],
        }}
      />
    );
  };

  function triggerStatus(msg, delay = 1200, final = "") {
    setStatus(msg);
    if (final) setTimeout(() => setStatus(final), delay);
  }

  function submitLogin(e) {
    e.preventDefault();
    const name = (username || "").trim() || "CyberAgent";
    triggerStatus(`AUTHENTICATING ${name.toUpperCase()}...`, 1200, "ACCESS GRANTED ✓");
    setTimeout(() => onLogin?.({ name, avatar: "🦊" }), 1400);
  }

  function submitSignup(e) {
    e.preventDefault();
    const name = (regUsername || "").trim() || "CyberAgent";
    triggerStatus("ENCRYPTING CREDENTIALS...", 900, "AGENT ACTIVATED ✓");
    setTimeout(() => onLogin?.({ name, avatar }), 1100);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: `radial-gradient(900px 500px at 30% 20%, ${accent}10, transparent 60%),
                     radial-gradient(900px 500px at 70% 10%, ${accent2}10, transparent 60%),
                     #040d18`,
        color: "#b0fff0",
        fontFamily: "'Rajdhani', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MatrixRain />

      {/* Scanlines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,200,0.012) 2px, rgba(0,255,200,0.012) 4px)",
          pointerEvents: "none",
        }}
      />

      <div style={cardStyle}>
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div
            className="cq-logo-icon"
            style={{ fontSize: 36, display: "block", marginBottom: 6 }}
          >
            🛡️
          </div>
          <div
            className="cq-title"
            style={{
              fontFamily: "'Orbitron', monospace",
              fontWeight: 900,
              letterSpacing: 5,
              color: accent,
              fontSize: 20,
              textShadow: `0 0 20px ${accent}88, 0 0 40px ${accent}44`,
            }}
          >
            CYBERQUEST
          </div>
          <div
            style={{
              color: "rgba(0,200,160,0.5)",
              letterSpacing: 3,
              marginTop: 4,
              fontSize: 11,
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            DEFEND · LEARN · CONQUER
          </div>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(0,0,0,0.45)",
            border: "1px solid rgba(0,200,160,0.15)",
            borderRadius: 10,
            padding: 4,
            marginBottom: 16,
            gap: 4,
          }}
        >
          {[
            { id: "login", label: "LOGIN" },
            { id: "signup", label: "REGISTER" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setMode(t.id); setStatus(""); }}
              className={mode === t.id ? "cq-tab-active" : "cq-tab-inactive"}
              style={{
                flex: 1,
                border: "1px solid transparent",
                cursor: "pointer",
                padding: "10px 12px",
                borderRadius: 7,
                fontFamily: "'Orbitron', monospace",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: 1.5,
                transition: "all 0.25s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Login Form */}
        {mode === "login" && (
          <form onSubmit={submitLogin}>
            <div style={{ marginBottom: 10 }}>
              <div style={labelStyle}>USERNAME</div>
              <div style={{ position: "relative" }}>
                <input
                  className="cq-input"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  style={inputStyle}
                />
                <div
                  className="cq-bar"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 12,
                    right: 12,
                    height: 1,
                    background: "transparent",
                    transition: "background 0.2s",
                  }}
                />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={labelStyle}>PASSWORD</div>
              <div style={{ position: "relative" }}>
                <input
                  className="cq-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  style={inputStyle}
                />
                <div
                  className="cq-bar"
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 12,
                    right: 12,
                    height: 1,
                    background: "transparent",
                    transition: "background 0.2s",
                  }}
                />
              </div>
            </div>
            <button type="submit" className="cq-btn" style={btnStyle}>
              <span
                className="cq-btn"
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                  transform: "translateX(-100%)",
                  pointerEvents: "none",
                }}
              />
              SIGN IN ⚡
            </button>
          </form>
        )}

        {/* Signup Form */}
        {mode === "signup" && (
          <form onSubmit={submitSignup}>
            <div style={{ marginBottom: 10 }}>
              <div style={labelStyle}>USERNAME</div>
              <div style={{ position: "relative" }}>
                <input
                  className="cq-input"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Choose codename"
                  style={inputStyle}
                />
                <div className="cq-bar" style={{ position: "absolute", bottom: 0, left: 12, right: 12, height: 1, background: "transparent", transition: "background 0.2s" }} />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={labelStyle}>SELECT AVATAR</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {AVATARS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={a === avatar ? "cq-avatar-sel" : ""}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      cursor: "pointer",
                      border: `2px solid rgba(0,200,160,0.22)`,
                      background: "rgba(0,20,14,0.85)",
                      color: "#b0fff0",
                      fontSize: 18,
                      transition: "all 0.2s",
                    }}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={labelStyle}>PASSPHRASE</div>
              <div style={{ position: "relative" }}>
                <input
                  className="cq-input"
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Create passphrase"
                  style={inputStyle}
                />
                <div className="cq-bar" style={{ position: "absolute", bottom: 0, left: 12, right: 12, height: 1, background: "transparent", transition: "background 0.2s" }} />
              </div>
            </div>
            <button type="submit" className="cq-btn" style={btnStyle}>
              CREATE ACCOUNT ⚡
            </button>
          </form>
        )}

        {/* Status bar */}
        <div
          style={{
            fontFamily: "'Rajdhani', monospace",
            fontSize: 12,
            color: "rgba(0,200,160,0.55)",
            textAlign: "center",
            marginTop: 14,
            letterSpacing: 1,
            minHeight: 18,
          }}
        >
          {status ? (
            <>
              {status} <span className="cq-blink">█</span>
            </>
          ) : (
            <span className="cq-blink">_</span>
          )}
        </div>
      </div>
    </div>
  );
}
