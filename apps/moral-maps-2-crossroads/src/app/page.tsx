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
  const initialQuery =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const [travelerName, setTravelerName] = useState(
    () => getStoredDraft().travelerName ?? initialQuery?.get("groupCode") ?? "",
  );
  const initialCoreValues = (
    getStoredDraft().coreValues ?? initialQuery?.get("coreValues") ?? ""
  )
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
  const [coreValue1, setCoreValue1] = useState(initialCoreValues[0] ?? "");
  const [coreValue2, setCoreValue2] = useState(initialCoreValues[1] ?? "");
  const [coreValue3, setCoreValue3] = useState(initialCoreValues[2] ?? "");
  const [destination, setDestination] = useState(
    () =>
      getStoredDraft().destination ??
      (initialQuery?.get("age") ? `Leeftijd ${initialQuery.get("age")}` : ""),
  );
  const [answers] = useState<AnswerMap>(() => getStoredDraft().answers ?? {});
  const [scores] = useState<ScoreMap>(() => getStoredDraft().scores ?? {});
  const coreValues = [coreValue1, coreValue2, coreValue3]
    .map((v) => v.trim())
    .filter(Boolean)
    .join(", ");

  const isPromptCompleted = (promptId: string) =>
    (answers[promptId] ?? "").trim().length >= 10 || Boolean(scores[promptId]);

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
    () => allPrompts.filter((prompt) => isPromptCompleted(prompt.id)).length,
    [answers, scores],
  );
  const completion = Math.round((answeredPrompts / allPrompts.length) * 100);

  function openRouteverslagPdf() {
    const html = `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><title>Moral Maps 2 - Routeverslag</title>
      <style>
        body{font-family:Arial,sans-serif;padding:32px;max-width:800px;margin:0 auto;color:#0f172a}
        h1{margin:0 0 8px}
        .meta{font-size:13px;color:#475569;margin-bottom:20px}
        .section{border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;margin-bottom:12px}
        .title{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#0f766e;font-weight:700;margin-bottom:6px}
        .value{white-space:pre-wrap;line-height:1.6}
      </style></head><body>
      <h1>Moral Maps 2 - Routeverslag</h1>
      <p class="meta">Naam/code: ${travelerName || "-"} · Kernwaarden: ${coreValues || "-"} · Bestemming: ${destination || "-"}</p>
      ${allPrompts
        .map((prompt) => `<section class="section"><div class="title">${prompt.title}</div><div class="value">${(answers[prompt.id] ?? "Niet ingevuld").replace(/</g, "&lt;")}</div></section>`)
        .join("")}
      </body></html>`;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (win) {
      win.onload = () => setTimeout(() => win.print(), 350);
    }
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
            Elke opdracht staat nu op een eigen pagina met een eigen afbeelding.
            Werk stap voor stap aan je routeverslag.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {allPrompts.map((prompt) => {
              const done = isPromptCompleted(prompt.id);
              return (
                <span
                  key={prompt.id}
                  className={`h-2.5 w-2.5 rounded-full ${done ? "bg-teal-500" : "bg-slate-300"}`}
                  title={prompt.title}
                />
              );
            })}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
              value={travelerName}
              onChange={(e) => setTravelerName(e.target.value)}
              placeholder="Jouw naam of code"
            />
            <input
              className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-600"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Jouw richting / bestemming"
            />
          </div>
          <div className="mt-3 rounded-xl border border-teal-200 bg-teal-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-teal-800">
              Kernwaarden uit Deel 1
            </p>
            <p className="mt-1 text-xs text-teal-900">
              Vul hier je drie kernwaarden in uit Deel 1.
            </p>
            <div className="mt-3 grid gap-3 md:grid-cols-3">
              <input
                className="rounded-xl border border-teal-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700"
                value={coreValue1}
                onChange={(e) => setCoreValue1(e.target.value)}
                placeholder="Kernwaarde 1"
              />
              <input
                className="rounded-xl border border-teal-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700"
                value={coreValue2}
                onChange={(e) => setCoreValue2(e.target.value)}
                placeholder="Kernwaarde 2"
              />
              <input
                className="rounded-xl border border-teal-300 bg-white px-3 py-2 text-sm outline-none focus:border-teal-700"
                value={coreValue3}
                onChange={(e) => setCoreValue3(e.target.value)}
                placeholder="Kernwaarde 3"
              />
            </div>
          </div>
          <div className="mt-5">
            <Link
              href={`/opdracht/${allPrompts[0].id}`}
              className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_-3px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(15,23,42,0.35)] transition hover:bg-slate-800"
            >
              Start Crossroads
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
          <h3 className="text-lg font-semibold">Routevoortgang</h3>
          <p className="mt-1 text-sm text-slate-600">
            Bewaart automatisch lokaal.
          </p>
          <button
            onClick={openRouteverslagPdf}
            className="mt-3 inline-flex rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white hover:bg-slate-700"
          >
            Open routeverslag als PDF/print
          </button>
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
