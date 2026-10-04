"use client";

import { useEffect, useState, type FormEvent } from "react";
import { plans, planOptions } from "@/data/content";

type Status = "idle" | "invalid" | "sending" | "sent" | "error";

const messages: Record<Status, string> = {
  idle: "",
  invalid: "Merci de renseigner votre nom, un téléphone, un e-mail valide et d'accepter la politique de confidentialité.",
  sending: "Envoi en cours…",
  sent: "Merci ! Nous vous rappelons très vite pour fixer votre rendez-vous.",
  error: "Une erreur est survenue. Veuillez réessayer ou nous appeler.",
};

const field =
  "block w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3.5 text-bone outline-none transition placeholder:text-mute focus:border-neon focus:ring-4 focus:ring-neon/15";

export default function BookingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [plan, setPlan] = useState(planOptions[0]);

  // The "Choisir ce forfait" buttons pre-select the formula.
  useEffect(() => {
    const onSelect = (e: Event) => {
      const id = (e as CustomEvent<string>).detail;
      const found = plans.find((p) => p.id === id);
      if (found) setPlan(`${found.name} · ${found.title}`);
    };
    window.addEventListener("select-plan", onSelect);
    return () => window.removeEventListener("select-plan", onSelect);
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      setStatus("invalid");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(form))),
      });
      if (!res.ok) throw new Error("Request failed");
      form.reset();
      setPlan(planOptions[0]);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Nom et prénom *</span>
        <input name="name" autoComplete="name" required className={field} />
      </label>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">Téléphone *</span>
          <input name="phone" type="tel" autoComplete="tel" required className={field} />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold">E-mail *</span>
          <input name="email" type="email" autoComplete="email" required className={field} />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Je suis intéressé(e) par</span>
        <select name="plan" value={plan} onChange={(e) => setPlan(e.target.value)} className={`${field} [&>option]:bg-night`}>
          {planOptions.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-semibold">Message</span>
        <textarea name="message" rows={4} className={`${field} resize-none`} />
      </label>
      <label className="flex items-start gap-3 text-sm text-bone/70">
        <input name="consent" type="checkbox" required className="mt-1 size-4 accent-[#2be39b]" />
        <span>J&apos;accepte que mes données soient utilisées pour répondre à ma demande, conformément à la politique de confidentialité. *</span>
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="cursor-pointer rounded-full bg-neon px-8 py-4 font-bold text-night shadow-[0_0_40px_-8px_#2be39b] transition hover:-translate-y-0.5 hover:brightness-110 disabled:opacity-60"
      >
        Réserver mon rendez-vous
      </button>
      <p role="status" aria-live="polite" className="min-h-6 text-sm font-medium text-neon">
        {messages[status]}
      </p>
    </form>
  );
}