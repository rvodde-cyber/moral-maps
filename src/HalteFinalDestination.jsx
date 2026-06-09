// ============================================================
//  MORAL MAPS — Tussenpagina: Halte 2 → 3
//  Bestand: src/HalteFinalDestination.jsx
//
//  Gebruik: toon dit scherm nadat een student deel 2 afrondt,
//  vóór ze doorgaan naar Final Destination.
//
//  Props:
//    groupCode  — string, de groepscode
//    onContinue — functie, wordt aangeroepen bij "Ga naar Deel 3"
// ============================================================

import { useState, useEffect } from "react";

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";

export default function HalteFinalDestination({ groupCode = "", onContinue }) {
  const [visible, setVisible] = useState(false);
  const url = groupCode
    ? `https://moral-maps-3-final-destination.vercel.app?code=${encodeURIComponent(groupCode.toUpperCase())}`
    : "https://moral-maps-3-final-destination.vercel.app";

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
      minHeight: "100vh", background: "linear-gradient(160deg, #1e2040 0%, #17193a 50%, #0f1230 100%)", fontFamily: FONT_BODY,
      color: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", overflow: "hidden", position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes starFloat {
          0%   { opacity:0; transform: translateY(0px) scale(.8); }
          50%  { opacity:1; }
          100% { opacity:0; transform: translateY(-40px) scale(1.2); }
        }
        .fade1 { animation: fadeUp .6s .1s both; }
        .fade2 { animation: fadeUp .6s .25s both; }
        .fade3 { animation: fadeUp .6s .4s both; }
        .fade4 { animation: fadeUp .6s .55s both; }
        .fade5 { animation: fadeUp .6s .7s both; }
        .star { position: absolute; font-size: 12px; animation: starFloat 3s ease-in-out infinite; }
      `}</style>

      {/* Sterren achtergrond */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        {[
          {left:"15%",top:"20%",delay:"0s"},{left:"80%",top:"15%",delay:"0.6s"},
          {left:"60%",top:"60%",delay:"1.2s"},{left:"25%",top:"70%",delay:"1.8s"},
          {left:"90%",top:"50%",delay:"0.3s"},{left:"45%",top:"30%",delay:"2.1s"},
          {left:"10%",top:"50%",delay:"1.5s"},{left:"70%",top:"80%",delay:"0.9s"},
        ].map((s, i) => (
          <div key={i} className="star" style={{ left: s.left, top: s.top, animationDelay: s.delay }}>★</div>
        ))}
        <div style={{
          position: "absolute", width: 500, height: 300, borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(212,83,126,.18), transparent 70%)",
          bottom: 0, left: "50%", transform: "translateX(-50%)",
        }}/>
        <div style={{
          position: "absolute", width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(239,159,39,.06), transparent 70%)",
          top: "20%", right: "10%",
        }}/>
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 560, width: "100%", textAlign: "center" }}>

        {/* Badge */}
        <div className="fade1" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(212,83,126,.12)", border: "1px solid rgba(212,83,126,.25)",
          borderRadius: 99, padding: "6px 18px", marginBottom: 28,
          fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#ed93b1", textTransform: "uppercase",
        }}>
          <span style={{ fontSize: 14 }}>✓</span> Deel 2 voltooid
        </div>

        {/* Hoofdtitel */}
        <h1 className="fade2" style={{
          fontFamily: FONT_DISPLAY, fontSize: "clamp(34px, 6vw, 52px)",
          fontWeight: 900, lineHeight: 1.1, letterSpacing: -1.5,
          color: "#f1f5f9", marginBottom: 16,
        }}>
          Je hebt de kruispunten<br/>
          <em style={{ color: "#d4537e", fontStyle: "italic" }}>doorstaan.</em>
        </h1>

        <p className="fade2" style={{
          fontSize: 15, color: "#64748b", lineHeight: 1.8, marginBottom: 36,
        }}>
          Je hebt keuzes gemaakt, afslagen genomen.<br/>
          Nu is het tijd om aan te komen.
        </p>

        {/* Wat komt er in deel 3 */}
        <div className="fade3" style={{
          background: "rgba(212,83,126,.06)", border: "1px solid rgba(212,83,126,.15)",
          borderRadius: 16, padding: "20px 24px", marginBottom: 32, textAlign: "left",
        }}>
          <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
              background: "rgba(212,83,126,.15)", border: "1px solid rgba(212,83,126,.3)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>🏁</div>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1.5, color: "#d4537e", textTransform: "uppercase", marginBottom: 6 }}>
                Eindbestemming — Final Destination
              </p>
              <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75 }}>
                Kijk terug op de reis die je hebt gemaakt.
                Activeer je persoonlijke morele GPS en maak concreet
                waar je naartoe wilt — bewust, vanuit wie je bent geworden.
              </p>
            </div>
          </div>
        </div>

        {/* Mijlpalen onderweg */}
        <div className="fade3" style={{
          background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 16, padding: "20px 24px", marginBottom: 32, textAlign: "left",
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, color: "#334155", textTransform: "uppercase", marginBottom: 14 }}>
            Wat je hebt gedaan
          </p>
          {[
            { icon: "🗺", label: "The Beginning", desc: "Waarden in kaart, GPS ingesteld", color: "#1d9e75" },
            { icon: "🛣", label: "Crossroads",    desc: "Kruispunten genavigeerd, koers gehouden", color: "#ef9f27" },
          ].map((s, i) => (
            <div key={i} style={{
              display: "flex", gap: 12, alignItems: "center",
              padding: "8px 0", borderBottom: i === 0 ? "1px solid rgba(255,255,255,.04)" : "none",
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: `rgba(${s.color === "#1d9e75" ? "29,158,119" : "239,159,39"},.12)`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
              }}>{s.icon}</div>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.label}</p>
                <p style={{ fontSize: 11, color: "#475569" }}>{s.desc}</p>
              </div>
              <div style={{ marginLeft: "auto", fontSize: 14, color: s.color }}>✓</div>
            </div>
          ))}
        </div>

        {/* Route indicator */}
        <div className="fade4" style={{
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 8, marginBottom: 32,
        }}>
          {[
            { label: "The Beginning", done: true,  accent: "#1d9e75" },
            { label: "Crossroads",    done: true,  accent: "#ef9f27" },
            { label: "Final Dest.",   done: false, accent: "#d4537e" },
          ].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: s.done ? s.accent : "rgba(255,255,255,.06)",
                  border: `2px solid ${s.done ? s.accent : s.accent}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, color: s.done ? "#fff" : s.accent, fontWeight: 700,
                }}>
                  {s.done ? "✓" : "3"}
                </div>
                <span style={{ fontSize: 9, color: s.done ? s.accent : s.accent, fontWeight: 700, whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && (
                <div style={{ width: 40, height: 1, background: i < 1 ? "rgba(239,159,39,.4)" : "rgba(212,83,126,.3)", marginBottom: 20 }}/>
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="fade5" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={handleGo}
            style={{
              background: "linear-gradient(135deg, #d4537e, #993556)",
              border: "none", borderRadius: 99, padding: "14px 32px",
              color: "#fff", fontWeight: 700, fontSize: 15,
              cursor: "pointer", fontFamily: FONT_BODY,
              boxShadow: "0 6px 24px rgba(212,83,126,.35)",
              transition: "transform .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
          >
            Ga naar Final Destination →
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#1e293b", marginTop: 16 }}>
          Je groepscode wordt automatisch meegenomen
        </p>

      </div>
    </div>
  );
}
