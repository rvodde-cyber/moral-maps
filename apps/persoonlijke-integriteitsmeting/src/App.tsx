import { useMemo, useState } from "react";

type Value = "Integriteit" | "Verantwoordelijkheid" | "Moed" | "Rechtvaardigheid" | "Reflectie";
type Answer = { prompt: string; options: { label: string; value: Value }[] };

const dilemmas: Answer[] = [
  { prompt: "Een collega vraagt je om een fout niet te melden omdat de deadline in gevaar komt.", options: [{ label: "Ik bespreek het direct en transparant.", value: "Integriteit" }, { label: "Ik zoek eerst een veilige route met mijn leidinggevende.", value: "Verantwoordelijkheid" }] },
  { prompt: "Je merkt dat een besluit nadelig uitpakt voor een kwetsbare groep.", options: [{ label: "Ik agendeer dit met feiten en alternatieven.", value: "Rechtvaardigheid" }, { label: "Ik accepteer het besluit om snelheid te houden.", value: "Moed" }] },
  { prompt: "Een opdrachtgever vraagt om informatie die je niet mag delen.", options: [{ label: "Ik weiger professioneel en licht toe waarom.", value: "Integriteit" }, { label: "Ik deel alleen wat het proces versnelt.", value: "Verantwoordelijkheid" }] },
];

export default function App() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [answers, setAnswers] = useState<Record<number, Value | undefined>>({});

  const profile = useMemo(() => {
    const tally: Record<Value, number> = {
      Integriteit: 0,
      Verantwoordelijkheid: 0,
      Moed: 0,
      Rechtvaardigheid: 0,
      Reflectie: 0,
    };
    Object.values(answers).forEach((v) => {
      if (v) tally[v] += 1;
    });
    return Object.entries(tally).sort((a, b) => b[1] - a[1])[0] as [Value, number];
  }, [answers]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-6 py-10">
        <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">Individuele route</p>
          <h1 className="mt-2 text-3xl font-semibold">Persoonlijke integriteitsmeting</h1>
          <p className="mt-2 text-sm text-slate-600">Reflecteer op morele keuzes in professionele situaties. Compact, duidelijk en toepasbaar in onderwijs en praktijk.</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none" placeholder="Naam (optioneel)" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="rounded-xl border border-slate-300 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none" placeholder="Rol / opleiding (optioneel)" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
        </header>

        <section className="space-y-3">
          {dilemmas.map((dilemma, index) => (
            <article key={dilemma.prompt} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Dilemma {index + 1}</p>
              <p className="mt-2 text-sm leading-relaxed">{dilemma.prompt}</p>
              <div className="mt-4 grid gap-2">
                {dilemma.options.map((option) => (
                  <button key={option.label} onClick={() => setAnswers((prev) => ({ ...prev, [index]: option.value }))} className={`rounded-xl border px-3 py-2 text-left text-sm transition ${answers[index] === option.value ? "border-teal-600 bg-teal-50 text-teal-900" : "border-slate-300 bg-white hover:border-slate-400"}`}>
                    {option.label}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </section>

        <footer className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-600">Ingevuld: {Object.keys(answers).length}/{dilemmas.length}</p>
          {Object.keys(answers).length === dilemmas.length && (
            <p className="mt-2 text-sm font-medium">
              Dominante waarde: <span className="text-teal-700">{profile[0]}</span>
            </p>
          )}
        </footer>
      </div>
    </main>
  );
}
