import Words from "./Words";
import { site } from "@/data/site";

const tile = "spot relative overflow-hidden rounded-[28px] border border-white/10 bg-panel/90 p-7 md:p-9";

export default function Why() {
  const years = new Date().getFullYear() - site.since;
  return (
    <section id="pourquoi" className="relative px-[5vw] py-28 md:py-44">
      <div className="mx-auto max-w-[1400px]">
        <p data-fade className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
          04 — Pourquoi Rostand
        </p>
        <h2 data-words="" className="mt-5 max-w-4xl font-display text-[clamp(30px,4.6vw,76px)] font-black uppercase leading-[1] tracking-[-0.03em]">
          <Words text="Tout pour réussir, rien de superflu." accent="réussir," />
        </h2>

        <div data-stagger="" className="mt-16 grid gap-5 md:grid-cols-4 md:grid-rows-3">
          <article data-spot="" className={`${tile} flex flex-col justify-between md:col-span-2 md:row-span-2 md:min-h-[420px]`}>
            <div aria-hidden="true" className="absolute -right-16 -top-16 size-72 rounded-full bg-[radial-gradient(circle,rgba(43,227,155,0.28),transparent_65%)]" />
            <p className="relative font-mono text-xs uppercase tracking-[0.2em] text-mute">Notre histoire</p>
            <div className="relative">
              <p className="font-display text-[clamp(90px,13vw,200px)] font-black leading-[0.85] tracking-tight text-neon [text-shadow:0_0_50px_rgba(43,227,155,0.45)]">
                <span data-count={years}>{years}</span>
              </p>
              <p className="mt-4 font-display text-2xl font-black uppercase tracking-tight">ans d&apos;expérience</p>
              <p className="mt-3 max-w-sm text-bone/70">Depuis {site.since}, on forme des conducteurs responsables et sereins.</p>
            </div>
          </article>

          <article data-spot="" className={`${tile} md:col-span-2`}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Véhicules</p>
            <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">Récents, à double commande</h3>
            <p className="mt-3 max-w-md text-bone/70">Des voitures entretenues et sécurisées, pour apprendre en toute confiance.</p>
          </article>

          <article data-spot="" className={tile}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Boîte</p>
            <p className="mt-4 font-display text-4xl font-black text-neon">B / BVA</p>
            <p className="mt-2 text-sm text-bone/70">Manuelle ou automatique, vous choisissez.</p>
          </article>

          <article data-spot="" className={tile}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Code</p>
            <p className="mt-4 font-display text-4xl font-black text-neon">35/40</p>
            <p className="mt-2 text-sm text-bone/70">Le seuil à atteindre. On s&apos;entraîne jusqu&apos;à l&apos;aisance.</p>
          </article>

          <article data-spot="" className={`${tile} md:col-span-2`}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Planning</p>
            <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">Des horaires faits pour vous</h3>
            <p className="mt-3 max-w-md text-bone/70">Études, travail, famille : on organise les leçons autour de votre emploi du temps.</p>
          </article>

          <article data-spot="" className={`${tile} md:col-span-2`}>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-mute">Paiement</p>
            <h3 className="mt-4 font-display text-2xl font-black uppercase leading-tight tracking-tight md:text-3xl">Facilités de règlement</h3>
            <p className="mt-3 max-w-md text-bone/70">Réglez votre formation en plusieurs fois, et renseignez-vous sur le financement par le CPF.</p>
          </article>
        </div>
      </div>
    </section>
  );
}