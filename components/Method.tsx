import Words from "./Words";
import SignSlot from "./SignSlot";
import { steps } from "@/data/content";

/** Small top-down car that drives down the road as you scroll (see lib/motion.ts). */
function CarIcon() {
  return (
    <svg viewBox="0 0 28 56" className="h-14 w-7 drop-shadow-[0_0_14px_#2be39b]" aria-hidden="true">
      <rect x="3" y="2" width="22" height="52" rx="9" fill="#0d1311" stroke="#2be39b" strokeWidth="2" />
      <rect x="7" y="30" width="14" height="10" rx="3" fill="#2be39b" opacity="0.85" />
      <rect x="7" y="13" width="14" height="8" rx="3" fill="#2be39b" opacity="0.45" />
      <circle cx="8" cy="49" r="1.9" fill="#fff" />
      <circle cx="20" cy="49" r="1.9" fill="#fff" />
    </svg>
  );
}

export default function Method() {
  return (
    <section id="methode" className="relative px-[5vw] py-28 md:py-44">
      <div className="mx-auto max-w-[1300px]">
        <p data-fade className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
          03 — La méthode
        </p>
        <h2 data-words="" className="mt-5 max-w-4xl font-display text-[clamp(30px,4.6vw,76px)] font-black uppercase leading-[1] tracking-[-0.03em]">
          <Words text="Quatre étapes jusqu'au permis." accent="jusqu'au permis." />
        </h2>

        <div data-method="" className="relative mt-20 md:mt-28">
          {/* the road */}
          <div aria-hidden="true" className="absolute inset-y-0 left-4 w-[3px] -translate-x-1/2 md:left-1/2">
            <div className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,rgba(255,255,255,0.28)_0_12px,transparent_12px_26px)]" />
            <div data-road-fill="" className="absolute inset-0 origin-top bg-neon shadow-[0_0_16px_#2be39b]" />
          </div>
          <div aria-hidden="true" className="absolute left-4 top-0 z-10 -translate-x-1/2 md:left-1/2">
            <div data-road-car="">
              <CarIcon />
            </div>
          </div>

          {steps.map((s, i) => {
            const left = i % 2 === 0;
            return (
              <article key={s.n} data-step="" className="relative grid items-center gap-10 py-14 pl-14 md:grid-cols-2 md:gap-28 md:py-24 md:pl-0">
                <div className={left ? "md:pr-6 md:text-right" : "md:order-2 md:pl-6"}>
                  <span className="step-num block font-display text-[clamp(80px,11vw,170px)] font-black leading-[0.85]">{s.n}</span>
                  <h3 className="mt-4 font-display text-3xl font-black uppercase tracking-tight md:text-5xl">{s.title}</h3>
                  <p className={`mt-4 max-w-md text-lg text-bone/70 ${left ? "md:ml-auto" : ""}`}>{s.text}</p>
                  <ul className={`mt-6 flex flex-col gap-2 text-bone/90 ${left ? "md:items-end" : ""}`}>
                    {s.points.map((p) => (
                      <li key={p} className="flex items-center gap-3">
                        <span className="size-2 rotate-45 bg-neon" aria-hidden="true" />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`flex ${left ? "md:justify-start" : "md:order-1 md:justify-end"}`}>
                  {s.fact ? (
                    <div data-spot="" className="spot relative w-full max-w-sm overflow-hidden rounded-[24px] border border-white/10 bg-panel/90 p-8">
                      <p className="font-display text-5xl font-black tracking-tight text-neon md:text-6xl">{s.fact}</p>
                      <p className="mt-3 font-mono text-xs uppercase tracking-[0.16em] text-mute">{s.factLabel}</p>
                    </div>
                  ) : (
                    <SignSlot kind="permis" speed={0.4} tilt={-6} className="mx-auto size-60 md:size-80" />
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}