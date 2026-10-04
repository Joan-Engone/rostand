import Image from "next/image";
import Words from "./Words";
import { site } from "@/data/site";

const values = [
  { t: "Pédagogie", d: "On explique, on montre, on recommence. Sans pression." },
  { t: "Sécurité", d: "Des conducteurs responsables, pour aujourd'hui et pour demain." },
  { t: "Proximité", d: "Un interlocuteur qui vous connaît et suit votre progression." },
];

export default function About() {
  return (
    <section id="autoecole" className="relative px-[5vw] py-28 md:py-44">
      <span
        aria-hidden="true"
        data-speed="-0.7"
        className="stroke-text pointer-events-none absolute -top-8 right-[2vw] select-none font-display text-[clamp(120px,24vw,380px)] font-black leading-none opacity-70"
      >
        {site.since}
      </span>

      <div className="relative mx-auto grid max-w-[1400px] items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div className="relative mx-auto w-full max-w-[520px]" data-tilt="">
          <div aria-hidden="true" className="absolute -inset-4 rounded-[2.4rem] bg-neon/20 blur-2xl" />
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-neon/30 shadow-[0_0_80px_-20px_#2be39b]">
            <div data-zoom="" className="absolute inset-0">
              <Image
                src="/images/enseigne-neon.jpg"
                alt="Enseigne néon de l'Auto-École Rostand, depuis 2009, avec un volant à la place du O"
                fill
                sizes="(min-width: 1024px) 520px, 90vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <div>
          <p data-fade className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            01 — L&apos;auto-école
          </p>
          <h2 data-words="" className="mt-5 font-display text-[clamp(30px,4.6vw,72px)] font-black uppercase leading-[1] tracking-[-0.03em]">
            <Words text={`Depuis ${site.since}, on apprend à conduire autrement.`} accent="autrement." />
          </h2>
          <p data-fade className="mt-7 max-w-xl text-lg leading-relaxed text-bone/70">
            L&apos;Auto-École Rostand accompagne les futurs conducteurs depuis {site.since}. Notre approche : de la pédagogie, de la patience et un suivi personnalisé, pour que chaque élève prenne la route en confiance et en sécurité.
          </p>

          <ul data-stagger="" className="mt-10 grid gap-4 sm:grid-cols-3">
            {values.map((v) => (
              <li key={v.t} className="spot relative overflow-hidden rounded-2xl border border-white/10 bg-panel p-5" data-spot="">
                <h3 className="font-display text-lg font-black uppercase tracking-tight text-neon">{v.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-bone/70">{v.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}