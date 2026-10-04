import Words from "./Words";
import PlanButton from "./PlanButton";
import { plans } from "@/data/content";

export default function Pricing() {
  return (
    <section id="tarifs" className="relative px-[5vw] py-28 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <p data-fade className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
          05 — Tarifs
        </p>
        <h2 data-words="" className="mt-5 max-w-4xl font-display text-[clamp(30px,4.6vw,76px)] font-black uppercase leading-[1] tracking-[-0.03em]">
          <Words text="Des forfaits clairs, sans surprise." accent="sans surprise." />
        </h2>

        <div data-stagger="" className="mt-16 grid items-stretch gap-6 [perspective:1200px] lg:grid-cols-3">
          {plans.map((p) => (
            <article
              key={p.id}
              data-tilt=""
              data-spot=""
              className={`spot relative flex flex-col overflow-hidden rounded-[28px] p-8 md:p-10 ${
                p.featured ? "neon-border bg-[#0b1a14] lg:-mt-5 lg:mb-5" : "border border-white/10 bg-panel/90"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">{p.title}</p>
                {p.featured ? <span className="rounded-full bg-neon px-3 py-1 text-xs font-bold text-night">Le plus choisi</span> : null}
              </div>

              <h3 className="mt-6 font-display text-3xl font-black uppercase tracking-tight">{p.name}</h3>

              <p className="mt-6 flex items-baseline gap-2">
                <span className={`font-display text-6xl font-black tracking-tight ${p.featured ? "text-neon [text-shadow:0_0_40px_rgba(43,227,155,0.5)]" : ""}`}>{p.price}</span>
                <span className="text-2xl font-bold">€</span>
                <span className="text-sm text-mute">TTC</span>
              </p>
              <p className="mt-3 text-bone/70">{p.note}</p>

              <ul className="mt-8 flex flex-col gap-3 border-t border-dashed border-white/20 pt-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-bone/90">
                    <svg viewBox="0 0 20 20" className="mt-0.5 size-5 shrink-0 text-neon" aria-hidden="true">
                      <circle cx="10" cy="10" r="10" fill="currentColor" />
                      <path d="M5.5 10.5l3 3 6-6.5" fill="none" stroke="#060908" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <PlanButton
                planId={p.id}
                className={`mt-10 cursor-pointer rounded-full px-7 py-4 font-bold transition hover:-translate-y-0.5 ${
                  p.featured ? "bg-neon text-night shadow-[0_0_36px_-8px_#2be39b] hover:brightness-110" : "border border-white/25 hover:border-neon hover:text-neon"
                }`}
              >
                Choisir ce forfait
              </PlanButton>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}