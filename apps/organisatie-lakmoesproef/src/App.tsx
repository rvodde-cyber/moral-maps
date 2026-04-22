import { useMemo, useState } from "react";

type Question = {
  id: number;
  title: string;
  subtitle: string;
  explanation: string;
};

type Pillar = {
  label: string;
  avg: number;
};

const questions: Question[] = [
  { id: 1, title: "Ethische visie", subtitle: "Richting en betekenis", explanation: "In welke mate is de missie concreet verbonden aan maatschappelijke waarde en verantwoord handelen?" },
  { id: 2, title: "Leiderschap als voorbeeld", subtitle: "Walk the talk", explanation: "In welke mate laten leidinggevenden in keuzes en gedrag zien wat zij van professionals verwachten?" },
  { id: 3, title: "Psychologische veiligheid", subtitle: "Ruimte om te spreken", explanation: "In welke mate ervaren medewerkers veiligheid om fouten, twijfels en zorgen bespreekbaar te maken?" },
  { id: 4, title: "Waarden in besluitvorming", subtitle: "Meer dan KPI's", explanation: "In welke mate worden waarden zichtbaar meegewogen naast kosten, snelheid en resultaat?" },
  { id: 5, title: "Transparantie", subtitle: "Uitlegbaar handelen", explanation: "In welke mate zijn besluiten navolgbaar en helder onderbouwd voor medewerkers en stakeholders?" },
  { id: 6, title: "Aanspreekcultuur", subtitle: "Constructieve correctie", explanation: "In welke mate spreken collega's elkaar professioneel aan op gedrag en verantwoordelijkheid?" },
  { id: 7, title: "Leren van fouten", subtitle: "Van incident naar leren", explanation: "In welke mate worden incidenten structureel geanalyseerd en omgezet in betere werkwijzen?" },
  { id: 8, title: "Rechtvaardigheid", subtitle: "Eerlijk en consistent", explanation: "In welke mate zijn kansen, beoordeling en beloning binnen teams rechtvaardig ingericht?" },
  { id: 9, title: "Inclusie", subtitle: "Diversiteit benutten", explanation: "In welke mate worden verschillende perspectieven actief betrokken in overleg en besluitvorming?" },
  { id: 10, title: "Eigenaarschap", subtitle: "Verantwoordelijkheid op elk niveau", explanation: "In welke mate ervaren professionals dat zij zelf een verantwoordelijkheid dragen voor de ethische kwaliteit van hun werkzaamheden?" },
  { id: 11, title: "Stakeholderperspectief", subtitle: "Brede impact", explanation: "In welke mate worden effecten op klanten, burgers en partners expliciet meegewogen?" },
  { id: 12, title: "Lange termijn", subtitle: "Duurzame keuzes", explanation: "In welke mate kiest de organisatie voor duurzame oplossingen boven korte-termijnwinst?" },
  { id: 13, title: "Samenwerking", subtitle: "Silo's doorbreken", explanation: "In welke mate werken teams en afdelingen integraal samen aan gedeelde waarden en doelen?" },
  { id: 14, title: "Signalering en opvolging", subtitle: "Melden heeft effect", explanation: "In welke mate worden signalen over risico's en misstanden tijdig en aantoonbaar opgevolgd?" },
  { id: 15, title: "Morele reflectie", subtitle: "Tijd voor beraad", explanation: "In welke mate bestaat er structureel ruimte voor ethische reflectie op complexe casuistiek?" },
  { id: 16, title: "Vakmanschap", subtitle: "Kennis en competenties", explanation: "In welke mate worden medewerkers getraind in morele oordeelsvorming en professioneel handelen?" },
  { id: 17, title: "Heldere grenzen", subtitle: "Normen en consequenties", explanation: "In welke mate zijn gedragsnormen, grensoverschrijding en consequenties expliciet en bekend?" },
  { id: 18, title: "Datagedreven verbeteren", subtitle: "Meten is leren", explanation: "In welke mate gebruikt de organisatie betrouwbare data om ethisch werken gericht te versterken?" },
  { id: 19, title: "Menselijke maat", subtitle: "Mensen boven systeemdruk", explanation: "In welke mate blijft de menselijke maat leidend in beleid, uitvoering en klantcontact?" },
  { id: 20, title: "Externe verantwoording", subtitle: "Open naar buiten", explanation: "In welke mate legt de organisatie actief verantwoording af over ethische keuzes en impact?" },
  { id: 21, title: "Verbeterkracht", subtitle: "Van scan naar uitvoering", explanation: "In welke mate worden inzichten uit metingen vertaald naar duidelijke acties en eigenaarschap?" },
];

function RadarChart({ pillars }: { pillars: Pillar[] }) {
  const size = 280;
  const center = size / 2;
  const maxRadius = 95;
  const steps = 5;
  const n = pillars.length;
  const angleStep = (Math.PI * 2) / n;

  const pointFor = (index: number, value: number) => {
    const angle = -Math.PI / 2 + index * angleStep;
    const radius = (value / 5) * maxRadius;
    return [center + Math.cos(angle) * radius, center + Math.sin(angle) * radius];
  };

  const polygonPoints = pillars
    .map((pillar, i) => pointFor(i, pillar.avg || 0))
    .map(([x, y]) => `${x},${y}`)
    .join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mx-auto">
      {[...Array(steps)].map((_, i) => {
        const r = ((i + 1) / steps) * maxRadius;
        const ringPoints = pillars
          .map((_, idx) => {
            const angle = -Math.PI / 2 + idx * angleStep;
            return `${center + Math.cos(angle) * r},${center + Math.sin(angle) * r}`;
          })
          .join(" ");
        return <polygon key={i} points={ringPoints} fill="none" stroke="#dbe2ea" strokeWidth="1" />;
      })}
      {pillars.map((pillar, i) => {
        const [x, y] = pointFor(i, 5);
        return (
          <g key={pillar.label}>
            <line x1={center} y1={center} x2={x} y2={y} stroke="#dbe2ea" />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#475569">
              {pillar.label}
            </text>
          </g>
        );
      })}
      <polygon points={polygonPoints} fill="rgba(14,165,233,0.22)" stroke="#0ea5e9" strokeWidth="2" />
    </svg>
  );
}

export default function App() {
  const [organization, setOrganization] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");
  const [started, setStarted] = useState(false);

  const completed = Object.keys(answers).length;
  const isDone = completed === questions.length;
  const score = useMemo(() => {
    if (!isDone) return 0;
    const total = Object.values(answers).reduce((sum, current) => sum + current, 0);
    return Math.round((total / (questions.length * 5)) * 100);
  }, [answers, isDone]);

  const pillars = useMemo(() => {
    const labels = ["Shared Values", "Strategy", "Structure", "Systems", "Staff", "Style", "Skills"];
    return labels.map((label, index) => {
      const start = index * 3 + 1;
      const ids = [start, start + 1, start + 2];
      const values = ids.map((id) => answers[id]).filter((v): v is number => typeof v === "number");
      const avg = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
      return { label, avg };
    });
  }, [answers]);

  const quickActions = useMemo(() => {
    if (!isDone) return [];
    const lowest = [...pillars].sort((a, b) => a.avg - b.avg).slice(0, 3);
    return lowest.map((item) => {
      if (item.label === "Shared Values") return "Plan een teamsessie waarin waarden worden vertaald naar concreet gedrag en besluitcriteria.";
      if (item.label === "Strategy") return "Toets lopende strategische keuzes op maatschappelijke impact en lange-termijn effecten.";
      if (item.label === "Structure") return "Herijk rollen en verantwoordelijkheden rond ethische besluitvorming in elke laag.";
      if (item.label === "Systems") return "Bouw een vaste cyclus voor signaleren, evalueren en opvolgen van ethische risico's.";
      if (item.label === "Staff") return "Start gerichte ontwikkeling op morele oordeelsvorming voor sleutelrollen.";
      if (item.label === "Style") return "Versterk psychologische veiligheid door structurele dialoog en zichtbaar voorbeeldgedrag.";
      return "Ontwikkel trainingsmodules op integriteit, aanspreekcultuur en professionele reflectie.";
    });
  }, [isDone, pillars]);

  const handlePrint = () => {
    window.print();
  };

  const printDate = useMemo(
    () =>
      new Intl.DateTimeFormat("nl-NL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  return (
    <main className="min-h-screen bg-[#f1f3f4] text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-700">Organisatiescan</p>
          <h1 className="mt-2 text-3xl font-semibold text-slate-900">De Morele Lakmoesproef</h1>
          <p className="mt-2 text-sm text-slate-600">Scan uw organisatie en leg de basis voor een verbeterplan. Deze meting is geinspireerd op o.a. <em>De voorbeeldige organisatie</em> en inzichten uit ethisch organisatieonderzoek.</p>
          <input className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none md:max-w-md" placeholder="Organisatienaam (optioneel)" value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </header>

        {!started && (
          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm print:hidden">
            <div className="grid gap-8 md:grid-cols-[1.15fr_1fr]">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">De Morele Lakmoesproef</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  Scan uw organisatie, visualiseer uw ethische landschap en vertaal inzichten direct naar verbeteracties.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-2xl text-violet-600">⚖️</p>
                    <p className="mt-1 text-sm font-semibold">13 Filters</p>
                    <p className="mt-1 text-xs text-slate-500">Volledige analyse</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-2xl text-violet-600">🧠</p>
                    <p className="mt-1 text-sm font-semibold">Actieplan</p>
                    <p className="mt-1 text-xs text-slate-500">Van inzicht naar stap</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-2xl text-violet-600">📈</p>
                    <p className="mt-1 text-sm font-semibold">Visueel Inzicht</p>
                    <p className="mt-1 text-xs text-slate-500">Helder scorebeeld</p>
                  </div>
                </div>
                <button onClick={() => setStarted(true)} className="mt-7 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95">
                  Start inschatting
                </button>
                <p className="mt-5 text-xs text-slate-500">
                  Het Fontys lectoraat Ethisch Werken volgt de ontwikkeling van dit instrument en denkt graag mee over verbeterstappen.
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Bronvermelding volgens APA7 is opgenomen op de eindpagina.
                </p>
              </div>
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-gradient-to-b from-[#eef2f7] to-white p-4">
                <img
                  src="/organisatie-lakmoesproef-hero.jpg"
                  alt="Organisatie Lakmoesproef preview"
                  className="w-full max-w-[360px] rounded-2xl border border-slate-200 object-cover shadow-[0_14px_30px_rgba(15,23,42,0.14)]"
                />
              </div>
            </div>
          </section>
        )}

        {started && (
        <section className="space-y-3 print:hidden">
          {questions.map((question) => (
            <article key={question.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vraag {question.id}</p>
              <h2 className="mt-1 text-xl font-semibold">{question.title}</h2>
              <p className="text-sm font-medium text-teal-700">{question.subtitle}</p>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{question.explanation}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setAnswers((prev) => ({ ...prev, [question.id]: n }))} className={`rounded-lg border px-4 py-2 text-sm font-semibold transition ${answers[question.id] === n ? "border-teal-600 bg-teal-50 text-teal-900" : "border-slate-300 bg-white hover:border-slate-400"}`}>
                    {n}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>
        )}

        <section className="report-section mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          {isDone && (
            <div className="mb-4 hidden rounded-xl border border-slate-300 bg-white p-4 print:block">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Rapport Morele Lakmoesproef
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                {organization.trim().length > 0
                  ? organization
                  : "Organisatie (niet ingevuld)"}
              </h2>
              <div className="mt-2 grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
                <p>
                  <span className="font-semibold">Datum:</span> {printDate}
                </p>
                <p>
                  <span className="font-semibold">Score:</span> {score}%
                </p>
                <p>
                  <span className="font-semibold">Voortgang:</span> {completed}/{questions.length}
                </p>
              </div>
            </div>
          )}
          <p className="text-sm text-slate-600">Voortgang: {completed}/{questions.length}</p>
          <label className="mt-4 block text-sm font-medium print:hidden">Kernobservaties en verbeteracties</label>
          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Welke 2-3 interventies hebben nu prioriteit?" className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none print:hidden" />
          {isDone && (
            <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1.1fr] print:mt-2 print:grid-cols-1">
              <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-sky-50 to-white p-4">
                <p className="text-sm font-semibold text-slate-700">Jouw Lakmoes Scorecard</p>
                <p className="mt-1 text-3xl font-bold text-sky-700">{score}%</p>
                <RadarChart pillars={pillars} />
              </div>
              <div className="rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4">
                <p className="text-sm font-semibold text-slate-700">Welke acties kun je nu meteen doen?</p>
                <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                  {quickActions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
                <div className="mt-4 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-900 print:hidden">
                  <p className="font-semibold">Advies en ondersteuning</p>
                  <p className="mt-1">
                    Neem contact op met het Lectoraat Ethisch Werken van Fontys voor begeleiding bij het verbeteren van uw score.
                  </p>
                  <a
                    href="https://www.fontys.nl/Onderzoek/Ethisch-werken.htm"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block font-semibold underline"
                  >
                    Naar Fontys Lectoraat Ethisch Werken
                  </a>
                </div>
              </div>
            </div>
          )}
          {isDone && (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-700">Ingevulde interventies</p>
              <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                {notes.trim().length > 0
                  ? notes
                  : "Geen interventies ingevuld."}
              </p>
            </div>
          )}
          {isDone && (
            <div className="mt-4 print:hidden">
              <button
                onClick={handlePrint}
                className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Print resultaten
              </button>
            </div>
          )}
          {isDone && (
            <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-sm font-semibold text-slate-800">Bronnenlijst (APA7)</p>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
                <li>
                  Ellemers, N., &amp; De Gilder, D. (2022). <em>De voorbeeldige organisatie: Een bereikbaar ideaal</em>. Managementboek.
                </li>
                <li>
                  Fontys Hogeschool. (z.d.). <em>Lectoraat Ethisch werken</em>. 
                  <a
                    href="https://www.fontys.nl/Onderzoek/Ethisch-werken.htm"
                    target="_blank"
                    rel="noreferrer"
                    className="ml-1 underline"
                  >
                    https://www.fontys.nl/Onderzoek/Ethisch-werken.htm
                  </a>
                </li>
                <li>
                  Waterman, R. H., Peters, T. J., &amp; Phillips, J. R. (1980). Structure is not organization. <em>Business Horizons, 23</em>(3), 14-26.
                </li>
                <li>
                  Peters, T. J., &amp; Waterman, R. H. (1982). <em>In search of excellence</em>. Harper &amp; Row.
                </li>
                <li>
                  Edmondson, A. C. (2019). <em>The fearless organization: Creating psychological safety in the workplace for learning, innovation, and growth</em>. Wiley.
                </li>
                <li>
                  Trevino, L. K., &amp; Nelson, K. A. (2021). <em>Managing business ethics: Straight talk about how to do it right</em> (8th ed.). Wiley.
                </li>
                <li>
                  Kaptein, M. (2011). Toward effective codes: Testing the relationship with unethical behavior. <em>Journal of Business Ethics, 99</em>(2), 233-251.
                </li>
                <li>
                  Schein, E. H., &amp; Schein, P. A. (2017). <em>Organizational culture and leadership</em> (5th ed.). Wiley.
                </li>
              </ul>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
