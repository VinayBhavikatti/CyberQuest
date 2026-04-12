import { useEffect, useRef, useState, useCallback } from "react";

const emails = [
  { type: "phishing", sender: "support@paypa1.com", subject: "Your account is SUSPENDED! Verify NOW", tag: "Fake domain", tip: 'Notice the "1" instead of "l" in PayPal!' },
  { type: "phishing", sender: "admin@bank-secure-alert.net", subject: "Unauthorized login detected — click to fix", tag: "Suspicious link", tip: "Real banks never email links to fix logins." },
  { type: "phishing", sender: "noreply@amaz0n-deals.com", subject: "You won a FREE iPhone! Claim immediately", tag: "Too good to be true", tip: "Nobody sends free iPhones by email." },
  { type: "phishing", sender: "it-dept@company-helpdesk.info", subject: "Reset your password or lose access today", tag: "Urgency trick", tip: "Real IT teams don't create panic." },
  { type: "phishing", sender: "info@microsofft.com", subject: "Your Office 365 expires in 24 hours", tag: "Typo in domain", tip: '"Microsofft" has double f — fake!' },
  { type: "phishing", sender: "security@g00gle.com", subject: "Sign-in attempt blocked — verify identity", tag: "Spoofed sender", tip: "g00gle (zeros) is NOT Google." },
  { type: "phishing", sender: "prize@lottery-winners.org", subject: "You have been selected — $1,000,000 prize!", tag: "Lottery scam", tip: "If you didn't enter, you can't win." },
  { type: "legit", sender: "no-reply@github.com", subject: "Your pull request #42 has been merged", tag: "Known platform", tip: "GitHub sends merge notifications from this address." },
  { type: "legit", sender: "billing@netflix.com", subject: "Your monthly receipt is ready to view", tag: "Expected email", tip: "Netflix billing comes from @netflix.com." },
  { type: "legit", sender: "team@slack.com", subject: "You've been invited to a workspace", tag: "Real sender", tip: "Slack invites come from @slack.com." },
  { type: "legit", sender: "school@edu.gov", subject: "Exam schedule posted on the portal", tag: "Official domain", tip: ".gov and .edu domains are trusted institutions." },
  { type: "legit", sender: "alerts@google.com", subject: "New sign-in to your Google account", tag: "Verified sender", tip: "Google alerts come from @google.com." },
];

const GAME_DURATION = 60;

export default function PhishingEmailCatcher() {
  const [screen, setScreen] = useState("start"); // start | playing | end
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timer, setTimer] = useState(GAME_DURATION);
  const [cards, setCards] = useState([]);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const intervalRef = useRef(null);
  const spawnRef = useRef(null);
  const livesRef = useRef(3);
  const runningRef = useRef(false);
  const cardsRef = useRef([]);

  const showFeedback = useCallback((msg, color) => {
    setFeedback({ msg, color });
    setTimeout(() => setFeedback(null), 1400);
  }, []);

  const endGame = useCallback(() => {
    runningRef.current = false;
    clearInterval(intervalRef.current);
    clearInterval(spawnRef.current);
    setCards([]);
    cardsRef.current = [];
    setScreen("end");
  }, []);

  const spawnEmail = useCallback(() => {
    if (!runningRef.current) return;
    const pool = emails.filter(e => !cardsRef.current.find(c => c.data.sender === e.sender));
    const data = pool.length > 0
      ? pool[Math.floor(Math.random() * pool.length)]
      : emails[Math.floor(Math.random() * emails.length)];
    const id = "card-" + Date.now() + Math.random();
    const x = Math.random() * 55;
    const y = Math.random() * 55;
    const newCard = { id, data, x, y };
    cardsRef.current = [...cardsRef.current.slice(-4), newCard];
    setCards([...cardsRef.current]);
  }, []);

  const startGame = useCallback(() => {
    setScore(0);
    setLives(3);
    setTimer(GAME_DURATION);
    setCards([]);
    setSelected(null);
    setFeedback(null);
    livesRef.current = 3;
    cardsRef.current = [];
    runningRef.current = true;
    setScreen("playing");

    clearInterval(intervalRef.current);
    clearInterval(spawnRef.current);

    setTimeout(() => {
      spawnEmail();
      spawnRef.current = setInterval(spawnEmail, 2800);
      let t = GAME_DURATION;
      intervalRef.current = setInterval(() => {
        t--;
        setTimer(t);
        if (t <= 0) endGame();
      }, 1000);
    }, 100);
  }, [spawnEmail, endGame]);

  const handleBin = useCallback((bin) => {
    if (!runningRef.current || !selected) {
      showFeedback("← Select an email first!", "#ffcc44");
      return;
    }
    const cardObj = cardsRef.current.find(c => c.id === selected);
    if (!cardObj) return;

    const correct =
      (bin === "phish" && cardObj.data.type === "phishing") ||
      (bin === "safe" && cardObj.data.type === "legit");

    if (correct) {
      setScore(s => s + 10);
      showFeedback(bin === "phish" ? "🎣 Caught it! +10" : "✅ Safe! +10", "#4fffb0");
    } else {
      const newLives = livesRef.current - 1;
      livesRef.current = newLives;
      setLives(newLives);
      showFeedback("✗ Wrong! " + cardObj.data.tip, "#ff6b6b");
      if (newLives <= 0) {
        setTimeout(endGame, 700);
        return;
      }
    }

    cardsRef.current = cardsRef.current.filter(c => c.id !== selected);
    setCards([...cardsRef.current]);
    setSelected(null);
  }, [selected, showFeedback, endGame]);

  useEffect(() => {
    const handler = (e) => {
      if (!runningRef.current) return;
      if (e.key === "p" || e.key === "P") handleBin("phish");
      if (e.key === "s" || e.key === "S") handleBin("safe");
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleBin]);

  useEffect(() => () => {
    clearInterval(intervalRef.current);
    clearInterval(spawnRef.current);
  }, []);

  const hearts = "♥ ".repeat(Math.max(0, lives)).trim() || "—";

  const grade =
    score >= 70 ? "🏆 Cyber Hero!" :
    score >= 40 ? "👍 Not Bad!" :
    "📚 Keep Learning!";

  return (
    <div style={{
      fontFamily: "system-ui, sans-serif",
      background: "linear-gradient(135deg, #0a0a2e 0%, #1a1a4e 50%, #0d1b3e 100%)",
      minHeight: 600,
      borderRadius: 16,
      overflow: "hidden",
      position: "relative",
      userSelect: "none",
    }}>

      {/* HUD */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "14px 20px",
        background: "rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <HudBlock label="Score" value={score} color="#4fffb0" />
        <div style={{ textAlign: "center" }}>
          <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>Phishing Catcher</div>
          <div style={{ color: "#556", fontSize: 11, marginTop: 2 }}>Cyber Awareness Game</div>
        </div>
        <HudBlock label="Lives" value={hearts} color="#ff6b6b" />
        <HudBlock label="Time" value={timer} color="#ffcc44" />
      </div>

      {/* Instruction strip */}
      <div style={{ textAlign: "center", fontSize: 12, color: "#667799", padding: "5px 0 6px", background: "rgba(0,0,0,0.2)" }}>
        Click an email to select it, then click a bin below — or press <b style={{ color: "#99aacc" }}>S</b> (Safe) / <b style={{ color: "#99aacc" }}>P</b> (Phish)
      </div>

      {/* Arena */}
      <div style={{ position: "relative", width: "100%", height: 400, overflow: "hidden" }}>
        {cards.map(card => (
          <EmailCard
            key={card.id}
            card={card}
            isSelected={selected === card.id}
            onClick={() => setSelected(card.id)}
          />
        ))}

        {/* Feedback */}
        {feedback && (
          <div style={{
            position: "absolute", top: "45%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 20, fontWeight: 500,
            color: feedback.color,
            background: "rgba(0,0,0,0.6)",
            padding: "10px 20px", borderRadius: 10,
            pointerEvents: "none",
            zIndex: 50,
            maxWidth: "80%", textAlign: "center",
            animation: "fadeOut 1.4s forwards",
          }}>{feedback.msg}</div>
        )}
      </div>

      {/* Bins */}
      <div style={{ display: "flex", justifyContent: "center", gap: 24, padding: "10px 20px 16px", background: "rgba(0,0,0,0.3)" }}>
        <Bin id="phish" icon="🎣" label="Phishing!" color="#ff7777" bg="rgba(255,60,60,0.1)" border="rgba(255,60,60,0.5)" onClick={() => handleBin("phish")} />
        <Bin id="safe" icon="✅" label="Looks Safe" color="#4fffb0" bg="rgba(60,200,120,0.1)" border="rgba(60,200,120,0.5)" onClick={() => handleBin("safe")} />
      </div>

      {/* Start screen */}
      {screen === "start" && (
        <Overlay>
          <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 500, textAlign: "center" }}>Phishing Email Catcher</h2>
          <p style={{ color: "#aab", fontSize: 14, textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
            Emails will fly across the screen. Can you spot the PHISHING ones from the REAL ones? Save your inbox — don't get hooked!
          </p>
          <TipBox>
            <b style={{ color: "#ffcc44" }}>Watch for clues:</b> Fake sender addresses · Urgent threats · Too-good offers · Suspicious links · Grammar errors
          </TipBox>
          <StartBtn onClick={startGame}>Start Game</StartBtn>
        </Overlay>
      )}

      {/* End screen */}
      {screen === "end" && (
        <Overlay>
          <h2 style={{ color: "#fff", fontSize: 26, fontWeight: 500, textAlign: "center" }}>{grade}</h2>
          <p style={{ fontSize: 36, fontWeight: 500, color: "#4fffb0", margin: 0 }}>{score} points</p>
          <p style={{ color: "#aab", fontSize: 14, textAlign: "center", maxWidth: 320, lineHeight: 1.6 }}>
            You identified real vs fake emails. Phishing attacks trick millions every year — staying alert keeps you safe online!
          </p>
          <TipBox>
            <b style={{ color: "#ffcc44" }}>Key lesson:</b> Always check the sender domain, avoid clicking urgent links, and when in doubt — don't click!
          </TipBox>
          <StartBtn onClick={startGame}>Play Again</StartBtn>
        </Overlay>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes floatIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

function HudBlock({ label, value, color }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#8899cc", textTransform: "uppercase", letterSpacing: 1 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 500, color, marginTop: 2 }}>{value}</div>
    </div>
  );
}

function EmailCard({ card, isSelected, onClick }) {
  const isPhishing = card.data.type === "phishing";
  return (
    <div
      onClick={onClick}
      style={{
        position: "absolute",
        left: `${card.x}%`,
        top: `${card.y}%`,
        width: 200,
        borderRadius: 10,
        padding: "12px 14px",
        cursor: "pointer",
        background: isPhishing
          ? "linear-gradient(135deg, #2d0a0a, #3d1515)"
          : "linear-gradient(135deg, #0a1a2d, #0d2540)",
        border: isSelected
          ? "2px solid #ffffff"
          : isPhishing
            ? "1.5px solid rgba(255,80,80,0.3)"
            : "1.5px solid rgba(80,160,255,0.3)",
        boxShadow: isSelected
          ? "0 0 18px rgba(255,255,255,0.3)"
          : "0 4px 20px rgba(0,0,0,0.4)",
        transform: isSelected ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.12s, box-shadow 0.12s, border 0.12s",
        zIndex: isSelected ? 10 : 1,
        animation: "floatIn 0.35s ease",
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 4, color: isPhishing ? "#ff8888" : "#66bbff" }}>
        {card.data.sender}
      </div>
      <div style={{ fontSize: 12, color: "#ccc", lineHeight: 1.4 }}>
        {card.data.subject}
      </div>
      <span style={{
        marginTop: 8, display: "inline-block",
        fontSize: 10, padding: "2px 8px", borderRadius: 20, fontWeight: 500,
        background: isPhishing ? "rgba(255,80,80,0.15)" : "rgba(80,160,255,0.15)",
        color: isPhishing ? "#ff8888" : "#66bbff",
        border: isPhishing ? "1px solid rgba(255,80,80,0.3)" : "1px solid rgba(80,160,255,0.3)",
      }}>
        {card.data.tag}
      </span>
    </div>
  );
}

function Bin({ icon, label, color, bg, border, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1, maxWidth: 220,
        borderRadius: 12, padding: 14,
        textAlign: "center", fontSize: 13, fontWeight: 500,
        cursor: "pointer",
        background: hovered ? bg.replace("0.1", "0.22") : bg,
        border: `2px solid ${hovered ? color : border}`,
        color,
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 0.15s",
      }}
    >
      <span style={{ fontSize: 28, display: "block", marginBottom: 6 }}>{icon}</span>
      {label}
    </div>
  );
}

function Overlay({ children }) {
  return (
    <div style={{
      position: "absolute", inset: 0,
      background: "rgba(5,5,30,0.92)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      gap: 16, zIndex: 100, padding: 24,
    }}>
      {children}
    </div>
  );
}

function TipBox({ children }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.05)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 8, padding: "12px 16px",
      maxWidth: 340, width: "100%",
      fontSize: 12, color: "#99aabb", lineHeight: 1.5,
    }}>
      {children}
    </div>
  );
}

function StartBtn({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        marginTop: 8, padding: "12px 32px",
        background: "linear-gradient(135deg, #4fffb0, #00cc88)",
        color: "#001a0d", border: "none", borderRadius: 8,
        fontSize: 15, fontWeight: 500, cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}