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
  const [panorama, setPanorama] = useState(
    () =>
      getStoredDraft().panorama ?? {
        goedOndanksKost: "",
        nietGeklopt: "",
        minderStandvastig: "",
        verantwoordelijkheid: "",
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
  const [passie, setPassie] = useState(
    () => getStoredDraft().passie ?? { waar: "" },
  );
  const [mensen, setMensen] = useState(
    () => getStoredDraft().mensen ?? { wie: "" },
  );
  const [nalatenschapStory, setNalatenschapStory] = useState(
    () => getStoredDraft().nalatenschapStory ?? { verhaal: "", goedeDingen: "" },
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
    const filledCount = fields.filter((value) => value.trim().length > 0).length;
    return Math.round((filledCount / 21) * 100);
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
  const stepIntroText: Record<StepId, string> = {
    brug: "Soms is de oversteek spannend en weet je niet precies wat je aan de overkant aantreft. Kies bewust wat je achterlaat, wat je meeneemt en welke waarde je route stuurt.",
    terugblik:
      "Door terug te kijken zie je patronen die je onderweg misschien miste. Gebruik deze stap om helder te krijgen wat je wilt behouden en wat je wilt doorbreken.",
    panorama:
      "Vanaf afstand zie je je keuzes scherper: waar je stevig stond, waar je twijfelde en wat je daarvan leert. Eerlijk terugkijken geeft richting voor je volgende etappe.",
    passie:
      "Passie geeft energie aan je reis. Onderzoek waar jij weer oplaadt en hoe je die energie bewust kunt inzetten in werk, studie en thuissituatie.",
    mensen:
      "Geen route loop je alleen. Sta stil bij de mensen die je dragen, spiegelen en veiligheid geven om echt jezelf te zijn.",
    nalatenschap:
      "Wat je nalaat ontstaat uit dagelijkse keuzes. Beschrijf welk verhaal jij wilt dat anderen later over jouw bijdrage vertellen.",
    vooruitblik:
      "De toekomst is nooit volledig voorspelbaar, maar je kunt wel kiezen wat je wél wilt bouwen en wat je niet meer wilt meenemen. Maak je richting concreet.",
    reisverslag:
      "Breng alles samen in een persoonlijk routeplan. Zo maak je van inzichten een kompas voor gedrag dat je ook echt volhoudt.",
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 md:px-8">
        <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Moral Maps 3: Final Destination - {stepMeta[step].subtitle}
            </p>
            <p className="text-xs text-slate-500">Voortgang: {progress}%</p>
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{stepMeta[step].title}</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            {stepIntroText[step]}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {stepOrder.map((item, idx) => {
              const isDone = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              const cls = isCurrent
                ? "bg-emerald-700"
                : isDone
                  ? "bg-emerald-400"
                  : "bg-slate-300";
              return (
                <span
                  key={item}
                  className={`h-2.5 w-2.5 rounded-full ${cls}`}
                  title={`Stap ${idx + 1}: ${stepMeta[item].title}`}
                />
              );
            })}
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Jouw naam of code
              </span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                value={travelerName}
                onChange={(e) => setTravelerName(e.target.value)}
                placeholder="Bijv. MM-AB12CD"
              />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Jouw volgende bestemming
              </span>
              <input
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-600"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Bijv. Meer rust, duidelijkere keuzes, betere balans"
              />
            </label>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            {step === "brug" && (
              <div className="grid gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Benoem eerlijk wat je achterlaat om ruimte te maken voor een
                  koers die klopt met je waarden.
                </p>
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
                  placeholder="Kernwaarde voor uw interne GPS"
                  value={bridge.kompas}
                  onChange={(e) =>
                    setBridge((prev) => ({ ...prev, kompas: e.target.value }))
                  }
                />
              </div>
            )}

            {step === "terugblik" && (
              <div className="grid gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Kijk terug op keerpunten in je reis en maak zichtbaar welke
                  patronen je voortaan bewuster wilt sturen.
                </p>
                <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-900">
                  Een scharnierpunt is een moment of gebeurtenis die zo&apos;n indruk
                  op je maakte dat het je denken, voelen of handelen blijvend veranderde.
                </p>
                <textarea
                  className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Wat was jouw scharnierpunt (het moment dat je blijvend veranderde)?"
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
                  placeholder="Wat is je morele GPS-richting?"
                  value={terugblik.noorden}
                  onChange={(e) =>
                    setTerugblik((prev) => ({ ...prev, noorden: e.target.value }))
                  }
                />
              </div>
            )}

            {step === "vooruitblik" && (
              <div className="grid gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Vertaal je inzichten naar richtinggevende keuzes die je
                  gedrag de komende periode echt gaan sturen.
                </p>
                <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-900">
                  Soms denk je na over wat jouw doel is in de wereld: wat je hoopt
                  na te laten, hoe mensen over je zullen praten, wat je graag wilt
                  bereiken en hoe je het goede blijft doen.
                </p>
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

            {step === "passie" && (
              <div className="grid gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Waar kunt u uw passie vinden tijdens uw reis (studie, werk, thuissituatie)
                  en hoe dan?
                </p>
                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Beschrijf waar u passie vindt tijdens uw reis en hoe dat zichtbaar is."
                  value={passie.waar}
                  onChange={(e) => setPassie({ waar: e.target.value })}
                />
              </div>
            )}

            {step === "mensen" && (
              <div className="grid gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Wie zijn de meest belangrijke mensen in uw leven, en bij wie kunt u helemaal uzelf zijn?
                </p>
                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Beschrijf de belangrijkste mensen en waarom u bij hen uzelf kunt zijn."
                  value={mensen.wie}
                  onChange={(e) => setMensen({ wie: e.target.value })}
                />
              </div>
            )}

            {step === "nalatenschap" && (
              <div className="grid gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Schrijf een kort verhaal over wat anderen later over uw reis mogen vertellen.
                </p>
                <textarea
                  className="min-h-32 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="1) Wat zou u willen dat anderen vertellen over uw betekenis voor anderen en de wereld?"
                  value={nalatenschapStory.verhaal}
                  onChange={(e) =>
                    setNalatenschapStory((prev) => ({ ...prev, verhaal: e.target.value }))
                  }
                />
                <textarea
                  className="min-h-28 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="2) Heeft u de goede dingen gedaan voor anderen?"
                  value={nalatenschapStory.goedeDingen}
                  onChange={(e) =>
                    setNalatenschapStory((prev) => ({ ...prev, goedeDingen: e.target.value }))
                  }
                />
              </div>
            )}

            {step === "reisverslag" && (
              <div className="grid gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Maak een korte synthese van je route: wie je bent geworden,
                  wat je bewaakt en wat je vanaf nu anders doet.
                </p>
                <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs leading-5 text-emerald-900">
                  Je vat hier je reis samen in een persoonlijk reisverslag. Beschrijf
                  niet alleen waar je nu staat, maar ook welke keuzes je bewust wilt
                  blijven maken, welke waarden je wilt bewaken en hoe je dat in de
                  praktijk gaat laten zien.
                </p>
                <textarea
                  className="min-h-40 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                  placeholder="Vat samen wie u bent geworden, wat u meeneemt en hoe u uw interne GPS blijft finetunen."
                  value={synthese}
                  onChange={(e) => setSynthese(e.target.value)}
                />
                <p className="text-xs text-slate-500">
                  Alles wordt automatisch lokaal opgeslagen.
                </p>
              </div>
            )}

            {step === "panorama" && (
              <div className="grid gap-3">
                <p className="text-xs leading-5 text-slate-500">
                  Vanuit de bergtop zie je niet alleen de mooie route - je ziet
                  ook de zijpaden die je vermeed en de punten waar je bent
                  uitgegleden.
                </p>
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-slate-700">
                    Kijk je terug op jouw reis: waar handelde je goed, ook als
                    het je iets kostte?
                  </span>
                  <span className="text-xs text-slate-500">
                    Benoem een concreet moment waarop je waarde boven gemak
                    koos.
                  </span>
                  <textarea
                    className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                    placeholder="Beschrijf het moment en de prijs die je betaalde."
                    value={panorama.goedOndanksKost}
                    onChange={(e) =>
                      setPanorama((prev) => ({
                        ...prev,
                        goedOndanksKost: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-slate-700">
                    Wat is iets wat je hebt gedaan - of nagelaten - waarvan je
                    nu weet dat het niet klopte?
                  </span>
                  <span className="text-xs text-slate-500">
                    Schrijf eerlijk op wat er gebeurde en wat je nu anders zou
                    doen.
                  </span>
                  <textarea
                    className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                    placeholder="Wat klopte er niet en wat leer je daarvan?"
                    value={panorama.nietGeklopt}
                    onChange={(e) =>
                      setPanorama((prev) => ({
                        ...prev,
                        nietGeklopt: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-slate-700">
                    Welke waarde bleek in de praktijk minder standvastig dan je
                    dacht? Wat zegt dat over jou?
                  </span>
                  <span className="text-xs text-slate-500">
                    Koppel je antwoord aan een terugkerend patroon in keuzes
                    of gedrag.
                  </span>
                  <textarea
                    className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                    placeholder="Welke waarde wankelde en waarom?"
                    value={panorama.minderStandvastig}
                    onChange={(e) =>
                      setPanorama((prev) => ({
                        ...prev,
                        minderStandvastig: e.target.value,
                      }))
                    }
                  />
                </label>
                <label className="grid gap-1">
                  <span className="text-sm font-medium text-slate-700">
                    Voor wie of wat voel jij je verantwoordelijk - en leefde je
                    daarnaar?
                  </span>
                  <span className="text-xs text-slate-500">
                    Toets je intentie aan je feitelijke gedrag en keuzes.
                  </span>
                  <textarea
                    className="min-h-24 rounded-xl border border-slate-300 p-3 text-sm outline-none focus:border-emerald-600"
                    placeholder="Waar nam je verantwoordelijkheid en waar bleef dat uit?"
                    value={panorama.verantwoordelijkheid}
                    onChange={(e) =>
                      setPanorama((prev) => ({
                        ...prev,
                        verantwoordelijkheid: e.target.value,
                      }))
                    }
                  />
                </label>
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

