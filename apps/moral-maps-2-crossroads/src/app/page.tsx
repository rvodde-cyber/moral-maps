"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { allPrompts, stages } from "@/lib/crossroads-content";
import {
  AnswerMap,
  getStoredDraft,
  ScoreMap,
  STORAGE_KEY,
} from "@/lib/crossroads-storage";

export default function Home() {
  const [travelerName, setTravelerName] = useState(
    () => getStoredDraft().travelerName ?? "",
  );
  const [coreValues, setCoreValues] = useState(
    () => getStoredDraft().coreValues ?? "",
  );
  const [destination, setDestination] = useState(
    () => getStoredDraft().destination ?? "",
  );
  const [answers] = useState<AnswerMap>(() => getStoredDraft().answers ?? {});
  const [scores] = useState<ScoreMap>(() => getStoredDraft().scores ?? {});

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        travelerName,
        coreValues,
        destination,
        answers,
        scores,
      }),
    );
  }, [travelerName, coreValues, destination, answers, scores]);

  const answeredPrompts = useMemo(
    () =>
      allPrompts.filter((prompt) => (answers[prompt.id] ?? "").trim().length >= 30)
        .length,
    [answers],
  );
  const completion = Math.round((answeredPrompts / allPrompts.length) * 100);

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
            Elke opdracht staat nu op een eigen pagina met een eigen afbeelding.
            Werk stap voor stap aan je routeverslag.
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
          <div className="mt-5">
            <Link
              href={`/opdracht/${allPrompts[0].id}`}
              className="inline-flex rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-teal-700"
            >
              Start eerste opdracht
            </Link>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {stages.map((stage) => (
            <article
              key={stage.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <p className="text-xl">{stage.icon}</p>
              <p className="mt-2 text-sm font-semibold">{stage.label}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{stage.summary}</p>
              <div className="mt-3 space-y-2">
                {stage.prompts.map((prompt) => (
                  <Link
                    key={prompt.id}
                    href={`/opdracht/${prompt.id}`}
                    className="block rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium hover:border-teal-400 hover:bg-teal-50"
                  >
                    {prompt.title}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Routeverslag</h3>
          <p className="mt-1 text-sm text-slate-600">
            Bewaart automatisch lokaal.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
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
          </div>
        </section>
      </div>
    </main>
  );
}
