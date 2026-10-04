"use client";

import { useState } from "react";
import { faq } from "@/data/content";

export default function FaqList() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-white/10 border-y border-white/10">
      {faq.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left font-display text-lg font-bold uppercase tracking-tight transition hover:text-neon md:text-xl"
              >
                <span>{item.q}</span>
                <span
                  aria-hidden="true"
                  className={`grid size-10 shrink-0 place-items-center rounded-full border text-2xl leading-none transition duration-300 ${
                    isOpen ? "rotate-45 border-neon bg-neon text-night" : "border-white/20"
                  }`}
                >
                  +
                </span>
              </button>
            </h3>
            <div id={`faq-${i}`} role="region" className={`grid transition-[grid-template-rows] duration-500 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <div className="overflow-hidden">
                <p className="max-w-3xl pb-6 text-bone/70">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}