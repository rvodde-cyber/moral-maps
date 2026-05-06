"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { getStoredDraft, STORAGE_KEY } from "@/lib/final-destination-storage";

export default function Home() {
  const stored = getStoredDraft();
  const [travelerName, setTravelerName] = useState(stored.travelerName ?? "");
  const [destination, setDestination] = useState(stored.destination ?? "");
  const [bridge, setBridge] = useState(
    stored.bridge ?? { ballast: "", meenemen: "", vinden: "", kompas: "" },
  );
  const [terugblik, setTerugblik] = useState(
    stored.terugblik ?? { scharnierpunt: "", patroon: "", noorden: "" },
  );
  const [vooruitblik, setVooruitblik] = useState(
    stored.vooruitblik ?? { nalatenschap: "", richting: "", belofte: "" },
  );
  const [synthese, setSynthese] = useState(stored.synthese ?? "");

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
      bridge.kompas,
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
        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
            Moral Maps 3
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            Final Destination - De Aankomst
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
            Laatste etappe van de trilogie: kies wat je achterlaat, wat je
            meeneemt en welke koers je hierna bewust volgt.
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
        </motion.header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Signature-opdracht
            </p>
            <h2 className="mt-2 text-xl font-bold">De Brug in de Mist</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              De brug heeft beperkte draagkracht. Kies bewust wat je achterlaat
              en wat je meeneemt naar je volgende fase.
            </p>
            <div className="mt-4 grid gap-3">
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
          </article>

          <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <Image
              src="https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1400&q=80"
              alt="Brug in mistige omgeving als metafoor voor de overgang"
              width={1200}
              height={900}
              className="h-full min-h-80 w-full object-cover"
              priority
            />
          </article>
        </section>

        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Terugblik</h3>
            <div className="mt-3 grid gap-3">
              <textarea
                className="min-h-20 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
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
                className="min-h-20 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                placeholder="Welk patroon zie je terug?"
                value={terugblik.patroon}
                onChange={(e) =>
                  setTerugblik((prev) => ({ ...prev, patroon: e.target.value }))
                }
              />
              <textarea
                className="min-h-20 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                placeholder="Wat is je ware noorden?"
                value={terugblik.noorden}
                onChange={(e) =>
                  setTerugblik((prev) => ({ ...prev, noorden: e.target.value }))
                }
              />
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Vooruitblik</h3>
            <div className="mt-3 grid gap-3">
              <textarea
                className="min-h-20 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
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
                className="min-h-20 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
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
                className="min-h-20 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                placeholder="Wat beloof je jezelf concreet?"
                value={vooruitblik.belofte}
                onChange={(e) =>
                  setVooruitblik((prev) => ({ ...prev, belofte: e.target.value }))
                }
              />
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold">Synthese - Reisverslag 3.0</h3>
          <textarea
            className="mt-3 min-h-28 w-full rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
            placeholder="Vat samen wie je bent geworden, wat je meeneemt en hoe je koers houdt."
            value={synthese}
            onChange={(e) => setSynthese(e.target.value)}
          />
          <p className="mt-2 text-xs text-slate-500">
            Alles wordt automatisch lokaal opgeslagen.
          </p>
        </section>
      </div>
    </main>
  );
}
