// ============================================================
//  MORAL APS — v1
//  Bijgewerkt: Deel 1 (Vertrek) flow met neutrale terminologie
//
//  SETUP:
//  1. npm install @supabase/supabase-js
//  2. Vul SUPABASE_URL en SUPABASE_ANON_KEY in
//  3. Voer supabase_setup.sql uit in de Supabase SQL Editor
// ============================================================

import { useState, useMemo, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ── Supabase via Vite env vars (Vercel friendly) ─────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_KEY;
const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
const supabase = hasSupabaseConfig
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
// ─────────────────────────────────────────────────────────────

// ── Database functies ──────────────────────────────────────────

async function dbSave(entry) {
  if (!supabase) {
    const msg = "Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY";
    console.error("Supabase save:", msg);
    return { ok: false, error: msg };
  }
  const basePayload = {
    group_code:        entry.groupCode,
    age:               entry.age,
    core_values:       entry.coreValues,
    dilemma_responses: entry.dilemmaResponses,
    starr:             entry.starr,
    dominant_color:    entry.dominantColor,
    socialisatie:      entry.socialisatie,
  };

  // Eerst proberen met volledige payload.
  // Daarna stapsgewijs terugvallen naar oudere schema-varianten.
  const fullPayload = {
    ...basePayload,
    participant_code: entry.participantCode,
    current_stage: entry.currentStage,
  };

  const { socialisatie: _dropSocialisatie, ...payloadNoSocialisatie } = basePayload;
  const payloadStringified = {
    ...payloadNoSocialisatie,
    starr: JSON.stringify(basePayload.starr || {}),
    socialisatie: JSON.stringify(basePayload.socialisatie || {}),
  };
  const { socialisatie: _dropSocialisatie2, ...payloadStringifiedNoSocialisatie } = payloadStringified;

  const attempts = [
    fullPayload,                    // nieuwste schema
    basePayload,                    // zonder resume-kolommen
    payloadNoSocialisatie,          // zonder socialisatie-kolom
    payloadStringified,             // voor tekstkolommen i.p.v. json/jsonb
    payloadStringifiedNoSocialisatie, // minimale compatibiliteit
  ];

  let lastError = null;
  for (const payload of attempts) {
    const { error } = await supabase.from("moralmaps_results").insert(payload);
    if (!error) return { ok: true, error: null };
    lastError = error;
  }

  const message = lastError?.message || "Unknown Supabase save error";
  if (lastError) { console.error("Supabase save:", message); }
  return { ok: false, error: message };
}

async function dbLoad(groupCode) {
  if (!supabase) {
    console.error("Supabase load: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
    return [];
  }
  const { data, error } = await supabase
    .from("moralmaps_results")
    .select("*")
    .eq("group_code", groupCode.toUpperCase())
    .order("created_at", { ascending: false });
  if (error) { console.error("Supabase load:", error.message); return []; }
  return (data || []).map(r => ({
    participantCode:    r.participant_code,
    currentStage:       r.current_stage,
    groupCode:         r.group_code,
    age:               r.age,
    coreValues:        r.core_values,
    dilemmaResponses:  r.dilemma_responses,
    starr:             r.starr,
    dominantColor:     r.dominant_color,
    socialisatie:      r.socialisatie,
    ts:                new Date(r.created_at).getTime(),
  }));
}

async function dbLoadByParticipantCode(participantCode) {
  if (!supabase) {
    console.error("Supabase load: missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
    return null;
  }
  const { data, error } = await supabase
    .from("moralmaps_results")
    .select("*")
    .eq("participant_code", participantCode.toUpperCase())
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) { console.error("Supabase load by participant:", error.message); return null; }
  if (!data) return null;
  return {
    participantCode: data.participant_code,
    currentStage: data.current_stage,
    groupCode: data.group_code,
    age: data.age,
    coreValues: data.core_values || [],
    dilemmaResponses: data.dilemma_responses || [],
    starr: data.starr || {situatie:"",taak:"",actie:"",resultaat:"",reflectie:""},
    dominantColor: data.dominant_color,
    socialisatie: data.socialisatie || {primair:"",secundair:"",transcultureel:"",professioneel:"",reflectie:""},
  };
}

// ── Constants ──────────────────────────────────────────────────

const TEAL = "#1b9e77";
const TEAL_DARK = "#147a5c";
const TEAL_LIGHT = "#e6f5f0";
const TEAL_GLOW = "#1b9e7740";

const CM = {
  geel:  { bg:"#FEF9C3", border:"#EAB308", text:"#713F12", solid:"#EAB308", label:"Geel",  desc:"Macht · Belangen · Politiek",   dot:"#EAB308" },
  blauw: { bg:"#DBEAFE", border:"#3B82F6", text:"#1E3A8A", solid:"#3B82F6", label:"Blauw", desc:"Regels · Structuur · Rationeel",  dot:"#3B82F6" },
  rood:  { bg:"#FFE4E6", border:"#F43F5E", text:"#881337", solid:"#F43F5E", label:"Rood",  desc:"Mens · Relatie · Harmonie",       dot:"#F43F5E" },
  groen: { bg:"#DCFCE7", border:"#22C55E", text:"#14532D", solid:"#22C55E", label:"Groen", desc:"Leren · Groei · Dialoog",         dot:"#22C55E" },
  wit:   { bg:"#F1F5F9", border:"#94A3B8", text:"#334155", solid:"#94A3B8", label:"Wit",   desc:"Essentie · Energie · Autonomie",  dot:"#94A3B8" },
};

const VALUES = [
  {id:1,name:"Resultaatgerichtheid",color:"geel"},{id:2,name:"Invloed",color:"geel"},{id:3,name:"Daadkracht",color:"geel"},
  {id:4,name:"Strategie",color:"geel"},{id:5,name:"Onderhandelen",color:"geel"},{id:6,name:"Ambitie",color:"geel"},
  {id:7,name:"Rechtvaardigheid",color:"blauw"},{id:8,name:"Zorgvuldigheid",color:"blauw"},{id:9,name:"Transparantie",color:"blauw"},
  {id:10,name:"Objectiviteit",color:"blauw"},{id:11,name:"Discipline",color:"blauw"},{id:12,name:"Integriteit",color:"blauw"},
  {id:13,name:"Professionaliteit",color:"blauw"},{id:14,name:"Harmonie",color:"rood"},{id:15,name:"Loyaliteit",color:"rood"},
  {id:16,name:"Empathie",color:"rood"},{id:17,name:"Geborgenheid",color:"rood"},{id:18,name:"Hulpvaardigheid",color:"rood"},
  {id:19,name:"Respect",color:"rood"},{id:20,name:"Verbinding",color:"rood"},{id:21,name:"Leervermogen",color:"groen"},
  {id:22,name:"Dialoog",color:"groen"},{id:23,name:"Openheid",color:"groen"},{id:24,name:"Reflectie",color:"groen"},
  {id:25,name:"Samenwerking",color:"groen"},{id:26,name:"Nieuwsgierigheid",color:"groen"},{id:27,name:"Ontwikkeling",color:"groen"},
  {id:28,name:"Autonomie",color:"wit"},{id:29,name:"Moed",color:"wit"},{id:30,name:"Authenticiteit",color:"wit"},
  {id:31,name:"Creativiteit",color:"wit"},{id:32,name:"Zingeving",color:"wit"},{id:33,name:"Vrijheid",color:"wit"},
  {id:34,name:"Passie",color:"wit"},{id:35,name:"Intuïtie",color:"wit"},
];

const DILEMMAS = [
  {
    title:"De Meelifter",
    scenario:"Een collega doet weinig in de projectgroep, maar krijgt wel dezelfde beoordeling. De deadline nadert en het werk is nog niet af.",
    options:[
      {text:"Ik meld dit bij de leidinggevende.",color:"blauw"},
      {text:"Ik ga het gesprek aan met de collega.",color:"groen"},
      {text:"Ik accepteer het en doe het werk zelf.",color:"rood"}
    ]
  },
  {
    title:"Het Vertrouwelijke Gesprek",
    scenario:"Een collega vertelt je in vertrouwen dat ze overweegt ontslag te nemen. Je manager vraagt jou direct of je weet waarom deze collega zich anders gedraagt.",
    options:[
      {text:"Ik vertel eerlijk wat ik weet aan de manager.",color:"geel"},
      {text:"Ik houd het vertrouwen en zeg niets.",color:"rood"},
      {text:"Ik moedig de collega aan om zelf het gesprek te voeren.",color:"groen"}
    ]
  },
  {
    title:"De Fout in het Systeem",
    scenario:"Je ontdekt dat een procedure in jouw organisatie structureel nadelig uitpakt voor een kwetsbare groep cliënten. Je leidinggevende weet het, maar wil het 'niet groter maken'.",
    options:[
      {text:"Ik volg de procedure — regels zijn er niet voor niets.",color:"blauw"},
      {text:"Ik zoek intern naar medestanders en maak het bespreekbaar.",color:"groen"},
      {text:"Ik maak een uitzondering voor de betrokkenen, stil.",color:"rood"}
    ]
  },
  {
    title:"De Burn-out Collega",
    scenario:"Een collega functioneert al weken slecht. Jij weet dat ze thuis veel problemen heeft. De teamleider vraagt jou om eerlijk te zijn over haar functioneren in een evaluatiegesprek.",
    options:[
      {text:"Ik ben volledig eerlijk — ook over de problemen.",color:"blauw"},
      {text:"Ik nuanceer en bescherm haar privacy zoveel mogelijk.",color:"rood"},
      {text:"Ik stel voor om eerst met haar zelf in gesprek te gaan.",color:"groen"}
    ]
  },
];

const AGE_CATS = ["<18","18-25","26-40","41-60","60+"];
const FONT = "'DM Sans',system-ui,sans-serif";
// Centrale plek voor alle visuele assets per deel/signature-event.
const ASSET_IMAGES = {
  deel1: {
    phoneMockup: "/moral-maps-phone=art.jpg",
    smsEvent: "/sms-koud-station.jpg",
  },
  deel2: {
    phoneMockup: "/moral-maps-phone-crossroads.jpg",
    crossroadsEvent: "/crossroads-omleiding.jpg",
  },
  deel3: {
    bridgeEvent: "/brug-in-de-mist.jpg",
    phoneMockup: "/mockup-deel3-bridge.jpg",
  },
};

function generateParticipantCode(){
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "MM-";
  for(let i=0;i<6;i++) out += chars[Math.floor(Math.random()*chars.length)];
  return out;
}

const ORG_QUESTIONS = [
  { id: 1, title: "Ethische visie", subtitle: "Richting en betekenis", explanation: "In welke mate is de missie van de organisatie expliciet gekoppeld aan maatschappelijke waarde en verantwoord handelen?" },
  { id: 2, title: "Voorbeeldgedrag leiderschap", subtitle: "Walk the talk", explanation: "In welke mate laten leidinggevenden in keuzes en gedrag zien wat zij van anderen verwachten?" },
  { id: 3, title: "Psychologische veiligheid", subtitle: "Ruimte om te spreken", explanation: "In welke mate ervaren medewerkers veiligheid om dilemma's, fouten en zorgen bespreekbaar te maken?" },
  { id: 4, title: "Waarden in besluitvorming", subtitle: "Niet alleen op papier", explanation: "In welke mate worden waarden zichtbaar meegewogen naast rendement, tijd en risico?" },
  { id: 5, title: "Transparantie", subtitle: "Uitlegbaar handelen", explanation: "In welke mate worden belangrijke beslissingen helder onderbouwd en gedeeld?" },
  { id: 6, title: "Aanspreekcultuur", subtitle: "Professionele feedback", explanation: "In welke mate spreken collega's en leidinggevenden elkaar constructief aan op gedrag?" },
  { id: 7, title: "Leren van fouten", subtitle: "Van incident naar verbetering", explanation: "In welke mate worden fouten systematisch benut om processen en gedrag te verbeteren?" },
  { id: 8, title: "Rechtvaardigheid", subtitle: "Eerlijk en consistent", explanation: "In welke mate worden mensen en teams gelijkwaardig behandeld in kansen, beoordeling en beloning?" },
  { id: 9, title: "Inclusie", subtitle: "Iedere stem telt", explanation: "In welke mate wordt actief ruimte gecreeerd voor verschillende perspectieven en achtergronden?" },
  { id: 10, title: "Verantwoordelijkheid", subtitle: "Eigenaarschap op elk niveau", explanation: "In welke mate voelen professionals zich eigenaar van ethische kwaliteit in hun dagelijkse werk?" },
  { id: 11, title: "Stakeholderbewustzijn", subtitle: "Brede impact meenemen", explanation: "In welke mate wordt de impact op klanten, burgers, partners en samenleving meegewogen?" },
  { id: 12, title: "Korte vs lange termijn", subtitle: "Duurzame afwegingen", explanation: "In welke mate wordt structureel gekozen voor duurzame oplossingen boven snelle winst?" },
  { id: 13, title: "Integrale samenwerking", subtitle: "Silo's doorbreken", explanation: "In welke mate werken afdelingen samen aan gedeelde ethische en organisatorische doelen?" },
  { id: 14, title: "Signalering en opvolging", subtitle: "Melden heeft effect", explanation: "In welke mate worden signalen over risico's of misstanden serieus opgepakt en opgevolgd?" },
  { id: 15, title: "Professionele reflectie", subtitle: "Tijd voor moreel beraad", explanation: "In welke mate is er structurele ruimte voor reflectie op complexe casuistiek?" },
  { id: 16, title: "Kennis en competenties", subtitle: "Ethisch vakmanschap", explanation: "In welke mate worden medewerkers getraind in morele oordeelsvorming en professioneel handelen?" },
  { id: 17, title: "Grenzen en normen", subtitle: "Heldere kaders", explanation: "In welke mate zijn normen, grensoverschrijdend gedrag en consequenties eenduidig geformuleerd?" },
  { id: 18, title: "Datagedreven verbeteren", subtitle: "Meten is leren", explanation: "In welke mate gebruikt de organisatie data en feedback om ethisch werken te versterken?" },
  { id: 19, title: "Mensen boven systemen", subtitle: "Menselijke maat", explanation: "In welke mate blijft de menselijke maat leidend in beleid, processen en klantcontact?" },
  { id: 20, title: "Externe verantwoording", subtitle: "Open naar buiten", explanation: "In welke mate legt de organisatie actief verantwoording af over maatschappelijke en ethische keuzes?" },
  { id: 21, title: "Continue verbetering", subtitle: "Van scan naar actie", explanation: "In welke mate vertaalt de organisatie inzichten uit metingen naar een concreet verbeterplan?" },
];

// ── Privilege Wiel Data ────────────────────────────────────────

const WHEEL_SEGMENTS = [
  { id:"opleiding", label:"Opleiding (V)", icon:"🎓",
    desc:"Deze as gaat over opleidingskapitaal en toegang tot formele kansen.",
    inside:"Universiteit / HBO+",
    middle:"MBO / HAVO",
    outside:"Basisonderwijs / VSO" },
  { id:"huisvesting", label:"Huisvesting", icon:"🏘️",
    desc:"Deze as kijkt naar woonzekerheid, woonkwaliteit en eigendom.",
    inside:"Koopwoning (Vrijstaand/Stad)",
    middle:"Huurwoning (Sector)",
    outside:"Sociale huur / Onzeker" },
  { id:"sociaal_milieu", label:"Sociaal Milieu (V)", icon:"👥",
    desc:"Deze as gaat over netwerkpositie, culturele codes en sociaal kapitaal.",
    inside:"Gevestigde Bovenlaag",
    middle:"Middenklasse",
    outside:"Arbeidersmilieu" },
  { id:"huidskleur", label:"Huidskleur (V)", icon:"🌍",
    desc:"Deze as gaat over hoe huidskleur iemands behandeling in systemen kan beïnvloeden.",
    inside:"Wit",
    middle:"Lichte tinten",
    outside:"Bruin / Donker" },
  { id:"gender", label:"Gender (V)", icon:"⚧",
    desc:"Deze as gaat over gendernormen en hoe die toegang en veiligheid beïnvloeden.",
    inside:"Cis-Man",
    middle:"Cis-Vrouw",
    outside:"Trans / Non-binair" },
  { id:"seksualiteit", label:"Seksualiteit (V)", icon:"🏳️‍🌈",
    desc:"Deze as gaat over heteronormativiteit en sociale acceptatie.",
    inside:"Heteroseksueel",
    middle:"Homo / Lesbisch",
    outside:"LHBTQ+ Overig" },
  { id:"immigratie", label:"Immigratie (V)", icon:"🧳",
    desc:"Deze as gaat over migratieachtergrond en ervaren institutionele drempels.",
    inside:"In NL geboren (ouders ook)",
    middle:"2e Generatie",
    outside:"Nieuwkomer / Expats" },
  { id:"taal", label:"Taal (V)", icon:"💬",
    desc:"Deze as gaat over taalvoorsprong in onderwijs, werk en instanties.",
    inside:"NL / Engels (Moedertaal)",
    middle:"NL als tweede taal",
    outside:"Anderstalig" },
  { id:"woonregio", label:"Woonregio", icon:"🗺️",
    desc:"Deze as kijkt naar regionale toegang tot voorzieningen en kansen.",
    inside:"Stedelijk / Grote stad",
    middle:"Middelgrote stad",
    outside:"Platteland / Krimp" },
  { id:"neurodiversiteit", label:"Neurodiversiteit", icon:"🧠",
    desc:"Deze as gaat over aansluiting tussen neuroprofiel en maatschappelijke normen.",
    inside:"Neurotypisch",
    middle:"Enige divergentie",
    outside:"Ernstige divergentie" },
  { id:"beperking", label:"Beperking", icon:"♿",
    desc:"Deze as gaat over fysieke/mentale toegankelijkheid en meedoen.",
    inside:"Geen beperking",
    middle:"Lichte beperking",
    outside:"Ernstige beperking" },
  { id:"vermogen", label:"Vermogen", icon:"💶",
    desc:"Deze as gaat over financiële buffers en economische handelingsruimte.",
    inside:"Rijk / Vermogend",
    middle:"Modaal inkomen",
    outside:"Minimum / Schulden" },
  { id:"lichaamsbouw", label:"Lichaamsbouw", icon:"🧍",
    desc:"Deze as kijkt naar normbeelden rond lichaam en sociale waardering.",
    inside:"Slank / Atletisch",
    middle:"Gemiddeld",
    outside:"Groot / Dik" },
];

// ── Micro components ───────────────────────────────────────────

function Dot({color,size=9}){
  return <span style={{display:"inline-block",width:size,height:size,borderRadius:"50%",background:CM[color].dot,flexShrink:0}}/>;
}

function Spinner(){
  return(
    <div style={{display:"flex",justifyContent:"center",padding:40}}>
      <div style={{width:32,height:32,borderRadius:"50%",border:`3px solid #e2e8f0`,borderTopColor:TEAL,animation:"spin .7s linear infinite"}}/>
    </div>
  );
}

function PBar({step,pct}){
  const L=["Positie","Waarden","Kompas","Dilemma's","STARR","Rugzak","Verslag"];
  return(
    <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:"14px 20px",marginBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
        {L.map((p,i)=>(
          <div key={p} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:4,flex:1}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:i<=step?TEAL:"#f1f5f9",color:i<=step?"#fff":"#94a3b8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,boxShadow:i===step?`0 0 0 4px ${TEAL_GLOW}`:"none",transition:"all .3s"}}>{i<step?"✓":i+1}</div>
            <span style={{fontSize:9,fontWeight:600,color:i<=step?TEAL:"#94a3b8",textAlign:"center"}}>{p}</span>
          </div>
        ))}
      </div>
      <div style={{height:4,borderRadius:99,background:"#f1f5f9",overflow:"hidden"}}>
        <div style={{height:"100%",width:`${pct}%`,background:TEAL,transition:"width .6s ease"}}/>
      </div>
      <div style={{textAlign:"right",fontSize:10,fontWeight:700,color:TEAL,marginTop:4}}>{Math.round(pct)}%</div>
    </div>
  );
}

// ── Privilege Wiel Component ───────────────────────────────────

function PrivilegeWheel({onComplete}){
  const [selected, setSelected] = useState({}); // id -> "inside" | "middle" | "outside" | null
  const [activeInfo, setActiveInfo] = useState(null);
  const [showIntro, setShowIntro] = useState(true);

  const allAnswered = WHEEL_SEGMENTS.every(s => selected[s.id]);
  const answeredCount = Object.keys(selected).filter(k => selected[k]).length;

  function toggle(id, side){
    setSelected(prev => ({...prev, [id]: prev[id]===side ? null : side}));
    setActiveInfo(id);
  }

  const svgSize = 340;
  const cx = svgSize/2;
  const cy = svgSize/2;
  const outerR = 140;
  const innerR = 75;
  const labelR = 115;
  const n = WHEEL_SEGMENTS.length;
  const sliceAngle = (2*Math.PI)/n;

  function polarToXY(angle, r){
    return [cx + r*Math.cos(angle), cy + r*Math.sin(angle)];
  }

  function segmentPath(i){
    const startAngle = (i * sliceAngle) - Math.PI/2 - sliceAngle/2;
    const endAngle = startAngle + sliceAngle;
    const [x1,y1] = polarToXY(startAngle, innerR+2);
    const [x2,y2] = polarToXY(endAngle, innerR+2);
    const [x3,y3] = polarToXY(endAngle, outerR-2);
    const [x4,y4] = polarToXY(startAngle, outerR-2);
    return `M ${x1} ${y1} A ${innerR+2} ${innerR+2} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${outerR-2} ${outerR-2} 0 0 0 ${x4} ${y4} Z`;
  }

  function labelPos(i){
    const angle = (i * sliceAngle) - Math.PI/2;
    return polarToXY(angle, labelR);
  }

  if(showIntro){
    return(
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:20,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:16}}>
          <div style={{background:`linear-gradient(135deg,${TEAL},${TEAL_DARK})`,padding:"28px 28px 24px"}}>
            <div style={{fontSize:40,marginBottom:12}}>🌸</div>
            <h2 style={{color:"#fff",fontWeight:900,fontSize:22,margin:0,letterSpacing:-.5}}>Het Privilege Wiel</h2>
            <p style={{color:"rgba(255,255,255,.8)",fontSize:13,marginTop:8,lineHeight:1.7}}>Voordat je aan de reis begint, sta je even stil bij jezelf.</p>
          </div>
          <div style={{padding:"24px 28px"}}>
            <p style={{fontSize:14,color:"#334155",lineHeight:1.8,marginBottom:16}}>Dit wiel toont dertien maatschappelijke assen die samen een beeld geven van machtscentrum, middenzone en marginale zone.</p>
            <div style={{background:TEAL_LIGHT,borderRadius:12,border:`1px solid ${TEAL}40`,padding:"14px 18px",marginBottom:20}}>
              <p style={{fontSize:13,color:"#1a5c46",lineHeight:1.7,margin:0}}>
                <strong>Wat je gaat doen:</strong> Klik per segment op de positie die het meest op jou van toepassing is. Er zijn geen goede of foute antwoorden — dit is een persoonlijk reflectiemoment.
              </p>
            </div>
            <div style={{background:"#f8fafc",borderRadius:10,border:"1px solid #e2e8f0",padding:"12px 16px",marginBottom:24}}>
              <p style={{fontSize:12,color:"#64748b",lineHeight:1.6,margin:0}}>🔒 <strong>Anoniem:</strong> Jouw keuzes in dit scherm worden niet opgeslagen in de database. Het wiel dient alleen als bewustwordingsmoment voor jou persoonlijk.</p>
            </div>
            <button onClick={()=>setShowIntro(false)} style={{width:"100%",padding:"13px",borderRadius:99,border:"none",background:TEAL,color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",boxShadow:`0 4px 20px ${TEAL_GLOW}`,fontFamily:FONT}}>
              Bekijk het wiel →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeSegment = activeInfo ? WHEEL_SEGMENTS.find(s=>s.id===activeInfo) : null;
  const scoreMap = { inside: 3, middle: 2, outside: 1 };
  const radarSize = 320;
  const radarCx = radarSize / 2;
  const radarCy = radarSize / 2;
  const radarMaxR = 110;
  const radarLevels = [1, 2, 3];

  function radarPoint(i, score){
    const angle = ((2 * Math.PI) / WHEEL_SEGMENTS.length) * i - Math.PI / 2;
    const radius = (score / 3) * radarMaxR;
    return [
      radarCx + Math.cos(angle) * radius,
      radarCy + Math.sin(angle) * radius
    ];
  }

  const radarPolygon = WHEEL_SEGMENTS
    .map((seg, i) => {
      const score = scoreMap[selected[seg.id]] || 0;
      const [x, y] = radarPoint(i, score);
      return `${x},${y}`;
    })
    .join(" ");

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:"20px",marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <h2 style={{fontWeight:800,fontSize:17,margin:0}}>🌸 Het Privilege Wiel</h2>
          <span style={{fontSize:12,fontWeight:700,color:TEAL}}>{answeredCount}/{WHEEL_SEGMENTS.length}</span>
        </div>
        <p style={{fontSize:12,color:"#64748b",margin:0}}>Klik per segment op jouw positie: <strong>machtscentrum</strong>, <strong>middenzone</strong> of <strong>marginale zone</strong>.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
        {/* SVG Wiel */}
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:16,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} style={{maxWidth:"100%"}}>
            {/* Achtergrond cirkels */}
            <circle cx={cx} cy={cy} r={outerR} fill="#f8fafc" stroke="#e2e8f0" strokeWidth="1"/>
            <circle cx={cx} cy={cy} r={innerR} fill="#fff" stroke="#e2e8f0" strokeWidth="1"/>

            {/* Segmenten */}
            {WHEEL_SEGMENTS.map((seg,i)=>{
              const sel = selected[seg.id];
              const isActive = activeInfo === seg.id;
              let fill = "#f1f5f9";
              if(sel==="inside") fill = TEAL;        // Binnenste ring: meest geprivilegieerd
              else if(sel==="middle") fill = "#64748b"; // Middelste ring: tussenzone
              else if(sel==="outside") fill = "#f59e0b"; // Buitenste ring: meest gemarginaliseerd
              return(
                <g key={seg.id} style={{cursor:"pointer"}} onClick={()=>setActiveInfo(seg.id)}>
                  <path d={segmentPath(i)} fill={fill} stroke="#fff" strokeWidth="2.5"
                    opacity={isActive ? 1 : (activeInfo ? 0.7 : 1)}
                    style={{transition:"all .2s"}}/>
                  {/* Label */}
                  {(()=>{
                    const [lx,ly] = labelPos(i);
                    const angle = (i * sliceAngle) - Math.PI/2;
                    const deg = (angle * 180 / Math.PI) + 90;
                    return(
                      <text x={lx} y={ly}
                        textAnchor="middle" dominantBaseline="middle"
                        fontSize="9" fontWeight="700" fill={sel?"#fff":"#475569"}
                        transform={`rotate(${deg}, ${lx}, ${ly})`}
                        style={{pointerEvents:"none"}}>
                        {seg.icon}
                      </text>
                    );
                  })()}
                </g>
              );
            })}

            {/* Midden tekst */}
            <text x={cx} y={cy-10} textAnchor="middle" fontSize="11" fontWeight="800" fill={TEAL}>Privilege</text>
            <text x={cx} y={cy+6} textAnchor="middle" fontSize="9" fill="#94a3b8">Wiel</text>
            <text x={cx} y={cy+20} textAnchor="middle" fontSize="9" fontWeight="700" fill="#64748b">{answeredCount}/{WHEEL_SEGMENTS.length}</text>
          </svg>

          {/* Legenda */}
          <div style={{display:"flex",gap:16,marginTop:8}}>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#475569"}}>
              <div style={{width:14,height:14,borderRadius:4,background:TEAL}}/>Meer privilege (binnenkant)
            </div>
              <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#475569"}}>
                <div style={{width:14,height:14,borderRadius:4,background:"#64748b"}}/>Tussenpositie (combinatie van beide uitersten)
            </div>
            <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:"#475569"}}>
              <div style={{width:14,height:14,borderRadius:4,background:"#f59e0b"}}/>Minder privilege (buitenkant)
            </div>
          </div>
        </div>

        {/* Rechter paneel: info + knoppen */}
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {activeSegment ? (
            <>
              <div style={{background:TEAL_LIGHT,borderRadius:14,border:`1px solid ${TEAL}40`,padding:"16px"}}>
                <div style={{fontSize:24,marginBottom:6}}>{activeSegment.icon}</div>
                <p style={{fontWeight:800,fontSize:14,color:TEAL,margin:"0 0 8px"}}>{activeSegment.label}</p>
                <p style={{fontSize:12,color:"#334155",lineHeight:1.7,margin:0}}>{activeSegment.desc}</p>
              </div>
              <p style={{fontSize:11,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:1,margin:"4px 0 2px"}}>Jouw positie:</p>
              <button onClick={()=>toggle(activeSegment.id,"inside")}
                style={{padding:"10px 14px",borderRadius:10,border:`2px solid ${selected[activeSegment.id]==="inside"?TEAL:"#e2e8f0"}`,background:selected[activeSegment.id]==="inside"?TEAL:"#fff",color:selected[activeSegment.id]==="inside"?"#fff":"#334155",fontWeight:600,fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:FONT,transition:"all .15s"}}>
                <div style={{fontWeight:700,marginBottom:2}}>Binnenkant: Machtscentrum</div>
                <div style={{opacity:.75,fontSize:11}}>{activeSegment.inside}</div>
              </button>
              <button onClick={()=>toggle(activeSegment.id,"middle")}
                style={{padding:"10px 14px",borderRadius:10,border:`2px solid ${selected[activeSegment.id]==="middle"?"#64748b":"#e2e8f0"}`,background:selected[activeSegment.id]==="middle"?"#e2e8f0":"#fff",color:"#334155",fontWeight:600,fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:FONT,transition:"all .15s"}}>
                <div style={{fontWeight:700,marginBottom:2}}>Middenring: Middenzone</div>
                <div style={{opacity:.75,fontSize:11}}>{activeSegment.middle || "Tussenvorm van beide uitersten."}</div>
              </button>
              <button onClick={()=>toggle(activeSegment.id,"outside")}
                style={{padding:"10px 14px",borderRadius:10,border:`2px solid ${selected[activeSegment.id]==="outside"?"#f59e0b":"#e2e8f0"}`,background:selected[activeSegment.id]==="outside"?"#fef3c7":"#fff",color:"#92400e",fontWeight:600,fontSize:12,cursor:"pointer",textAlign:"left",fontFamily:FONT,transition:"all .15s"}}>
                <div style={{fontWeight:700,marginBottom:2}}>Buitenkant: Marginale zone</div>
                <div style={{opacity:.75,fontSize:11}}>{activeSegment.outside}</div>
              </button>
            </>
          ) : (
            <div style={{background:"#f8fafc",borderRadius:14,border:"1px solid #e2e8f0",padding:20,flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:10}}>👆</div>
              <p style={{fontWeight:700,fontSize:13,color:"#334155",margin:0}}>Klik op een segment</p>
              <p style={{fontSize:12,color:"#94a3b8",marginTop:4}}>Selecteer een stuk van het wiel om meer uitleg te zien en jouw positie in te vullen.</p>
            </div>
          )}

          {/* Segmentenlijst */}
          <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:12}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {WHEEL_SEGMENTS.map(seg=>{
                const sel = selected[seg.id];
                return(
                  <button key={seg.id} onClick={()=>setActiveInfo(seg.id)}
                    style={{display:"flex",alignItems:"center",gap:4,padding:"4px 8px",borderRadius:8,border:`1px solid ${activeInfo===seg.id?TEAL:"#e2e8f0"}`,background:sel?"#f0fdf4":activeInfo===seg.id?TEAL_LIGHT:"#f8fafc",color:"#334155",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:FONT}}>
                    <span>{seg.icon}</span>
                    {sel && <span style={{color:TEAL}}>✓</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reflectievraag */}
      {answeredCount >= 4 && (
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"16px 20px",marginBottom:16}}>
          <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>💭 Even stilstaan</p>
          <p style={{fontSize:13,color:"#334155",lineHeight:1.7,margin:0}}>
            Je hebt nu een eerste beeld van je eigen rugzak. Privilege betekent niet dat je het makkelijk hebt gehad — maar dat bepaalde drempels voor jou onzichtbaarder zijn dan voor anderen. Houd dit beeld in gedachten tijdens de rest van de reis.
          </p>
        </div>
      )}

      {allAnswered && (
        <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"16px 20px",marginBottom:16}}>
          <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>📈 Grafische weergave</p>
          <p style={{fontSize:13,color:"#334155",lineHeight:1.7,margin:"0 0 12px"}}>
            Dit spinneweb laat je ingevulde profiel zien per as (3 = machtscentrum, 2 = middenzone, 1 = marginale zone).
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,alignItems:"center"}}>
            <div style={{display:"flex",justifyContent:"center"}}>
              <svg width={radarSize} height={radarSize} viewBox={`0 0 ${radarSize} ${radarSize}`}>
                {radarLevels.map((level) => (
                  <polygon
                    key={level}
                    points={WHEEL_SEGMENTS.map((_, i) => radarPoint(i, level).join(",")).join(" ")}
                    fill="none"
                    stroke="#e2e8f0"
                    strokeWidth="1"
                  />
                ))}
                {WHEEL_SEGMENTS.map((_, i) => {
                  const [x, y] = radarPoint(i, 3);
                  return <line key={`axis-${i}`} x1={radarCx} y1={radarCy} x2={x} y2={y} stroke="#e2e8f0" strokeWidth="1" />;
                })}
                <polygon points={radarPolygon} fill={`${TEAL}33`} stroke={TEAL} strokeWidth="2" />
                {WHEEL_SEGMENTS.map((seg, i) => {
                  const score = scoreMap[selected[seg.id]] || 0;
                  const [x, y] = radarPoint(i, score);
                  return <circle key={`point-${seg.id}`} cx={x} cy={y} r="3.5" fill={TEAL_DARK} />;
                })}
              </svg>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#334155"}}>
                <span style={{width:12,height:12,borderRadius:"50%",background:TEAL_DARK,display:"inline-block"}} />
                3 = Machtscentrum (binnenkant)
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#334155"}}>
                <span style={{width:12,height:12,borderRadius:"50%",background:"#64748b",display:"inline-block"}} />
                2 = Middenzone (tussenvorm)
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:"#334155"}}>
                <span style={{width:12,height:12,borderRadius:"50%",background:"#f59e0b",display:"inline-block"}} />
                1 = Marginale zone (buitenkant)
              </div>
              <p style={{fontSize:11,color:"#64748b",lineHeight:1.6,margin:"8px 0 0"}}>
                Tip: gebruik dit beeld als reflectiestart, niet als label. Context en persoonlijke geschiedenis blijven altijd belangrijk.
              </p>
            </div>
          </div>
        </div>
      )}

      <div style={{display:"flex",justifyContent:"flex-end"}}>
        <button onClick={onComplete}
          style={{padding:"12px 28px",borderRadius:99,border:"none",background:allAnswered?TEAL:"#94a3b8",color:"#fff",fontWeight:800,fontSize:14,cursor:allAnswered?"pointer":"not-allowed",boxShadow:allAnswered?`0 4px 20px ${TEAL_GLOW}`:"none",fontFamily:FONT,transition:"all .2s"}}>
          {allAnswered ? "Start De Kaart →" : `Nog ${WHEEL_SEGMENTS.length - answeredCount} segment${WHEEL_SEGMENTS.length - answeredCount !== 1 ? 'en' : ''} in te vullen`}
        </button>
      </div>
    </div>
  );
}

// ── De Vreemde Ander ───────────────────────────────────────────

function VreemdeAnder({coreVals, onComplete}){
  const [vreemd, setVreemd] = useState({spiegel:"", tussenruimte:"", insluiting:""});
  const [showIntro, setShowIntro] = useState(true);
  const isComplete = Object.values(vreemd).every(v => v.trim().length > 20);

  const vragen = [
    { key:"spiegel", icon:"🪞", label:"De Spiegel", kleur:"#6366f1", lichtkleur:"#eef2ff", borderkleur:"#a5b4fc",
      uitleg:"Denk aan iemand die jij als 'de ander' ervaart — iemand die anders is dan jij, iemand met wie contact soms moeizaam gaat, of iemand die je instinctief op afstand houdt.",
      hint:"Wie is deze persoon voor jou? Beschrijf hoe jij deze persoon ziet en waarom het contact soms lastig is. Wees eerlijk — dit is alleen voor jou." },
    { key:"tussenruimte", icon:"🤝", label:"De Tussenruimte", kleur:"#f59e0b", lichtkleur:"#fffbeb", borderkleur:"#fcd34d",
      uitleg:"De tussenruimte is de plek tussen jou en die ander — niet van jou, niet van hem/haar, maar van jullie samen. Echte ontmoeting vindt daar plaats.",
      hint:"Wat gebeurt er in de ruimte tussen jou en deze persoon? Wanneer lukt verbinding wél, al is het maar even? Wat maakt het contact soms moeilijk?" },
    { key:"insluiting", icon:"🌍", label:"Insluiting", kleur:TEAL, lichtkleur:TEAL_LIGHT, borderkleur:TEAL,
      uitleg:"Insluiting gaat over bewust kiezen om er te zijn voor iemand die anders is dan jij. Niet als gunst, maar als professionele en menselijke keuze.",
      hint:"Wat zou jij concreet kunnen doen om deze persoon meer in te sluiten? Koppel dit aan één van jouw kernwaarden." },
  ];

  if(showIntro){
    return(
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:20,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:16}}>
          <div style={{background:"linear-gradient(135deg,#6366f1,#4f46e5)",padding:"28px 28px 24px"}}>
            <div style={{fontSize:40,marginBottom:12}}>🌍</div>
            <h2 style={{color:"#fff",fontWeight:900,fontSize:22,margin:0,letterSpacing:-.5}}>De Vreemde Ander</h2>
            <p style={{color:"rgba(255,255,255,.8)",fontSize:13,marginTop:8,lineHeight:1.7}}>Een reflectie op ontmoeting, verschil en inclusie.</p>
          </div>
          <div style={{padding:"24px 28px"}}>
            <p style={{fontSize:14,color:"#334155",lineHeight:1.8,marginBottom:16}}>Je hebt net vier dilemma's doorlopen vanuit jouw eigen kompas. Nu richt je de blik op de ander — op iemand die buiten jouw cirkel valt.</p>
            <div style={{background:"#eef2ff",borderRadius:12,border:"1px solid #a5b4fc",padding:"14px 18px",marginBottom:16}}>
              <p style={{fontSize:13,color:"#3730a3",lineHeight:1.7,margin:0}}><strong>Drie stappen:</strong> De Spiegel (wie is de ander voor jou?), De Tussenruimte (wat gebeurt er tussen jullie?) en Insluiting (wat kun jij doen?).</p>
            </div>
            <div style={{background:TEAL_LIGHT,borderRadius:12,border:`1px solid ${TEAL}40`,padding:"14px 18px",marginBottom:24}}>
              <p style={{fontSize:13,color:"#1a5c46",lineHeight:1.7,margin:0}}>💡 Jouw kompas: <strong>{coreVals.map(v=>v.name).join(", ")}</strong>. Kom je die waarden hier ook tegen?</p>
            </div>
            <button onClick={()=>setShowIntro(false)} style={{width:"100%",padding:"13px",borderRadius:99,border:"none",background:"#6366f1",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:FONT}}>
              Begin de reflectie →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:20}}>
        <div style={{background:"linear-gradient(135deg,#6366f1,#4f46e5)",padding:"20px 22px"}}>
          <h2 style={{color:"#fff",fontWeight:800,fontSize:18,margin:0}}>🌍 De Vreemde Ander</h2>
          <p style={{color:"rgba(255,255,255,.8)",fontSize:12,marginTop:6,lineHeight:1.5}}>Reflecteer op ontmoeting en verschil aan de hand van drie perspectieven.</p>
        </div>
        <div style={{background:"#fff",padding:20,display:"flex",flexDirection:"column",gap:20}}>
          <div style={{background:"#f8fafc",borderRadius:12,border:"1px solid #e2e8f0",padding:"12px 16px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>Jouw kompas:</span>
            {coreVals.map(cv=>{const c=CM[cv.color];return<span key={cv.id} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99,border:`1px solid ${c.border}`,color:c.text,background:c.bg}}><Dot color={cv.color} size={7}/>{cv.name}</span>;})}
          </div>
          {vragen.map(({key,icon,label,kleur,borderkleur,uitleg,hint})=>(
            <div key={key} style={{borderRadius:14,border:`1.5px solid ${borderkleur}`,overflow:"hidden"}}>
              <div style={{background:`${kleur}12`,borderBottom:`1px solid ${borderkleur}`,padding:"14px 18px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:36,height:36,borderRadius:10,background:kleur,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
                <div>
                  <p style={{fontWeight:800,fontSize:14,color:kleur,margin:"0 0 4px"}}>{label}</p>
                  <p style={{fontSize:12,color:"#475569",lineHeight:1.6,margin:0}}>{uitleg}</p>
                </div>
              </div>
              <div style={{padding:"14px 18px",background:"#fff"}}>
                <p style={{fontSize:11,color:"#94a3b8",marginBottom:8,lineHeight:1.5}}>{hint}</p>
                <textarea value={vreemd[key]} onChange={e=>setVreemd({...vreemd,[key]:e.target.value})}
                  placeholder="Schrijf hier je reflectie…" rows={4}
                  style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT}}
                  onFocus={e=>e.target.style.borderColor=kleur} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                <div style={{textAlign:"right",fontSize:10,color:vreemd[key].trim().length>20?TEAL:"#94a3b8",marginTop:4}}>
                  {vreemd[key].trim().length>20 ? "✓ Voldoende" : `Nog ${20-vreemd[key].trim().length} tekens`}
                </div>
              </div>
            </div>
          ))}
          <button onClick={()=>onComplete(vreemd)} disabled={!isComplete}
            style={{padding:"13px",borderRadius:99,border:"none",background:isComplete?"#6366f1":"#94a3b8",color:"#fff",fontWeight:700,fontSize:14,cursor:isComplete?"pointer":"not-allowed",boxShadow:isComplete?"0 4px 12px #6366f140":"none",fontFamily:FONT,transition:"all .2s"}}>
            {isComplete ? "Naar STARR Reflectie →" : "Vul alle drie de velden in om verder te gaan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Socialisatieverslag ────────────────────────────────────────

function Socialisatieverslag({coreVals, onComplete}){
  const [antwoorden, setAntwoorden] = useState({
    primair:"", secundair:"", tertiair:"", koppeling:""
  });
  const [showIntro, setShowIntro] = useState(true);

  const isComplete = Object.values(antwoorden).every(v => v.trim().length > 20);

  const lagen = [
    {
      key: "primair",
      icon: "🏠",
      label: "Primaire socialisatie",
      kleur: "#f43f5e",
      lichtkleur: "#ffe4e6",
      borderkleur: "#f43f5e",
      uitleg: "Primaire socialisatie vindt plaats in je vroege jeugd, vooral in het gezin. De waarden, normen en gewoonten die je thuis hebt meegekregen vormen de basis van wie je bent.",
      hint: "Welke waarden of normen heb je van huis uit meegekregen? Denk aan opvattingen over eerlijkheid, hard werken, zorgen voor anderen, of juist onafhankelijkheid. Herken je die in jouw drie kernwaarden?",
    },
    {
      key: "secundair",
      icon: "🏫",
      label: "Secundaire socialisatie",
      kleur: "#f59e0b",
      lichtkleur: "#fffbeb",
      borderkleur: "#fcd34d",
      uitleg: "Secundaire socialisatie gebeurt buiten het gezin: op school, in verenigingen, bij vrienden, via media. Je leert hoe grotere sociale verbanden werken en welke waarden daar gelden.",
      hint: "Welke omgevingen buiten je gezin hebben jouw waarden gevormd? Denk aan school, sport, religie, sociale media of vriendschapsgroepen. Wat leerde je daar — en botste dat soms met thuis?",
    },
    {
      key: "tertiair",
      icon: "💼",
      label: "Tertiaire socialisatie",
      kleur: TEAL,
      lichtkleur: TEAL_LIGHT,
      borderkleur: TEAL,
      uitleg: "Tertiaire socialisatie vindt plaats in je professionele context: werk, team en beroepsgroep. Je leert de normen en waarden van een specifiek werkveld of organisatie.",
      hint: "Hoe heeft je werkomgeving jouw professionele waarden gevormd of uitgedaagd? Zijn er waarden die je bewust hebt overgenomen — of juist afgewezen — in jouw beroepsidentiteit?",
    },
    {
      key: "koppeling",
      icon: "🧭",
      label: "Koppeling aan jouw kompas",
      kleur: "#6366f1",
      lichtkleur: "#eef2ff",
      borderkleur: "#a5b4fc",
      uitleg: "Je kernwaarden zijn niet zomaar ontstaan — ze hebben een geschiedenis. In dit laatste veld breng je de drie lagen samen en koppel je ze aan jouw moreel kompas.",
      hint: `Hoe verklaren jouw socialisatielagen de keuze voor jouw kernwaarden ${coreVals.map(v=>v.name).join(", ")}? Welke laag heeft het meeste invloed gehad? En wat betekent dit voor jouw professioneel handelen?`,
    },
  ];

  if(showIntro){
    return(
      <div style={{maxWidth:560,margin:"0 auto"}}>
        <div style={{background:"#fff",borderRadius:20,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:16}}>
          <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",padding:"28px 28px 24px"}}>
            <div style={{fontSize:40,marginBottom:12}}>📖</div>
            <h2 style={{color:"#fff",fontWeight:900,fontSize:22,margin:0,letterSpacing:-.5}}>Het Socialisatieverslag</h2>
            <p style={{color:"rgba(255,255,255,.7)",fontSize:13,marginTop:8,lineHeight:1.7}}>Waar komen jouw waarden vandaan?</p>
          </div>
          <div style={{padding:"24px 28px"}}>
            <p style={{fontSize:14,color:"#334155",lineHeight:1.8,marginBottom:16}}>Jouw kernwaarden zijn niet toevallig. Ze zijn gevormd door de omgevingen waarin je bent opgegroeid en gewerkt. Dit verslag helpt je die wortels te begrijpen.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:20}}>
              {[
                {icon:"🏠",label:"Primaire socialisatie",sub:"Gezin en vroege jeugd",kleur:"#f43f5e"},
                {icon:"🏫",label:"Secundaire socialisatie",sub:"School, vrienden, media",kleur:"#f59e0b"},
                {icon:"💼",label:"Tertiaire socialisatie",sub:"Werk en beroepsomgeving",kleur:TEAL},
                {icon:"🧭",label:"Koppeling aan jouw kompas",sub:"Alles samen",kleur:"#6366f1"},
              ].map(({icon,label,sub,kleur})=>(
                <div key={label} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:12,border:`1px solid ${kleur}30`,background:`${kleur}08`}}>
                  <div style={{width:32,height:32,borderRadius:8,background:kleur,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{icon}</div>
                  <div><p style={{fontWeight:700,fontSize:13,color:"#1e293b",margin:0}}>{label}</p><p style={{fontSize:11,color:"#94a3b8",margin:0}}>{sub}</p></div>
                </div>
              ))}
            </div>
            <div style={{background:TEAL_LIGHT,borderRadius:12,border:`1px solid ${TEAL}40`,padding:"12px 16px",marginBottom:24}}>
              <p style={{fontSize:12,color:"#1a5c46",lineHeight:1.7,margin:0}}>💡 Jouw kernwaarden: <strong>{coreVals.map(v=>v.name).join(", ")}</strong>. Zie je de rode draad terug in jouw socialisatiegeschiedenis?</p>
            </div>
            <button onClick={()=>setShowIntro(false)} style={{width:"100%",padding:"13px",borderRadius:99,border:"none",background:"#0f172a",color:"#fff",fontWeight:800,fontSize:15,cursor:"pointer",fontFamily:FONT}}>
              Begin het verslag →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    <div style={{maxWidth:680,margin:"0 auto"}}>
      <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",overflow:"hidden",marginBottom:20}}>
        <div style={{background:"linear-gradient(135deg,#0f172a,#1e293b)",padding:"20px 22px"}}>
          <h2 style={{color:"#fff",fontWeight:800,fontSize:18,margin:0}}>📖 Het Socialisatieverslag</h2>
          <p style={{color:"rgba(255,255,255,.6)",fontSize:12,marginTop:6,lineHeight:1.5}}>Reflecteer op de drie lagen van jouw socialisatie en de wortels van jouw waarden.</p>
        </div>
        <div style={{background:"#fff",padding:20,display:"flex",flexDirection:"column",gap:20}}>

          {/* Kernwaarden reminder */}
          <div style={{background:"#f8fafc",borderRadius:12,border:"1px solid #e2e8f0",padding:"12px 16px",display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1}}>Jouw kompas:</span>
            {coreVals.map(cv=>{const c=CM[cv.color];return<span key={cv.id} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99,border:`1px solid ${c.border}`,color:c.text,background:c.bg}}><Dot color={cv.color} size={7}/>{cv.name}</span>;})}
          </div>

          {lagen.map(({key,icon,label,kleur,borderkleur,uitleg,hint})=>(
            <div key={key} style={{borderRadius:14,border:`1.5px solid ${borderkleur}`,overflow:"hidden"}}>
              <div style={{background:`${kleur}10`,borderBottom:`1px solid ${borderkleur}50`,padding:"14px 18px",display:"flex",gap:12,alignItems:"flex-start"}}>
                <div style={{width:36,height:36,borderRadius:10,background:kleur,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{icon}</div>
                <div>
                  <p style={{fontWeight:800,fontSize:14,color:kleur,margin:"0 0 4px"}}>{label}</p>
                  <p style={{fontSize:12,color:"#475569",lineHeight:1.6,margin:0}}>{uitleg}</p>
                </div>
              </div>
              <div style={{padding:"14px 18px",background:"#fff"}}>
                <p style={{fontSize:11,color:"#94a3b8",marginBottom:8,lineHeight:1.6,fontStyle:"italic"}}>{hint}</p>
                <textarea
                  value={antwoorden[key]}
                  onChange={e=>setAntwoorden({...antwoorden,[key]:e.target.value})}
                  placeholder="Schrijf hier je reflectie…"
                  rows={4}
                  style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT}}
                  onFocus={e=>e.target.style.borderColor=kleur}
                  onBlur={e=>e.target.style.borderColor="#e2e8f0"}
                />
                <div style={{textAlign:"right",fontSize:10,color:antwoorden[key].trim().length>20?TEAL:"#94a3b8",marginTop:4}}>
                  {antwoorden[key].trim().length>20 ? "✓ Voldoende" : `Nog ${20-antwoorden[key].trim().length} tekens`}
                </div>
              </div>
            </div>
          ))}

          <button onClick={()=>onComplete(antwoorden)} disabled={!isComplete}
            style={{padding:"13px",borderRadius:99,border:"none",background:isComplete?"#0f172a":"#94a3b8",color:"#fff",fontWeight:700,fontSize:14,cursor:isComplete?"pointer":"not-allowed",fontFamily:FONT,transition:"all .2s"}}>
            {isComplete ? "Naar het Reisverslag →" : "Vul alle vier de velden in om verder te gaan"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PDF Export ─────────────────────────────────────────────────

function exportPDF(coreVals, dilResp, starr, smsDilemma, domColor, groupCode, age){
  const c = CM[domColor];
  const html = `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8">
    <title>Moral APS – Deel 1 Verslag</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'DM Sans',sans-serif;color:#0f172a;padding:40px;max-width:700px;margin:0 auto;background:#fff}
      .header{background:linear-gradient(135deg,${TEAL},${TEAL_DARK});color:#fff;border-radius:16px;padding:32px;margin-bottom:28px}
      .header h1{font-size:28px;font-weight:900;letter-spacing:-1px}
      .header p{opacity:.8;font-size:13px;margin-top:6px}
      .section{background:#fff;border:1px solid #e2e8f0;border-radius:14px;padding:20px 24px;margin-bottom:20px}
      .section-title{font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:14px}
      .chip{display:inline-flex;align-items:center;gap:6px;padding:5px 12px;border-radius:99px;font-size:12px;font-weight:700;margin:3px}
      .dominant{background:${c.bg};border:2px solid ${c.border};border-radius:14px;padding:18px 24px;text-align:center;margin-bottom:20px}
      .dominant .label{font-size:28px;font-weight:900;color:${c.text}}
      .dominant .desc{font-size:12px;color:#64748b;margin-top:4px}
      .key{font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
      .val{font-size:13px;color:#334155;line-height:1.7;margin-bottom:16px}
      .vblock{border-radius:12px;padding:16px;margin-bottom:14px}
      .ditem{display:flex;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9}
      .ditem:last-child{border-bottom:none}
      .num{width:26px;height:26px;border-radius:50%;background:#f1f5f9;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#64748b;flex-shrink:0}
      .footer{text-align:center;font-size:11px;color:#94a3b8;margin-top:32px;padding-top:20px;border-top:1px solid #f1f5f9}
      @media print{body{padding:20px}.header{border-radius:8px}}
    </style></head><body>
    <div class="header">
      <div style="font-size:36px;margin-bottom:12px">🏆</div>
      <h1>Moral APS — Deel 1 Verslag</h1>
      <p>Groep: ${groupCode} · Leeftijd: ${age} · ${new Date().toLocaleDateString("nl-NL",{day:"numeric",month:"long",year:"numeric"})}</p>
    </div>
    <div class="section">
      <div class="section-title">🧭 Kernwaarden</div>
      <div>${coreVals.map(cv=>{const cc=CM[cv.color];return`<span class="chip" style="background:${cc.bg};border:1.5px solid ${cc.border};color:${cc.text}">${cv.name}</span>`;}).join("")}</div>
    </div>
    <div class="dominant">
      <div style="font-size:10px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px">Dominante veranderkleur</div>
      <div class="label">${c.label}</div>
      <div class="desc">${c.desc}</div>
    </div>
    <div class="section">
      <div class="section-title">🛣 Dilemma-keuzes</div>
      ${DILEMMAS.map((d,i)=>{const r=dilResp[i];const cc=r?CM[r.color]:null;return`<div class="ditem"><div class="num">${i+1}</div><div><div style="font-weight:700;font-size:13px">${d.title}</div>${r&&cc?`<div style="font-size:12px;color:${cc.text};margin-top:3px">${r.text}</div>`:""}</div></div>`;}).join("")}
    </div>
    <div class="section">
      <div class="section-title">✨ STARR Reflectie</div>
      ${Object.entries(starr).map(([key,val])=>`<div class="key" style="color:${TEAL}">${key.charAt(0).toUpperCase()+key.slice(1)}</div><div class="val">${val||"Niet ingevuld"}</div>`).join("")}
    </div>
    ${smsDilemma?.smsChoice ? `
    <div class="section">
      <div class="section-title">📩 Einddilemma — SMS uit Roosendaal</div>
      <div class="key" style="color:${TEAL}">Gekozen reactie</div>
      <div class="val">${smsDilemma.smsChoice}</div>
      <div class="key" style="color:${TEAL}">Waardenafweging</div>
      <div class="val">${smsDilemma.smsReflection || "Niet ingevuld"}</div>
    </div>` : ""}
    <div class="footer">Gegenereerd door Moral APS · Geïnspireerd op Caluwé &amp; Vermaak · ${new Date().getFullYear()}</div>
    </body></html>`;

  const blob = new Blob([html], {type:"text/html"});
  const url = URL.createObjectURL(blob);
  const win = window.open(url,"_blank");
  if(win){ win.onload = ()=>{ setTimeout(()=>win.print(), 500); }; }
}

function exportPDFDeel2({coreVals, crossroadsChoice, crossroadsReflectie, vreemdeAnderResult, profile, groupCode, age}){
  const html = `<!DOCTYPE html><html lang="${profile.locale || "nl"}"><head><meta charset="UTF-8">
    <title>Moral APS - Deel 2 Onderweg</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'DM Sans',sans-serif;color:#0f172a;padding:38px;max-width:760px;margin:0 auto;background:#fff}
      .header{background:linear-gradient(135deg,#1b9e77,#147a5c);color:#fff;border-radius:14px;padding:26px;margin-bottom:20px}
      .section{border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;margin-bottom:14px}
      .label{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
      .value{font-size:13px;color:#334155;line-height:1.7}
      .chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:700;margin-right:6px}
      .footer{margin-top:24px;padding-top:12px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8;text-align:center}
    </style></head><body>
    <div class="header">
      <h1 style="font-size:26px;font-weight:900;letter-spacing:-.6px;margin:0">Moral APS - Deel 2 (Onderweg)</h1>
      <p style="opacity:.9;font-size:12px;margin-top:6px">Groep: ${groupCode || "-"} · Leeftijd: ${age || "-"} · Context: ${profile.workContext || "algemeen"} · ${new Date().toLocaleDateString("nl-NL",{day:"numeric",month:"long",year:"numeric"})}</p>
    </div>
    <div class="section">
      <div class="label">Kernwaarden (mee uit Deel 1)</div>
      <div>${(coreVals||[]).map(cv=>{const c=CM[cv.color]||CM.blauw;return `<span class="chip" style="background:${c.bg};border:1px solid ${c.border};color:${c.text}">${cv.name}</span>`;}).join("") || "<span class='value'>Niet ingevuld</span>"}</div>
    </div>
    <div class="section">
      <div class="label">Crossroads keuze</div>
      <div class="value">${crossroadsChoice || "Niet ingevuld"}</div>
    </div>
    <div class="section">
      <div class="label">Waardenafweging</div>
      <div class="value">${crossroadsReflectie || "Niet ingevuld"}</div>
    </div>
    <div class="section">
      <div class="label">De Vreemde Ander - samenvatting</div>
      <div class="value"><strong>De Spiegel:</strong><br/>${vreemdeAnderResult?.spiegel || "Niet ingevuld"}</div>
      <div class="value" style="margin-top:10px"><strong>De Tussenruimte:</strong><br/>${vreemdeAnderResult?.tussenruimte || "Niet ingevuld"}</div>
      <div class="value" style="margin-top:10px"><strong>Insluiting:</strong><br/>${vreemdeAnderResult?.insluiting || "Niet ingevuld"}</div>
    </div>
    ${profile.extraAssignment ? `<div class="section"><div class="label">Extra opdracht</div><div class="value">${profile.extraAssignment}</div></div>` : ""}
    <div class="footer">Gegenereerd voor Deel 2 - printbaar portfolio-fragment</div>
    </body></html>`;

  const blob = new Blob([html], {type:"text/html"});
  const url = URL.createObjectURL(blob);
  const win = window.open(url,"_blank");
  if(win){ win.onload = ()=>{ setTimeout(()=>win.print(), 500); }; }
}

function exportPDFDeel3Portfolio({coreVals, dilResp, starr, smsDilemma, bridge, domColor, socialisatie, profile, groupCode, age}){
  const c = CM[domColor];
  const html = `<!DOCTYPE html><html lang="${profile.locale || "nl"}"><head><meta charset="UTF-8">
    <title>Moral APS - Portfolio Deel 3</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');
      *{box-sizing:border-box;margin:0;padding:0}
      body{font-family:'DM Sans',sans-serif;color:#0f172a;padding:34px;max-width:800px;margin:0 auto;background:#fff}
      .header{background:linear-gradient(135deg,#0f172a,#1e293b);color:#fff;border-radius:14px;padding:24px;margin-bottom:18px}
      .section{border:1px solid #e2e8f0;border-radius:12px;padding:16px 18px;margin-bottom:14px}
      .label{font-size:10px;font-weight:800;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px}
      .value{font-size:13px;color:#334155;line-height:1.7}
      .chip{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;border-radius:99px;font-size:11px;font-weight:700;margin-right:6px}
      .dominant{background:${c.bg};border:1.5px solid ${c.border};border-radius:10px;padding:10px 12px}
      .footer{margin-top:20px;padding-top:10px;border-top:1px solid #f1f5f9;font-size:11px;color:#94a3b8;text-align:center}
    </style></head><body>
    <div class="header">
      <h1 style="font-size:24px;font-weight:900;letter-spacing:-.5px;margin:0">Moral APS - Portfolio (tot en met Deel 3)</h1>
      <p style="opacity:.85;font-size:12px;margin-top:6px">Groep: ${groupCode || "-"} · Leeftijd: ${age || "-"} · Context: ${profile.workContext || "algemeen"} · Taal: ${profile.locale || "nl"}</p>
    </div>
    <div class="section"><div class="label">Kernwaarden</div><div>${(coreVals||[]).map(cv=>{const cc=CM[cv.color];return `<span class="chip" style="background:${cc.bg};border:1px solid ${cc.border};color:${cc.text}">${cv.name}</span>`;}).join("") || "<span class='value'>Niet ingevuld</span>"}</div></div>
    <div class="section"><div class="label">Dominante veranderkleur</div><div class="dominant"><div class="value" style="font-weight:800;color:${c.text}">${c.label}</div><div class="value">${c.desc}</div></div></div>
    <div class="section"><div class="label">Dilemma-keuzes Deel 1</div>${DILEMMAS.map((d,i)=>{const r=dilResp?.[i];return `<div class="value" style="margin-bottom:8px"><strong>${i+1}. ${d.title}</strong><br/>${r?.text || "Niet ingevuld"}</div>`;}).join("")}</div>
    <div class="section"><div class="label">STARR</div>${Object.entries(starr||{}).map(([k,v])=>`<div class="value"><strong>${k}:</strong> ${v || "Niet ingevuld"}</div>`).join("")}</div>
    <div class="section"><div class="label">Socialisatie / Rugzak</div>${Object.entries(socialisatie||{}).map(([k,v])=>`<div class="value"><strong>${k}:</strong> ${v || "Niet ingevuld"}</div>`).join("")}</div>
    <div class="section"><div class="label">SMS-einddilemma</div><div class="value"><strong>Keuze:</strong> ${smsDilemma?.smsChoice || "Niet ingevuld"}</div><div class="value"><strong>Reflectie:</strong> ${smsDilemma?.smsReflection || "Niet ingevuld"}</div></div>
    <div class="section"><div class="label">De Brug in de Mist (Deel 3 signature)</div><div class="value"><strong>Ballast:</strong> ${bridge?.ballast || "Niet ingevuld"}</div><div class="value"><strong>Meenemen:</strong> ${bridge?.meenemen || "Niet ingevuld"}</div><div class="value"><strong>Hoop te vinden:</strong> ${bridge?.vinden || "Niet ingevuld"}</div><div class="value"><strong>Kernwaarde:</strong> ${bridge?.kompas || "Niet ingevuld"}</div></div>
    ${profile.extraAssignment ? `<div class="section"><div class="label">Extra opdracht</div><div class="value">${profile.extraAssignment}</div></div>` : ""}
    <div class="footer">Portfolio-export - bruikbaar voor presentatie of persoonlijk verhaal</div>
    </body></html>`;

  const blob = new Blob([html], {type:"text/html"});
  const url = URL.createObjectURL(blob);
  const win = window.open(url,"_blank");
  if(win){ win.onload = ()=>{ setTimeout(()=>win.print(), 500); }; }
}

// ── Dashboard ──────────────────────────────────────────────────

function WordCloud({results}){
  const words=useMemo(()=>{
    const m={};
    results.forEach(r=>(r.coreValues||[]).forEach(v=>{const k=`${v.name}|${v.color}`;m[k]=(m[k]||0)+1;}));
    return Object.entries(m).map(([k,c])=>{const[n,col]=k.split("|");return{name:n,color:col,count:c};}).sort((a,b)=>b.count-a.count);
  },[results]);
  if(!words.length)return <p style={{color:"#94a3b8",textAlign:"center",padding:24,fontSize:13}}>Nog geen data voor deze groep.</p>;
  const mx=words[0].count;
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",padding:"12px 0"}}>
      {words.map(({name,color,count})=>{
        const c=CM[color],s=0.75+(count/mx)*1.0;
        return <span key={name} style={{fontSize:Math.round(11*s),fontWeight:count===mx?800:600,color:c.solid,background:c.bg,border:`1.5px solid ${c.border}`,borderRadius:8,padding:"3px 9px"}}>{name}<sup style={{fontSize:8,opacity:.5,marginLeft:2}}>{count}</sup></span>;
      })}
    </div>
  );
}

function Dashboard({groupCode,onBack}){
  const [results,setResults]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState(null);

  const fetchData = useCallback(async ()=>{
    setLoading(true);setError(null);
    try{setResults(await dbLoad(groupCode));}
    catch{setError("Kon data niet ophalen. Controleer je Supabase-instellingen.");}
    finally{setLoading(false);}
  },[groupCode]);
  useEffect(()=>{fetchData();},[fetchData]);

  const byAge=useMemo(()=>{const m={};AGE_CATS.forEach(a=>{m[a]=[];});results.forEach(r=>{if(m[r.age])m[r.age].push(r);});return m;},[results]);
  function top3(es){const c={};es.forEach(r=>(r.coreValues||[]).forEach(v=>{if(!c[v.name])c[v.name]={count:0,color:v.color};c[v.name].count++;}));return Object.entries(c).sort(([,a],[,b])=>b.count-a.count).slice(0,3).map(([n,{color}])=>({name:n,color}));}
  const cdist=useMemo(()=>{const d={geel:0,blauw:0,rood:0,groen:0,wit:0};results.forEach(r=>(r.coreValues||[]).forEach(v=>{d[v.color]=(d[v.color]||0)+1;}));const t=Object.values(d).reduce((a,b)=>a+b,0)||1;return Object.entries(d).map(([c,n])=>({color:c,pct:Math.round(n/t*100)}));},[results]);

  return(
    <div style={{maxWidth:700,margin:"0 auto",padding:"24px 16px 60px",fontFamily:FONT}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;700;900&display=swap');*{box-sizing:border-box}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:24}}>
        <button onClick={onBack} style={{background:"#f1f5f9",border:"none",borderRadius:99,padding:"8px 16px",cursor:"pointer",fontWeight:700,fontSize:13,color:"#334155",fontFamily:FONT}}>← Terug</button>
        <div><h2 style={{fontWeight:900,fontSize:20,margin:0}}>Dashboard</h2><p style={{margin:0,fontSize:12,color:"#64748b"}}>Groep: <strong>{groupCode}</strong>{!loading&&<span> · {results.length} deelnemers</span>}</p></div>
        <button onClick={fetchData} style={{marginLeft:"auto",background:TEAL_LIGHT,border:`1px solid ${TEAL}40`,borderRadius:99,padding:"6px 14px",cursor:"pointer",fontWeight:600,fontSize:12,color:TEAL,fontFamily:FONT}}>↻ Vernieuwen</button>
      </div>
      {error&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:12,padding:"14px 18px",marginBottom:20,color:"#b91c1c",fontSize:13}}>⚠️ {error}</div>}
      {loading?<Spinner/>:<>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:20,marginBottom:16}}>
          <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Wordcloud – Kernwaarden</p>
          <WordCloud results={results}/>
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:20,marginBottom:16}}>
          <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Veranderkleuren Verdeling</p>
          <div style={{display:"flex",height:28,borderRadius:8,overflow:"hidden",gap:2}}>
            {cdist.filter(c=>c.pct>0).map(({color,pct})=>(
              <div key={color} style={{width:`${pct}%`,background:CM[color].solid,display:"flex",alignItems:"center",justifyContent:"center"}}>
                {pct>10&&<span style={{fontSize:10,fontWeight:700,color:color==="geel"?"#451A03":"#fff"}}>{pct}%</span>}
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginTop:8}}>
            {cdist.map(({color,pct})=><span key={color} style={{display:"flex",alignItems:"center",gap:5,fontSize:11,color:"#475569"}}><Dot color={color} size={8}/>{CM[color].label} {pct}%</span>)}
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",overflow:"hidden"}}>
          <div style={{padding:"16px 20px 12px",borderBottom:"1px solid #f1f5f9"}}><p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,margin:0}}>Top 3 Waarden per Generatie</p></div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#f8fafc"}}>{["Leeftijd","n","#1","#2","#3"].map(h=><th key={h} style={{padding:"10px 16px",textAlign:"left",fontSize:11,fontWeight:700,color:"#64748b",whiteSpace:"nowrap"}}>{h}</th>)}</tr></thead>
              <tbody>{AGE_CATS.map((age,idx)=>{const es=byAge[age]||[];const t=top3(es);return(
                <tr key={age} style={{background:idx%2?"#f8fafc":"#fff",borderTop:"1px solid #f1f5f9"}}>
                  <td style={{padding:"10px 16px",fontWeight:700,fontSize:13}}>{age}</td>
                  <td style={{padding:"10px 16px",color:"#64748b",fontSize:12}}>{es.length}</td>
                  {[0,1,2].map(i=>{const v=t[i];return<td key={i} style={{padding:"10px 16px"}}>{v?<span style={{display:"inline-flex",alignItems:"center",gap:4,background:CM[v.color].bg,border:`1px solid ${CM[v.color].border}`,color:CM[v.color].text,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:600}}><Dot color={v.color} size={7}/>{v.name}</span>:<span style={{color:"#cbd5e1",fontSize:11}}>–</span>}</td>;})}
                </tr>
              );})}</tbody>
            </table>
          </div>
        </div>
      </>}
    </div>
  );
}

function OrganizationLakmoesproef({ onBack }) {
  const [orgName, setOrgName] = useState("");
  const [role, setRole] = useState("");
  const [answers, setAnswers] = useState({});
  const [notes, setNotes] = useState("");

  const completed = Object.keys(answers).length;
  const allDone = completed === ORG_QUESTIONS.length;
  const score = allDone
    ? Math.round(
        (Object.values(answers).reduce((sum, val) => sum + val, 0) /
          (ORG_QUESTIONS.length * 5)) *
          100
      )
    : 0;

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", fontFamily: FONT }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "24px 16px 60px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 26, fontWeight: 900, letterSpacing: -0.4 }}>Organisatie lakmoesproef</h2>
          <button onClick={onBack} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 999, padding: "8px 14px", cursor: "pointer", fontWeight: 700, color: "#334155" }}>← Terug</button>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 18, marginBottom: 14 }}>
          <p style={{ margin: "0 0 10px", color: "#475569", lineHeight: 1.7, fontSize: 14 }}>
            Een professionele organisatiescan op basis van 21 vragen over voorbeeldig organiseren. Beoordeel per vraag de huidige praktijk op een schaal van 1 (zwak) tot 5 (sterk).
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Organisatie (optioneel)" style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontFamily: FONT }} />
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Jouw rol/functie (optioneel)" style={{ padding: "10px 12px", borderRadius: 10, border: "1px solid #cbd5e1", fontFamily: FONT }} />
          </div>
          <p style={{ margin: "10px 0 0", fontSize: 12, color: "#64748b" }}>{completed}/{ORG_QUESTIONS.length} vragen ingevuld</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {ORG_QUESTIONS.map((q) => (
            <div key={q.id} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 16 }}>
              <p style={{ margin: 0, fontSize: 11, color: "#94a3b8", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>Vraag {q.id}</p>
              <h3 style={{ margin: "4px 0 2px", fontSize: 18, fontWeight: 800 }}>{q.title}</h3>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: TEAL, fontWeight: 700 }}>{q.subtitle}</p>
              <p style={{ margin: "0 0 12px", fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{q.explanation}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: n }))} style={{ minWidth: 42, padding: "8px 12px", borderRadius: 10, border: `1.5px solid ${answers[q.id] === n ? TEAL : "#cbd5e1"}`, background: answers[q.id] === n ? TEAL : "#fff", color: answers[q.id] === n ? "#fff" : "#334155", fontWeight: 700, cursor: "pointer", fontFamily: FONT }}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 14, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: 16 }}>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#334155", marginBottom: 6 }}>Kernobservaties en verbetersporen (optioneel)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Welke 2-3 thema's verdienen direct aandacht? Welke acties zijn kansrijk?" style={{ width: "100%", borderRadius: 10, border: "1px solid #cbd5e1", padding: 12, fontFamily: FONT, resize: "vertical" }} />
          <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <p style={{ margin: 0, fontSize: 13, color: allDone ? TEAL : "#64748b", fontWeight: 700 }}>
              {allDone ? `Integriteitsscore organisatie: ${score}%` : "Vul alle vragen in voor een totaalscore"}
            </p>
          </div>
          {allDone && (
            <p style={{ margin: "10px 0 0", fontSize: 13, color: "#334155", lineHeight: 1.6 }}>
              {score >= 80 ? "Sterk fundament: borg de werkwijze en houd focus op continue verbetering." : score >= 60 ? "Goede basis: prioriteer 3 verbeterpunten met duidelijke eigenaarschap en planning." : "Versterking nodig: start met leiderschap, aanspreekcultuur en veilige dialoog als eerste interventies."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Landing ────────────────────────────────────────────────────

function TrilogieHome({onStartDeel1, onStartDeel2, onStartDeel3, onResume}){
  const [gc,setGc]=useState("");
  const [age,setAge]=useState("");
  const [resumeCode,setResumeCode]=useState("");
  const [startHint, setStartHint] = useState("");
  const canStart = gc.trim() && age;
  function runStart(action){
    if(!canStart){
      setStartHint("Vul eerst groepscode en leeftijd in, daarna kun je direct starten.");
      return;
    }
    setStartHint("");
    action(gc.trim().toUpperCase(), age);
  }

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(180deg,#eef2ff,#f8fafc 38%)",fontFamily:FONT}}>
      <div style={{maxWidth:980,margin:"0 auto",padding:"32px 16px 56px"}}>
        <div style={{background:"#fff",borderRadius:24,border:"1px solid #e2e8f0",padding:"24px 24px 20px",marginBottom:16,boxShadow:"0 14px 38px rgba(15,23,42,.08)"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,alignItems:"center"}}>
            <div>
              <p style={{fontSize:11,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:1.2,margin:"0 0 6px"}}>Moral Maps Trilogie</p>
              <h1 style={{margin:0,fontSize:32,fontWeight:900,letterSpacing:-.8,color:"#0f172a"}}>Welkom bij je morele reis</h1>
              <p style={{margin:"10px 0 0",fontSize:14,color:"#475569",lineHeight:1.7}}>
                Kies het deel waar je vandaag aan wilt werken. Je verslagen worden per deel opgebouwd en na Deel 3 gekoppeld tot een totaalportfolio.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:12}}>
                <span style={{fontSize:11,padding:"4px 10px",borderRadius:99,background:"#eef2ff",color:"#3730a3",fontWeight:700}}>I: The Beginning</span>
                <span style={{fontSize:11,padding:"4px 10px",borderRadius:99,background:"#ecfeff",color:"#155e75",fontWeight:700}}>II: Crossroads</span>
                <span style={{fontSize:11,padding:"4px 10px",borderRadius:99,background:"#f0fdf4",color:"#166534",fontWeight:700}}>III: Final Destination</span>
              </div>
            </div>
            <div style={{background:"linear-gradient(160deg,#0f172a,#1e293b)",borderRadius:18,padding:10,border:"1px solid #334155"}}>
              <div style={{background:"#dbeafe",borderRadius:14,overflow:"hidden",position:"relative",height:260,padding:12}}>
                <img src="/trilogie-hero-map.svg" alt="Moral Maps trilogie kaart" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"center",opacity:.92}} />
                <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 82% 24%, rgba(255,255,255,.55), rgba(255,255,255,0) 42%)"}} />
                <div style={{position:"absolute",left:0,right:0,bottom:56,height:18,backgroundImage:"radial-gradient(#475569 1.4px, transparent 1.4px)",backgroundSize:"11px 11px",opacity:.22}} />

                <div style={{position:"relative",zIndex:2,width:132,height:238,marginLeft:14,background:"linear-gradient(175deg,#0f172a,#1e293b)",borderRadius:24,border:"1.5px solid #334155",padding:6,boxShadow:"0 14px 24px rgba(15,23,42,.35)"}}>
                  <div style={{height:8,width:38,borderRadius:99,background:"#0b1220",margin:"2px auto 4px",border:"1px solid #1f2a3d"}} />
                  <div style={{height:210,borderRadius:17,overflow:"hidden",position:"relative",background:"#e2e8f0"}}>
                    <img src={ASSET_IMAGES.deel1.phoneMockup} alt="Moral Maps mobiele mockup" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 42%"}} />
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,rgba(15,23,42,.08),rgba(15,23,42,.18))"}} />
                  </div>
                </div>

                <div style={{position:"absolute",left:12,right:12,bottom:10,background:"rgba(255,255,255,.93)",borderRadius:10,padding:"8px 10px",fontSize:11,color:"#334155",fontWeight:700}}>
                  Kies direct I, II of III
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:18,marginBottom:16}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            <div>
              <label style={{display:"block",fontSize:10,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Groepscode</label>
              <input value={gc} onChange={e=>setGc(e.target.value)} placeholder="bijv. HBO25A" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #d1d5db",fontFamily:"'DM Mono',monospace",letterSpacing:1}}/>
            </div>
            <div>
              <label style={{display:"block",fontSize:10,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Leeftijdscategorie</label>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {AGE_CATS.map(a=>(
                  <button key={a} onClick={()=>setAge(a)} style={{padding:"7px 11px",borderRadius:99,border:`1.5px solid ${age===a?TEAL:"#d1d5db"}`,background:age===a?TEAL:"#fff",color:age===a?"#fff":"#475569",fontWeight:700,fontSize:11,cursor:"pointer",fontFamily:FONT}}>{a}</button>
                ))}
              </div>
            </div>
          </div>
          <p style={{margin:0,fontSize:11,color:"#64748b"}}>Vul groepscode + leeftijd in om direct een deel te starten.</p>
          {startHint && <p style={{margin:"8px 0 0",fontSize:11,color:"#b45309",fontWeight:700}}>⚠ {startHint}</p>}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3, minmax(0, 1fr))",gap:12,marginBottom:16}}>
          <button onClick={()=>runStart(onStartDeel1)} style={{padding:"16px 14px",borderRadius:16,border:"1px solid #e2e8f0",background:"#fff",textAlign:"left",cursor:"pointer",fontFamily:FONT,boxShadow:"0 8px 24px rgba(15,23,42,.05)"}}>
            <p style={{margin:0,fontSize:10,fontWeight:800,color:"#6366f1",textTransform:"uppercase",letterSpacing:1}}>I: The Beginning</p>
            <p style={{margin:"5px 0 0",fontSize:14,fontWeight:900,color:"#0f172a"}}>Start Deel I</p>
            <p style={{margin:"6px 0 0",fontSize:12,color:"#64748b",lineHeight:1.6}}>Begin, waarden en eerste reisverslag.</p>
          </button>
          <button onClick={()=>runStart(onStartDeel2)} style={{padding:"16px 14px",borderRadius:16,border:"1px solid #e2e8f0",background:"#fff",textAlign:"left",cursor:"pointer",fontFamily:FONT,boxShadow:"0 8px 24px rgba(15,23,42,.05)"}}>
            <p style={{margin:0,fontSize:10,fontWeight:800,color:"#0ea5e9",textTransform:"uppercase",letterSpacing:1}}>II: Crossroads</p>
            <p style={{margin:"5px 0 0",fontSize:14,fontWeight:900,color:"#0f172a"}}>Werk aan Deel II</p>
            <p style={{margin:"6px 0 0",fontSize:12,color:"#64748b",lineHeight:1.6}}>Crossroads en De Vreemde Ander.</p>
          </button>
          <button onClick={()=>runStart(onStartDeel3)} style={{padding:"16px 14px",borderRadius:16,border:"1px solid #e2e8f0",background:"#fff",textAlign:"left",cursor:"pointer",fontFamily:FONT,boxShadow:"0 8px 24px rgba(15,23,42,.05)"}}>
            <p style={{margin:0,fontSize:10,fontWeight:800,color:"#16a34a",textTransform:"uppercase",letterSpacing:1}}>III: Final Destination</p>
            <p style={{margin:"5px 0 0",fontSize:14,fontWeight:900,color:"#0f172a"}}>Werk aan Deel III</p>
            <p style={{margin:"6px 0 0",fontSize:12,color:"#64748b",lineHeight:1.6}}>Brug in de Mist en totaalportfolio.</p>
          </button>
        </div>

        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:16,boxShadow:"0 8px 24px rgba(15,23,42,.05)"}}>
          <label style={{display:"block",fontSize:10,fontWeight:800,color:"#64748b",textTransform:"uppercase",letterSpacing:1.2,marginBottom:6}}>Verder met code</label>
          <div style={{display:"flex",gap:8}}>
            <input value={resumeCode} onChange={e=>setResumeCode(e.target.value.toUpperCase())} placeholder="bijv. MM-8K4P2X" style={{flex:1,padding:"10px 12px",borderRadius:10,border:"1.5px solid #d1d5db",fontFamily:"'DM Mono',monospace",letterSpacing:1}}/>
            <button onClick={()=>resumeCode.trim()&&onResume(resumeCode.trim())} style={{padding:"10px 14px",borderRadius:10,border:"none",background:"#0f172a",color:"#fff",fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Hervat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Landing({onStart, onResume, onStartDeel2}){
  const [gc,setGc]=useState("");
  const [age,setAge]=useState("");
  const [dash,setDash]=useState("");
  const [resumeCode,setResumeCode]=useState("");
  const GM_BLUE = "#1a73e8";
  const GM_BG = "#f1f3f4";
  const GM_TEXT = "#202124";
  const GM_MUTED = "#5f6368";
  const GM_BORDER = "#dadce0";

  function MiniIcon({type}){
    const common = {width:14,height:14,viewBox:"0 0 24 24",fill:"none",stroke:"#3c4043",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round"};
    if(type==="heart") return <svg {...common}><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>;
    if(type==="work") return <svg {...common}><path d="M3 7h18v12H3z"/><path d="M8 7V5h8v2"/><path d="M3 12h18"/></svg>;
    if(type==="drive") return <svg {...common}><path d="M3 12l9-9 9 9-9 9-9-9z"/><path d="M12 7v5h5"/></svg>;
    return <svg {...common}><polygon points="12 2 15 9 22 9 16.5 13.5 18.5 21 12 16.8 5.5 21 7.5 13.5 2 9 9 9"/></svg>;
  }

  const STEPS=[
    {color:TEAL,sc:TEAL_DARK,icon:"🌸",num:"00",label:"Privilege Wiel",tag:"Bewustwording",desc:"Verken jouw eigen rugzak. Reflecteer op privilege als startpunt voor bewustwording."},
    {color:"#3B82F6",sc:"#1d4ed8",icon:"🗺",num:"01",label:"De Kaart",tag:"Vertrekpunt",desc:"Kies 10 waarden die bij jou passen uit 35 professionele waarden, verdeeld over vijf Caluwé-kleuren."},
    {color:"#EAB308",sc:"#a16207",icon:"🧭",num:"02",label:"Het Kompas",tag:"Koersbepaling",desc:"Verklein je selectie naar 3 kernwaarden — de ankerpunten van jouw moreel kompas."},
    {color:"#F43F5E",sc:"#be123c",icon:"🛣",num:"03",label:"De Route",tag:"Onderweg",desc:"Reageer op vier realistische dilemma's en ontdek of je keuzes overeenkomen met jouw kompas."},
    {color:"#22C55E",sc:"#15803d",icon:"✨",num:"04",label:"STARR Reflectie",tag:"Eigen Ervaring",desc:"Beschrijf een situatie uit je verleden via de STARR-methode, waarbij één van je kernwaarden zichtbaar werd."},
  ];

  return(
    <div style={{minHeight:"100vh",fontFamily:FONT,background:GM_BG}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@500&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes floatPhone{0%,100%{transform:translateY(0) rotate(-3deg)}50%{transform:translateY(-14px) rotate(-3deg)}}@keyframes shimmer{0%{opacity:.4}50%{opacity:1}100%{opacity:.4}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulsePin{0%{box-shadow:0 0 0 0 rgba(26,115,232,.45)}100%{box-shadow:0 0 0 16px rgba(26,115,232,0)}}.phone{animation:floatPhone 5s ease-in-out infinite}.shimmer{animation:shimmer 2.5s ease-in-out infinite}`}</style>

      {/* HERO */}
      <section style={{background:"linear-gradient(180deg,#e8f0fe,#f1f3f4 60%,#f8f9fa)",position:"relative",overflow:"hidden",borderBottom:`1px solid ${GM_BORDER}`}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"linear-gradient(rgba(95,99,104,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(95,99,104,.08) 1px,transparent 1px)",backgroundSize:"56px 56px",pointerEvents:"none"}}/>
        <div style={{position:"absolute",width:420,height:420,borderRadius:"50%",background:"radial-gradient(circle,rgba(26,115,232,.25),transparent 70%)",top:-120,left:-90,pointerEvents:"none"}}/>
        <div style={{maxWidth:1000,margin:"0 auto",padding:"48px 24px 56px",display:"grid",gridTemplateColumns:"1fr auto",gap:40,alignItems:"start",position:"relative",zIndex:1}}>

          {/* Left */}
          <div style={{maxWidth:480}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(26,115,232,.12)",border:"1px solid rgba(26,115,232,.28)",borderRadius:99,padding:"5px 14px",fontSize:11,color:GM_BLUE,fontWeight:600,marginBottom:24,letterSpacing:.5}}>
              <span style={{width:7,height:7,borderRadius:"50%",background:GM_BLUE,display:"inline-block"}} className="shimmer"/>
              MORAL MAPS PLATFORM
            </div>
            <h1 style={{fontSize:"clamp(34px,6vw,56px)",fontWeight:900,lineHeight:1.0,letterSpacing:-1.5,marginBottom:16,color:GM_TEXT}}>Moral Maps<br/><span style={{color:GM_BLUE,textShadow:"0 0 18px rgba(26,115,232,.25)"}}>The beginning</span></h1>
            <p style={{color:GM_MUTED,fontSize:16,lineHeight:1.75,marginBottom:36,maxWidth:420}}>Start hier jouw traject in het Moral Maps platform en werk stap voor stap door Deel 1, Deel 2 en Deel 3.</p>

            {/* START FORM */}
            <div style={{background:"#fff",borderRadius:20,border:`1px solid ${GM_BORDER}`,padding:24,boxShadow:"0 1px 2px rgba(60,64,67,.2),0 2px 6px rgba(60,64,67,.12)"}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:18}}>
                <div style={{width:32,height:32,borderRadius:10,background:GM_BLUE,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>📍</div>
                <div><p style={{color:GM_TEXT,fontWeight:800,fontSize:15,margin:0}}>Start Deel 1: The Beginning</p><p style={{color:GM_MUTED,fontSize:11,marginTop:1}}>Vul in om te beginnen · anoniem</p></div>
              </div>
              <div style={{marginBottom:14}}>
                <label style={{color:GM_MUTED,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,display:"block",marginBottom:6}}>Groepscode</label>
                <input value={gc} onChange={e=>setGc(e.target.value)} placeholder="bijv. HBO25A"
                  style={{width:"100%",padding:"11px 15px",borderRadius:12,border:`1.5px solid ${gc.trim()?GM_BLUE:GM_BORDER}`,background:"#fff",color:GM_TEXT,fontSize:14,outline:"none",fontFamily:"'DM Mono',monospace",letterSpacing:1.5,transition:"border .2s"}}/>
              </div>
              <div style={{marginBottom:18}}>
                <label style={{color:GM_MUTED,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,display:"block",marginBottom:8}}>Leeftijdscategorie</label>
                <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
                  {AGE_CATS.map(a=>(
                    <button key={a} onClick={()=>setAge(a)} style={{padding:"7px 14px",borderRadius:99,border:`1.5px solid ${age===a?GM_BLUE:GM_BORDER}`,background:age===a?GM_BLUE:"#fff",color:age===a?"#fff":GM_MUTED,fontWeight:700,fontSize:12,cursor:"pointer",transition:"all .15s",fontFamily:FONT}}>{a}</button>
                  ))}
                </div>
              </div>
              <div style={{background:"#f8f9fa",borderRadius:10,padding:"9px 12px",marginBottom:16,border:`1px solid ${GM_BORDER}`}}>
                <p style={{color:GM_MUTED,fontSize:11,lineHeight:1.6,margin:0}}>🔒 <strong style={{color:GM_TEXT}}>Anoniem:</strong> Alleen groepscode en leeftijd worden opgeslagen. Geen naam, geen login.</p>
              </div>
              <button onClick={()=>{if(gc.trim()&&age)onStart(gc.trim().toUpperCase(),age,null);}} disabled={!gc.trim()||!age}
                style={{width:"100%",padding:"13px",borderRadius:99,border:"none",background:gc.trim()&&age?GM_BLUE:"#c4c7c5",color:"#fff",fontWeight:800,fontSize:15,cursor:gc.trim()&&age?"pointer":"not-allowed",boxShadow:gc.trim()&&age?"0 4px 14px rgba(26,115,232,.35)":"none",transition:"all .2s",fontFamily:FONT,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                Start Deel 1 →
              </button>
              <button
                onClick={()=>{if(gc.trim()&&age)onStartDeel2(gc.trim().toUpperCase(),age);}}
                disabled={!gc.trim()||!age}
                style={{width:"100%",marginTop:8,padding:"11px",borderRadius:99,border:`1.5px solid ${gc.trim()&&age?GM_BLUE:"#d1d5db"}`,background:"#fff",color:gc.trim()&&age?GM_BLUE:"#9ca3af",fontWeight:700,fontSize:13,cursor:gc.trim()&&age?"pointer":"not-allowed",transition:"all .2s",fontFamily:FONT}}>
                Testmodus: start direct bij Deel 2
              </button>
              <p style={{marginTop:6,fontSize:10,color:GM_MUTED,lineHeight:1.5}}>
                Handig voor checks. Je hoeft Deel 1 dan niet telkens opnieuw te doorlopen.
              </p>
              <div style={{marginTop:12,paddingTop:12,borderTop:`1px solid ${GM_BORDER}`}}>
                <label style={{color:GM_MUTED,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1.2,display:"block",marginBottom:6}}>Verder met code</label>
                <div style={{display:"flex",gap:8}}>
                  <input value={resumeCode} onChange={e=>setResumeCode(e.target.value.toUpperCase())} placeholder="bijv. MM-8K4P2X"
                    style={{flex:1,padding:"10px 12px",borderRadius:10,border:`1.5px solid ${GM_BORDER}`,background:"#fff",color:GM_TEXT,fontSize:13,outline:"none",fontFamily:"'DM Mono',monospace",letterSpacing:1}}/>
                  <button onClick={()=>resumeCode.trim()&&onResume(resumeCode.trim())}
                    style={{padding:"10px 14px",borderRadius:10,border:"none",background:"#0f172a",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:FONT}}>
                    Hervat →
                  </button>
                </div>
                <p style={{marginTop:6,fontSize:10,color:GM_MUTED,lineHeight:1.5}}>
                  Werkt zodra je sessie minimaal één keer is opgeslagen (bij afronding van Deel 1 of Deel 2).
                </p>
              </div>
            </div>
          </div>

          {/* Right: smartphone mockup */}
          <div style={{display:"flex",alignItems:"center",paddingTop:20,paddingRight:8,perspective:900}}>
            <div className="phone" style={{width:242,height:472,background:"linear-gradient(170deg,#232a36,#0c1119)",borderRadius:42,border:"2px solid #3b4350",boxShadow:"0 42px 95px rgba(0,0,0,.5),inset 0 1px 0 rgba(255,255,255,.22)",padding:11,flexShrink:0,transform:"rotate(-2deg)",transition:"transform .25s ease"}}>
              <div style={{width:72,height:18,background:"#0b1119",borderRadius:99,margin:"0 auto 8px",border:"1px solid #263142"}}/>
              <div style={{background:"#dfe6df",borderRadius:30,height:408,overflow:"hidden",position:"relative",boxShadow:"inset 0 0 0 1px rgba(255,255,255,.22), inset 0 -20px 35px rgba(0,0,0,.08)"}}>
                <img
                  src={ASSET_IMAGES.deel1.phoneMockup}
                  alt="Moral Maps mobiele preview Deel 1"
                  style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center 42%",display:"block",filter:"saturate(1.05) contrast(1.03)"}}
                />
                <div style={{position:"absolute",inset:0,background:"radial-gradient(circle at 50% 40%, transparent 60%, rgba(0,0,0,.13) 100%)",pointerEvents:"none"}}/>
                <div style={{position:"absolute",left:"8%",right:"8%",top:6,height:24,borderRadius:999,background:"linear-gradient(180deg,rgba(255,255,255,.38),rgba(255,255,255,0))",pointerEvents:"none"}}/>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROUTE STEPS */}
      <section style={{background:"#f8f9fa",padding:"56px 24px"}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:44}}>
            <p style={{fontSize:11,fontWeight:700,color:GM_BLUE,textTransform:"uppercase",letterSpacing:2.5,marginBottom:10}}>Jouw Routebeschrijving</p>
            <h2 style={{fontSize:"clamp(24px,4vw,36px)",fontWeight:900,color:"#0f172a",letterSpacing:-1}}>5 Stops, Deel 1: Vertrek</h2>
          </div>
          <div style={{position:"relative"}}>
            <div style={{position:"absolute",left:31,top:32,bottom:32,width:3,background:`linear-gradient(to bottom,${TEAL},#3B82F6,#EAB308,#F43F5E,#22C55E)`,borderRadius:99,zIndex:0}}/>
            {STEPS.map((s,i)=>(
              <div key={i} style={{display:"flex",gap:20,marginBottom:i<STEPS.length-1?28:0,position:"relative",zIndex:1}}>
                <div style={{width:64,flexShrink:0,display:"flex",justifyContent:"center"}}>
                  <div style={{width:64,height:64,borderRadius:"50%",background:`linear-gradient(135deg,${s.color},${s.sc})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,boxShadow:`0 6px 20px ${s.color}50`,border:"3px solid #f8fafc"}}>{s.icon}</div>
                </div>
                <div style={{flex:1,background:"#fff",borderRadius:18,border:"1px solid #e2e8f0",padding:"18px 22px",boxShadow:"0 2px 12px rgba(0,0,0,.06)",marginTop:7}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                    <span style={{fontSize:10,fontWeight:800,color:s.color,textTransform:"uppercase",letterSpacing:1.5}}>{s.tag}</span>
                    <span style={{fontSize:10,color:"#cbd5e1"}}>·</span>
                    <span style={{fontSize:10,fontWeight:600,color:"#94a3b8",fontFamily:"'DM Mono',monospace"}}>{s.num}</span>
                  </div>
                  <h3 style={{fontSize:18,fontWeight:900,color:"#0f172a",marginBottom:8,letterSpacing:-.3}}>{s.label}</h3>
                  <p style={{fontSize:13,color:"#64748b",lineHeight:1.75,margin:0}}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* KLEUREN */}
      <section style={{background:"#fff",padding:"48px 24px",borderTop:`1px solid ${GM_BORDER}`}}>
        <div style={{maxWidth:720,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <p style={{fontSize:11,fontWeight:700,color:GM_BLUE,textTransform:"uppercase",letterSpacing:2.5,marginBottom:8}}>De Vijf Kleuren</p>
            <h2 style={{fontSize:24,fontWeight:900,color:"#0f172a",letterSpacing:-.5}}>Caluwé's Veranderkleuren</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
            {Object.entries(CM).map(([key,c])=>(
              <div key={key} style={{background:c.bg,borderRadius:14,border:`1.5px solid ${c.border}`,padding:"14px 16px",display:"flex",alignItems:"flex-start",gap:10}}>
                <div style={{width:13,height:13,borderRadius:"50%",background:c.solid,flexShrink:0,marginTop:2}}/>
                <div><p style={{fontWeight:800,fontSize:13,color:c.text}}>{c.label}</p><p style={{fontSize:11,color:"#64748b",lineHeight:1.5,marginTop:2}}>{c.desc}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DASHBOARD */}
      <section style={{background:"#f8f9fa",padding:"36px 24px",borderTop:`1px solid ${GM_BORDER}`}}>
        <div style={{maxWidth:500,margin:"0 auto",textAlign:"center"}}>
          <p style={{color:GM_MUTED,fontSize:13,marginBottom:16}}>📊 <strong style={{color:GM_TEXT}}>Leidinggevende?</strong> Bekijk het groepsdashboard</p>
          <div style={{display:"flex",gap:8}}>
            <input value={dash} onChange={e=>setDash(e.target.value)} placeholder="Voer groepscode in…"
              style={{flex:1,padding:"10px 14px",borderRadius:10,border:`1.5px solid ${GM_BORDER}`,background:"#fff",color:GM_TEXT,fontSize:13,outline:"none",fontFamily:"'DM Mono',monospace",letterSpacing:1}}/>
            <button onClick={()=>dash.trim()&&onStart(null,null,dash.trim().toUpperCase())}
              style={{padding:"10px 20px",borderRadius:10,border:"none",background:GM_BLUE,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:FONT}}>Open →</button>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────

export default function MoralMaps(){
  const [screen,setScreen]=useState("trilogie-home");
  const [participantCode,setParticipantCode]=useState("");
  const [groupCode,setGroupCode]=useState("");
  const [age,setAge]=useState("");
  const [dashCode,setDashCode]=useState("");
  const [phase,setPhase]=useState(0); // 0=privilege, 1=kaart, 2=kompas, 3=dilemma's, 4=starr
  const [selVals,setSelVals]=useState([]);
  const [coreVals,setCoreVals]=useState([]);
  const [dilResp,setDilResp]=useState([]);
  const [curDil,setCurDil]=useState(0);
  const [pending,setPending]=useState(null);
  const [insight,setInsight]=useState(false);
  const [filter,setFilter]=useState(null);
  const [starr,setStarr]=useState({situatie:"",taak:"",actie:"",resultaat:"",reflectie:""});
  const [socialisatie,setSocialisatie]=useState({primair:"",secundair:"",transcultureel:"",professioneel:"",reflectie:""});
  const [bridge,setBridge]=useState({ballast:"",meenemen:"",vinden:"",kompas:""});
  const [saved,setSaved]=useState(false);
  const [savedLocal,setSavedLocal]=useState(false);
  const [saveErr,setSaveErr]=useState(null);
  const [showSmsDilemma,setShowSmsDilemma]=useState(false);
  const [smsChoice,setSmsChoice]=useState("");
  const [smsReflection,setSmsReflection]=useState("");
  const [deel2Step,setDeel2Step]=useState(0);
  const [crossroadsChoice,setCrossroadsChoice]=useState("");
  const [crossroadsReflectie,setCrossroadsReflectie]=useState("");
  const [vreemdeAnderResult,setVreemdeAnderResult]=useState(null);
  const [contentProfile,setContentProfile]=useState({
    locale:"nl",
    workContext:"algemeen",
    extraAssignment:"",
  });

  const pct=useMemo(()=>{
    if(phase===0)return 2;
    if(phase===1)return 14+(selVals.length/10)*12;
    if(phase===2)return 28+(coreVals.length/3)*12;
    if(phase===3)return 42+(curDil/DILEMMAS.length)*14;
    if(phase===4)return 58;
    if(phase===5)return 76;
    return 100;
  },[phase,selVals.length,coreVals.length,curDil]);

  const domColor=useMemo(()=>{
    const c={geel:0,blauw:0,rood:0,groen:0,wit:0};
    [...coreVals,...dilResp].forEach(x=>{if(x.color)c[x.color]++;});
    return Object.keys(c).reduce((a,b)=>c[a]>=c[b]?a:b);
  },[coreVals,dilResp]);

  function start(gc,ag,dc){
    if(dc){setDashCode(dc);setScreen("dashboard");return;}
    setParticipantCode(generateParticipantCode());
    setGroupCode(gc);
    setAge(ag);
    setScreen("app");
    setPhase(0);
  }
  function startDeel2Direct(gc, ag){
    setParticipantCode(generateParticipantCode());
    setGroupCode(gc);
    setAge(ag);
    // Minimale demo-kernwaarden zodat Deel 2 context direct bruikbaar is.
    setCoreVals([
      { id: 12, name: "Integriteit", color: "blauw" },
      { id: 16, name: "Empathie", color: "rood" },
      { id: 24, name: "Reflectie", color: "groen" },
    ]);
    setScreen("deel2");
    setDeel2Step(0);
  }
  function startDeel3Direct(gc, ag){
    setParticipantCode(generateParticipantCode());
    setGroupCode(gc);
    setAge(ag);
    if(coreVals.length===0){
      setCoreVals([
        { id: 12, name: "Integriteit", color: "blauw" },
        { id: 16, name: "Empathie", color: "rood" },
        { id: 24, name: "Reflectie", color: "groen" },
      ]);
    }
    setScreen("deel3");
  }
  async function resumeWithCode(code){
    const data = await dbLoadByParticipantCode(code);
    if(!data){
      alert("Nog geen opgeslagen sessie gevonden voor deze code. Rond eerst minimaal Deel 1 of Deel 2 af en probeer daarna opnieuw.");
      return;
    }
    setParticipantCode(data.participantCode || code.toUpperCase());
    setGroupCode(data.groupCode || "");
    setAge(data.age || "");
    setCoreVals(data.coreValues || []);
    setDilResp(data.dilemmaResponses || []);
    setStarr(data.starr || {situatie:"",taak:"",actie:"",resultaat:"",reflectie:""});
    setSocialisatie(data.socialisatie || {primair:"",secundair:"",transcultureel:"",professioneel:"",reflectie:""});
    const stage = (data.currentStage || "").toLowerCase();
    if(stage.startsWith("deel3")) {
      setScreen("deel3");
      return;
    }
    if(stage.startsWith("deel2")) {
      setScreen("deel2");
      setDeel2Step(0);
      return;
    }
    setScreen("app");
    setPhase(6);
    setSaved(true);
  }
  function reset(){setScreen("trilogie-home");setParticipantCode("");setGroupCode("");setAge("");setPhase(0);setSelVals([]);setCoreVals([]);setDilResp([]);setCurDil(0);setPending(null);setInsight(false);setFilter(null);setStarr({situatie:"",taak:"",actie:"",resultaat:"",reflectie:""});setSocialisatie({primair:"",secundair:"",transcultureel:"",professioneel:"",reflectie:""});setBridge({ballast:"",meenemen:"",vinden:"",kompas:""});setSaved(false);setSavedLocal(false);setSaveErr(null);setShowSmsDilemma(false);setSmsChoice("");setSmsReflection("");setDeel2Step(0);setCrossroadsChoice("");setCrossroadsReflectie("");setVreemdeAnderResult(null);setContentProfile({locale:"nl",workContext:"algemeen",extraAssignment:""});}
  async function saveProgress(currentStage){
    if(!participantCode || !groupCode) return;
    const result = await dbSave({
      participantCode,
      currentStage,
      groupCode,
      age,
      coreValues: coreVals,
      dilemmaResponses: dilResp,
      starr,
      dominantColor: domColor,
      socialisatie,
    });
    if(!result.ok) console.error("Save progress failed:", result.error);
  }
  async function saveAndFinish(){
    setSaveErr(null);
    setSavedLocal(false);
    const payload = {
      participantCode,
      currentStage:"deel1_done",
      groupCode,
      age,
      coreValues:coreVals,
      dilemmaResponses:dilResp,
      starr,
      dominantColor:domColor,
      socialisatie
    };
    const result = await dbSave({
      ...payload
    });
    if(result.ok){
      setSaved(true);
      setPhase(6);
      return;
    }
    try{
      localStorage.setItem("moralmaps_pending_save", JSON.stringify({
        ...payload,
        savedAt: new Date().toISOString(),
      }));
      setSavedLocal(true);
      setSaveErr(`Online opslaan mislukt (${result.error}). Je voortgang is lokaal bewaard en je kunt verder.`);
      setPhase(6);
    }catch{
      setSaveErr(`Opslaan mislukt: ${result.error}`);
    }
  }

  const filtered=filter?VALUES.filter(v=>v.color===filter):VALUES;

  if(screen==="trilogie-home")return <TrilogieHome onStartDeel1={(gc,ag)=>start(gc,ag,null)} onStartDeel2={startDeel2Direct} onStartDeel3={startDeel3Direct} onResume={resumeWithCode}/>;
  if(screen==="landing")return <Landing onStart={start} onResume={resumeWithCode} onStartDeel2={startDeel2Direct}/>;
  if(screen==="dashboard")return <div style={{minHeight:"100vh",background:"#f8fafc"}}><Dashboard groupCode={dashCode} onBack={()=>setScreen("trilogie-home")}/></div>;
  if(screen==="deel2"){
    const crossroadsOptions = [
      "Snelle, saaie route naar je bestemming",
      "Route naar je geboortedorp (herinneringen en oude vrienden)",
      "Route via een hypermoderne stad (shoppen, casino, uitgaan)",
      "Onbekende avontuurlijke route (vreemde mensen en uitdagingen)",
    ];
    return (
      <div style={{background:"#f8fafc",minHeight:"100vh",fontFamily:FONT}}>
        <div style={{maxWidth:760,margin:"0 auto",padding:"24px 16px 60px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <button onClick={()=>setScreen("trilogie-home")} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:999,padding:"8px 14px",cursor:"pointer",fontWeight:700,color:"#334155",fontFamily:FONT}}>← Terug</button>
            <div>
              <h2 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:-.4}}>Deel 2 — Onderweg</h2>
              <p style={{margin:0,fontSize:12,color:"#64748b"}}>Crossroads en De Vreemde Ander · Code: {participantCode || "n.v.t."}</p>
            </div>
          </div>

          {deel2Step===0&&(
            <div>
              <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:8,marginBottom:12}}>
                <img src={ASSET_IMAGES.deel2.phoneMockup} alt="Deel 2 smartphone mockup" style={{width:"100%",display:"block",borderRadius:10,maxHeight:260,objectFit:"cover"}} />
              </div>
              <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:"18px 20px"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>II: Crossroads</p>
                <h3 style={{margin:"0 0 8px",fontSize:20,fontWeight:900,color:"#0f172a"}}>Welkom in Deel 2</h3>
                <p style={{fontSize:13,color:"#334155",lineHeight:1.75,marginTop:0}}>
                  In dit deel sta je op een moreel kruispunt. Je onderzoekt eerst je routekeuze en verdiept daarna in De Vreemde Ander.
                </p>
                <button onClick={()=>setDeel2Step(1)} style={{width:"100%",padding:"12px",borderRadius:999,border:"none",background:TEAL,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:FONT}}>
                  Start Deel 2 →
                </button>
              </div>
            </div>
          )}

          {deel2Step===1&&(
            <div>
              <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:8,marginBottom:12}}>
                <img src={ASSET_IMAGES.deel2.crossroadsEvent} alt="Crossroads met vier afslagen" style={{width:"100%",display:"block",borderRadius:10,maxHeight:300,objectFit:"cover"}} />
              </div>
              <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:"18px 20px"}}>
                <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Signature opdracht Deel 2</p>
                <p style={{fontSize:13,color:"#334155",lineHeight:1.75,marginTop:0}}>
                  Je bent onderweg als er een groot bord opduikt: omleiding. Na een lange tocht door dorre weilanden kom je op een kruispunt met vier afslagen.
                </p>
                <p style={{fontSize:12,color:"#64748b",fontWeight:700,marginBottom:8}}>Welke route kies je?</p>
                <div style={{display:"grid",gap:8,marginBottom:10}}>
                  {crossroadsOptions.map((opt)=>(
                    <button key={opt} onClick={()=>setCrossroadsChoice(opt)} style={{textAlign:"left",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${crossroadsChoice===opt?TEAL:"#e2e8f0"}`,background:crossroadsChoice===opt?TEAL_LIGHT:"#fff",color:"#334155",fontSize:12,cursor:"pointer",fontFamily:FONT}}>
                      {opt}
                    </button>
                  ))}
                </div>
                <textarea value={crossroadsReflectie} onChange={e=>setCrossroadsReflectie(e.target.value)} rows={3} placeholder="Waarom kies je deze route, en hoe past dit bij je kernwaarden?" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT,marginBottom:12}} />
                <button onClick={()=>setDeel2Step(2)} disabled={!crossroadsChoice} style={{width:"100%",padding:"12px",borderRadius:999,border:"none",background:crossroadsChoice?TEAL:"#94a3b8",color:"#fff",fontWeight:700,fontSize:13,cursor:crossroadsChoice?"pointer":"not-allowed",fontFamily:FONT}}>
                  Verder naar De Vreemde Ander →
                </button>
              </div>
            </div>
          )}

          {deel2Step===2&&(
            <VreemdeAnder
              coreVals={coreVals}
              onComplete={(result)=>{
                setVreemdeAnderResult(result);
                setDeel2Step(3);
              }}
            />
          )}

          {deel2Step===3&&(
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:"20px"}}>
              <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Deel 2 afgerond</p>
              <h3 style={{margin:"0 0 8px",fontSize:18,fontWeight:900,color:"#0f172a"}}>Onderweg vastgelegd</h3>
              <p style={{fontSize:13,color:"#334155",lineHeight:1.7,marginTop:0}}>
                Je crossroads-keuze is gemaakt en je reflectie op de vreemde ander is ingevuld.
              </p>
              <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
                <p style={{fontSize:11,color:"#64748b",margin:"0 0 4px"}}>Jouw gekozen route:</p>
                <p style={{fontSize:13,color:"#0f172a",fontWeight:700,margin:0}}>{crossroadsChoice || "Niet ingevuld"}</p>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
                <select value={contentProfile.locale} onChange={(e)=>setContentProfile({...contentProfile,locale:e.target.value})} style={{padding:"9px 10px",borderRadius:10,border:"1.5px solid #e2e8f0",fontFamily:FONT,fontSize:12}}>
                  <option value="nl">Taal: Nederlands</option>
                  <option value="en">Language: English</option>
                </select>
                <input value={contentProfile.workContext} onChange={(e)=>setContentProfile({...contentProfile,workContext:e.target.value})} placeholder="Werkomgeving (bijv. onderwijs, zorg, IT)" style={{padding:"9px 10px",borderRadius:10,border:"1.5px solid #e2e8f0",fontFamily:FONT,fontSize:12}} />
              </div>
              <textarea value={contentProfile.extraAssignment} onChange={(e)=>setContentProfile({...contentProfile,extraAssignment:e.target.value})} rows={2} placeholder="Optionele vervolgopdracht (komt mee in PDF)" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT,marginBottom:10}} />
              <div style={{display:"flex",gap:10}}>
                <button onClick={()=>exportPDFDeel2({coreVals,crossroadsChoice,crossroadsReflectie,vreemdeAnderResult,profile:contentProfile,groupCode,age})} style={{flex:1,padding:"11px",borderRadius:999,border:"none",background:TEAL,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:FONT}}>↓ PDF/Print Deel 2</button>
                <button onClick={()=>setDeel2Step(0)} style={{flex:1,padding:"11px",borderRadius:999,border:"1.5px solid #e2e8f0",background:"#fff",color:"#334155",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:FONT}}>↺ Opnieuw Deel 2</button>
                <button onClick={async ()=>{await saveProgress("deel2_done");setScreen("deel3");}} style={{flex:1,padding:"11px",borderRadius:999,border:"none",background:"#0f172a",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:FONT}}>Naar Deel 3</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if(screen==="deel3"){
    return (
      <div style={{background:"#f8fafc",minHeight:"100vh",fontFamily:FONT}}>
        <div style={{maxWidth:760,margin:"0 auto",padding:"24px 16px 60px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
            <button onClick={()=>setScreen("trilogie-home")} style={{background:"#fff",border:"1px solid #e2e8f0",borderRadius:999,padding:"8px 14px",cursor:"pointer",fontWeight:700,color:"#334155",fontFamily:FONT}}>← Terug</button>
            <div>
              <h2 style={{margin:0,fontSize:22,fontWeight:900,letterSpacing:-.4}}>Deel 3 — Bestemming</h2>
              <p style={{margin:0,fontSize:12,color:"#64748b"}}>Brug in de Mist en totaalportfolio · Code: {participantCode || "n.v.t."}</p>
            </div>
          </div>

          <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:20,marginBottom:20}}>
            <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>🌫️ Signature opdracht Deel 3 — De Brug in de Mist</p>
            <div style={{marginBottom:12,borderRadius:12,overflow:"hidden",border:"1px solid #e2e8f0"}}>
              <img src={ASSET_IMAGES.deel3.bridgeEvent} alt="De brug in de mist met beperkte draagkracht" style={{width:"100%",height:"auto",display:"block",maxHeight:280,objectFit:"cover"}} />
            </div>
            <p style={{fontSize:13,color:"#334155",lineHeight:1.7,margin:"0 0 10px"}}>
              De brug heeft beperkte draagkracht. Je kunt niet alles meenemen naar je volgende bestemming.
            </p>
            <div style={{display:"grid",gap:10}}>
              <textarea value={bridge.ballast} onChange={e=>setBridge({...bridge,ballast:e.target.value})} rows={2} placeholder="Wat laat je bewust achter als ballast?" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT}} />
              <textarea value={bridge.meenemen} onChange={e=>setBridge({...bridge,meenemen:e.target.value})} rows={2} placeholder="Wat neem je absoluut mee?" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT}} />
              <textarea value={bridge.vinden} onChange={e=>setBridge({...bridge,vinden:e.target.value})} rows={2} placeholder="Wat hoop je te vinden aan de overkant?" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT}} />
              <textarea value={bridge.kompas} onChange={e=>setBridge({...bridge,kompas:e.target.value})} rows={2} placeholder="Welke kernwaarde stuurt deze keuze?" style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT}} />
            </div>
          </div>

          <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:16}}>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button onClick={async ()=>{await saveProgress("deel3_done");}} style={{flex:1,padding:"11px",borderRadius:999,border:"none",background:TEAL,color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:FONT}}>Opslaan Deel 3</button>
              <button onClick={()=>exportPDFDeel3Portfolio({coreVals,dilResp,starr,smsDilemma:{smsChoice,smsReflection},bridge,domColor,socialisatie,profile:contentProfile,groupCode,age})} style={{flex:1,padding:"11px",borderRadius:999,border:"none",background:"#0f172a",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:FONT}}>↓ PDF/Print Totaalportfolio</button>
            </div>
          </div>
        </div>
      </div>
    );
  }


  // ── APP ──
  return(
    <div style={{background:"#f8fafc",minHeight:"100vh",fontFamily:FONT}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;900&family=DM+Mono:wght@500&display=swap');*{box-sizing:border-box}textarea,input{font-family:inherit}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{maxWidth:680,margin:"0 auto",padding:"20px 16px 60px"}}>

        {/* Header */}
        <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:"14px 20px",marginBottom:20,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:38,height:38,borderRadius:10,background:TEAL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>🧭</div>
            <div><div style={{fontWeight:800,fontSize:16}}>Moral Maps Trilogie</div><div style={{fontSize:10,color:"#94a3b8"}}>Code: {participantCode || "n.v.t."} · Groep: {groupCode} · {age}</div></div>
          </div>
          <button onClick={reset} style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:99,padding:"6px 14px",fontSize:12,fontWeight:600,color:"#64748b",cursor:"pointer",fontFamily:FONT}}>↺ Opnieuw</button>
        </div>

        <PBar step={phase} pct={pct}/>

        {/* P0 — Privilege Wiel */}
        {phase===0 && <PrivilegeWheel onComplete={()=>setPhase(1)}/>}

        {/* P1 — De Kaart */}
        {phase===1&&(
          <div>
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:"16px 20px",marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div><h2 style={{fontWeight:800,fontSize:17,margin:0}}>🗺 De Grote Kaart</h2><p style={{fontSize:12,color:"#64748b",margin:"4px 0 0"}}>Kies <strong>10 waarden</strong> die bij jou passen.</p></div>
                <div style={{width:48,height:48,borderRadius:"50%",background:TEAL_LIGHT,border:`2px solid ${TEAL}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:15,color:TEAL}}>{selVals.length}<span style={{fontSize:10,color:"#94a3b8"}}>/10</span></div>
              </div>
            </div>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:12,marginBottom:16,display:"flex",flexWrap:"wrap",gap:8}}>
              <button onClick={()=>setFilter(null)} style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${!filter?TEAL:"#e2e8f0"}`,background:!filter?TEAL:"#fff",color:!filter?"#fff":"#64748b",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:FONT}}>Alle</button>
              {Object.entries(CM).map(([k,c])=>(
                <button key={k} onClick={()=>setFilter(filter===k?null:k)} style={{padding:"6px 14px",borderRadius:99,border:`1.5px solid ${filter===k?c.border:"#e2e8f0"}`,background:filter===k?c.solid:"#fff",color:filter===k?(k==="geel"?"#451A03":"#fff"):c.text,fontSize:11,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",gap:5,fontFamily:FONT}}>
                  <Dot color={k} size={7}/>{c.label}
                </button>
              ))}
            </div>
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:16,marginBottom:16}}>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(148px,1fr))",gap:8}}>
                {filtered.map(v=>{const sel=selVals.some(s=>s.id===v.id);const c=CM[v.color];return(
                  <button key={v.id} disabled={!sel&&selVals.length>=10}
                    onClick={()=>{if(sel)setSelVals(selVals.filter(s=>s.id!==v.id));else if(selVals.length<10)setSelVals([...selVals,v]);}}
                    style={{padding:"10px 12px",borderRadius:12,border:`2px solid ${sel?c.border:c.border+"60"}`,background:sel?c.solid:c.bg,color:sel?(v.color==="geel"?"#451A03":"#fff"):c.text,fontWeight:600,fontSize:12.5,cursor:!sel&&selVals.length>=10?"not-allowed":"pointer",opacity:!sel&&selVals.length>=10?0.35:1,display:"flex",alignItems:"center",gap:6,transition:"all .15s",boxShadow:sel?`0 0 0 2px ${c.border}44`:"none",fontFamily:FONT}}>
                    {sel?"✓ ":<Dot color={v.color}/>}{v.name}
                  </button>
                );})}
              </div>
            </div>
            {selVals.length>0&&(
              <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"12px 16px",marginBottom:16}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Jouw selectie</p>
                <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{selVals.map(v=>{const c=CM[v.color];return<button key={v.id} onClick={()=>setSelVals(selVals.filter(s=>s.id!==v.id))} style={{display:"inline-flex",alignItems:"center",gap:5,padding:"4px 10px",borderRadius:99,border:`1px solid ${c.border}`,background:c.bg,color:c.text,fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:FONT}}>{v.name} ×</button>;})}</div>
              </div>
            )}
            {selVals.length>=10&&<div style={{display:"flex",justifyContent:"flex-end"}}><button onClick={()=>setPhase(2)} style={{padding:"11px 24px",borderRadius:99,border:"none",background:TEAL,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:`0 4px 12px ${TEAL_GLOW}`,fontFamily:FONT}}>Smeed je Kompas →</button></div>}
          </div>
        )}

        {/* P2 — Kompas */}
        {phase===2&&(
          <div>
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:"20px",marginBottom:16,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:8}}>🧭</div>
              <h2 style={{fontWeight:800,fontSize:17,margin:0}}>Het Kompas</h2>
              <p style={{fontSize:12,color:"#64748b",marginTop:6}}>Kies <strong>3 kernwaarden</strong> als ankerpunten van jouw moreel kompas.</p>
            </div>
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:20,marginBottom:16}}>
              <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center"}}>
                {selVals.map(v=>{const isC=coreVals.some(c=>c.id===v.id);const c=CM[v.color];return(
                  <button key={v.id} disabled={!isC&&coreVals.length>=3}
                    onClick={()=>{if(isC)setCoreVals(coreVals.filter(c=>c.id!==v.id));else if(coreVals.length<3)setCoreVals([...coreVals,v]);}}
                    style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 16px",borderRadius:999,border:`2px solid ${c.border}`,background:isC?c.solid:c.bg,color:isC?(v.color==="geel"?"#451A03":"#fff"):c.text,fontWeight:700,fontSize:13,cursor:!isC&&coreVals.length>=3?"not-allowed":"pointer",opacity:!isC&&coreVals.length>=3?0.35:1,boxShadow:isC?`0 0 0 3px ${c.border}44`:"none",transition:"all .15s",fontFamily:FONT}}>
                    {!isC&&<Dot color={v.color}/>}{v.name}
                  </button>
                );})}
              </div>
            </div>
            {coreVals.length>0&&(
              <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:20,marginBottom:16}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,textAlign:"center",marginBottom:14}}>Jouw moreel kompas</p>
                <div style={{display:"flex",justifyContent:"center",gap:14,flexWrap:"wrap"}}>{coreVals.map(cv=>{const c=CM[cv.color];return<div key={cv.id} style={{textAlign:"center",padding:"16px 20px",borderRadius:16,border:`2px solid ${c.border}`,background:c.bg}}><div style={{fontSize:24,marginBottom:4}}>🧭</div><p style={{fontWeight:700,fontSize:13,color:c.text,margin:0}}>{cv.name}</p><p style={{fontSize:10,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginTop:2}}>{c.label}</p></div>;})}</div>
              </div>
            )}
            <div style={{textAlign:"center"}}>
              <p style={{fontSize:12,color:"#94a3b8",marginBottom:12}}><strong style={{color:TEAL}}>{coreVals.length}</strong> / 3 kernwaarden</p>
              {coreVals.length===3&&<button onClick={()=>setPhase(3)} style={{padding:"11px 24px",borderRadius:99,border:"none",background:TEAL,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:`0 4px 12px ${TEAL_GLOW}`,fontFamily:FONT}}>Start de Route →</button>}
            </div>
          </div>
        )}

        {/* P3 — Dilemma's */}
        {phase===3&&(
          <div>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:8,marginBottom:12}}>
              <img src={ASSET_IMAGES.deel1.phoneMockup} alt="Deel 1 smartphone mockup" style={{width:"100%",height:"auto",display:"block",borderRadius:10,maxHeight:260,objectFit:"cover"}} />
            </div>
            <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:12,fontWeight:600,color:"#64748b"}}>Dilemma {curDil+1} van {DILEMMAS.length}</span>
              <div style={{display:"flex",gap:6}}>{DILEMMAS.map((_,i)=><div key={i} style={{width:20,height:5,borderRadius:99,background:i<=curDil?TEAL:"#e2e8f0",transition:"background .3s"}}/>)}</div>
            </div>
            <div style={{borderRadius:16,overflow:"hidden",border:"1px solid #e2e8f0",marginBottom:16}}>
              <div style={{background:"#0f172a",padding:"20px 20px 18px"}}>
                <h3 style={{color:"#fff",fontWeight:800,fontSize:18,margin:0}}>📍 {DILEMMAS[curDil].title}</h3>
                <p style={{color:"#94a3b8",fontSize:13,marginTop:8,lineHeight:1.6}}>{DILEMMAS[curDil].scenario}</p>
              </div>
              <div style={{background:"#fff",padding:18}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>Wat doe jij?</p>
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  {DILEMMAS[curDil].options.map((opt,i)=>{const c=CM[opt.color];const isSel=pending?.text===opt.text;return(
                    <button key={i} disabled={insight}
                      onClick={()=>{setPending(opt);setInsight(true);}}
                      style={{textAlign:"left",padding:"13px 16px",borderRadius:12,border:`2px solid ${isSel?c.border:c.border+"60"}`,background:isSel?c.bg:"#fff",color:c.text,fontWeight:500,fontSize:13,cursor:insight?"not-allowed":"pointer",opacity:insight&&!isSel?0.4:1,display:"flex",alignItems:"flex-start",gap:10,lineHeight:1.5,boxShadow:isSel?`0 0 0 3px ${c.border}30`:"none",fontFamily:FONT}}>
                      <Dot color={opt.color} size={9}/>{opt.text}
                    </button>
                  );})}
                </div>
              </div>
            </div>
            {insight&&pending&&(()=>{
              const isM=coreVals.some(cv=>cv.color===pending.color);
              const match=coreVals.find(cv=>cv.color===pending.color);
              const c=CM[pending.color];
              return(
                <div style={{borderRadius:16,border:`2px solid ${isM?TEAL:"#EAB308"}`,background:"#fff",overflow:"hidden",marginBottom:16}}>
                  <div style={{background:isM?TEAL_LIGHT:"#fefce8",padding:"12px 18px",display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:32,height:32,borderRadius:"50%",background:isM?TEAL:"#EAB308",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{isM?"✓":"!"}</div>
                    <strong style={{color:isM?TEAL_DARK:"#854d0e",fontSize:14}}>{isM?"Koersvast!":"Interessant!"}</strong>
                  </div>
                  <div style={{padding:"14px 18px"}}>
                    {isM?<p style={{fontSize:13,color:"#334155",lineHeight:1.6}}>Deze keuze sluit aan bij jouw kernwaarde <strong style={{color:c.text}}>{match.name}</strong>. Je handelt vanuit je kompas.</p>:<p style={{fontSize:13,color:"#334155",lineHeight:1.6}}>Je kiest hier voor <strong style={{color:c.text}}>{c.label}</strong>, terwijl je kompas op andere waarden staat. Wat gaf dit de doorslag?</p>}
                    <div style={{marginTop:12,paddingTop:12,borderTop:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                      <span style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase"}}>Kompas:</span>
                      {coreVals.map(cv=>{const cc=CM[cv.color];const act=cv.color===pending.color;return<span key={cv.id} style={{display:"inline-flex",alignItems:"center",gap:4,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99,border:`1px solid ${act?cc.border:"#e2e8f0"}`,background:act?cc.bg:"#f8fafc",color:act?cc.text:"#64748b"}}><Dot color={cv.color} size={7}/>{cv.name}</span>;})}
                    </div>
                    <button onClick={()=>{
                      setDilResp(prev=>[...prev,pending]);
                      setPending(null);
                      setInsight(false);
                      if(curDil < DILEMMAS.length - 1) setCurDil(prev=>prev + 1);
                      else setPhase(4);
                    }}
                      style={{marginTop:14,width:"100%",padding:"11px",borderRadius:99,border:"none",background:TEAL,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:FONT}}>
                      {curDil<DILEMMAS.length-1?"Volgende dilemma →":"Naar STARR Reflectie →"}
                    </button>
                  </div>
                </div>
              );
            })()}
            {!insight&&(
              <div style={{background:"#fff",borderRadius:12,border:"1px solid #e2e8f0",padding:"10px 16px",display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:11,color:"#94a3b8"}}>🧭 Jouw kompas:</span>
                {coreVals.map(cv=>{const c=CM[cv.color];return<span key={cv.id} style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:11,fontWeight:600,padding:"3px 10px",borderRadius:99,border:`1px solid ${c.border}`,color:c.text,background:c.bg}}><Dot color={cv.color} size={7}/>{cv.name}</span>;})}
              </div>
            )}
          </div>
        )}

        {/* P4 — STARR */}
        {phase===4&&(
          <div>
            <div style={{borderRadius:16,overflow:"hidden",border:"1px solid #e2e8f0",marginBottom:20}}>
              <div style={{background:TEAL,padding:"20px 22px"}}>
                <h2 style={{color:"#fff",fontWeight:800,fontSize:18,margin:0}}>✨ STARR Reflectie</h2>
                <p style={{color:"rgba(255,255,255,.85)",fontSize:13,marginTop:8,lineHeight:1.6}}>Geef een voorbeeld uit je eigen verleden waarbij je ook voor (één van) je drie kernwaarden hebt gekozen. Gebruik de STARR-methode om deze situatie te beschrijven.</p>
              </div>
              <div style={{background:"#fff",padding:20,display:"flex",flexDirection:"column",gap:18}}>
                <div style={{background:"#f8fafc",borderRadius:12,border:"1px solid #e2e8f0",padding:14}}>
                  <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Jouw kernwaarden</p>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{coreVals.map(cv=>{const c=CM[cv.color];return<span key={cv.id} style={{display:"inline-flex",alignItems:"center",gap:6,padding:"5px 12px",borderRadius:99,border:`1.5px solid ${c.border}`,background:c.bg,color:c.text,fontWeight:700,fontSize:12}}><Dot color={cv.color}/>{cv.name}</span>;})}</div>
                </div>
                <div style={{background:TEAL_LIGHT,borderRadius:10,border:`1px solid ${TEAL}40`,padding:"12px 16px",display:"flex",gap:10}}>
                  <span style={{fontSize:16,flexShrink:0}}>✏️</span>
                  <p style={{fontSize:12,color:"#1a5c46",lineHeight:1.7,margin:0}}><strong>Opdracht:</strong> Geef een voorbeeld uit je eigen verleden waarbij je ook voor (één van) je drie kernwaarden hebt gekozen. Beschrijf een situatie in je werk of privéleven waar die waarde zichtbaar werd in jouw keuze of handelen.</p>
                </div>
                {[{key:"situatie",label:"Situatie",hint:"Wat was de context? Waar en wanneer speelde het zich af?"},{key:"taak",label:"Taak",hint:"Wat was jouw rol of verantwoordelijkheid in deze situatie?"},{key:"actie",label:"Actie",hint:"Welke stappen heb je concreet ondernomen? Wat deed jij?"},{key:"resultaat",label:"Resultaat",hint:"Wat was het resultaat van jouw aanpak?"},{key:"reflectie",label:"Reflectie",hint:"Wat heb je hiervan geleerd? Wat zou je anders doen? Welke kernwaarde speelde een rol?"}].map(({key,label,hint})=>(
                  <div key={key}>
                    <label style={{fontSize:11,fontWeight:800,color:TEAL,textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:4}}>{label}</label>
                    <p style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>{hint}</p>
                    <textarea value={starr[key]} onChange={e=>setStarr({...starr,[key]:e.target.value})} placeholder={`Beschrijf de ${label.toLowerCase()}…`} rows={3}
                      style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,lineHeight:1.6,resize:"vertical",outline:"none"}}
                      onFocus={e=>e.target.style.borderColor=TEAL} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/>
                  </div>
                ))}
                {saveErr&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",color:"#b91c1c",fontSize:12}}>⚠️ {saveErr}</div>}
                <button onClick={()=>setPhase(5)}
                  style={{padding:"13px",borderRadius:99,border:"none",background:TEAL,color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",boxShadow:`0 4px 12px ${TEAL_GLOW}`,fontFamily:FONT,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  🎒 Naar Jouw Rugzak →
                </button>
              </div>
            </div>
          </div>
        )}

        {phase===5&&(
          <div style={{borderRadius:16,overflow:"hidden",border:"1px solid #e2e8f0",marginBottom:20,background:"#fff"}}>
            <div style={{background:"linear-gradient(135deg,#7c3aed,#8B5CF6)",padding:"20px 22px"}}>
              <h2 style={{color:"#fff",fontWeight:800,fontSize:18,margin:0}}>🎒 Jouw Rugzak</h2>
              <p style={{color:"#ddd6fe",fontSize:13,marginTop:8,lineHeight:1.6}}>Reflecteer op hoe socialisatie je waarden en professionele blik vormt.</p>
            </div>
            <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
              {[
                {
                  key:"primair",
                  label:"Primaire socialisatie",
                  hint:"Van wie heb je als eerste jouw waarden en normen meegekregen (bijvoorbeeld thuis of in je gezin)?",
                },
                {
                  key:"secundair",
                  label:"Secundaire socialisatie",
                  hint:"Welke invloed hadden school, vrienden, sport, media of je omgeving op hoe jij bent gaan denken?",
                },
                {
                  key:"transcultureel",
                  label:"Transculturele aspecten",
                  hint:"Welke rol speelden cultuur, afkomst, taal of migratie in hoe jij naar jezelf en anderen kijkt?",
                },
                {
                  key:"professioneel",
                  label:"Professionele identiteit",
                  hint:"Welke ervaringen in stage, werk of opleiding hebben jouw professionele houding gevormd?",
                },
                {
                  key:"reflectie",
                  label:"Reflectie & koppeling aan Caluwe",
                  hint:"Welke veranderkleur herken je het meest in jezelf, en hoe zie je die terug in je keuzes en gedrag?",
                }
              ].map(({key,label,hint})=>(
                <div key={key}>
                  <label style={{fontSize:11,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",letterSpacing:1,display:"block",marginBottom:6}}>{label}</label>
                  <p style={{fontSize:11,color:"#94a3b8",lineHeight:1.6,margin:"0 0 6px"}}>{hint}</p>
                  <textarea
                    value={socialisatie[key]}
                    onChange={e=>setSocialisatie({...socialisatie,[key]:e.target.value})}
                    rows={3}
                    placeholder={`Beschrijf ${label.toLowerCase()}...`}
                    style={{width:"100%",padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT}}
                  />
                </div>
              ))}
              {saveErr&&<div style={{background:"#fef2f2",border:"1px solid #fecaca",borderRadius:10,padding:"12px 16px",color:"#b91c1c",fontSize:12}}>⚠️ {saveErr}</div>}
              <button onClick={saveAndFinish} style={{padding:"13px",borderRadius:99,border:"none",background:"#7c3aed",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",fontFamily:FONT}}>
                🏁 Naar Reisverslag →
              </button>
            </div>
          </div>
        )}

        {phase===6&&(
          <div>
            <div style={{background:"#0f172a",borderRadius:16,padding:"28px 24px",textAlign:"center",marginBottom:20}}>
              <div style={{fontSize:44,marginBottom:8}}>🏆</div>
              <h2 style={{color:"#fff",fontWeight:900,fontSize:22,margin:0}}>Jouw Reisverslag</h2>
              <p style={{color:"#94a3b8",fontSize:12,marginTop:6}}>Overzicht van je volledige route in Moral Maps 1</p>
              {saved&&<div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:6,background:"#1e293b",borderRadius:99,padding:"5px 14px",fontSize:11,color:"#4ade80",fontWeight:600}}>✓ Opgeslagen in Supabase</div>}
              {savedLocal&&<div style={{marginTop:10,display:"inline-flex",alignItems:"center",gap:6,background:"#1e293b",borderRadius:99,padding:"5px 14px",fontSize:11,color:"#facc15",fontWeight:600}}>⚠ Lokaal bewaard (online save later opnieuw proberen)</div>}
            </div>
            {!showSmsDilemma&&(
              <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"16px 18px",marginBottom:14}}>
                <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>📩 Afsluitende SMS-opdracht</p>
                <div style={{marginBottom:10,borderRadius:12,overflow:"hidden",border:"1px solid #e2e8f0"}}>
                  <img src={ASSET_IMAGES.deel1.smsEvent} alt="Onverwachte sms in slaapkamer om 5 uur" style={{width:"100%",height:"auto",display:"block",maxHeight:260,objectFit:"cover"}} />
                </div>
                <p style={{fontSize:13,color:"#334155",lineHeight:1.7,margin:0}}>
                  Vlak voor je afsluit ontvang je een bericht van een goede vriend uit het verleden:
                  <strong> "Kun je me helpen? Ik sta zonder geld op station Roosendaal. Het is nat, koud, 01:00 uur en ik heb alleen zomerkleren."</strong>
                  Tegelijk heb je je partner beloofd om om 05:00 op te staan voor jullie reis. Wat weegt nu zwaarder?
                </p>
                <button onClick={()=>setShowSmsDilemma(true)} style={{marginTop:12,padding:"10px 18px",borderRadius:99,border:"none",background:"#0f172a",color:"#fff",fontWeight:700,fontSize:12,cursor:"pointer",fontFamily:FONT}}>
                  Beantwoord dit einddilemma →
                </button>
              </div>
            )}
            {showSmsDilemma&&(
              <div style={{background:"#fff",borderRadius:14,border:"1px solid #e2e8f0",padding:"16px 18px",marginBottom:14}}>
                <p style={{fontSize:12,fontWeight:800,color:"#0f172a",marginBottom:8}}>SMS uit Roosendaal — wat doe je?</p>
                <div style={{display:"grid",gap:8}}>
                  {[
                    "Ik ga direct helpen en haal mijn vriend op.",
                    "Ik regel direct hulp op afstand (taxi/hotel/geld) en blijf mijn afspraak met mijn partner nakomen.",
                    "Ik kies nu voor mijn partner en help mijn vriend pas later."
                  ].map((opt)=>(
                    <button key={opt} onClick={()=>setSmsChoice(opt)} style={{textAlign:"left",padding:"10px 12px",borderRadius:10,border:`1.5px solid ${smsChoice===opt?TEAL:"#e2e8f0"}`,background:smsChoice===opt?TEAL_LIGHT:"#fff",color:"#334155",fontSize:12,cursor:"pointer",fontFamily:FONT}}>
                      {opt}
                    </button>
                  ))}
                </div>
                <textarea value={smsReflection} onChange={e=>setSmsReflection(e.target.value)} rows={3} placeholder="Welke waarden vind je hier belangrijker en waarom?" style={{width:"100%",marginTop:10,padding:"10px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:12,lineHeight:1.6,resize:"vertical",outline:"none",fontFamily:FONT}} />
              </div>
            )}
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:20,marginBottom:16}}>
              <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>🧭 Kernwaarden</p>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>{coreVals.map(cv=>{const c=CM[cv.color];return<div key={cv.id} style={{padding:"10px 14px",borderRadius:12,border:`1.5px solid ${c.border}`,background:c.bg}}><p style={{fontWeight:700,fontSize:13,color:c.text,margin:0}}>{cv.name}</p></div>;})}</div>
            </div>
            <div style={{background:"#fff",borderRadius:16,border:"1px solid #e2e8f0",padding:20,marginBottom:20}}>
              <p style={{fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,marginBottom:12}}>🎒 Rugzak reflectie</p>
              {Object.entries(socialisatie).map(([key,val])=>(
                <div key={key} style={{marginBottom:10}}>
                  <span style={{fontSize:10,fontWeight:800,color:"#7c3aed",textTransform:"uppercase",letterSpacing:1}}>{key}</span>
                  <p style={{fontSize:13,color:val?"#334155":"#cbd5e1",marginTop:2,lineHeight:1.6}}>{val||"Niet ingevuld"}</p>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:12}}>
              <button onClick={()=>setScreen("deel2")} style={{flex:1,padding:"12px",borderRadius:99,border:"1.5px solid #d1d5db",background:"#fff",color:"#111827",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:FONT}}>→ Start Deel 2</button>
              <button onClick={()=>exportPDF(coreVals,dilResp,starr,{smsChoice,smsReflection},domColor,groupCode,age)} style={{flex:1,padding:"12px",borderRadius:99,border:"none",background:TEAL,color:"#fff",fontWeight:700,fontSize:13,cursor:"pointer",boxShadow:`0 4px 12px ${TEAL_GLOW}`,fontFamily:FONT}}>↓ Download PDF</button>
              <button onClick={reset} style={{flex:1,padding:"12px",borderRadius:99,border:"1.5px solid #e2e8f0",background:"#fff",color:"#334155",fontWeight:700,fontSize:13,cursor:"pointer",fontFamily:FONT}}>↺ Opnieuw beginnen</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
