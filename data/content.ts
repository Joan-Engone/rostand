// Tout le contenu des sections. Les prix sont des exemples : à remplacer par les vrais tarifs.

export const nav = [
  { href: "#autoecole", label: "L'auto-école" },
  { href: "#formations", label: "Formations" },
  { href: "#methode", label: "Méthode" },
  { href: "#tarifs", label: "Tarifs" },
  { href: "#faq", label: "FAQ" },
];

export const marqueeItems = ["Rostand", "Depuis 2009", "Permis B", "Conduite accompagnée", "Code de la route"];

export type Service = { n: string; badge: string; title: string; text: string; tag: string };

export const services: Service[] = [
  { n: "01", badge: "B", title: "Permis B · boîte manuelle", text: "Le parcours complet : code, conduite en ville, sur route et en agglomération, avec un moniteur qui s'adapte à votre rythme.", tag: "20 h minimum" },
  { n: "02", badge: "BVA", title: "Permis B · boîte automatique", text: "Une conduite plus fluide, idéale en ville. Le permis est alors valable pour les véhicules à boîte automatique.", tag: "13 h minimum" },
  { n: "03", badge: "AAC", title: "Conduite accompagnée", text: "Dès 15 ans, apprenez progressivement avec un accompagnateur et arrivez à l'examen avec de l'expérience.", tag: "Dès 15 ans" },
  { n: "04", badge: "ETG", title: "Code de la route", text: "Entraînement en ligne illimité, cours en salle et examens blancs pour aborder l'épreuve théorique sereinement.", tag: "40 questions" },
  { n: "05", badge: "24h", title: "Stage intensif", text: "Une formation condensée pour passer rapidement l'examen, selon vos disponibilités et celles de l'administration.", tag: "Sur mesure" },
  { n: "06", badge: "R+", title: "Remise à niveau", text: "Vous avez le permis mais plus confiance au volant ? Reprenez la route avec un moniteur patient.", tag: "À la carte" },
];

export type Step = { n: string; title: string; text: string; points: string[]; fact: string; factLabel: string };

export const steps: Step[] = [
  { n: "01", title: "Inscription", text: "On se rencontre à l'agence, on monte votre dossier et on choisit ensemble la formule qui vous convient.", points: ["Dossier administratif pris en charge", "Choix de la formule", "Premier rendez-vous sans engagement"], fact: "1 dossier", factLabel: "Et on s'occupe du reste" },
  { n: "02", title: "Code", text: "Entraînement en ligne illimité et séances en salle jusqu'à l'examen théorique général (ETG).", points: ["Accès en ligne illimité", "Cours en salle avec le moniteur", "Examens blancs"], fact: "35 / 40", factLabel: "Le seuil de réussite au code" },
  { n: "03", title: "Conduite", text: "Leçons en ville, sur route et en situations réelles, avec un suivi après chaque séance.", points: ["Véhicules récents à double commande", "Suivi de progression", "Horaires adaptés"], fact: "20 h", factLabel: "Minimum légal (13 h en automatique)" },
  { n: "04", title: "Examen", text: "Préparation finale, examens blancs et accompagnement le jour J. Puis : le permis en poche !", points: ["Examen blanc de conduite", "Accompagnement le jour J", "Et on fête ça"], fact: "", factLabel: "" },
];

export type Plan = { id: string; name: string; title: string; price: string; note: string; features: string[]; featured?: boolean };

export const plans: Plan[] = [
  { id: "essentiel", name: "Essentiel", title: "Permis B · 20 h", price: "1 190", note: "Le forfait de départ, idéal si vous avez déjà de l'aisance.", features: ["Inscription et dossier administratif", "Code en ligne illimité", "20 h de conduite", "Accompagnement à l'examen"] },
  { id: "confort", name: "Confort", title: "Permis B · 30 h", price: "1 690", note: "Le plus choisi pour arriver détendu à l'examen.", features: ["Tout l'Essentiel", "30 h de conduite", "Examens blancs code et conduite", "Suivi personnalisé avec votre moniteur"], featured: true },
  { id: "intensif", name: "Intensif", title: "Stage accéléré", price: "1 890", note: "Une formation condensée pour aller vite, selon les places d'examen.", features: ["Formation condensée sur quelques semaines", "Code et 30 h de conduite planifiés", "Planning dédié", "Présentation à l'examen dès que possible"] },
];

export const planOptions = [
  "Premier rendez-vous (sans engagement)",
  ...plans.map((p) => `${p.name} · ${p.title}`),
  "Conduite accompagnée (AAC)",
  "Je ne sais pas encore",
];

export const faq = [
  { q: "À partir de quel âge peut-on commencer ?", a: "La conduite accompagnée (AAC) est accessible dès 15 ans pour la formation, et vous conduisez accompagné dès 16 ans. Pour le permis B classique, la formation peut commencer à 17 ans et l'examen pratique se passe à partir de 18 ans." },
  { q: "Combien d'heures de conduite faut-il prévoir ?", a: "La loi impose 20 heures minimum pour le permis B (13 heures pour la boîte automatique). Le nombre réel dépend de votre aisance : nous l'estimons ensemble dès le premier rendez-vous." },
  { q: "Comment se passe l'examen du code ?", a: "L'épreuve théorique générale (ETG) comporte 40 questions et il faut au moins 35 bonnes réponses pour la réussir. Vous vous entraînez en ligne autant que vous le souhaitez, et en salle avec nous." },
  { q: "Peut-on financer son permis avec le CPF ?", a: "Le CPF peut financer une partie du permis B sous conditions. Contactez-nous : nous vérifions ensemble vos droits et les démarches à suivre." },
  { q: "Que se passe-t-il si j'échoue à l'examen ?", a: "Pas de panique. On analyse l'épreuve avec vous, on ajuste le plan de formation et on vous représente dès que possible." },
  { q: "Quels documents faut-il fournir à l'inscription ?", a: "Une pièce d'identité, un justificatif de domicile, une photo d'identité numérique (e-photo) et, selon votre âge, un justificatif de recensement ou de journée défense et citoyenneté. La liste complète vous est remise à l'inscription." },
];