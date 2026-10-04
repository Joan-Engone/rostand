"use client";

import type { ReactNode } from "react";
import { scrollToTarget } from "@/lib/scroll";

type Props = { planId: string; className?: string; children: ReactNode };

/** Pre-selects the formula in the booking form, then scrolls to it. */
export default function PlanButton({ planId, className, children }: Props) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(new CustomEvent("select-plan", { detail: planId }));
        scrollToTarget("#reservation");
      }}
    >
      {children}
    </button>
  );
}