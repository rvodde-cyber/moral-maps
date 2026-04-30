"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { allPrompts } from "@/lib/crossroads-content";
import {
  AnswerMap,
  getStoredDraft,
  ScoreMap,
  STORAGE_KEY,
} from "@/lib/crossroads-storage";

export default function PromptPage() {
  const params = useParams<{ promptId: string }>();
  const promptId = params.promptId;
  const promptIndex = allPrompts.findIndex((item) => item.id === promptId);
  const prompt = promptIndex >= 0 ? allPrompts[promptIndex] : null;

  const [answers, setAnswers] = useState<AnswerMap>(
    () => getStoredDraft().answers ?? {},
  );
  const [scores, setScores] = useState<ScoreMap>(() => getStoredDraft().scores ?? {});
  const [detourChoice, setDetourChoice] = useState(
    () => getStoredDraft().detourChoice ?? "",
  );

  useEffect(() => {
    const draft = getStoredDraft();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...draft,
        answers,
        scores,
        detourChoice,
      }),
    );
  }, [answers, scores, detourChoice]);

  const prevPrompt = promptIndex > 0 ? allPrompts[promptIndex - 1] : null;
  const nextPrompt =
    promptIndex >= 0 && promptIndex < allPrompts.length - 1
      ? allPrompts[promptIndex + 1]
      : null;

  const completion = useMemo(() => {
    const answered = allPrompts.filter(
      (item) => (answers[item.id] ?? "").trim().length >= 30,
    ).length;
    return Math.round((answered / allPrompts.length) * 100);
  }, [answers]);

  if (!prompt) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-6">
          <h1 className="text-2xl font-bold">Opdracht niet gevonden</h1>
          <Link href="/" className="mt-4 inline-block text-sm text-teal-700 underline">
            Terug naar overzicht
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-8 md:px-8">
        <motion.div
          key={prompt.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
              {prompt.stageIcon} {prompt.stageLabel}
            </p>
            <p className="text-xs text-slate-500">Voortgang: {completion}%</p>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{prompt.title}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-700">{prompt.question}</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
            <Image
              src={prompt.imageSrc}
              alt={prompt.imageAlt}
              width={1400}
              height={800}
              priority
              className="h-72 w-full object-cover"
            />
          </div>

          {prompt.id === "wegomleiding-keuze" && (
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {[
                {
                  id: "avontuur",
                  label:
                    "Avontuurlijke route: wilde bossen, dieren en landschappen",
                },
                {
                  id: "herinnering",
                  label:
                    "Omweg via je oude stad: herinneringen en jeugdvrienden",
                },
                {
                  id: "hypermodern",
                  label: "Hypermoderne stad: drukte, hightech, gokken en shoppen",
                },
                {
                  id: "snel",
                  label: "Saai maar snel: rechtstreeks naar de bestemming",
                },
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
            className="mt-4 min-h-32 w-full resize-y rounded-lg border border-slate-300 bg-white p-3 text-sm outline-none focus:border-teal-600"
            placeholder="Schrijf je reflectie..."
            value={answers[prompt.id] ?? ""}
            onChange={(e) =>
              setAnswers((prev) => ({
                ...prev,
                [prompt.id]: e.target.value,
              }))
            }
          />

          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-slate-500">Koerszekerheid</span>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                onClick={() =>
                  setScores((prev) => ({
                    ...prev,
                    [prompt.id]: n,
                  }))
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

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={prevPrompt ? `/opdracht/${prevPrompt.id}` : "/"}
              className="rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              {prevPrompt ? "Vorige opdracht" : "Terug naar overzicht"}
            </Link>
            {nextPrompt ? (
              <Link
                href={`/opdracht/${nextPrompt.id}`}
                className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Volgende opdracht
              </Link>
            ) : (
              <Link
                href="/"
                className="rounded-full bg-teal-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-700"
              >
                Klaar, terug naar overzicht
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
