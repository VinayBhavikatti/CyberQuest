import { useEffect, useRef, useState } from "react";

const NODES = [
  { id: "RU", lon: 60,  lat: 58,  col: [220, 60, 60],  sev: "cr", r: 5.5, count: 1247 },
  { id: "CN", lon: 104, lat: 35,  col: [210, 110, 35], sev: "hi", r: 5.0, count: 834  },
  { id: "KP", lon: 127, lat: 40,  col: [210, 60, 60],  sev: "cr", r: 3.5, count: 88   },
  { id: "IR", lon: 53,  lat: 32,  col: [210, 90, 35],  sev: "hi", r: 3.5, count: 72   },
  { id: "NG", lon: 8,   lat: 10,  col: [210, 90, 35],  sev: "hi", r: 3.0, count: 61   },
  { id: "US", lon: -98, lat: 40,  col: [80, 150, 220], sev: "lo", r: 5.0, count: 512  },
  { id: "DE", lon: 10,  lat: 51,  col: [55, 165, 95],  sev: "lo", r: 4.0, count: 248  },
  { id: "GB", lon: -2,  lat: 54,  col: [55, 165, 95],  sev: "lo", r: 3.5, count: 145  },
  { id: "JP", lon: 138, lat: 37,  col: [80, 150, 220], sev: "me", r: 3.5, count: 112  },
  { id: "IN", lon: 78,  lat: 22,  col: [180, 155, 35], sev: "me", r: 4.0, count: 189  },
  { id: "AU", lon: 134, lat: -26, col: [120, 80, 200], sev: "lo", r: 3.5, count: 97   },
  { id: "BR", lon: -51, lat: -14, col: [180, 155, 35], sev: "me", r: 3.5, count: 93   },
];

const ATTACK_ROUTES = [
  { src: "RU", dst: "US", w: 1.2 }, { src: "CN", dst: "US", w: 1.1 },
  { src: "RU", dst: "DE", w: 1.0 }, { src: "CN", dst: "DE", w: 0.9 },
  { src: "KP", dst: "US", w: 0.9 }, { src: "KP", dst: "JP", w: 0.9 },
  { src: "RU", dst: "GB", w: 0.9 }, { src: "CN", dst: "JP", w: 0.8 },
  { src: "IR", dst: "US", w: 0.8 }, { src: "IR", dst: "DE", w: 0.7 },
  { src: "NG", dst: "GB", w: 0.7 }, { src: "RU", dst: "IN", w: 0.7 },
  { src: "CN", dst: "AU", w: 0.8 }, { src: "RU", dst: "JP", w: 0.7 },
  { src: "NG", dst: "US", w: 0.6 }, { src: "CN", dst: "IN", w: 0.7 },
];

const LOG_TEMPLATES = [
  (s, d) => `SQL injection wave · ${s}→${d}`,
  (s, d) => `Zero-day RCE deployed · ${s}→${d}`,
  (s, d) => `Ransomware beacon · ${s}→${d}`,
  (s, d) => `DDoS flood ${Math.floor(Math.random() * 800 + 200)}Gbps · ${s}→${d}`,
  (s, d) => `APT lateral movement · ${s}→${d}`,
  (s, d) => `Credential dump ${Math.floor(Math.random() * 900 + 100)}k · ${s}→${d}`,
  (s, d) => `Spearphish campaign · ${s}→${d}`,
  (s, d) => `Supply-chain probe · ${s}→${d}`,
  (s, d) => `Malware dropper · ${s}→${d}`,
  (s, d) => `Data exfil detected · ${s}→${d}`,
];

const nmap = {};
NODES.forEach((n) => (nmap[n.id] = n));

function rc(col, a) {
  return `rgba(${col[0]},${col[1]},${col[2]},${a})`;
}

function qbp(x1, y1, cpx, cpy, x2, y2, t) {
  const m = 1 - t;
  return [m * m * x1 + 2 * m * t * cpx + t * t * x2, m * m * y1 + 2 * m * t * cpy + t * t * y2];
}

export default function ThreatMap() {
  const canvasRef = useRef(null);
  const stateRef = useRef({
    beams: [], explosions: [], shockwaves: [], arcTrails: [], floatingTxt: [],
    scanY: 0, worldData: null, bcount: 2847, sessionAtks: 0,
    proj: null, gpath: null, d3: null, topo: null,
  });

  const [bcount, setBcount] = useState(2847);
  const [activeThreats, setActiveThreats] = useState(23);
  const [sessionAtks, setSessionAtks] = useState(0);
  const [clock, setClock] = useState("");
  const [logs, setLogs] = useState([]);

  // Clock
  useEffect(() => {
    const t = setInterval(() => {
      setClock(new Date().toISOString().slice(0, 19).replace("T", " "));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  // Stats tickers
  useEffect(() => {
    const t1 = setInterval(() => {
      stateRef.current.bcount += Math.floor(Math.random() * 3);
      setBcount(stateRef.current.bcount);
    }, 2200);
    const t2 = setInterval(() => {
      setActiveThreats(18 + Math.floor(Math.random() * 12));
    }, 4000);
    return () => { clearInterval(t1); clearInterval(t2); };
  }, []);

  function addLog(src, dst) {
    const msg = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)](src.id, dst.id);
    const ts = new Date().toTimeString().slice(0, 8);
    setLogs((prev) => [{ ts, sev: src.sev, msg, id: Date.now() + Math.random() }, ...prev].slice(0, 5));
  }

  function spawnAttack() {
    const S = stateRef.current;
    const route = ATTACK_ROUTES[Math.floor(Math.random() * ATTACK_ROUTES.length)];
    const src = nmap[route.src], dst = nmap[route.dst];
    if (!S.proj) return;

    const [x1, y1] = S.proj([src.lon, src.lat]);
    const [x2, y2] = S.proj([dst.lon, dst.lat]);
    const cpx = (x1 + x2) / 2;
    const cpy = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.28 - 20;

    S.shockwaves.push({ x: x1, y: y1, col: src.col, age: 0, maxAge: 42 });
    S.arcTrails.push({ x1, y1, x2, y2, cpx, cpy, col: src.col, age: 0, maxAge: 110, w: route.w });
    S.beams.push({ x1, y1, x2, y2, cpx, cpy, col: src.col, age: 0, maxAge: 72, w: route.w, srcId: route.src, dstId: route.dst });

    addLog(src, dst);
    S.sessionAtks++;
    setSessionAtks(S.sessionAtks);
  }

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const W = 900, H = 460;
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");
    const S = stateRef.current;
    let rafId, spawnTimer;

    // Load D3 + TopoJSON dynamically
    Promise.all([
      import("https://cdn.jsdelivr.net/npm/d3@7/+esm"),
      import("https://cdn.jsdelivr.net/npm/topojson-client@3/+esm"),
    ]).then(([d3, topo]) => {
      S.d3 = d3; S.topo = topo;
      S.proj = d3.geoNaturalEarth1().scale(148).translate([W / 2, H / 2 + 10]);
      S.gpath = d3.geoPath().context(ctx).projection(S.proj);

      fetch("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json")
        .then((r) => r.json())
        .then((data) => { S.worldData = data; })
        .catch(() => {});

      // Spawn attacks
      for (let i = 0; i < 3; i++) setTimeout(spawnAttack, i * 400);
      spawnTimer = setInterval(() => {
        const n = 1 + Math.floor(Math.random() * 2);
        for (let i = 0; i < n; i++) setTimeout(spawnAttack, i * 220);
      }, 1200);

      function drawFrame() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "#05080f";
        ctx.fillRect(0, 0, W, H);

        // Graticule
        const grat = d3.geoGraticule()();
        ctx.beginPath(); S.gpath(grat);
        ctx.strokeStyle = "rgba(60,100,150,0.06)";
        ctx.lineWidth = 0.4; ctx.stroke();

        // Countries
        if (S.worldData) {
          const countries = topo.feature(S.worldData, S.worldData.objects.countries);
          ctx.beginPath(); S.gpath(countries);
          ctx.fillStyle = "rgba(22,48,82,0.65)"; ctx.fill();
          ctx.strokeStyle = "rgba(50,90,150,0.22)";
          ctx.lineWidth = 0.35; ctx.stroke();
          const borders = topo.mesh(S.worldData, S.worldData.objects.countries, (a, b) => a !== b);
          ctx.beginPath(); S.gpath(borders);
          ctx.strokeStyle = "rgba(70,120,190,0.14)";
          ctx.lineWidth = 0.25; ctx.stroke();
        }

        // Sphere
        ctx.beginPath(); S.gpath({ type: "Sphere" });
        ctx.strokeStyle = "rgba(60,110,170,0.1)";
        ctx.lineWidth = 0.8; ctx.stroke();

        // Scan line
        S.scanY = (S.scanY + 0.35) % H;
        const sg = ctx.createLinearGradient(0, S.scanY - 10, 0, S.scanY + 10);
        sg.addColorStop(0, "rgba(80,160,220,0)");
        sg.addColorStop(0.5, "rgba(80,160,220,0.04)");
        sg.addColorStop(1, "rgba(80,160,220,0)");
        ctx.fillStyle = sg; ctx.fillRect(0, S.scanY - 10, W, 20);

        // Arc trails
        S.arcTrails = S.arcTrails.filter((a) => a.age < a.maxAge);
        S.arcTrails.forEach((a) => {
          a.age++;
          const fade = Math.max(0, 1 - a.age / a.maxAge);
          ctx.beginPath();
          ctx.moveTo(a.x1, a.y1);
          ctx.quadraticCurveTo(a.cpx, a.cpy, a.x2, a.y2);
          ctx.strokeStyle = rc(a.col, fade * 0.18);
          ctx.lineWidth = a.w;
          ctx.setLineDash([5, 5]);
          ctx.lineDashOffset = -a.age * 1.2;
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // Shockwaves
        S.shockwaves = S.shockwaves.filter((s) => s.age < s.maxAge);
        S.shockwaves.forEach((s) => {
          s.age++;
          const prog = s.age / s.maxAge;
          const rad = 4 + prog * 28;
          const fade = (1 - prog) * 0.7;
          ctx.beginPath(); ctx.arc(s.x, s.y, rad, 0, Math.PI * 2);
          ctx.strokeStyle = rc(s.col, fade);
          ctx.lineWidth = 1.2; ctx.stroke();
          if (s.age < s.maxAge * 0.5) {
            ctx.beginPath(); ctx.arc(s.x, s.y, rad * 0.5, 0, Math.PI * 2);
            ctx.strokeStyle = rc(s.col, fade * 0.5);
            ctx.lineWidth = 0.7; ctx.stroke();
          }
        });

        // Beams
        S.beams = S.beams.filter((b) => b.age < b.maxAge);
        S.beams.forEach((b) => {
          b.age++;
          const t = b.age / b.maxAge;
          const [hx, hy] = qbp(b.x1, b.y1, b.cpx, b.cpy, b.x2, b.y2, t);
          for (let i = 0; i < 10; i++) {
            const tt = Math.max(0, t - i * 0.016);
            const [tx, ty] = qbp(b.x1, b.y1, b.cpx, b.cpy, b.x2, b.y2, tt);
            ctx.beginPath(); ctx.arc(tx, ty, 2.5 * (1 - i / 10), 0, Math.PI * 2);
            ctx.fillStyle = rc(b.col, (1 - i / 10) * 0.8); ctx.fill();
          }
          ctx.beginPath(); ctx.arc(hx, hy, 6, 0, Math.PI * 2);
          ctx.fillStyle = rc(b.col, 0.12); ctx.fill();
          ctx.beginPath(); ctx.arc(hx, hy, 3.2, 0, Math.PI * 2);
          ctx.fillStyle = rc(b.col, 0.5); ctx.fill();
          ctx.beginPath(); ctx.arc(hx, hy, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = rc(b.col, 1.0); ctx.fill();
          if (b.age === b.maxAge - 1) {
            S.explosions.push({ x: b.x2, y: b.y2, col: b.col, age: 0, maxAge: 58 });
            S.floatingTxt.push({ x: b.x2, y: b.y2 - 10, col: b.col, age: 0, maxAge: 62 });
            S.bcount++;
            setBcount(S.bcount);
          }
        });

        // Explosions
        S.explosions = S.explosions.filter((e) => e.age < e.maxAge);
        S.explosions.forEach((e) => {
          e.age++;
          const prog = e.age / e.maxAge;
          for (let ring = 0; ring < 3; ring++) {
            const rp = Math.max(0, prog - ring * 0.15);
            if (rp <= 0) continue;
            ctx.beginPath(); ctx.arc(e.x, e.y, 3 + rp * 34, 0, Math.PI * 2);
            ctx.strokeStyle = rc(e.col, (1 - rp) * 0.6);
            ctx.lineWidth = 1.5 - ring * 0.4; ctx.stroke();
          }
          if (e.age < 22) {
            for (let i = 0; i < 8; i++) {
              const angle = (i / 8) * Math.PI * 2;
              const dist = prog * 24;
              ctx.beginPath();
              ctx.arc(e.x + Math.cos(angle) * dist, e.y + Math.sin(angle) * dist, 1.3, 0, Math.PI * 2);
              ctx.fillStyle = rc(e.col, (1 - prog) * 0.8); ctx.fill();
            }
          }
          if (prog < 0.3) {
            ctx.beginPath(); ctx.arc(e.x, e.y, 4 * (1 - prog / 0.3), 0, Math.PI * 2);
            ctx.fillStyle = rc(e.col, (1 - prog / 0.3) * 0.55); ctx.fill();
          }
        });

        // Floating text
        S.floatingTxt = S.floatingTxt.filter((f) => f.age < f.maxAge);
        S.floatingTxt.forEach((f) => {
          f.age++;
          const fade = f.age < 10 ? f.age / 10 : Math.max(0, 1 - (f.age - 10) / (f.maxAge - 10));
          ctx.font = '600 8px "Share Tech Mono", monospace';
          ctx.fillStyle = rc(f.col, fade * 0.9);
          ctx.textAlign = "center";
          ctx.fillText("+1 breach", f.x, f.y - f.age * 0.4);
        });

        // Nodes
        NODES.forEach((n) => {
          const [x, y] = S.proj([n.lon, n.lat]);
          const pulse = 0.5 + 0.5 * Math.sin(Date.now() * 0.002 + n.lon * 0.15);
          ctx.beginPath(); ctx.arc(x, y, n.r * 3.5 + pulse * 2, 0, Math.PI * 2);
          ctx.fillStyle = rc(n.col, 0.06 + pulse * 0.03); ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, n.r, 0, Math.PI * 2);
          ctx.fillStyle = rc(n.col, 0.85); ctx.fill();
          ctx.beginPath(); ctx.arc(x, y, n.r + 3, 0, Math.PI * 2);
          ctx.strokeStyle = rc(n.col, 0.25);
          ctx.lineWidth = 0.7; ctx.stroke();
          ctx.font = '700 8px "Share Tech Mono", monospace';
          ctx.fillStyle = rc(n.col, 0.85);
          ctx.textAlign = "center";
          ctx.fillText(`${n.id} · ${n.count}`, x, y - n.r - 5);
        });

        rafId = requestAnimationFrame(drawFrame);
      }

      rafId = requestAnimationFrame(drawFrame);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearInterval(spawnTimer);
    };
  }, []);

  const sevColor = { cr: "rgba(220,60,60,0.85)", hi: "rgba(210,120,40,0.8)", me: "rgba(180,155,35,0.75)", lo: "rgba(55,165,95,0.7)" };

  return (
    <div style={{ background: "#05080f", borderRadius: 14, overflow: "hidden", fontFamily: "'Share Tech Mono', monospace", border: "1px solid rgba(80,140,200,0.1)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid rgba(80,140,200,0.1)" }}>
        <span style={{ color: "rgba(120,180,240,0.65)", fontSize: 11, letterSpacing: 3 }}>GLOBAL THREAT INTELLIGENCE</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9, color: "rgba(70,190,120,0.7)", letterSpacing: 2 }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#46be78", display: "inline-block", animation: "blink 1.6s ease-in-out infinite" }} />
          LIVE &nbsp;
          <span style={{ color: "rgba(60,90,120,0.5)" }}>{clock}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 1, background: "rgba(80,140,200,0.07)", borderBottom: "1px solid rgba(80,140,200,0.07)" }}>
        {[
          { val: bcount.toLocaleString(), label: "TOTAL BREACHES",  color: "rgba(220,60,60,0.8)"   },
          { val: activeThreats,           label: "ACTIVE THREATS",  color: "rgba(210,120,40,0.75)" },
          { val: 61,                      label: "COUNTRIES HIT",   color: "rgba(80,150,220,0.7)"  },
          { val: "LIVE",                  label: "FEED STATUS",     color: "rgba(55,165,95,0.7)"   },
        ].map((s, i) => (
          <div key={i} style={{ background: "#05080f", padding: "9px 12px", textAlign: "center" }}>
            <div style={{ fontSize: 16, letterSpacing: 1, fontWeight: 700, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 8, color: "rgba(80,120,160,0.45)", letterSpacing: 2, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map canvas */}
      <div style={{ position: "relative" }}>
        <canvas ref={canvasRef} style={{ display: "block", width: "100%" }} />
      </div>

      {/* Legend + session count */}
      <div style={{ borderTop: "1px solid rgba(80,140,200,0.07)", padding: "8px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {[["rgba(220,60,60,0.9)", "CRITICAL"], ["rgba(210,120,40,0.85)", "HIGH"], ["rgba(180,155,35,0.8)", "MEDIUM"], ["rgba(55,165,95,0.75)", "LOW"], ["rgba(80,150,220,0.7)", "MONITORED"]].map(([c, l]) => (
            <div key={l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 8, color: "rgba(80,120,160,0.55)", letterSpacing: 1 }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: c }} />
              {l}
            </div>
          ))}
        </div>
        <div style={{ fontSize: 8, color: "rgba(60,90,120,0.4)", letterSpacing: 1 }}>{sessionAtks} ATTACKS THIS SESSION</div>
      </div>

      {/* Log */}
      <div style={{ padding: "8px 16px 12px", borderTop: "1px solid rgba(80,140,200,0.06)" }}>
        <div style={{ fontSize: 8, color: "rgba(80,110,150,0.35)", letterSpacing: 3, marginBottom: 6 }}>LIVE THREAT LOG</div>
        {logs.map((log) => (
          <div key={log.id} style={{ fontSize: 9, color: "rgba(100,140,180,0.5)", display: "flex", gap: 8, lineHeight: 1.7 }}>
            <span style={{ color: "rgba(60,90,120,0.4)", minWidth: 58 }}>{log.ts}</span>
            <span style={{ color: sevColor[log.sev] }}>[{log.sev.toUpperCase()}]</span>
            <span>{log.msg}</span>
          </div>
        ))}
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}`}</style>
    </div>
  );
}