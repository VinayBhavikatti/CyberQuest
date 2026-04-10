import { useMemo, useState } from "react";
import { COLORS } from "../theme/colors.js";
import { AVATARS } from "../data/social.js";

export default function Login({ onLogin }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("CyberFox");
  const [password, setPassword] = useState("password");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0] ?? "🦊");

  const cardStyle = useMemo(
    () => ({
      width: "100%",
      maxWidth: 460,
      background: "rgba(15, 22, 41, 0.94)",
      border: `1px solid ${COLORS.border}`,
      borderRadius: 18,
      padding: "28px 24px",
      backdropFilter: "blur(18px)",
      position: "relative",
      overflow: "hidden"
    }),
    []
  );

  const labelStyle = { fontSize: 12, fontWeight: 700, letterSpacing: 2, color: COLORS.accent, marginBottom: 6 };
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    background: "#0b1224",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 10,
    color: COLORS.text,
    outline: "none"
  };

  function submitLogin(e) {
    e.preventDefault();
    const name = (username || "").trim() || "CyberAgent";
    onLogin?.({ name, avatar: "🦊" });
  }

  function submitSignup(e) {
    e.preventDefault();
    const name = (regUsername || "").trim() || "CyberAgent";
    onLogin?.({ name, avatar });
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: `radial-gradient(900px 500px at 30% 20%, ${COLORS.accent}12, transparent 60%),
                     radial-gradient(900px 500px at 70% 10%, ${COLORS.accent2}12, transparent 60%),
                     ${COLORS.bg}`,
        color: COLORS.text,
        fontFamily: "'Rajdhani', system-ui, -apple-system, Segoe UI, sans-serif"
      }}
    >
      <div style={cardStyle}>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 40, filter: `drop-shadow(0 0 16px ${COLORS.accent}88)` }}>🛡️</div>
          <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, letterSpacing: 4, color: COLORS.accent, fontSize: 22 }}>
            CYBERQUEST
          </div>
          <div style={{ color: COLORS.textMuted, letterSpacing: 2, marginTop: 4, fontSize: 12 }}>DEFEND · LEARN · CONQUER</div>
        </div>

        <div style={{ display: "flex", background: "#0b1224", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 4, marginBottom: 18 }}>
          {[
            { id: "login", label: "SIGN IN" },
            { id: "signup", label: "JOIN UP" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setMode(t.id)}
              style={{
                flex: 1,
                border: "none",
                cursor: "pointer",
                padding: "10px 12px",
                borderRadius: 8,
                background: mode === t.id ? `linear-gradient(135deg, ${COLORS.accent}22, ${COLORS.accent2}22)` : "transparent",
                color: mode === t.id ? COLORS.accent : COLORS.textMuted,
                fontWeight: 700,
                letterSpacing: 1,
                fontFamily: "inherit"
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {mode === "login" ? (
          <form onSubmit={submitLogin}>
            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>USERNAME</div>
              <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter username" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>PASSWORD</div>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" style={inputStyle} />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
                color: "#fff",
                fontFamily: "'Orbitron', monospace",
                fontWeight: 800,
                letterSpacing: 2
              }}
            >
              BREACH ENTRY ⚡
            </button>
          </form>
        ) : (
          <form onSubmit={submitSignup}>
            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>USERNAME</div>
              <input value={regUsername} onChange={(e) => setRegUsername(e.target.value)} placeholder="Choose username" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>CHOOSE AVATAR</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                {AVATARS.map((a) => {
                  const selected = a === avatar;
                  return (
                    <button
                      type="button"
                      key={a}
                      onClick={() => setAvatar(a)}
                      style={{
                        width: 42,
                        height: 42,
                        borderRadius: 999,
                        cursor: "pointer",
                        border: `2px solid ${selected ? COLORS.accent : COLORS.border}`,
                        background: "#0f1a33",
                        boxShadow: selected ? `0 0 16px ${COLORS.accent}66` : "none",
                        color: COLORS.text,
                        fontSize: 18
                      }}
                      aria-pressed={selected}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={labelStyle}>PASSWORD</div>
              <input type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Create password" style={inputStyle} />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                background: `linear-gradient(135deg, ${COLORS.accent}, ${COLORS.accent2})`,
                color: "#fff",
                fontFamily: "'Orbitron', monospace",
                fontWeight: 800,
                letterSpacing: 2
              }}
            >
              ACTIVATE AGENT ⚡
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

