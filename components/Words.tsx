import { Fragment } from "react";

type Props = {
  text: string;
  /** Words (space separated) that get the accent colour. */
  accent?: string;
  accentClass?: string;
};

/** Splits a heading into masked words so GSAP can slide them up (see lib/motion.ts). */
export default function Words({ text, accent = "", accentClass = "text-neon" }: Props) {
  const accented = new Set(accent.split(" ").filter(Boolean));
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden align-top pb-[0.14em] -mb-[0.14em]">
            <span data-word="" className={`inline-block will-change-transform ${accented.has(word) ? accentClass : ""}`}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}