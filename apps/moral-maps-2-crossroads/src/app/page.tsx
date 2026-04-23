"use client";

import { useEffect, useMemo, useState } from "react";

type Prompt = {
  id: string;
  title: string;
  question: string;
};

type Stage = {
  id: string;
  label: string;
  icon: string;
  summary: string;
  prompts: Prompt[];
};

type AnswerMap = Record<string, string>;
type ScoreMap = Record<string, number>;

const STORAGE_KEY = "maps2-crossroads-v1";

function getStoredDraft(): {
  travelerName?: string;
  coreValues?: string;
  destination?: string;
  answers?: AnswerMap;
  scores?: ScoreMap;
} {
  if (typeof window === "undefined") return {};
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as {
      travelerName?: string;
      coreValues?: string;
      destination?: string;
      answers?: AnswerMap;
      scores?: ScoreMap;
    };
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}

const stages: Stage[] = [
  {
    id: "crossroads",
    label: "De Kruising",
    icon: "🛣️",
    summary: "Kiezen is ook verliezen. Onderzoek welke afslag je neemt en waarom.",
    prompts: [
      {
        id: "onbewandelde-weg",
        title: "De Onbewandelde Weg",
        question:
          "Reflecteer op een afslag die je niet hebt genomen. Wat liet je achter? Was het angst, veiligheid of een keuze vanuit je kernwaarden?",
      },
    ],
  },
  {
    id: "energie",
    label: "Brandstof",
    icon: "⛽",
    summary: "Zonder energie geen duurzame reis. Breng je actieradius eerlijk in beeld.",
    prompts: [
      {
        id: "tankstation-ziel",
        title: "Het Tankstation van de Ziel",
        question:
          "Welke activiteiten geven je hoogwaardige brandstof? Welke gewoonten vervuilen je motor?",
      },
      {
        id: "reserve-lampje",
        title: "Rijden op de Reserve",
        question:
          "Beschrijf een periode waarin je te lang doorging. Wat was de morele en relationele prijs van die uitputting?",
      },
    ],
  },
  {
    id: "wegomleiding",
    label: "Wegomleiding",
    icon: "🚧",
    summary: "De weg wordt versperd. Je moet kiezen uit vier routes met elk een andere morele lading.",
    prompts: [
      {
        id: "wegomleiding-keuze",
        title: "De omleiding bij schemer",
        question:
          "Je rijdt door een uitgestrekte, verdroogde vlakte en moet kiezen: avontuur in wilde bossen, omweg via je jeugdstad, hypermoderne stad vol prikkels, of de saaie maar snelle route. Welke kies je en waarom past dit bij jouw kernwaarden?",
      },
    ],
  },
  {
    id: "apk",
    label: "Morele APK",
    icon: "🧰",
    summary: "Onderhoud bepaalt betrouwbaarheid. Kijk naar slijtage en ballast.",
    prompts: [
      {
        id: "slijtage",
        title: "Slijtagecheck",
        question:
          "Welke karakteronderdelen vragen nu onderhoud (bijv. geduld, empathie, integriteit, moed)?",
      },
      {
        id: "ballast",
        title: "Bagagedrager",
        question:
          "Welke oude koffers maken je reis zwaarder dan nodig? Wat kun je bewust achterlaten?",
      },
    ],
  },
  {
    id: "panne",
    label: "Pech & Hulp",
    icon: "🛟",
    summary: "Stilstand hoort erbij. Kwetsbaarheid en wederkerigheid zijn onderdeel van leiderschap.",
    prompts: [
      {
        id: "vangrail",
        title: "Langs de Vangrail",
        question:
          "Denk aan een moment van pech of twijfel. Deelde je wat er werkelijk speelde, of hield je de motorkap dicht?",
      },
      {
        id: "wegenwacht",
        title: "De Wegenwacht",
        question:
          "Wie stopt er voor jou wanneer je vastloopt? En stop jij zelf voor anderen als het schuurt met je planning?",
      },
    ],
  },
  {
    id: "mist",
    label: "Mist & Zicht",
    icon: "🌫️",
    summary: "Wanneer zicht ontbreekt, bepaalt je interne kompas je koers.",
    prompts: [
      {
        id: "mist-rijden",
        title: "Rijden in de Mist",
        question:
          "Op welk intern kompas vertrouw je wanneer externe zekerheden wegvallen?",
      },
      {
        id: "dode-hoek",
        title: "De Dode Hoek",
        question:
          "Welke blinde vlek zie je vaak te laat? Wie fungeert voor jou als extra spiegel?",
      },
    ],
  },
  {
    id: "socialisatie",
    label: "Socialisatieverslag",
    icon: "🧾",
    summary:
      "Wie ben je onderweg tegengekomen en hoe vormen die ontmoetingen je morele koers?",
    prompts: [
      {
        id: "ontmoetingen-route",
        title: "Wie kwam je onderweg tegen?",
        question:
          "Welke personen, groepen of systemen hebben jouw route wezenlijk beïnvloed? Beschrijf per ontmoeting de impact op je waarden en keuzes.",
      },
      {
        id: "sociale-sporen",
        title: "Sporen op je stuur",
        question:
          "Welke overtuigingen heb je onderweg overgenomen, en welke heb je bewust losgelaten om koersvast te blijven?",
      },
    ],
  },
  {
    id: "vreemde-ander",
    label: "De Vreemde Ander",
    icon: "🧍",
    summary:
      "De reisgenoot die anders is, houdt je een spiegel voor en verbreedt je blik.",
    prompts: [
      {
        id: "reisgenoot-spiegel",
        title: "De Reisgenoot als Spiegel",
        question:
          "Denk aan iemand die je als 'anders' ervaart. Wat laat deze persoon je zien over je eigen aannames, grenzen en waarden?",
      },
      {
        id: "insluiting-onderweg",
        title: "Insluiting onderweg",
        question:
          "Wat kun je concreet doen om deze reisgenoot beter te begrijpen en in te sluiten, zonder je eigen kompas te verliezen?",
      },
    ],
  },
];

export default function Home() {
  const [travelerName, setTravelerName] = useState(() => getStoredDraft().travelerName ?? "");
  const [coreValues, setCoreValues] = useState(() => getStoredDraft().coreValues ?? "");
  const [destination, setDestination] = useState(() => getStoredDraft().destination ?? "");
  const [answers, setAnswers] = useState<AnswerMap>(() => getStoredDraft().answers ?? {});
  const [scores, setScores] = useState<ScoreMap>(() => getStoredDraft().scores ?? {});
  const [activeStage, setActiveStage] = useState(stages[0].id);
  const [started, setStarted] = useState(false);
  const [detourChoice, setDetourChoice] = useState<string>(() => getStoredDraft().answers?.["wegomleiding-route"] ?? "");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        travelerName,
        coreValues,
        destination,
        answers: { ...answers, "wegomleiding-route": detourChoice },
        scores,
      }),
    );
  }, [travelerName, coreValues, destination, answers, scores, detourChoice]);

  const allPrompts = useMemo(() => stages.flatMap((stage) => stage.prompts), []);
  const answeredPrompts = allPrompts.filter((prompt) => (answers[prompt.id] ?? "").trim().length >= 30).length;
  const completion = Math.round((answeredPrompts / allPrompts.length) * 100);

  const roadmapScore = useMemo(() => {
    const values = Object.values(scores);
    if (!values.length) return 0;
    return Number((values.reduce((sum, n) => sum + n, 0) / values.length).toFixed(1));
  }, [scores]);

  function exportSnapshot() {
    const payload = {
      generatedAt: new Date().toISOString(),
      travelerName,
      coreValues,
      destination,
      completion,
      roadmapScore,
      answers,
      scores,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "maps2-crossroads-routeverslag.json";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function clearProgress() {
    if (!window.confirm("Weet je zeker dat je alle voortgang wilt wissen?")) return;
    setTravelerName("");
    setCoreValues("");
    setDestination("");
    setAnswers({});
    setScores({});
    setDetourChoice("");
    setActiveStage(stages[0].id);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
            Moral Maps 2
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Crossroads
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Deel 2 van de trilogie: navigeer jouw reis, maak morele keuzes op
            kruispunten en bouw een duurzaam routeplan dat past bij je kernwaarden.
          </p>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
              value={travelerName}
              onChange={(e) => setTravelerName(e.target.value)}
              placeholder="Jouw naam of code"
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
              value={coreValues}
              onChange={(e) => setCoreValues(e.target.value)}
              placeholder="Kernwaarden uit Deel 1"
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Jouw richting / bestemming"
            />
          </div>
        </header>

        {!started && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-7 md:grid-cols-[1fr_1.15fr] md:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                  Intro
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  Voor je de opdrachten start
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  In Deel 1 bepaalde je wie je bent, waar je staat en welke waarden jouw
                  richting vormen. In Crossroads ga je op reis: je kiest afslagen, mist soms
                  een afslag, raakt energie kwijt en hervindt koers. Deze module helpt je om
                  niet doelloos rond te rijden, maar bewust te navigeren vanuit je kompas.
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Neem per opdracht de tijd. Schrijf concreet, eerlijk en toepasbaar, zodat je
                  routeverslag bruikbaar wordt voor coaching, reflectie en je volgende stap.
                </p>
                <button
                  onClick={() => setStarted(true)}
                  className="mt-5 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
                >
                  Start Crossroads
                </button>
              </div>
              <div className="mx-auto w-full max-w-[360px] rounded-[2.6rem] border border-slate-200 bg-gradient-to-b from-slate-100 to-white p-2.5 shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                <img
                  src="https://moral-maps.vercel.app/moral-maps-phone-crossroads.jpg"
                  alt="Moral Maps mobiele mockup"
                  className="h-auto w-full rounded-[2.1rem] object-cover"
                />
              </div>
            </div>
          </section>
        )}

        {started && (
          <>
        <section className="mt-6 grid gap-4 md:grid-cols-4 lg:grid-cols-7">
          {stages.map((stage) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={`rounded-2xl border p-4 text-left shadow-sm transition ${
                activeStage === stage.id
                  ? "border-teal-500 bg-teal-50"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <p className="text-xl">{stage.icon}</p>
              <p className="mt-2 text-sm font-semibold">{stage.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {stage.summary}
              </p>
            </button>
          ))}
        </section>

        {stages
          .filter((stage) => stage.id === activeStage)
          .map((stage) => (
            <section
              key={stage.id}
              className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-2xl font-bold tracking-tight">
                {stage.icon} {stage.label}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{stage.summary}</p>

              <div className="mt-5 space-y-4">
                {stage.prompts.map((prompt) => (
                  <article
                    key={prompt.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <p className="text-sm font-semibold">{prompt.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {prompt.question}
                    </p>
                    {prompt.id === "wegomleiding-keuze" && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 bg-white">
                        <img
                          src="/crossroads-wegomleiding.jpg"
                          alt="Wegomleiding met meerdere routekeuzes"
                          className="h-auto w-full object-cover"
                        />
                      </div>
                    )}
                    {prompt.id === "wegomleiding-keuze" && (
                      <div className="mt-3 grid gap-2 md:grid-cols-2">
                        {[
                          { id: "avontuur", label: "Avontuurlijke route: wilde bossen, dieren en landschappen" },
                          { id: "herinnering", label: "Omweg via je oude stad: herinneringen en jeugdvrienden" },
                          { id: "hypermodern", label: "Hypermoderne stad: drukte, hightech, gokken en shoppen" },
                          { id: "snel", label: "Saai maar snel: rechtstreeks naar de bestemming" },
                        ].map((route) => (
                          <button
                            key={route.id}
                            onClick={() => setDetourChoice(route.id)}
                            className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                              detourChoice === route.id
                                ? "border-teal-600 bg-teal-50 text-teal-900"
                                : "border-slate-300 bg-white hover:border-slate-400"
                            }`}
                          >
                            {route.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <textarea
                      className="mt-3 min-h-28 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-teal-600"
                      placeholder={
                        prompt.id === "wegomleiding-keuze"
                          ? "Waarom kies je deze route, en hoe sluit deze keuze aan op je kernwaarden?"
                          : "Schrijf je reflectie..."
                      }
                      value={answers[prompt.id] ?? ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [prompt.id]: e.target.value,
                        }))
                      }
                    />
                    <div className="mt-3 flex items-center gap-2">
                      <span className="text-xs text-slate-500">
                        Koerszekerheid
                      </span>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <button
                          key={n}
                          onClick={() =>
                            setScores((prev) => ({ ...prev, [prompt.id]: n }))
                          }
                          className={`h-8 w-8 rounded-full border text-xs font-semibold ${
                            scores[prompt.id] === n
                              ? "border-teal-600 bg-teal-600 text-white"
                              : "border-slate-300 bg-white text-slate-700"
                          }`}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Routeverslag</h3>
          <p className="mt-1 text-sm text-slate-600">
            Bewaart automatisch lokaal. Gebruik export voor coaching, reflectie of beoordeling.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Voortgang</p>
              <p className="mt-1 text-2xl font-bold">{completion}%</p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Ingevulde opdrachten</p>
              <p className="mt-1 text-2xl font-bold">
                {answeredPrompts}/{allPrompts.length}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs text-slate-500">Gemiddelde koersscore</p>
              <p className="mt-1 text-2xl font-bold">{roadmapScore || "-"}</p>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={exportSnapshot}
              className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Exporteer routeverslag
            </button>
            <button
              onClick={clearProgress}
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Wis voortgang
            </button>
          </div>
        </section>
          </>
        )}
      </div>
    </main>
  );
}
