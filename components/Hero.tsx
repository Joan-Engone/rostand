import Words from "./Words";
import ScrollLink from "./ScrollLink";
import { site } from "@/data/site";

export default function Hero() {
  const years = new Date().getFullYear() - site.since;
  const stats = [
    { big: `${years} ans`, small: `d'expérience · depuis ${site.since}` },
    { big: "B · BVA · AAC", small: "manuelle, automatique, accompagnée" },
    { big: "Moniteurs", small: "diplômés et à l'écoute" },
  ];

  return (
    <section id="top" data-hero className="relative min-h-[100svh] overflow-hidden px-[5vw] pb-10 pt-28">
      {/* keeps the headline readable over the road */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(6,9,8,0.92)_0%,rgba(6,9,8,0.6)_42%,transparent_72%)] max-lg:bg-[linear-gradient(180deg,rgba(6,9,8,0.92)_0%,rgba(6,9,8,0.82)_58%,rgba(6,9,8,0.25)_86%,transparent_100%)]"
      />

      <div data-hero-content className="relative mx-auto flex min-h-[calc(100svh-9rem)] max-w-[1500px] flex-col justify-between gap-12">
        <div className="max-w-[820px] pt-4 lg:pt-14">
          <p
            data-hero-item
            className="inline-flex items-center gap-3 rounded-full border border-neon/30 bg-neon/10 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-neon sm:text-xs"
          >
            <span className="size-2 rounded-full bg-neon shadow-[0_0_12px_#2be39b]" />
            Auto-école · depuis {site.since}
          </p>

          <h1
            data-words=""
            data-delay="0.4"
            className="mt-7 font-display text-[clamp(36px,6.3vw,106px)] font-black uppercase leading-[0.96] tracking-[-0.03em] text-bone"
          >
            <span className="block">
              <Words text="La route" />
            </span>
            <span className="block">
              <Words text="commence" />
            </span>
            <span className="block">
              <Words text="ici." accent="ici." />
            </span>
          </h1>

          <p data-hero-item className="mt-7 max-w-xl text-lg leading-relaxed text-bone/70 md:text-xl">
            Permis B, conduite accompagnée et code de la route avec des moniteurs passionnés. On vous accompagne pas à pas, du premier rendez-vous jusqu&apos;au permis.
          </p>

          <div data-hero-item className="mt-9 flex flex-wrap gap-4">
            <ScrollLink
              href="#reservation"
              className="rounded-full bg-neon px-8 py-4 font-bold text-night shadow-[0_0_40px_-8px_#2be39b] transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Réserver un rendez-vous
            </ScrollLink>
            <ScrollLink href="#formations" className="rounded-full border border-white/25 px-8 py-4 font-semibold text-bone transition hover:border-neon hover:text-neon">
              Voir les formations
            </ScrollLink>
          </div>
        </div>

        <ul data-hero-item className="grid max-w-[900px] gap-6 border-t border-white/10 pt-7 sm:grid-cols-3">
          {stats.map((s) => (
            <li key={s.big}>
              <p className="font-display text-xl font-black uppercase tracking-tight text-bone md:text-2xl">{s.big}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.14em] text-mute">{s.small}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}