"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { getStoredDraft, STORAGE_KEY } from "@/lib/final-destination-storage";
import { stepMeta, StepId, stepOrder } from "@/lib/final-destination-steps";

export default function StepPage() {
  const params = useParams<{ step: string }>();
  const step = params.step as StepId;
  const stepIndex = stepOrder.indexOf(step);

  const [travelerName, setTravelerName] = useState(
    () => getStoredDraft().travelerName ?? "",
  );
  const [destination, setDestination] = useState(
    () => getStoredDraft().destination ?? "",
  );
  const [bridge, setBridge] = useState(
    () =>
      getStoredDraft().bridge ?? {
        ballast: "",
        meenemen: "",
        vinden: "",
        kompas: "",
      },
  );
  const [terugblik, setTerugblik] = useState(
    () =>
      getStoredDraft().terugblik ?? {
        scharnierpunt: "",
        patroon: "",
        noorden: "",
      },
  );
  const [vooruitblik, setVooruitblik] = useState(
    () =>
      getStoredDraft().vooruitblik ?? {
        nalatenschap: "",
        richting: "",
        belofte: "",
      },
  );
  const [synthese, setSynthese] = useState(() => getStoredDraft().synthese ?? "");

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        travelerName,
        destination,
        bridge,
        terugblik,
        vooruitblik,
        synthese,
      }),
    );
  }, [travelerName, destination, bridge, terugblik, vooruitblik, synthese]);

  const progress = useMemo(() => {
    const fields = [
      travelerName,
      destination,
      bridge.ballast,
      bridge.meenemen,
      bridge.vinden,
      bridge.kompas,
      terugblik.scharnierpunt,
      terugblik.patroon,
      terugblik.noorden,
      vooruitblik.nalatenschap,
      vooruitblik.richting,
      vooruitblik.belofte,
      synthese,
    ];
    const filledCount = fields.filter((value) => value.trim().length > 0).length;
    return Math.round((filledCount / 13) * 100);
  }, [travelerName, destination, bridge, terugblik, vooruitblik, synthese]);

  if (stepIndex < 0) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold">Opdracht niet gevonden</h1>
          <Link href="/" className="mt-4 inline-block text-sm text-emerald-700 underline">
            Terug naar overzicht
          </Link>
        </div>
      </main>
    );
  }

  const previousStep = stepIndex > 0 ? stepOrder[stepIndex - 1] : null;
  const nextStep = stepIndex < stepOrder.length - 1 ? stepOrder[stepIndex + 1] : null;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Moral Maps 3 - {stepMeta[step].subtitle}
            </p>
            <p className="text-xs text-slate-500">Voortgang: {progress}%</p>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{stepMeta[step].title}</h1>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
              value={travelerName}
              onChange={(e) => setTravelerName(e.target.value)}
              placeholder="Jouw naam of code"
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Jouw volgende bestemming"
            />
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {step === "brug" && (
              <div className="grid gap-3">
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Welke ballast laat je achter?"
                  value={bridge.ballast}
                  onChange={(e) =>
                    setBridge((prev) => ({ ...prev, ballast: e.target.value }))
                  }
                />
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Wat neem je juist bewust mee?"
                  value={bridge.meenemen}
                  onChange={(e) =>
                    setBridge((prev) => ({ ...prev, meenemen: e.target.value }))
                  }
                />
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Wat hoop je te vinden aan de overkant?"
                  value={bridge.vinden}
                  onChange={(e) =>
                    setBridge((prev) => ({ ...prev, vinden: e.target.value }))
                  }
                />
                <input
                  className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                  placeholder="Kernwaarde als kompas"
                  value={bridge.kompas}
                  onChange={(e) =>
                    setBridge((prev) => ({ ...prev, kompas: e.target.value }))
                  }
                />
              </div>
            )}

            {step === "terugblik" && (
              <div className="grid gap-3">
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Wat was je scharnierpunt?"
                  value={terugblik.scharnierpunt}
                  onChange={(e) =>
                    setTerugblik((prev) => ({
                      ...prev,
                      scharnierpunt: e.target.value,
                    }))
                  }
                />
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Welk patroon zie je terug?"
                  value={terugblik.patroon}
                  onChange={(e) =>
                    setTerugblik((prev) => ({ ...prev, patroon: e.target.value }))
                  }
                />
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Wat is je ware koers?"
                  value={terugblik.noorden}
                  onChange={(e) =>
                    setTerugblik((prev) => ({ ...prev, noorden: e.target.value }))
                  }
                />
              </div>
            )}

            {step === "vooruitblik" && (
              <div className="grid gap-3">
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Welke nalatenschap wil je bouwen?"
                  value={vooruitblik.nalatenschap}
                  onChange={(e) =>
                    setVooruitblik((prev) => ({
                      ...prev,
                      nalatenschap: e.target.value,
                    }))
                  }
                />
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Welke richting kies je vanaf nu?"
                  value={vooruitblik.richting}
                  onChange={(e) =>
                    setVooruitblik((prev) => ({
                      ...prev,
                      richting: e.target.value,
                    }))
                  }
                />
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Wat beloof je jezelf concreet?"
                  value={vooruitblik.belofte}
                  onChange={(e) =>
                    setVooruitblik((prev) => ({ ...prev, belofte: e.target.value }))
                  }
                />
              </div>
            )}

            {step === "reisverslag" && (
              <div className="grid gap-3">
                <textarea
                  className="min-h-40 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Vat samen wie je bent geworden, wat je meeneemt en hoe je koers houdt."
                  value={synthese}
                  onChange={(e) => setSynthese(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Alles wordt automatisch lokaal opgeslagen.
                </p>
              </div>
            )}
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Image
              src={stepMeta[step].imageSrc}
              alt={stepMeta[step].imageAlt}
              width={1200}
              height={900}
              className="h-full min-h-80 w-full object-cover"
              priority
            />
          </article>
        </section>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href={previousStep ? `/opdracht/${previousStep}` : "/"}
            className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            {previousStep ? "Vorige opdracht" : "Terug naar overzicht"}
          </Link>
          <Link
            href={nextStep ? `/opdracht/${nextStep}` : "/"}
            className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            {nextStep ? "Volgende opdracht" : "Klaar, terug naar overzicht"}
          </Link>
        </div>
      </div>
    </main>
  );
}

