import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { gsap } from "gsap";
import { scrollState } from "./scroll";

/**
 * The page background: a neon night road seen from behind a sports car.
 *  - the road, lamp posts and speed particles flow toward the camera
 *  - scrolling accelerates the flow, then the car drives off into the distance
 *  - the mouse steers the car slightly
 * Everything is procedural (no model or texture files).
 */

const NEON = 0x2be39b;
const NEON_RGB = "43,227,155";
const ROAD_W = 11;
const ROAD_L = 520;
const POSTS = 20; // per side
const SPACING = 22;
const RANGE = POSTS * SPACING;
const FAR = -420;
const BASE_SPEED = 16;

function canvasTexture(w: number, h: number, draw: (g: CanvasRenderingContext2D) => void, srgb = true) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function radialGlow(rgb: string) {
  return canvasTexture(128, 128, (g) => {
    const gr = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    gr.addColorStop(0, `rgba(${rgb},1)`);
    gr.addColorStop(0.25, `rgba(${rgb},0.4)`);
    gr.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 128, 128);
  });
}

function stripGlow() {
  return canvasTexture(64, 8, (g) => {
    const gr = g.createLinearGradient(0, 0, 64, 0);
    gr.addColorStop(0, `rgba(${NEON_RGB},0)`);
    gr.addColorStop(0.5, `rgba(${NEON_RGB},1)`);
    gr.addColorStop(1, `rgba(${NEON_RGB},0)`);
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 8);
  });
}

function textTexture(text: string, w: number, h: number, fg: string, bg: string, font: string) {
  return canvasTexture(w, h, (g) => {
    g.fillStyle = bg;
    g.fillRect(0, 0, w, h);
    g.fillStyle = fg;
    g.font = font;
    g.textAlign = "center";
    g.textBaseline = "middle";
    g.fillText(text, w / 2, h / 2 + 2);
  });
}

function buildCar() {
  const group = new THREE.Group();

  const body = new THREE.MeshPhysicalMaterial({ color: 0x0b0f0e, metalness: 0.9, roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.08 });
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x030504, metalness: 0.3, roughness: 0.04, clearcoat: 1 });
  const chrome = new THREE.MeshStandardMaterial({ color: 0xcfd8d4, metalness: 1, roughness: 0.18 });
  const tail = new THREE.MeshBasicMaterial({ color: 0xff2d3a });

  const lower = new THREE.Mesh(new RoundedBoxGeometry(1.9, 0.5, 4.3, 5, 0.14), body);
  lower.position.set(0, 0.5, 0);

  const cabinGeo = new RoundedBoxGeometry(1.55, 0.46, 2.1, 5, 0.16);
  const pos = cabinGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    if (pos.getY(i) > 0) {
      pos.setX(i, pos.getX(i) * 0.82);
      pos.setZ(i, pos.getZ(i) * 0.78 - 0.18);
    }
  }
  cabinGeo.computeVertexNormals();
  const cabin = new THREE.Mesh(cabinGeo, glass);
  cabin.position.set(0, 0.95, 0.35);

  const roof = new THREE.Mesh(new RoundedBoxGeometry(1.2, 0.05, 1.3, 3, 0.02), body);
  roof.position.set(0, 1.19, 0.12);

  // roof sign (every driving-school car has one)
  const signTex = textTexture("AUTO-ÉCOLE", 512, 128, "#2be39b", "#04100b", "800 66px Arial, Helvetica, sans-serif");
  const sign = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.15, 0.26), [
    new THREE.MeshBasicMaterial({ color: 0x04100b }),
    new THREE.MeshBasicMaterial({ color: 0x04100b }),
    new THREE.MeshBasicMaterial({ color: 0x04100b }),
    new THREE.MeshBasicMaterial({ color: 0x04100b }),
    new THREE.MeshBasicMaterial({ map: signTex }),
    new THREE.MeshBasicMaterial({ map: signTex }),
  ]);
  sign.position.set(0, 1.3, 0.12);

  // tail lights + light bar
  const tl = new RoundedBoxGeometry(0.62, 0.11, 0.08, 2, 0.03);
  const tlL = new THREE.Mesh(tl, tail);
  tlL.position.set(-0.6, 0.64, 2.16);
  const tlR = new THREE.Mesh(tl, tail);
  tlR.position.set(0.6, 0.64, 2.16);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.035, 0.05), tail);
  bar.position.set(0, 0.64, 2.17);

  // plate
  const plateTex = textTexture("ROSTAND", 256, 64, "#0b0f0e", "#eef5f1", "800 40px Arial, Helvetica, sans-serif");
  const plate = new THREE.Mesh(new THREE.PlaneGeometry(0.56, 0.14), new THREE.MeshBasicMaterial({ map: plateTex }));
  plate.position.set(0, 0.4, 2.165);

  // diffuser, exhausts, spoiler
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.12, 0.3), new THREE.MeshStandardMaterial({ color: 0x050707, roughness: 0.6 }));
  diffuser.position.set(0, 0.24, 2.0);
  const ex1 = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16), chrome);
  ex1.rotation.x = Math.PI / 2;
  ex1.position.set(-0.5, 0.22, 2.22);
  const ex2 = ex1.clone();
  ex2.position.x = 0.5;
  const spoiler = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.04, 0.38), body);
  spoiler.position.set(0, 0.93, 1.9);
  const strutGeo = new THREE.BoxGeometry(0.05, 0.14, 0.05);
  const s1 = new THREE.Mesh(strutGeo, body);
  s1.position.set(-0.6, 0.84, 1.9);
  const s2 = s1.clone();
  s2.position.x = 0.6;

  // wheels
  const wheels: THREE.Group[] = [];
  const tyre = new THREE.CylinderGeometry(0.38, 0.38, 0.3, 32);
  const tyreMat = new THREE.MeshStandardMaterial({ color: 0x050606, roughness: 0.8 });
  const ringGeo = new THREE.TorusGeometry(0.24, 0.025, 8, 36);
  const ringMat = new THREE.MeshBasicMaterial({ color: NEON });
  for (const [x, z] of [
    [-0.98, 1.4],
    [0.98, 1.4],
    [-0.98, -1.4],
    [0.98, -1.4],
  ]) {
    const pivot = new THREE.Group();
    pivot.position.set(x, 0.38, z);
    const t = new THREE.Mesh(tyre, tyreMat);
    t.rotation.z = Math.PI / 2;
    const r = new THREE.Mesh(ringGeo, ringMat);
    r.rotation.y = Math.PI / 2;
    r.position.x = Math.sign(x) * 0.152;
    pivot.add(t, r);
    group.add(pivot);
    wheels.push(pivot);
  }

  // neon underglow on the road
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 5.8),
    new THREE.MeshBasicMaterial({ map: radialGlow(NEON_RGB), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 }),
  );
  glow.rotation.x = -Math.PI / 2;
  glow.position.set(0, 0.04, 0);

  const light = new THREE.PointLight(NEON, 6, 9, 2);
  light.position.set(0, 0.5, 1.2);

  group.add(lower, cabin, roof, sign, tlL, tlR, bar, plate, diffuser, ex1, ex2, spoiler, s1, s2, glow, light);
  return { group, wheels };
}

export function initRoad(canvas: HTMLCanvasElement): () => void {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: window.innerWidth >= 768, powerPreference: "high-performance" });
  } catch {
    return () => {};
  }
  renderer.setClearColor(0x060908, 1);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060908, 0.015);
  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 900);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04);
  scene.environment = envTarget.texture;
  scene.environmentIntensity = 0.5;
  scene.add(new THREE.AmbientLight(0x88ffcc, 0.25));
  const key = new THREE.DirectionalLight(0xffffff, 0.9);
  key.position.set(-4, 8, 10);
  scene.add(key);

  const disposables: Array<{ dispose: () => void }> = [envTarget, pmrem];
  const own = <T extends { dispose: () => void }>(o: T) => {
    disposables.push(o);
    return o;
  };

  /* ---- road ---- */
  const noise = own(
    canvasTexture(256, 256, (g) => {
      g.fillStyle = "#101514";
      g.fillRect(0, 0, 256, 256);
      for (let i = 0; i < 5000; i++) {
        const v = 10 + Math.random() * 26;
        g.fillStyle = `rgb(${v},${v + 3},${v + 2})`;
        g.fillRect(Math.random() * 256, Math.random() * 256, 2, 2);
      }
    }),
  );
  noise.wrapS = noise.wrapT = THREE.RepeatWrapping;
  noise.repeat.set(3, ROAD_L / 10);
  const road = new THREE.Mesh(new THREE.PlaneGeometry(ROAD_W, ROAD_L), own(new THREE.MeshStandardMaterial({ map: noise, roughness: 0.55, metalness: 0.25 })));
  road.rotation.x = -Math.PI / 2;
  road.position.set(0, 0, -ROAD_L / 2 + 10);
  scene.add(road);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(700, ROAD_L), own(new THREE.MeshBasicMaterial({ color: 0x040605 })));
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(0, -0.03, -ROAD_L / 2 + 10);
  scene.add(ground);

  const dashTex = own(
    canvasTexture(16, 256, (g) => {
      g.clearRect(0, 0, 16, 256);
      g.fillStyle = "#eef5f1";
      g.fillRect(0, 0, 16, 96);
    }),
  );
  dashTex.wrapS = dashTex.wrapT = THREE.RepeatWrapping;
  dashTex.repeat.set(1, ROAD_L / 8);
  const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.26, ROAD_L), own(new THREE.MeshBasicMaterial({ map: dashTex, transparent: true, opacity: 0.9 })));
  dash.rotation.x = -Math.PI / 2;
  dash.position.set(0, 0.012, -ROAD_L / 2 + 10);
  scene.add(dash);

  const edgeX = ROAD_W / 2 - 0.5;
  const lineMat = own(new THREE.MeshBasicMaterial({ color: NEON }));
  const glowStrip = own(stripGlow());
  const glowMat = own(new THREE.MeshBasicMaterial({ map: glowStrip, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.55 }));
  for (const side of [-1, 1]) {
    const line = new THREE.Mesh(new THREE.PlaneGeometry(0.14, ROAD_L), lineMat);
    line.rotation.x = -Math.PI / 2;
    line.position.set(side * edgeX, 0.014, -ROAD_L / 2 + 10);
    scene.add(line);
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(1.8, ROAD_L), glowMat);
    halo.rotation.x = -Math.PI / 2;
    halo.position.set(side * edgeX, 0.016, -ROAD_L / 2 + 10);
    scene.add(halo);
  }

  /* ---- lamp posts (instanced) + glows ---- */
  const poleGeo = own(new THREE.CylinderGeometry(0.07, 0.09, 7, 6));
  poleGeo.translate(0, 3.5, 0);
  const lampGeo = own(new THREE.BoxGeometry(0.55, 0.08, 0.26));
  const poles = new THREE.InstancedMesh(poleGeo, own(new THREE.MeshStandardMaterial({ color: 0x151c1a, roughness: 0.7, metalness: 0.4 })), POSTS * 2);
  const lamps = new THREE.InstancedMesh(lampGeo, own(new THREE.MeshBasicMaterial({ color: 0xd6fff0 })), POSTS * 2);
  scene.add(poles, lamps);

  const glowPos = new Float32Array(POSTS * 2 * 3);
  const glowGeo = own(new THREE.BufferGeometry());
  glowGeo.setAttribute("position", new THREE.BufferAttribute(glowPos, 3));
  const glowPoints = new THREE.Points(
    glowGeo,
    own(new THREE.PointsMaterial({ map: own(radialGlow("160,255,220")), size: 9, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85, fog: false })),
  );
  glowPoints.frustumCulled = false;
  scene.add(glowPoints);
  const dummy = new THREE.Object3D();

  /* ---- sky: stars + horizon glow ---- */
  const starPos = new Float32Array(600 * 3);
  for (let i = 0; i < 600; i++) {
    const a = Math.random() * Math.PI * 2;
    const e = Math.random() * 1.1 + 0.08;
    const r = 380;
    starPos[i * 3] = Math.cos(a) * Math.cos(e) * r;
    starPos[i * 3 + 1] = Math.sin(e) * r * 0.55 + 4;
    starPos[i * 3 + 2] = -Math.abs(Math.sin(a) * Math.cos(e) * r) - 40;
  }
  const starGeo = own(new THREE.BufferGeometry());
  starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
  scene.add(new THREE.Points(starGeo, own(new THREE.PointsMaterial({ color: 0xcfffe9, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0.6, fog: false }))));

  const horizon = new THREE.Mesh(
    new THREE.PlaneGeometry(1000, 190),
    own(new THREE.MeshBasicMaterial({ map: own(radialGlow(NEON_RGB)), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.4, fog: false })),
  );
  horizon.position.set(0, 26, -400);
  scene.add(horizon);

  /* ---- speed particles ---- */
  const N = 180;
  const pPos = new Float32Array(N * 3);
  const reset = (i: number, far = false) => {
    pPos[i * 3] = (Math.random() - 0.5) * 30;
    pPos[i * 3 + 1] = 0.3 + Math.random() * 7;
    pPos[i * 3 + 2] = far ? -140 - Math.random() * 20 : -140 + Math.random() * 150;
  };
  for (let i = 0; i < N; i++) reset(i);
  const pGeo = own(new THREE.BufferGeometry());
  pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
  const particles = new THREE.Points(pGeo, own(new THREE.PointsMaterial({ map: own(radialGlow("170,255,225")), size: 0.35, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending, depthWrite: false })));
  particles.frustumCulled = false;
  scene.add(particles);

  /* ---- car ---- */
  const { group: car, wheels } = buildCar();
  scene.add(car);

  /* ---- sizing ---- */
  let W = 1;
  let H = 1;
  const resize = () => {
    W = canvas.clientWidth || window.innerWidth;
    H = canvas.clientHeight || window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, W < 768 ? 1.5 : 1.75));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.fov = W / H < 0.8 ? 72 : 58;
    if (W >= 1024) camera.setViewOffset(W, H, -W * 0.2, 0, W, H); // car sits right of the headline
    else if (W / H < 0.8) camera.setViewOffset(W, H, 0, -H * 0.16, W, H); // phones: car sits lower, under the text
    else camera.clearViewOffset();
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    pointer.tx = (e.clientX / W) * 2 - 1;
    pointer.ty = (e.clientY / H) * 2 - 1;
  };
  window.addEventListener("pointermove", onMove, { passive: true });

  let offset = 0;
  let speed = reduce ? 0 : BASE_SPEED;
  const look = new THREE.Vector3();

  let frame = 0;
  const tick = (time: number, dtMs: number) => {
    frame++;
    const dimmed = !reduce && scrollState.y > H * 1.1;
    if (dimmed && frame % 2 === 1) return;
    const dt = Math.min(dtMs / 1000, 0.05) * (dimmed ? 2 : 1);
    const target = reduce ? 0 : BASE_SPEED + Math.abs(scrollState.norm) * 150;
    speed += (target - speed) * 0.06;
    offset += speed * dt;

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    // road markings and asphalt grain flow toward the camera
    dashTex.offset.y += (speed * dt) / 8;
    noise.offset.y += (speed * dt) / 10;

    // lamp posts wrap around
    let g = 0;
    for (let side = 0; side < 2; side++) {
      const x = side === 0 ? -(ROAD_W / 2 + 1.6) : ROAD_W / 2 + 1.6;
      for (let i = 0; i < POSTS; i++) {
        const z = FAR + ((i * SPACING + offset) % RANGE);
        const idx = side * POSTS + i;
        dummy.position.set(x, 0, z);
        dummy.updateMatrix();
        poles.setMatrixAt(idx, dummy.matrix);
        const lx = x + (side === 0 ? 0.5 : -0.5);
        dummy.position.set(lx, 7.04, z);
        dummy.updateMatrix();
        lamps.setMatrixAt(idx, dummy.matrix);
        glowPos[g++] = lx;
        glowPos[g++] = 7;
        glowPos[g++] = z;
      }
    }
    poles.instanceMatrix.needsUpdate = true;
    lamps.instanceMatrix.needsUpdate = true;
    (glowGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // particles
    for (let i = 0; i < N; i++) {
      pPos[i * 3 + 2] += speed * dt * 1.4;
      if (pPos[i * 3 + 2] > 12) reset(i, true);
    }
    (pGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;

    // the car: idles, steers with the mouse, drives away as you scroll
    const p = reduce ? 0 : THREE.MathUtils.clamp(scrollState.y / (H * 0.85), 0, 1);
    car.visible = p < 0.995;
    car.position.set(pointer.x * 0.9, Math.sin(time * 7) * 0.012 * (1 + speed / 60), -(p * p) * 150);
    car.rotation.set(-p * 0.08, -pointer.x * 0.07, -pointer.x * 0.02);
    wheels.forEach((w) => (w.rotation.x -= speed * dt * 2.6));

    // camera
    const portrait = camera.aspect < 0.8;
    camera.position.set(pointer.x * 0.5, (portrait ? 1.95 : 1.65) + pointer.y * 0.15, portrait ? 8 : 6.8);
    look.set(0, 1.0, -18);
    camera.lookAt(look);

    renderer.render(scene, camera);
  };
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    window.removeEventListener("pointermove", onMove);
    ro.disconnect();
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.geometry) m.geometry.dispose();
      const mats = m.material ? (Array.isArray(m.material) ? m.material : [m.material]) : [];
      mats.forEach((mt) => {
        (mt as THREE.MeshBasicMaterial).map?.dispose();
        mt.dispose();
      });
    });
    disposables.forEach((d) => d.dispose());
    renderer.dispose();
  };
}