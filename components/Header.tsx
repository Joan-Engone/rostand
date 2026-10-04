"use client";

import { useEffect, useState } from "react";
import ScrollLink from "./ScrollLink";
import Logo from "./Logo";
import { setScrollLocked } from "@/lib/scroll";
import { site } from "@/data/site";
import { nav } from "@/data/content";

export default function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.menu = open ? "open" : "closed";
    setScrollLocked(open);
    return () => setScrollLocked(false);
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header data-header className="fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-300">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-[5vw] pb-4 pt-[calc(env(safe-area-inset-top,0px)_+_1rem)] text-bone lg:px-10">
          <ScrollLink href="#top" aria-label="Auto-École Rostand — accueil" onNavigate={() => setOpen(false)}>
            <Logo />
          </ScrollLink>

          <nav aria-label="Navigation principale" className="hidden items-center gap-9 lg:flex">
            {nav.map((l) => (
              <ScrollLink key={l.href} href={l.href} className="text-[15px] font-medium text-bone/80 transition hover:text-neon">
                {l.label}
              </ScrollLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={`tel:${site.phoneHref}`}
              className="hidden rounded-full border border-white/15 px-5 py-2.5 font-mono text-sm transition hover:border-neon hover:text-neon md:inline-flex"
            >
              {site.phone}
            </a>
            <ScrollLink
              href="#reservation"
              className="hidden rounded-full bg-neon px-5 py-2.5 text-sm font-bold text-night shadow-[0_0_28px_-6px_#2be39b] transition hover:brightness-110 sm:inline-flex"
            >
              Réserver
            </ScrollLink>
            <button
              type="button"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="flex size-11 flex-col items-center justify-center gap-[6px] lg:hidden"
            >
              <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "translate-y-[4px] rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-between bg-night px-[7vw] pb-10 pt-28 text-bone transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Menu mobile" className="flex flex-col gap-3">
          {nav.map((l, i) => (
            <ScrollLink
              key={l.href}
              href={l.href}
              tabIndex={open ? 0 : -1}
              onNavigate={() => setOpen(false)}
              style={{ transitionDelay: open ? `${120 + i * 60}ms` : "0ms" }}
              className={`font-display text-3xl font-black uppercase tracking-tight transition-all duration-500 ${
                open ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
              }`}
            >
              {l.label}
            </ScrollLink>
          ))}
        </nav>
        <div className="flex flex-col gap-3">
          <ScrollLink href="#reservation" tabIndex={open ? 0 : -1} onNavigate={() => setOpen(false)} className="rounded-full bg-neon px-7 py-4 text-center font-bold text-night">
            Réserver un rendez-vous
          </ScrollLink>
          <a href={`tel:${site.phoneHref}`} tabIndex={open ? 0 : -1} className="rounded-full border border-white/20 px-7 py-4 text-center font-mono">
            {site.phone}
          </a>
        </div>
      </div>
    </>
  );
}