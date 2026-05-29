// ============================================================
//  MORAL MAPS — Tussenpagina: Halte 1 → 2
//  Bestand: src/HalteCrossroads.jsx
//
//  Gebruik: toon dit scherm nadat een student deel 1 afrondt,
//  vóór ze doorgaan naar Crossroads.
//
//  Props:
//    coreValues  — array van kernwaarden uit deel 1 [{name, color}]
//    groupCode   — string, de groepscode
//    onContinue  — functie, wordt aangeroepen bij "Ga naar Deel 2"
// ============================================================

import { useState, useEffect } from "react";

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";

const COLOR_MAP = {
  geel:  { solid: "#EAB308", bg: "rgba(234,179,8,.15)",   border: "rgba(234,179,8,.3)"   },
  blauw: { solid: "#3B82F6", bg: "rgba(59,130,246,.15)",  border: "rgba(59,130,246,.3)"  },
  rood:  { solid: "#F43F5E", bg: "rgba(244,63,94,.15)",   border: "rgba(244,63,94,.3)"   },
  groen: { solid: "#22C55E", bg: "rgba(34,197,94,.15)",   border: "rgba(34,197,94,.3)"   },
  wit:   { solid: "#94A3B8", bg: "rgba(148,163,184,.15)", border: "rgba(148,163,184,.3)" },
};

export default function HalteCrossroads({ coreValues = [], groupCode = "", onContinue }) {
  const [visible, setVisible] = useState(false);
  const url = groupCode
    ? `https://moral-maps-2-crossroads.vercel.app?code=${encodeURIComponent(groupCode.toUpperCase())}`
    : "https://moral-maps-2-crossroads.vercel.app";

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  function handleGo() {
    if (onContinue) onContinue();
    else window.location.href = url;
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#080d16", fontFamily: FONT_BODY,
      color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", overflow: "hidden", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes roadScroll { from { transform: translateY(0); } to { transform: translateY(48px); } }
        .fade1 { animation: fadeUp .6s .1s both; }
        .fade2 { animation: fadeUp .6s .25s both; }
        .fade3 { animation: fadeUp .6s .4s both; }
        .fade4 { animation: fadeUp .6s .55s both; }
        .fade5 { animation: fadeUp .6s .7s both; }
      `}</style>

      {/* Rijdende weg achtergrond */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{
          position: "absolute", left: "50%", top: -48, bottom: -48,
          width: 3, background: "rgba(255,255,255,.04)",
          transform: "translateX(-50%)",
        }}/>
        {[0,1,2,3,4,5,6,7].map(i => (
          <div key={i} style={{
            position: "absolute", left: "50%", width: 2, height: 20,
            background: "rgba(255,255,255,.06)", transform: "translateX(-50%)",
            top: i * 120 + (Date.now() % 120),
            animation: "roadScroll 2s linear infinite",
            animationDelay: `${i * -0.25}s`,
          }}/>
        ))}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, transparent 40%, #080d16 80%)",
        }}/>
      </div>

      {/* Glow */}
      <div style={{
        position: "fixed", width: 600, height: 300, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(239,159,39,.08), transparent 70%)",
        bottom: 0, left: "50%", transform: "translateX(-50%)",
        pointerEvents: "none", zIndex: 0,
      }}/>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 560, width: "100%", textAlign: "center" }}>

        {/* Afgeronde bestemming badge */}
        <div className="fade1" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(29,158,119,.12)", border: "1px solid rgba(29,158,119,.25)",
          borderRadius: 99, padding: "6px 18px", marginBottom: 28,
          fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#5dcaa5", textTransform: "uppercase",
        }}>
          <span style={{ fontSize: 14 }}>✓</span> Deel 1 voltooid
        </div>

        {/* Hoofdtitel */}
        <h1 className="fade2" style={{
          fontFamily: FONT_DISPLAY, fontSize: "clamp(34px, 6vw, 52px)",
          fontWeight: 900, lineHeight: 1.1, letterSpacing: -1.5,
          color: "#f1f5f9", marginBottom: 16,
        }}>
          Je kompas is<br/>
          <em style={{ color: "#ef9f27", fontStyle: "italic" }}>gekalibreerd.</em>
        </h1>

        <p className="fade2" style={{
          fontSize: 15, color: "#64748b", lineHeight: 1.8, marginBottom: 36,
        }}>
          Je weet wie je bent en wat je drijft.<br/>
          Nu wachten de kruispunten.
        </p>

        {/* Kernwaarden samenvatting */}
        {coreValues.length > 0 && (
          <div className="fade3" style={{
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)",
            borderRadius: 16, padding: "20px 24px", marginBottom: 32,
          }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#334155", textTransform: "uppercase", marginBottom: 14 }}>
              Jouw moreel kompas
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
              {coreValues.map((v, i) => {
                const c = COLOR_MAP[v.color] || COLOR_MAP.wit;
                return (
                  <div key={i} style={{
                    padding: "8px 18px", borderRadius: 99,
                    background: c.bg, border: `1px solid ${c.border}`,
                    fontSize: 13, fontWeight: 700, color: c.solid,
                  }}>
                    {v.name}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wat komt er in deel 2 */}
        <div className="fade3" style={{
          background: "rgba(239,159,39,.06)", border: "1px solid rgba(239,159,39,.15)",
          borderRadius: 16, padding: "20px 24px", marginBottom: 32, textAlign: "left",
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: "rgba(239,159,39,.15)", border: "1px solid rgba(239,159,39,.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🛣</div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#ef9f27", textTransform: "uppercase", marginBottom: 6 }}>
                Volgende halte — Crossroads
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>
                Je staat op een kruispunt. Welke afslagen neem je?
                Hoe bewaar je energie en houd je koers — ook als de weg onduidelijk is?
                In deel 2 navigeer je door de complexiteit van je leven en werk.
              </p>
            </div>
          </div>
        </div>

        {/* Route indicator */}
        <div className="fade4" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginBottom: 32,
        }}>
          {[
            { label: "The Beginning", done: true,  accent: "#1d9e75" },
            { label: "Crossroads",    done: false, accent: "#ef9f27" },
            { label: "Final Dest.",   done: false, accent: "#d4537e" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: s.done ? s.accent : "rgba(255,255,255,.06)",
                  border: `2px solid ${s.done ? s.accent : i === 1 ? s.accent : "rgba(255,255,255,.1)"}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, color: s.done ? "#fff" : i === 1 ? s.accent : "#334155",
                  fontWeight: 700,
                }}>
                  {s.done ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 9, color: s.done ? s.accent : i === 1 ? s.accent : "#1e293b", fontWeight: 700, whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div style={{ width: 40, height: 1, background: i === 0 ? "rgba(239,159,39,.3)" : "rgba(255,255,255,.06)", marginBottom: 20 }}/>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fade5" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleGo}
            style={{
              background: "linear-gradient(135deg, #ef9f27, #ba7517)",
              border: "none", borderRadius: 99, padding: "14px 32px",
              color: "#fff", fontWeight: 700, fontSize: 15,
              cursor: "pointer", fontFamily: FONT_BODY,
              boxShadow: "0 6px 24px rgba(239,159,39,.35)",
              transition: "transform .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Ga naar Crossroads →
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#1e293b", marginTop: 16 }}>
          Je groepscode wordt automatisch meegenomen
        </p>

      </div>
    </div>
  );
}
