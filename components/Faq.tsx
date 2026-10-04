import Words from "./Words";
import FaqList from "./FaqList";

export default function Faq() {
  return (
    <section id="faq" className="relative px-[5vw] pb-28 md:pb-44">
      <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <div>
          <p data-fade className="font-mono text-sm uppercase tracking-[0.22em] text-neon">
            06 — FAQ
          </p>
          <h2 data-words="" className="mt-5 font-display text-[clamp(30px,4.2vw,64px)] font-black uppercase leading-[1] tracking-[-0.03em]">
            <Words text="Vos questions, nos réponses." accent="réponses." />
          </h2>
        </div>
        <div data-fade="">
          <FaqList />
        </div>
      </div>
    </section>
  );
}