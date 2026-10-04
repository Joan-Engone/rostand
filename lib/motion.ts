import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { scrollState } from "./scroll";

const q = (selector: string) => gsap.utils.toArray<HTMLElement>(selector);

export function initMotion(): () => void {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  const mm = gsap.matchMedia();

  // "all" is always true: without it nothing would run on phones.
  mm.add({ all: "(min-width: 0px)", desktop: "(min-width: 1024px)", reduce: "(prefers-reduced-motion: reduce)" }, (ctx) => {
    const { desktop, reduce } = ctx.conditions as { desktop: boolean; reduce: boolean };

    if (reduce) {
      gsap.set("[data-hero] [data-hero-item], [data-hero] [data-words]", { visibility: "visible" });
      gsap.set("[data-road-dim]", { opacity: 0.88 });
      return;
    }

    const undo: Array<() => void> = [];

    /* Scroll progress bar */
    gsap.set("[data-progress]", { scaleX: 0, transformOrigin: "0 50%" });
    gsap.to("[data-progress]", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });

    /* Header: glass after scrolling, hides when scrolling down */
    const header = document.querySelector<HTMLElement>("[data-header]");
    let hidden = false;
    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const y = self.scroll();
        header?.classList.toggle("is-scrolled", y > 24);
        const menuOpen = document.documentElement.dataset.menu === "open";
        const shouldHide = !menuOpen && self.direction === 1 && y > 360;
        if (shouldHide !== hidden) {
          hidden = shouldHide;
          gsap.to(header, { yPercent: hidden ? -120 : 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
        }
      },
    });
    gsap.from(header, { autoAlpha: 0, duration: 0.9, ease: "power2.out" });

    /* Hero: entrance, then the road fades back behind the content as you scroll */
    gsap.from("[data-hero] [data-hero-item]", { y: 40, autoAlpha: 0, duration: 1.1, ease: "power3.out", stagger: 0.1, delay: 0.55 });
    gsap.fromTo(
      "[data-road-dim]",
      { opacity: 0 },
      { opacity: 0.9, ease: "none", scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom 35%", scrub: true } },
    );
    gsap.to("[data-hero-content]", {
      yPercent: -10,
      opacity: 0.15,
      ease: "none",
      scrollTrigger: { trigger: "[data-hero]", start: "top top", end: "bottom 30%", scrub: true },
    });

    /* Headings: words slide up out of a mask */
    q("[data-words]").forEach((el) => {
      const words = el.querySelectorAll("[data-word]");
      gsap.from(words, {
        yPercent: 118,
        duration: 1.2,
        ease: "power4.out",
        stagger: 0.06,
        delay: parseFloat(el.dataset.delay ?? "0"),
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onStart: () => {
          gsap.set(el, { visibility: "visible" });
        },
      });
    });

    q("[data-fade]").forEach((el) => {
      gsap.from(el, {
        y: 40,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: parseFloat(el.dataset.delay ?? "0"),
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });
    });

    q("[data-stagger]").forEach((el) => {
      gsap.from(Array.from(el.children), {
        y: 70,
        autoAlpha: 0,
        duration: 1.1,
        ease: "power3.out",
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    });

    /* Parallax (negative = other way) */
    const amplitude = desktop ? 70 : 24;
    q("[data-speed]").forEach((el) => {
      const s = parseFloat(el.dataset.speed ?? "0");
      if (!s) return;
      gsap.fromTo(
        el,
        { y: -amplitude * s },
        { y: amplitude * s, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } },
      );
    });

    q("[data-zoom]").forEach((el) => {
      gsap.fromTo(
        el,
        { scale: 1.2 },
        { scale: 1, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom 40%", scrub: true } },
      );
    });

    /* Numbers count up */
    q("[data-count]").forEach((el) => {
      const to = parseFloat(el.dataset.count ?? "0");
      const o = { v: 0 };
      el.textContent = "0";
      gsap.to(o, {
        v: to,
        duration: 2.2,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = String(Math.round(o.v));
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    });

    /* Formations: the section pins and the cards slide sideways (desktop) */
    if (desktop) {
      q("[data-hscroll]").forEach((section) => {
        const track = section.querySelector<HTMLElement>("[data-hscroll-track]");
        const bar = section.querySelector<HTMLElement>("[data-hscroll-bar]");
        if (!track) return;
        const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
        gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${dist()}`,
            pin: true,
            scrub: 0.7,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (bar) gsap.set(bar, { scaleX: self.progress });
            },
          },
        });
      });
    }

    /* Method: a little car drives down the road as you scroll, lighting the steps */
    q("[data-method]").forEach((wrap) => {
      const car = wrap.querySelector<HTMLElement>("[data-road-car]");
      const fill = wrap.querySelector<HTMLElement>("[data-road-fill]");
      const trigger = { trigger: wrap, start: "top 55%", end: "bottom 55%", scrub: 0.4, invalidateOnRefresh: true };
      if (car) gsap.fromTo(car, { y: 0 }, { y: () => wrap.offsetHeight - car.offsetHeight, ease: "none", scrollTrigger: trigger });
      if (fill) gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: trigger });
    });
    q("[data-step]").forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: "top 62%", end: "bottom 38%", toggleClass: { targets: el, className: "is-active" } });
    });

    /* Cursor spotlight on cards */
    q("[data-spot]").forEach((el) => {
      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      el.addEventListener("pointermove", move);
      undo.push(() => el.removeEventListener("pointermove", move));
    });

    /* Speedometer in the corner follows your scrolling speed */
    const hud = document.querySelector<HTMLElement>("[data-hud-speed]");
    if (hud) {
      let last = -1;
      const tickHud = () => {
        const v = Math.round(18 + Math.abs(scrollState.norm) * 190);
        if (v !== last) {
          last = v;
          hud.textContent = String(v).padStart(3, "0");
        }
      };
      gsap.ticker.add(tickHud);
      undo.push(() => gsap.ticker.remove(tickHud));
    }

    /* Marquee: runs by itself, speeds up and reverses with your scrolling */
    q("[data-marquee]").forEach((wrap) => {
      const track = wrap.querySelector<HTMLElement>("[data-track]");
      if (!track) return;
      const base = parseFloat(wrap.dataset.marquee ?? "60");
      let x = 0;
      let dir = 1;
      const tick = (_time: number, dt: number) => {
        const half = track.scrollWidth / 2;
        const v = scrollState.velocity;
        if (Math.abs(v) > 0.4) dir += (Math.sign(v) - dir) * 0.08;
        x -= dir * (base + Math.abs(v) * 24) * (dt / 1000);
        if (x <= -half) x += half;
        if (x > 0) x -= half;
        track.style.transform = `translate3d(${x}px,0,0)`;
      };
      gsap.ticker.add(tick);
      undo.push(() => gsap.ticker.remove(tick));
    });

    /* 3D tilt on cards (mouse only) */
    if (desktop && window.matchMedia("(hover: hover)").matches) {
      q("[data-tilt]").forEach((card) => {
        gsap.set(card, { transformPerspective: 900 });
        const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3" });
        const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3" });
        const move = (e: PointerEvent) => {
          const r = card.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 9);
          rx(-((e.clientY - r.top) / r.height - 0.5) * 9);
        };
        const leave = () => {
          rx(0);
          ry(0);
        };
        card.addEventListener("pointermove", move);
        card.addEventListener("pointerleave", leave);
        undo.push(() => {
          card.removeEventListener("pointermove", move);
          card.removeEventListener("pointerleave", leave);
        });
      });
    }

    return () => undo.forEach((fn) => fn());
  });

  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => mm.revert();
}