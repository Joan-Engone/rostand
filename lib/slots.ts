import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { gsap } from "gsap";
import { scrollState } from "./scroll";
import { createSign, disposeObject, type SignKind } from "./signs";

/**
 * A second transparent canvas, drawn ABOVE the page content, for 3D objects that are tied to the layout.
 * Every empty <div data-sign="stop"> in the layout becomes a 3D road sign that:
 *  - sits exactly where the div is (so Tailwind classes position and size it)
 *  - pops in with an elastic bounce when it reaches the screen
 *  - turns as it crosses the viewport, follows the mouse, floats, and spins with scroll speed
 */

const FOV = 28;
const DIST = 12;

interface Slot {
  el: HTMLElement;
  kind: SignKind;
  group: THREE.Group;
  pop: number;
  revealed: boolean;
  phase: number;
  spin: number;
  spinVel: number;
  tilt: number;
  delay: number;
}

export function initSlots(canvas: HTMLCanvasElement): () => void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const els = Array.from(document.querySelectorAll<HTMLElement>("[data-sign]"));

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  } catch {
    return () => {};
  }
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  camera.position.z = DIST;
  const visibleH = 2 * Math.tan(THREE.MathUtils.degToRad(FOV / 2)) * DIST;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.75;

  scene.add(new THREE.AmbientLight(0xffffff, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.7);
  key.position.set(-3, 4, 6);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xbcd2ff, 0.9);
  rim.position.set(4, -2, 3);
  scene.add(rim);

  let W = 1;
  let H = 1;
  let upp = 0.01; // world units per CSS pixel at z = 0
  const resize = () => {
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, W < 768 ? 1.5 : 2));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    upp = visibleH / H;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const slots: Slot[] = els.map((el) => {
    const kind = el.dataset.sign as SignKind;
    const group = createSign(kind);
    group.scale.setScalar(0.0001);
    scene.add(group);
    return {
      el,
      kind,
      group,
      pop: reduce ? 1 : 0,
      revealed: false,
      phase: Math.random() * Math.PI * 2,
      spin: 0,
      spinVel: 0,
      tilt: THREE.MathUtils.degToRad(parseFloat(el.dataset.tilt ?? "0")),
      delay: parseFloat(el.dataset.delay ?? "0"),
    };
  });

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.tx = (e.clientX / W) * 2 - 1;
    pointer.ty = (e.clientY / H) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  const tick = (time: number) => {
    pointer.x += (pointer.tx - pointer.x) * 0.06;
    pointer.y += (pointer.ty - pointer.y) * 0.06;

    for (const s of slots) {
      const r = s.el.getBoundingClientRect();
      const visible = r.width > 0 && r.bottom > -200 && r.top < H + 200;
      s.group.visible = visible;
      if (!visible) continue;

      if (!s.revealed && r.top < H * 0.95) {
        s.revealed = true;
        if (!reduce) gsap.to(s, { pop: 1, duration: 1.5, delay: s.delay, ease: "elastic.out(1, 0.6)" });
      }

      const size = r.width * upp * s.pop;
      s.group.scale.setScalar(Math.max(size, 0.0001));

      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const float = reduce ? 0 : Math.sin(time * 1.1 + s.phase) * 7;
      s.group.position.set((cx - W / 2) * upp, -(cy + float - H / 2) * upp, 0);

      if (reduce) {
        s.group.rotation.set(0, 0, s.tilt);
        continue;
      }

      const progress = (cy - H / 2) / H; // about -0.5 .. 0.5 while on screen
      s.spinVel += (scrollState.norm * 0.1 - s.spinVel) * 0.08;
      s.spin = (s.spin + s.spinVel) * 0.975;

      if (s.kind === "wheel") {
        s.group.rotation.set(-pointer.y * 0.25 + 0.15, pointer.x * 0.35 + Math.sin(time * 0.6 + s.phase) * 0.12, progress * -3.2 + s.spin * 2 + s.tilt);
      } else {
        s.group.rotation.set(
          -pointer.y * 0.25 + Math.sin(time * 0.7 + s.phase) * 0.1,
          pointer.x * 0.5 + progress * 1.3 + Math.sin(time * 0.6 + s.phase) * 0.28 + s.spin,
          s.tilt + Math.sin(time * 0.5 + s.phase) * 0.04,
        );
      }
    }
    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener("pointermove", onMove);
    ro.disconnect();
    slots.forEach((s) => {
      gsap.killTweensOf(s);
      disposeObject(s.group);
    });
    envTarget.dispose();
    pmrem.dispose();
    renderer.dispose();
  };
}