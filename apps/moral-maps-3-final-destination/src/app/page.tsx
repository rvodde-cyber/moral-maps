"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getStoredDraft, STORAGE_KEY } from "@/lib/final-destination-storage";
import { stepMeta, stepOrder } from "@/lib/final-destination-steps";

export default function Home() {
  const stored = getStoredDraft();
  const [travelerName, setTravelerName] = useState(stored.travelerName ?? "");
  const [destination, setDestination] = useState(stored.destination ?? "");
  const [bridge] = useState(
    stored.bridge ?? { ballast: "", meenemen: "", vinden: "", gps: "" },
  );
  const [terugblik] = useState(
    stored.terugblik ?? { scharnierpunt: "", patroon: "", noorden: "" },
  );
  const [vooruitblik] = useState(
    stored.vooruitblik ?? { nalatenschap: "", richting: "", belofte: "" },
  );
  const [synthese] = useState(stored.synthese ?? "");

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

  const filledCount = useMemo(() => {
    const fields = [
      travelerName,
      destination,
      bridge.ballast,
      bridge.meenemen,
      bridge.vinden,
      bridge.gps,
      terugblik.scharnierpunt,
      terugblik.patroon,
      terugblik.noorden,
      vooruitblik.nalatenschap,
      vooruitblik.richting,
      vooruitblik.belofte,
      synthese,
    ];
    return fields.filter((value) => value.trim().length > 0).length;
  }, [travelerName, destination, bridge, terugblik, vooruitblik, synthese]);

  const progress = Math.round((filledCount / 13) * 100);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Moral Maps 3
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Je ware koers
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Elke opdracht staat op een eigen pagina met een eigen afbeelding.
            Werk de slotfase van de trilogie stap voor stap af.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
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
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-xs text-slate-500">Voortgang</p>
            <p className="text-2xl font-bold">{progress}%</p>
          </div>
          <Link
            href="/opdracht/brug"
            className="mt-5 inline-flex rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Start Je ware koers
          </Link>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2">
          {stepOrder.map((step) => (
            <article
              key={step}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-emerald-700">
                {stepMeta[step].subtitle}
              </p>
              <h2 className="mt-2 text-lg font-semibold">{stepMeta[step].title}</h2>
              <Link
                href={`/opdracht/${step}`}
                className="mt-4 inline-flex text-sm font-semibold text-emerald-700 underline"
              >
                Open opdracht
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
