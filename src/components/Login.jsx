import { useEffect, useMemo, useRef, useState } from "react";
import { AVATARS } from "../data/social.js";
import { loginUser, registerUser } from "../utils/progress.js";

function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const FONT_SIZE = 16;
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const INTERVAL = 120;

    let cols;
    let drops;
    let speeds;
    let animId;
    let lastTime = 0;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      cols = Math.floor(canvas.width / FONT_SIZE);
      drops = Array.from({ length: cols }, () => Math.random() * -(canvas.height / FONT_SIZE) * 2);
      speeds = Array.from({ length: cols }, () => (Math.random() > 0.5 ? 1 : 2));
      ctx.font = `${FONT_SIZE}px monospace`;
    }

    function draw(ts) {
      animId = requestAnimationFrame(draw);
      if (ts - lastTime < INTERVAL) return;
      lastTime = ts;

      ctx.fillStyle = "rgba(4,13,24,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < cols; i += 1) {
        const y = Math.floor(drops[i]) * FONT_SIZE;
        if (y < 0) {
          drops[i] += speeds[i];
          continue;
        }

        ctx.fillStyle = Math.random() > 0.92 ? "#e0fff8" : "#00c896";
        ctx.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], i * FONT_SIZE, y);

        if (y > canvas.height && Math.random() > 0.97) {
          drops[i] = -Math.floor(Math.random() * 20);
        }

        drops[i] += speeds[i];
      }
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
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
    50% { filter: drop-shadow(0 0 22px #00e5c0) drop-shadow(0 0 44px #00e5c0aa); }
  }

  @keyframes cq-flicker {
    0%, 95%, 100% { opacity: 1; }
    97% { opacity: 0.82; }
    98% { opacity: 1; }
    99% { opacity: 0.9; }
  }

  @keyframes cq-shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(220%); }
  }

  @keyframes cq-blink {
    0%, 100% { opacity: 1; }
    50% { opacity: 0; }
  }

  .cq-title { animation: cq-flicker 4s infinite; }
  .cq-logo-icon { animation: cq-pulse 2.5s ease-in-out infinite; }
  .cq-btn::before { animation: cq-shimmer 2.8s infinite; }
  .cq-blink { animation: cq-blink 1s step-end infinite; }

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

function StatusPanel({ status, error }) {
  return (
    <>
      {error ? (
        <div
          style={{
            marginTop: 12,
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid rgba(255,90,90,0.3)",
            background: "rgba(255,90,90,0.08)",
            color: "#ff9a9a",
            fontSize: 12,
          }}
        >
          {error}
        </div>
      ) : null}
      <div
        style={{
          fontFamily: "'Rajdhani', monospace",
          fontSize: 12,
          color: error ? "#ff9a9a" : "rgba(0,200,160,0.55)",
          textAlign: "center",
          marginTop: 14,
          letterSpacing: 1,
          minHeight: 18,
        }}
      >
        {status ? (
          <>
            {status} <span className="cq-blink">|</span>
          </>
        ) : (
          <span className="cq-blink">_</span>
        )}
      </div>
    </>
  );
}

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0] ?? "🛡️");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (document.getElementById("cq-styles")) return undefined;
    const style = document.createElement("style");
    style.id = "cq-styles";
    style.textContent = globalStyles;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const accent = "#00e5c0";
  const accent2 = "#0090d0";

  const cardStyle = useMemo(
    () => ({
      position: "relative",
      zIndex: 2,
      width: "100%",
      maxWidth: 380,
      background: "rgba(4,16,32,0.90)",
      border: "1px solid rgba(0,220,180,0.22)",
      borderRadius: 16,
      padding: "24px 22px",
      boxShadow: "0 0 60px rgba(0,200,160,0.08), inset 0 0 40px rgba(0,100,80,0.05)",
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
    cursor: submitting ? "wait" : "pointer",
    background: `linear-gradient(135deg, ${accent}, ${accent2})`,
    color: "#001a14",
    fontFamily: "'Orbitron', monospace",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 3,
    position: "relative",
    overflow: "hidden",
    marginTop: 4,
    opacity: submitting ? 0.75 : 1,
  };

  const barStyle = {
    position: "absolute",
    bottom: 0,
    left: 12,
    right: 12,
    height: 1,
    background: "transparent",
    transition: "background 0.2s",
  };

  function resetMessages(nextMode) {
    setMode(nextMode);
    setStatus("");
    setError("");
  }

  async function submitLogin(event) {
    event.preventDefault();
    setError("");

    const safeEmail = email.trim().toLowerCase();
    if (!safeEmail || !password) {
      setError("Enter your email and password.");
      return;
    }

    try {
      setSubmitting(true);
      setStatus("VERIFYING EMAIL LOGIN...");
      const profile = await loginUser({ email: safeEmail, password });
      setStatus("ACCESS GRANTED");
      onLogin?.(profile);
    } catch (err) {
      setStatus("ACCESS DENIED");
      setError(err.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitSignup(event) {
    event.preventDefault();
    setError("");

    const username = regUsername.trim();
    const safeEmail = regEmail.trim().toLowerCase();

    if (!username || !safeEmail || !regPassword) {
      setError("Username, email, and password are required.");
      return;
    }

    try {
      setSubmitting(true);
      setStatus("ENCRYPTING CREDENTIALS...");
      const profile = await registerUser({
        username,
        email: safeEmail,
        password: regPassword,
        avatar,
      });
      setStatus("AGENT ACTIVATED");
      onLogin?.(profile);
    } catch (err) {
      setStatus("REGISTRATION BLOCKED");
      setError(err.message || "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

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

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: `radial-gradient(900px 500px at 30% 20%, ${accent}10, transparent 60%), radial-gradient(900px 500px at 70% 10%, ${accent2}10, transparent 60%), #040d18`,
        color: "#b0fff0",
        fontFamily: "'Rajdhani', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <MatrixRain />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,200,0.012) 2px, rgba(0,255,200,0.012) 4px)",
          pointerEvents: "none",
        }}
      />

      <div style={cardStyle}>
        <Corner pos="tl" />
        <Corner pos="tr" />
        <Corner pos="bl" />
        <Corner pos="br" />

        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div className="cq-logo-icon" style={{ fontSize: 36, display: "block", marginBottom: 6 }}>
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
            DEFEND - LEARN - CONQUER
          </div>
        </div>

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
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => resetMessages(tab.id)}
              className={mode === tab.id ? "cq-tab-active" : "cq-tab-inactive"}
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
              {tab.label}
            </button>
          ))}
        </div>

        {mode === "login" ? (
          <form onSubmit={submitLogin}>
            <div style={{ marginBottom: 10 }}>
              <div style={labelStyle}>EMAIL</div>
              <div style={{ position: "relative" }}>
                <input
                  className="cq-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="agent@domain.com"
                  autoComplete="email"
                  style={inputStyle}
                />
                <div className="cq-bar" style={barStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={labelStyle}>PASSWORD</div>
              <div style={{ position: "relative" }}>
                <input
                  className="cq-input"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  style={inputStyle}
                />
                <div className="cq-bar" style={barStyle} />
              </div>
            </div>
            <button type="submit" className="cq-btn" style={btnStyle} disabled={submitting}>
              <span
                className="cq-btn"
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                  transform: "translateX(-100%)",
                  pointerEvents: "none",
                }}
              />
              {submitting ? "VERIFYING..." : "SIGN IN"}
            </button>
          </form>
        ) : (
          <form onSubmit={submitSignup}>
            <div style={{ marginBottom: 10 }}>
              <div style={labelStyle}>USERNAME</div>
              <div style={{ position: "relative" }}>
                <input
                  className="cq-input"
                  value={regUsername}
                  onChange={(event) => setRegUsername(event.target.value)}
                  placeholder="Choose codename"
                  autoComplete="username"
                  style={inputStyle}
                />
                <div className="cq-bar" style={barStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={labelStyle}>EMAIL</div>
              <div style={{ position: "relative" }}>
                <input
                  className="cq-input"
                  type="email"
                  value={regEmail}
                  onChange={(event) => setRegEmail(event.target.value)}
                  placeholder="agent@domain.com"
                  autoComplete="email"
                  style={inputStyle}
                />
                <div className="cq-bar" style={barStyle} />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={labelStyle}>SELECT AVATAR</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {AVATARS.map((itemAvatar) => (
                  <button
                    type="button"
                    key={itemAvatar}
                    onClick={() => setAvatar(itemAvatar)}
                    className={itemAvatar === avatar ? "cq-avatar-sel" : ""}
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 999,
                      cursor: "pointer",
                      border: "2px solid rgba(0,200,160,0.22)",
                      background: "rgba(0,20,14,0.85)",
                      color: "#b0fff0",
                      fontSize: 18,
                      transition: "all 0.2s",
                    }}
                  >
                    {itemAvatar}
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
                  onChange={(event) => setRegPassword(event.target.value)}
                  placeholder="Min 8 chars, upper/lower/number/symbol"
                  autoComplete="new-password"
                  style={inputStyle}
                />
                <div className="cq-bar" style={barStyle} />
              </div>
            </div>
            <button type="submit" className="cq-btn" style={btnStyle} disabled={submitting}>
              {submitting ? "SECURING..." : "CREATE ACCOUNT"}
            </button>
          </form>
        )}

        <StatusPanel status={status} error={error} />
      </div>
    </div>
  );
}
