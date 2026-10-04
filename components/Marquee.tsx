type Props = { items: string[]; speed?: number };

export default function Marquee({ items, speed = 70 }: Props) {
  const group = (
    <div className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={item} className="flex items-center">
          <span
            className={`px-6 md:px-10 ${
              i % 2 === 0 ? "text-transparent [-webkit-text-stroke:1.5px_rgba(238,245,241,0.5)]" : "text-neon [text-shadow:0_0_30px_rgba(43,227,155,0.5)]"
            }`}
          >
            {item}
          </span>
          <span className="size-3 rotate-45 bg-neon md:size-4" />
        </span>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="relative z-0 overflow-hidden border-y border-white/10 bg-night/60 py-5 md:py-7">
      <div data-marquee={speed} className="overflow-hidden font-display text-[clamp(30px,5.2vw,76px)] font-black uppercase tracking-tight">
        <div data-track="" className="flex w-max whitespace-nowrap will-change-transform">
          {group}
          {group}
          {group}
          {group}
        </div>
      </div>
    </div>
  );
}