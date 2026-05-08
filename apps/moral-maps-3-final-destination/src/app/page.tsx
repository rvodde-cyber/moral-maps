"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getStoredDraft, STORAGE_KEY } from "@/lib/final-destination-storage";
import { stepMeta, stepOrder } from "@/lib/final-destination-steps";

export default function Home() {
  const stored = getStoredDraft();
  const [travelerName, setTravelerName] = useState(stored.travelerName ?? "");
  const [destination, setDestination] = useState(stored.destination ?? "");
  const [bridge] = useState(
    stored.bridge ?? { ballast: "", meenemen: "", vinden: "", kompas: "" },
  );
  const [terugblik] = useState(
    stored.terugblik ?? { scharnierpunt: "", patroon: "", noorden: "" },
  );
  const [panorama] = useState(
    stored.panorama ?? {
      goedOndanksKost: "",
      nietGeklopt: "",
      minderStandvastig: "",
      verantwoordelijkheid: "",
    },
  );
  const [vooruitblik] = useState(
    stored.vooruitblik ?? { nalatenschap: "", richting: "", belofte: "" },
  );
  const [passie] = useState(stored.passie ?? { waar: "" });
  const [mensen] = useState(stored.mensen ?? { wie: "" });
  const [nalatenschapStory] = useState(
    stored.nalatenschapStory ?? { verhaal: "", goedeDingen: "" },
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
        panorama,
        vooruitblik,
        passie,
        mensen,
        nalatenschapStory,
        synthese,
      }),
    );
  }, [
    travelerName,
    destination,
    bridge,
    terugblik,
    panorama,
    vooruitblik,
    passie,
    mensen,
    nalatenschapStory,
    synthese,
  ]);

  const filledCount = useMemo(() => {
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
      panorama.goedOndanksKost,
      panorama.nietGeklopt,
      panorama.minderStandvastig,
      panorama.verantwoordelijkheid,
      passie.waar,
      mensen.wie,
      nalatenschapStory.verhaal,
      nalatenschapStory.goedeDingen,
      vooruitblik.nalatenschap,
      vooruitblik.richting,
      vooruitblik.belofte,
      synthese,
    ];
    return fields.filter((value) => value.trim().length > 0).length;
  }, [
    travelerName,
    destination,
    bridge,
    terugblik,
    panorama,
    passie,
    mensen,
    nalatenschapStory,
    vooruitblik,
    synthese,
  ]);

  const progress = Math.round((filledCount / 21) * 100);

  function saveAndClose() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        travelerName,
        destination,
        bridge,
        terugblik,
        panorama,
        vooruitblik,
        passie,
        mensen,
        nalatenschapStory,
        synthese,
      }),
    );

    try {
      window.close();
    } catch {
      // no-op: some browsers block closing tabs not opened by script
    }

    alert("Je gegevens zijn lokaal opgeslagen. Je kunt dit tabblad nu veilig sluiten.");
  }

  function downloadTrilogyReport() {
    const maps2Raw = window.localStorage.getItem("maps2-crossroads-v2");
    const maps2 = maps2Raw ? (JSON.parse(maps2Raw) as Record<string, unknown>) : {};
    const maps2Answers = ((maps2.answers as Record<string, string>) ?? {});
    const maps2Items = Object.entries(maps2Answers)
      .map(([key, value]) => `<li><strong>${key}</strong><br/>${(value ?? "").replace(/</g, "&lt;") || "Niet ingevuld"}</li>`)
      .join("");

    const html = `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><title>Moral Maps Trilogie - Portfolio</title>
      <style>
        body{font-family:Arial,sans-serif;padding:32px;max-width:900px;margin:0 auto;color:#0f172a}
        h1{margin:0 0 8px}
        h2{margin:24px 0 8px}
        .section{border:1px solid #e2e8f0;border-radius:12px;padding:14px 16px;margin-bottom:12px}
        .value{white-space:pre-wrap;line-height:1.6}
        ul{padding-left:18px}
        li{margin-bottom:10px}
      </style></head><body>
      <h1>Moral Maps - Trilogie Portfolio</h1>
      <p>Deelnemer: ${travelerName || "-"} · Bestemming: ${destination || "-"}</p>
      <section class="section"><h2>Deel 1 - The Beginning</h2><p class="value">Samenvatting Deel 1 kan hier worden aangevuld vanuit jouw MAPS 1 export.</p></section>
      <section class="section"><h2>Deel 2 - Crossroads</h2><ul>${maps2Items || "<li>Geen opgeslagen antwoorden uit Deel 2 gevonden.</li>"}</ul></section>
      <section class="section"><h2>Deel 3 - Final Destination</h2>
        <p class="value"><strong>Brug - Ballast:</strong> ${bridge.ballast || "Niet ingevuld"}</p>
        <p class="value"><strong>Brug - Meenemen:</strong> ${bridge.meenemen || "Niet ingevuld"}</p>
        <p class="value"><strong>Passie:</strong> ${passie.waar || "Niet ingevuld"}</p>
        <p class="value"><strong>Mensen:</strong> ${mensen.wie || "Niet ingevuld"}</p>
        <p class="value"><strong>Nalatenschap verhaal:</strong> ${nalatenschapStory.verhaal || "Niet ingevuld"}</p>
        <p class="value"><strong>Terugblik - Scharnierpunt:</strong> ${terugblik.scharnierpunt || "Niet ingevuld"}</p>
        <p class="value"><strong>Vooruitblik - Richting:</strong> ${vooruitblik.richting || "Niet ingevuld"}</p>
        <p class="value"><strong>Reisverslag:</strong> ${synthese || "Niet ingevuld"}</p>
      </section>
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
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Moral Maps 3
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Final Destination
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Welkom bij het laatste deel van je reis. In deze fase kijk je terug,
            kies je bewust je richting en maak je je persoonlijke routeplan concreet.
            Neem per opdracht rustig de tijd: elke stap helpt je om met vertrouwen je
            volgende bestemming te bereiken.
          </p>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Soms weet je nog niet precies wat de toekomst je brengt. Juist dan helpt
            het om helder te kiezen wat je in ieder geval wel wilt, en wat je niet
            meer wilt meenemen op je route.
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
            <div className="mt-2 flex flex-wrap gap-2">
              {stepOrder.map((step, idx) => (
                <span
                  key={step}
                  className="h-2.5 w-2.5 rounded-full bg-emerald-300"
                  title={`Stap ${idx + 1}: ${stepMeta[step].title}`}
                />
              ))}
            </div>
          </div>
          <Link
            href="/opdracht/brug"
            className="mt-5 inline-flex rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-[inset_0_-3px_0_rgba(255,255,255,0.12),0_10px_24px_rgba(15,23,42,0.35)] transition hover:bg-slate-800"
          >
            Start Final Destination
          </Link>
          <button
            onClick={downloadTrilogyReport}
            className="mt-3 ml-0 inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100 md:ml-3"
          >
            Download verslag deel 1-2-3
          </button>
          <button
            onClick={saveAndClose}
            className="mt-3 ml-0 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-6 py-3 text-sm font-semibold text-emerald-800 hover:bg-emerald-100 md:ml-3"
          >
            Opslaan en afsluiten
          </button>
        </header>

        <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Image
            src="/images/maps3-landing-smartphone-gps.jpg"
            alt="Smartphone met morele GPS, aankomst op bestemming"
            width={1600}
            height={900}
            className="h-auto w-full object-cover"
            priority
          />
        </section>

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
