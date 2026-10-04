import type { SignKind } from "@/lib/signs";

type Props = {
  kind: SignKind;
  /** Tailwind classes: position and size (width = size of the 3D sign). */
  className?: string;
  /** parallax strength while scrolling */
  speed?: number;
  /** resting tilt in degrees */
  tilt?: number;
  /** pop-in delay in seconds */
  delay?: number;
};

/** An empty box. The three.js scene draws a 3D sign exactly on top of it. */
export default function SignSlot({ kind, className = "", speed, tilt, delay }: Props) {
  return (
    <div
      aria-hidden="true"
      data-sign={kind}
      data-speed={speed}
      data-tilt={tilt}
      data-delay={delay}
      className={`pointer-events-none ${className}`}
    />
  );
}