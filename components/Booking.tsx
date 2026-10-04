import Words from "./Words";
import SignSlot from "./SignSlot";
import BookingForm from "./BookingForm";
import { site } from "@/data/site";

export default function Booking() {
  return (
    <section id="reservation" className="relative px-[5vw] py-28 md:py-44">
      <div className="relative mx-auto grid max-w-[1400px] gap-16 lg:grid-cols-[1fr_0.95fr] lg:gap-24">
        <div>
          <p data-fade className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            07 — Réservation
          </p>
          <h2 data-words="" className="mt-5 font-display text-[clamp(32px,5.2vw,84px)] font-black uppercase leading-[0.98] tracking-[-0.03em]">
            <Words text="Prêt à démarrer ?" accent="démarrer ?" />
          </h2>
          <p data-fade className="mt-6 max-w-lg text-lg text-bone/70">
            Le premier rendez-vous est sans engagement. Laissez-nous vos coordonnées : on vous rappelle pour trouver le bon créneau.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            <div data-fade>
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neon">Coordonnées</h3>
              <p className="mt-3">
                <a href={`tel:${site.phoneHref}`} className="font-display text-2xl font-black transition hover:text-neon">
                  {site.phone}
                </a>
              </p>
              <p className="mt-1">
                <a href={`mailto:${site.email}`} className="text-bone/80 underline-offset-4 hover:text-neon hover:underline">
                  {site.email}
                </a>
              </p>
              <address className="mt-4 not-italic text-bone/70">
                {site.address.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a href={site.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-neon underline-offset-4 hover:underline">
                Voir sur la carte →
              </a>
            </div>
            <div data-fade data-delay="0.1">
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-neon">Horaires</h3>
              <dl className="mt-3 flex flex-col gap-1.5">
                {site.hours.map(([d, h]) => (
                  <div key={d} className="flex justify-between gap-6 border-b border-white/10 pb-1.5">
                    <dt className="text-bone/70">{d}</dt>
                    <dd className="font-semibold">{h}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <SignSlot kind="wheel" speed={0.6} className="mx-auto mt-14 size-56 sm:size-72 lg:ml-0 lg:size-80" />
        </div>

        <div data-fade className="relative h-fit rounded-[2rem] border border-white/10 bg-panel/90 p-7 shadow-[0_0_80px_-30px_#2be39b] md:p-10">
          <h3 className="mb-6 font-display text-2xl font-black uppercase tracking-tight">Votre demande</h3>
          <BookingForm />
        </div>
      </div>
    </section>
  );
}