// ============================================================
//  MORAL MAPS — Centrale Landing
//  Bestand: src/MapsLanding.jsx
//  Deployment: moral-maps.vercel.app (root)
//
//  Gebruik: vervang de huidige Landing-component in MoralMaps.jsx
//  door dit bestand, of importeer het als aparte route.
// ============================================================

import { useState } from "react";

const FONT_DISPLAY = "'Playfair Display', Georgia, serif";
const FONT_BODY    = "'DM Sans', system-ui, sans-serif";

const PARTS = [
  {
    num: "01",
    tag: "The Beginning",
    title: "Moral Maps",
    subtitle: "Wie ben je?",
    desc: "Breng je waarden in kaart, smeed je moreel kompas en navigeer je eerste dilemma's. De reis begint met zelfkennis.",
    duration: "± 25 min",
    url: "https://moral-maps.vercel.app",
    accent: "#1d9e75",
    accentDim: "rgba(29,158,119,.15)",
    accentBorder: "rgba(29,158,119,.3)",
    icon: "🗺",
  },
  {
    num: "02",
    tag: "Crossroads",
    title: "Moral Maps 2",
    subtitle: "Wat is je route?",
    desc: "Je staat op een kruispunt. Kies bewust je afslagen, bewaar je energie en houd koers — ook als de weg onduidelijk is.",
    duration: "± 30 min",
    url: "https://moral-maps-2-crossroads.vercel.app",
    accent: "#ef9f27",
    accentDim: "rgba(239,159,39,.15)",
    accentBorder: "rgba(239,159,39,.3)",
    icon: "🛣",
  },
  {
    num: "03",
    tag: "Final Destination",
    title: "Moral Maps 3",
    subtitle: "Waar ga je naartoe?",
    desc: "Kijk terug, kijk vooruit. Activeer je persoonlijke morele GPS en maak je route concreet richting wie je wilt zijn.",
    duration: "± 35 min",
    url: "https://moral-maps-3-final-destination.vercel.app",
    accent: "#d4537e",
    accentDim: "rgba(212,83,126,.15)",
    accentBorder: "rgba(212,83,126,.3)",
    icon: "🏁",
  },
];

export default function MapsLanding({ onStart, onResume, onStartDeel2 }) {
  const [code, setCode] = useState("");
  const [hover, setHover] = useState(null);

  function handleStart(url) {
    if (url === PARTS[0].url && onStart) {
      // Deel 1: gebruik interne app-navigatie
      if (code.trim()) onStart(code.trim().toUpperCase(), null, null);
      else onStart("", null, null);
    } else {
      // Deel 2 of 3: navigeer naar externe URL
      const dest = code.trim()
        ? `${url}?code=${encodeURIComponent(code.trim().toUpperCase())}`
        : url;
      window.location.href = dest;
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080d16", fontFamily: FONT_BODY, color: "#e2e8f0", overflowX: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .anim-1 { animation: fadeUp .7s ease both; }
        .anim-2 { animation: fadeUp .7s .15s ease both; }
        .anim-3 { animation: fadeUp .7s .3s ease both; }
        .anim-4 { animation: fadeUp .7s .45s ease both; }
        .pulse { animation: pulse 2.5s ease-in-out infinite; }
        .float { animation: float 6s ease-in-out infinite; }
      `}</style>

      {/* Achtergrond grid */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)",
        backgroundSize: "52px 52px",
      }}/>

      {/* Glow links boven */}
      <div style={{
        position: "fixed", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(29,158,119,.12), transparent 70%)",
        top: -150, left: -150, pointerEvents: "none", zIndex: 0,
      }}/>

      {/* Glow rechts onder */}
      <div style={{
        position: "fixed", width: 400, height: 400, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(212,83,126,.08), transparent 70%)",
        bottom: -100, right: -100, pointerEvents: "none", zIndex: 0,
      }}/>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 860, margin: "0 auto", padding: "0 24px 80px" }}>

        {/* ── HERO ── */}
        <section style={{ paddingTop: 72, paddingBottom: 64, display: "grid", gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }}>

          {/* Linker kolom — tekst */}
          <div>
            <div className="anim-1" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "rgba(29,158,119,.12)", border: "1px solid rgba(29,158,119,.25)",
              borderRadius: 99, padding: "6px 18px", marginBottom: 28,
              fontSize: 11, fontWeight: 700, letterSpacing: 2, color: "#5dcaa5", textTransform: "uppercase",
            }}>
              <span className="pulse" style={{ width: 7, height: 7, borderRadius: "50%", background: "#1d9e75", display: "inline-block" }}/>
              Een reis in drie delen
            </div>

            <h1 className="anim-2" style={{
              fontFamily: FONT_DISPLAY, fontSize: "clamp(38px, 5vw, 64px)",
              fontWeight: 900, lineHeight: 1.05, letterSpacing: -2.5, marginBottom: 20,
              color: "#f1f5f9",
            }}>
              Moral Maps —<br/>
              <em style={{ color: "#1d9e75", fontStyle: "italic" }}>Jouw Reis</em><br/>
              in 3 Delen
            </h1>

            <p className="anim-3" style={{
              fontSize: 16, color: "#94a3b8", lineHeight: 1.85, marginBottom: 14,
            }}>
              <em style={{ fontFamily: FONT_DISPLAY, color: "#cbd5e1", fontSize: 17 }}>
                "Elke reis begint met een vraag: wie ben ik, en waar ga ik naartoe?"
              </em>
            </p>

            <p className="anim-3" style={{
              fontSize: 14, color: "#64748b", lineHeight: 1.8, marginBottom: 36, maxWidth: 420,
            }}>
              In drie delen ontdek je je startpositie, navigeer je door kruispunten,
              en bepaal je je bestemming — bewust, vanuit je eigen innerlijke GPS.
            </p>

            {/* Groepscode invoer */}
            <div className="anim-4" style={{
              display: "inline-flex", gap: 10, background: "rgba(255,255,255,.04)",
              border: "1px solid rgba(255,255,255,.08)", borderRadius: 16,
              padding: 12, marginBottom: 12,
            }}>
              <input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="Groepscode (optioneel)"
                style={{
                  background: "rgba(0,0,0,.3)", border: `1.5px solid ${code.trim() ? "rgba(29,158,119,.5)" : "rgba(255,255,255,.08)"}`,
                  borderRadius: 10, padding: "10px 16px", color: "#e2e8f0",
                  fontSize: 14, outline: "none", fontFamily: "'DM Mono', monospace",
                  letterSpacing: 1.5, width: 200, transition: "border .2s",
                }}
              />
              <button
                onClick={() => handleStart(PARTS[0].url)}
                style={{
                  background: "#1d9e75", border: "none", borderRadius: 10,
                  padding: "10px 20px", color: "#fff", fontWeight: 700,
                  fontSize: 14, cursor: "pointer", fontFamily: FONT_BODY,
                  boxShadow: "0 4px 20px rgba(29,158,119,.4)", whiteSpace: "nowrap",
                }}
              >
                Begin bij Deel 1 →
              </button>
            </div>

            <p style={{ fontSize: 11, color: "#334155" }}>
              🔒 Anoniem · geen login · alleen groepscode wordt opgeslagen
            </p>
          </div>

          {/* Rechter kolom — GPS telefoon mockup */}
          <div className="anim-2" style={{ flexShrink: 0 }}>
            <div className="float" style={{
              width: 200, height: 400,
              background: "linear-gradient(170deg, #1e293b, #0f172a)",
              borderRadius: 32, border: "2px solid #2d3f55",
              boxShadow: "0 40px 80px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.06)",
              padding: 9, flexShrink: 0,
            }}>
              {/* Notch */}
              <div style={{ width: 64, height: 16, background: "#0a0f1e", borderRadius: 99, margin: "0 auto 6px", border: "1px solid #1e2d3d" }}/>
              {/* Scherm */}
              <div style={{ background: "#f8fafc", borderRadius: 22, height: 348, overflow: "hidden", position: "relative" }}>
                {/* Grid achtergrond */}
                <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px)", backgroundSize: "16px 16px" }}/>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(248,250,252,.97))" }}/>
                {/* Header balk */}
                <div style={{ position: "relative", zIndex: 2, background: "#fff", margin: "7px 7px 0", borderRadius: 10, padding: "6px 10px", boxShadow: "0 2px 8px rgba(0,0,0,.1)", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10 }}>🧭</span>
                  <span style={{ fontSize: 9, fontWeight: 800, color: "#1d9e75", flex: 1 }}>Moral Maps</span>
                  <span style={{ fontSize: 8, color: "#94a3b8", fontWeight: 600 }}>3 delen</span>
                </div>
                {/* GPS route stops */}
                <div style={{ position: "relative", zIndex: 2, padding: "8px 10px 0" }}>
                  {[
                    { icon: "🗺", label: "The Beginning",    color: "#1d9e75", time: "25 min" },
                    { icon: "🛣", label: "Crossroads",       color: "#ef9f27", time: "30 min" },
                    { icon: "🏁", label: "Final Destination",color: "#d4537e", time: "35 min" },
                  ].map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{s.icon}</div>
                        {i < 2 && <div style={{ width: 2, height: 16, background: `${s.color}50`, margin: "2px 0" }}/>}
                      </div>
                      <div style={{ paddingTop: 3 }}>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "#1e293b", margin: 0 }}>{s.label}</p>
                        <p style={{ fontSize: 8, color: "#94a3b8", margin: "1px 0 0" }}>{s.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {/* GPS bestemming balk */}
                <div style={{ position: "absolute", bottom: 8, left: 7, right: 7, background: "linear-gradient(135deg, #1d9e75, #0f6e56)", borderRadius: 10, padding: "7px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "#fff", fontSize: 9, fontWeight: 800 }}>Jouw bestemming</span>
                  <span style={{ color: "rgba(255,255,255,.7)", fontSize: 8, fontWeight: 600 }}>±90 min</span>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ── DRIE DELEN ── */}
        <section>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
            {PARTS.map((p, i) => (
              <div
                key={i}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{
                  background: hover === i ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.03)",
                  border: `1px solid ${hover === i ? p.accentBorder : "rgba(255,255,255,.07)"}`,
                  borderRadius: 20, padding: 28, position: "relative", overflow: "hidden",
                  transition: "all .25s", cursor: "default",
                  transform: hover === i ? "translateY(-4px)" : "none",
                }}
              >
                {/* Groot achtergrond-nummer */}
                <div style={{
                  position: "absolute", right: 16, top: 8,
                  fontFamily: FONT_DISPLAY, fontSize: 88, fontWeight: 900,
                  color: p.accent, opacity: .06, lineHeight: 1, pointerEvents: "none",
                  userSelect: "none",
                }}>
                  {p.num}
                </div>

                {/* Icon */}
                <div className="float" style={{
                  fontSize: 32, marginBottom: 16, display: "inline-block",
                  animationDelay: `${i * 0.8}s`,
                }}>{p.icon}</div>

                {/* Tag */}
                <div style={{
                  fontSize: 10, fontWeight: 700, letterSpacing: 2,
                  textTransform: "uppercase", color: p.accent, marginBottom: 8,
                }}>{p.tag}</div>

                {/* Titel */}
                <h2 style={{
                  fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700,
                  color: "#f1f5f9", marginBottom: 4, letterSpacing: -.3,
                }}>{p.title}</h2>

                {/* Subtitel */}
                <p style={{
                  fontSize: 13, fontWeight: 700, color: p.accent,
                  marginBottom: 12, fontStyle: "italic", fontFamily: FONT_DISPLAY,
                }}>{p.subtitle}</p>

                {/* Beschrijving */}
                <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75, marginBottom: 20 }}>
                  {p.desc}
                </p>

                {/* Tijdsduur */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  borderTop: "1px solid rgba(255,255,255,.06)", paddingTop: 16,
                }}>
                  <span style={{ fontSize: 11, color: "#334155", fontWeight: 600 }}>{p.duration}</span>
                  <button
                    onClick={() => handleStart(p.url)}
                    style={{
                      background: p.accentDim, border: `1px solid ${p.accentBorder}`,
                      borderRadius: 99, padding: "6px 16px", color: p.accent,
                      fontWeight: 700, fontSize: 12, cursor: "pointer",
                      fontFamily: FONT_BODY, transition: "all .15s",
                    }}
                  >
                    Start deel {p.num} →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ROUTE VISUALISATIE ── */}
        <section style={{ marginTop: 64, textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 0,
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 99, padding: "12px 24px", flexWrap: "wrap", justifyContent: "center",
          }}>
            {PARTS.map((p, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "4px 12px",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: p.accentDim, border: `1.5px solid ${p.accentBorder}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 13,
                  }}>{p.icon}</div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.accent }}>{p.tag}</span>
                </div>
                {i < PARTS.length - 1 && (
                  <div style={{
                    width: 32, height: 1,
                    background: "linear-gradient(90deg, rgba(255,255,255,.15), rgba(255,255,255,.05))",
                  }}/>
                )}
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "#1e293b", marginTop: 12 }}>
            Volg de route van begin tot bestemming · ± 90 minuten totaal
          </p>
        </section>

        {/* ── VOOR WIE ── */}
        <section style={{ marginTop: 72 }}>
          <div style={{
            background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)",
            borderRadius: 20, padding: "36px 40px",
            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32,
          }}>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#1d9e75", marginBottom: 12 }}>Voor studenten</p>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, lineHeight: 1.3 }}>
                Ontdek wie je bent<br/>als professional
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>
                Moral Maps helpt je je eigen waarden te verkennen en te verbinden aan concrete situaties in je studie en werk.
              </p>
            </div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#ef9f27", marginBottom: 12 }}>Voor professionals</p>
              <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, lineHeight: 1.3 }}>
                Durf de reis<br/>in jezelf aan
              </h3>
              <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.75 }}>
                Ben je bewust van je innerlijke GPS? Moral Maps daagt je uit om de juiste afslagen te nemen naar wie je wilt zijn.
              </p>
            </div>
          </div>
        </section>

        {/* ── DOCENTEN ── */}
        <section style={{ marginTop: 24 }}>
          <div style={{
            background: "rgba(255,255,255,.02)", border: "1px solid rgba(255,255,255,.05)",
            borderRadius: 14, padding: "18px 28px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12,
          }}>
            <p style={{ fontSize: 13, color: "#475569" }}>
              📊 <strong style={{ color: "#64748b" }}>Begeleider?</strong> Bekijk het groepsdashboard via de app zelf.
            </p>
            <button
              onClick={() => handleStart(PARTS[0].url + "?dashboard=1")}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,.1)",
                borderRadius: 99, padding: "7px 18px", color: "#64748b",
                fontWeight: 700, fontSize: 12, cursor: "pointer", fontFamily: FONT_BODY,
              }}
            >
              Open dashboard →
            </button>
          </div>
        </section>

        {/* ── FONTYS VERMELDING ── */}
        <section style={{ marginTop: 48, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,.05)", textAlign: "center" }}>
          <p style={{ fontSize: 11, color: "#1e293b", lineHeight: 1.8 }}>
            Dit project maakt deel uit van de reeks{" "}
            <strong style={{ color: "#334155" }}>Moreel Vakmanschap</strong>{" "}
            van het{" "}
            <a
              href="https://www.linkedin.com/company/lectoraat-ethisch-werken-bijdragen"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#5dcaa5", textDecoration: "none", fontWeight: 700 }}
            >
              Fontys Lectoraat Ethisch Werken
            </a>
          </p>
          <p style={{ fontSize: 10, color: "#1e293b", marginTop: 6 }}>
            Fontys HRM en TP · Richard Voddé MCC
          </p>
        </section>

      </div>
    </div>
  );
}
