import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let instance: Lenis | null = null;

/** Shared scroll values read by the GSAP and three.js code every frame. */
export const scrollState = {
  y: 0,
  /** pixels scrolled since the previous frame */
  velocity: 0,
  /** smoothed velocity, clamped to -1..1 */
  norm: 0,
};

/** Inertial smooth scrolling, wired into GSAP's ticker and ScrollTrigger. */
export function initSmoothScroll(): () => void {
  gsap.registerPlugin(ScrollTrigger);
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};

  const lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9 });
  instance = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  const raf = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(raf);
    lenis.destroy();
    instance = null;
  };
}

/** Must be registered AFTER initSmoothScroll so it reads the updated scroll position. */
export function trackScroll(): () => void {
  let last = window.scrollY;
  const tick = () => {
    const y = window.scrollY;
    const d = y - last;
    last = y;
    scrollState.y = y;
    scrollState.velocity = d;
    scrollState.norm += (gsap.utils.clamp(-1, 1, d / 50) - scrollState.norm) * 0.1;
  };
  gsap.ticker.add(tick);
  return () => gsap.ticker.remove(tick);
}

/** Freeze / unfreeze page scrolling (used by the mobile menu). */
export function setScrollLocked(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  } else {
    document.documentElement.style.overflow = locked ? "hidden" : "";
  }
}

/** Smooth-scroll to "#id", "#top", or a pixel position. */
export function scrollToTarget(target: string | number) {
  const dest = target === "#top" ? 0 : target;
  if (instance) {
    instance.scrollTo(dest, { duration: 1.6, easing: (t: number) => 1 - Math.pow(1 - t, 4) });
    return;
  }
  if (typeof dest === "number") window.scrollTo({ top: dest, behavior: "smooth" });
  else document.querySelector(dest)?.scrollIntoView({ behavior: "smooth" });
}