import { useEffect, useMemo, useState } from "react";
import { COLORS } from "../theme/colors.js";

function GlassCard({ glow = COLORS.accent, hover = true, style, children }) {
  return (
    <div
      className={hover ? "cq-hoverLift" : undefined}
      style={{
        position: "relative",
        background: "rgba(15, 22, 41, 0.82)",
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        backdropFilter: "blur(14px)",
        boxShadow: `0 0 0 1px ${glow}14, 0 18px 60px rgba(0,0,0,0.25)`,
        ...style
      }}
    >
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle, color, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
        <div style={{ fontFamily: "'Orbitron', monospace", fontWeight: 900, letterSpacing: 2, color, fontSize: 14 }}>
          {icon} {title}
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: 13 }}>{subtitle}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span className="cq-glowPulse" style={{ width: 8, height: 8, borderRadius: 999, background: color, boxShadow: `0 0 10px ${color}` }} />
        <span style={{ fontFamily: "'Orbitron', monospace", fontSize: 11, letterSpacing: 2, color }}>LIVE</span>
      </div>
    </div>
  );
}

export default function ThreatMap() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((p) => p + 1), 2000);
    return () => clearInterval(t);
  }, []);

  const hotspots = useMemo(
    () => [
      { x: 440, y: 62, color: "#FF3B3B", label: "RU", count: 847 + (tick % 3) },
      { x: 488, y: 74, color: "#F97316", label: "CN", count: 623 + (tick % 2) },
      { x: 108, y: 94, color: "#3B82F6", label: "US", count: 412 },
      { x: 318, y: 64, color: "#00FFB2", label: "DE", count: 198 },
      { x: 425, y: 118, color: "#F59E0B", label: "IN", count: 156 + (tick % 4) },
      { x: 510, y: 190, color: "#A78BFA", label: "AU", count: 89 }
    ],
    [tick]
  );

  return (
    <div>
      <SectionHeader title="Threat Map" subtitle="Global breach activity — live simulation" color="#FF3B3B" icon="◬" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginBottom: 16 }}>
        {[
          { val: "2,236", label: "Total Breaches", color: "#FF3B3B" },
          { val: "47", label: "Countries", color: "#F97316" },
          { val: "12", label: "Active Threats", color: "#3B82F6" },
          { val: "LIVE", label: "Feed Status", color: "#00FFB2" }
        ].map((s, i) => (
          <GlassCard key={i} glow={s.color} style={{ padding: "14px 16px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Orbitron', monospace", fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 2, marginTop: 4 }}> {s.label.toUpperCase()}</div>
          </GlassCard>
        ))}
      </div>

      <GlassCard glow="#FF3B3B" hover={false} style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg, #FF3B3B, #F97316, #F59E0B)", borderRadius: "16px 16px 0 0" }} />

        <div style={{ padding: "14px 18px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 3, fontFamily: "'Orbitron', monospace" }}>GLOBAL ATTACK MAP</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF3B3B", boxShadow: "0 0 10px #FF3B3B", display: "inline-block" }} className="cq-glowPulse" />
            <span style={{ fontSize: 10, color: "#FF3B3B", fontFamily: "'Orbitron', monospace", letterSpacing: 2 }}>LIVE</span>
          </div>
        </div>

        <svg width="100%" viewBox="0 0 680 320" style={{ display: "block", padding: "0 8px 16px" }}>
          <rect width="680" height="320" fill="rgba(0,0,0,0)" />

          {/* Grid */}
          {[80, 160, 240].map((y) => (
            <line key={y} x1="0" y1={y} x2="680" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          ))}
          {[170, 340, 510].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="320" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          ))}

          {/* Continents (stylized) */}
          <path d="M55,65 Q90,50 140,55 L160,75 L165,110 L150,140 L120,155 L90,158 L65,145 L52,120 Z" fill="#0F172A" stroke="rgba(0,255,178,0.15)" strokeWidth="1" />
          <path d="M118,162 L148,158 L162,180 L165,210 L152,240 L128,255 L108,248 L98,220 L102,192 Z" fill="#0F172A" stroke="rgba(0,255,178,0.15)" strokeWidth="1" />
          <path d="M293,52 L350,48 L355,72 L337,82 L295,77 Z" fill="#0F172A" stroke="rgba(0,255,178,0.1)" strokeWidth="1" />
          <path d="M300,88 L345,83 L352,95 L355,140 L340,168 L318,175 L296,160 L287,135 L290,108 Z" fill="#0F172A" stroke="rgba(0,255,178,0.1)" strokeWidth="1" />
          <path d="M346,42 L440,37 L510,55 L522,80 L500,98 L458,104 L415,94 L375,88 L352,70 Z" fill="#0F172A" stroke="rgba(0,255,178,0.12)" strokeWidth="1" />
          <path d="M416,102 L444,98 L450,125 L438,148 L418,152 L406,134 L408,112 Z" fill="#0F172A" stroke="rgba(0,255,178,0.12)" strokeWidth="1" />
          <path d="M488,175 L535,170 L548,188 L542,218 L516,228 L488,218 L478,198 Z" fill="#0F172A" stroke="rgba(0,255,178,0.1)" strokeWidth="1" />

          {/* Attack arcs */}
          {[
            { x1: 440, y1: 62, x2: 110, y2: 94, color: "#FF3B3B" },
            { x1: 488, y1: 74, x2: 318, y2: 64, color: "#F97316" },
            { x1: 318, y1: 64, x2: 425, y2: 118, color: "#3B82F6" }
          ].map((arc, i) => (
            <path
              key={i}
              d={`M${arc.x1},${arc.y1} Q${(arc.x1 + arc.x2) / 2},${Math.min(arc.y1, arc.y2) - 50} ${arc.x2},${arc.y2}`}
              fill="none"
              stroke={arc.color}
              strokeWidth="0.8"
              strokeDasharray="5 4"
              opacity="0.55"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-60" dur={`${1.5 + i * 0.4}s`} repeatCount="indefinite" />
            </path>
          ))}

          {/* Hotspots */}
          {hotspots.map((h, i) => (
            <g key={i}>
              <circle cx={h.x} cy={h.y} r="22" fill={h.color} opacity="0.05">
                <animate attributeName="r" values="14;26;14" dur={`${1.8 + i * 0.3}s`} repeatCount="indefinite" />
              </circle>
              <circle cx={h.x} cy={h.y} r="5" fill={h.color} style={{ filter: `drop-shadow(0 0 6px ${h.color})` }} />
              <text x={h.x} y={h.y - 14} textAnchor="middle" fill={h.color} fontSize="9" fontFamily="monospace" letterSpacing="1" fontWeight="bold">
                {h.label} {h.count}
              </text>
            </g>
          ))}

          {/* Scan line */}
          <rect x="0" y="0" width="680" height="3" fill="#00FFB2" opacity="0.04">
            <animate attributeName="y" from="-3" to="320" dur="4s" repeatCount="indefinite" />
          </rect>
        </svg>

        <div style={{ padding: "8px 18px 16px", display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[{ c: "#FF3B3B", l: "Critical" }, { c: "#F97316", l: "High" }, { c: "#3B82F6", l: "Medium" }, { c: "#00FFB2", l: "Low" }].map((item, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: item.c, boxShadow: `0 0 6px ${item.c}` }} />
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{item.l}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

