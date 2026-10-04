import Image from "next/image";
import ScrollLink from "./ScrollLink";
import { site } from "@/data/site";
import { nav } from "@/data/content";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/10 bg-night px-[5vw] pb-[calc(env(safe-area-inset-bottom,0px)_+_2rem)] pt-20">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-14 md:grid-cols-[1.3fr_1fr_1fr]">
          <div>
            <Image src="/images/logo-rostand.png" alt="Auto-École Rostand, depuis 2009" width={448} height={330} className="h-auto w-56" />
            <p className="mt-6 max-w-sm text-bone/60">{site.description}</p>
          </div>

          <nav aria-label="Pied de page">
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neon">Navigation</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {nav.map((l) => (
                <li key={l.href}>
                  <ScrollLink href={l.href} className="text-bone/75 transition hover:text-neon">
                    {l.label}
                  </ScrollLink>
                </li>
              ))}
              <li>
                <ScrollLink href="#reservation" className="text-bone/75 transition hover:text-neon">
                  Réservation
                </ScrollLink>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-neon">Suivez-nous</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="text-bone/75 transition hover:text-neon">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p aria-hidden="true" className="stroke-text mt-20 select-none text-center font-display text-[clamp(56px,18.5vw,320px)] font-black leading-[0.82] tracking-tight">
          ROSTAND
        </p>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-bone/50 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name} · {site.agrement}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            <li>
              <a href="#" className="hover:text-neon">
                Mentions légales
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-neon">
                Politique de confidentialité
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-neon">
                CGV
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}