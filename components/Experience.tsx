"use client";

import { useEffect, useRef } from "react";
import { initSmoothScroll, trackScroll } from "@/lib/scroll";
import { initMotion } from "@/lib/motion";
import { initRoad } from "@/lib/road";
import { initSlots } from "@/lib/slots";

/**
 * Everything that runs in the browser:
 * smooth scroll -> scroll tracking -> GSAP animations -> background road scene -> 3D objects on top.
 * Order matters: each step reads what the previous one updated this frame.
 */
export default function Experience() {
  const roadRef = useRef<HTMLCanvasElement>(null);
  const slotsRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const stops: Array<() => void> = [];
    stops.push(initSmoothScroll());
    stops.push(trackScroll());
    stops.push(initMotion());
    if (roadRef.current) stops.push(initRoad(roadRef.current));
    if (slotsRef.current) stops.push(initSlots(slotsRef.current));
    return () => stops.reverse().forEach((stop) => stop());
  }, []);

  return (
    <>
      {/* background road (behind the page) */}
      <canvas ref={roadRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
      {/* darkens the road once the hero is scrolled past */}
      <div data-road-dim aria-hidden="true" className="pointer-events-none fixed inset-0 z-[1] bg-night opacity-0" />
      {/* 3D objects above the page content */}
      <canvas ref={slotsRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 h-full w-full" />

      <div data-progress aria-hidden="true" className="fixed left-0 top-0 z-[60] h-[3px] w-full bg-neon shadow-[0_0_12px_#2be39b]" />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed bottom-5 right-5 z-30 hidden items-center gap-3 rounded-full border border-white/10 bg-night/70 px-4 py-2 font-mono text-xs uppercase tracking-widest text-mute backdrop-blur sm:flex"
      >
        <span className="size-1.5 animate-pulse rounded-full bg-neon" />
        <span data-hud-speed className="text-base font-bold tabular-nums text-neon">
          018
        </span>
        km/h
      </div>
    </>
  );
}