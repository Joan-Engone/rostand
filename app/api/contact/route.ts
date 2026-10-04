import { NextResponse } from "next/server";

type Body = { name?: string; phone?: string; email?: string; plan?: string; message?: string; consent?: string };

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Body | null;
  const { name, phone, email, plan, message, consent } = body ?? {};

  if (!name?.trim() || !phone?.trim() || !email || !/^\S+@\S+\.\S+$/.test(email) || !consent) {
    return NextResponse.json({ ok: false, error: "Données invalides" }, { status: 400 });
  }

  // TODO: envoyer le message à l'auto-école. Options courantes :
  //  - Resend (npm i resend) : await resend.emails.send({ from, to, subject, text })
  //  - Nodemailer avec les identifiants SMTP de l'auto-école
  // Pour l'instant, la demande est seulement écrite dans les logs du serveur.
  console.log("Demande de réservation :", { name, phone, email, plan, message });

  return NextResponse.json({ ok: true });
}