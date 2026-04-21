import { useMemo, useState } from "react";

type Question = {
  id: number;
  title: string;
  subtitle: string;
  explanation: string;
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
  { id: 10, title: "Eigenaarschap", subtitle: "Verantwoordelijkheid op elk niveau", explanation: "In welke mate ervaren professionals dat ethische kwaliteit onderdeel is van hun eigen rol?" },
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

export default function App() {
  const [organization, setOrganization] = useState("");
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [notes, setNotes] = useState("");

  const completed = Object.keys(answers).length;
  const isDone = completed === questions.length;
  const score = useMemo(() => {
    if (!isDone) return 0;
    const total = Object.values(answers).reduce((sum, current) => sum + current, 0);
    return Math.round((total / (questions.length * 5)) * 100);
  }, [answers, isDone]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Organisatiescan</p>
          <h1 className="mt-2 text-3xl font-semibold">Organisatie lakmoesproef</h1>
          <p className="mt-2 text-sm text-slate-600">Complete meting op basis van 21 vragen uit het perspectief van voorbeeldige organisaties. Score per vraag op een schaal van 1 (onvoldoende) tot 5 (sterk ontwikkeld).</p>
          <input className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none md:max-w-md" placeholder="Organisatienaam (optioneel)" value={organization} onChange={(e) => setOrganization(e.target.value)} />
        </header>

        <section className="space-y-3">
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

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Voortgang: {completed}/{questions.length}</p>
          <label className="mt-4 block text-sm font-medium">Kernobservaties en verbeteracties</label>
          <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Welke 2-3 interventies hebben nu prioriteit?" className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none" />
          {isDone && <p className="mt-3 text-sm font-semibold text-teal-700">Totale integriteitsscore: {score}%</p>}
        </section>
      </div>
    </main>
  );
}
