import Words from "./Words";
import SignSlot from "./SignSlot";
import { services } from "@/data/content";

export default function Formations() {
  return (
    <section id="formations" data-hscroll="" className="relative lg:h-screen lg:overflow-hidden">
      <div data-hscroll-track="" className="flex gap-6 px-[5vw] py-24 max-lg:flex-col lg:h-full lg:w-max lg:items-center lg:gap-8 lg:py-0">
        {/* title panel */}
        <div className="relative shrink-0 lg:w-[46vw] lg:pr-[4vw]">
          <p data-fade className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            02 — Formations
          </p>
          <h2 data-words="" className="mt-5 font-display text-[clamp(30px,4.6vw,76px)] font-black uppercase leading-[1] tracking-[-0.03em]">
            <Words text="Le bon permis pour chaque projet." accent="chaque projet." />
          </h2>
          <p data-fade className="mt-6 max-w-md text-lg text-bone/70">
            Manuelle, automatique, accompagnée ou accélérée : choisissez la formation qui colle à votre vie.
          </p>
          <p className="mt-10 hidden items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-mute lg:flex">
            Faites défiler <span className="inline-block h-px w-14 bg-neon" />
          </p>
          <SignSlot kind="stop" speed={0.8} tilt={8} delay={0.3} className="absolute -top-6 right-0 size-24 lg:-right-2 lg:top-0 lg:size-32" />
          <SignSlot kind="zone30" speed={-0.6} tilt={-8} delay={0.5} className="absolute -bottom-4 right-24 hidden size-24 lg:block" />
        </div>

        {services.map((s) => (
          <article
            key={s.n}
            data-spot=""
            className="spot relative flex w-full shrink-0 flex-col justify-between overflow-hidden rounded-[28px] border border-white/10 bg-panel/90 p-8 lg:h-[64vh] lg:max-h-[600px] lg:w-[min(30vw,440px)]"
          >
            <div className="flex items-start justify-between">
              <span className="font-mono text-sm text-mute">{s.n}</span>
              <span className="rounded-full border border-neon/30 bg-neon/10 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-neon">{s.tag}</span>
            </div>

            <p aria-hidden="true" className="stroke-neon my-6 select-none font-display text-[clamp(72px,9vw,150px)] font-black leading-none">
              {s.badge}
            </p>

            <div>
              <h3 className="font-display text-2xl font-black uppercase leading-tight tracking-tight">{s.title}</h3>
              <p className="mt-3 text-bone/70">{s.text}</p>
            </div>
          </article>
        ))}

        <div aria-hidden="true" className="hidden shrink-0 lg:block lg:w-[12vw]" />
      </div>

      <div aria-hidden="true" className="absolute bottom-10 left-[5vw] right-[5vw] hidden h-px bg-white/15 lg:block">
        <div data-hscroll-bar="" className="h-full origin-left scale-x-0 bg-neon shadow-[0_0_10px_#2be39b]" />
      </div>
    </section>
  );
}