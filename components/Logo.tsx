/** Steering wheel icon: used as the "O" of ROSTAND, like in the real logo. */
export function WheelIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9.6" />
      <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
      <path d="M2.8 11.4h6.8M14.4 11.4h6.8M12 14.2v7.2" strokeWidth="2.4" />
    </svg>
  );
}

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <span className="inline-flex items-center font-display text-[22px] font-black leading-none tracking-tight">
        R<WheelIcon className="mx-[1px] size-[0.98em] text-neon" />
        STAND
      </span>
      <span className="hidden border-l border-white/20 pl-3 font-mono text-[10px] uppercase leading-tight tracking-[0.2em] text-mute sm:block">
        Auto-
        <br />
        école
      </span>
    </span>
  );
}