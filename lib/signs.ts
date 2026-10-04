import * as THREE from "three";

/**
 * Procedural 3D road signs: no model files needed.
 * Each sign = a bevelled metal plate (extruded outline) + a front face painted on a canvas.
 * Every sign is about 1 unit wide, centred on the origin, so it can be scaled to any DOM box.
 */

export type SignKind =
  | "stop"
  | "danger"
  | "rond-point"
  | "interdit"
  | "fleche"
  | "zone30"
  | "cedez"
  | "wheel"
  | "permis";

type V = [number, number];
const S = 512; // canvas size in px
const RED = "#dc2430";
const BLUE = "#0b4cc7";
const NEON = "#2be39b";

/* ---------- outline helpers (unit coordinates, y up) ---------- */

function regular(n: number, r: number, rot: number, cy = 0): V[] {
  return Array.from({ length: n }, (_, i) => {
    const a = rot + (i / n) * Math.PI * 2;
    return [Math.cos(a) * r, Math.sin(a) * r + cy] as V;
  });
}

function rectPts(w: number, h: number): V[] {
  return [
    [-w / 2, -h / 2],
    [w / 2, -h / 2],
    [w / 2, h / 2],
    [-w / 2, h / 2],
  ];
}

/** Round every corner of a polygon with a quadratic curve. */
function rounded(pts: V[], rad: number, seg = 6): V[] {
  const n = pts.length;
  const out: V[] = [];
  const toward = (a: V, b: V): V => {
    const dx = a[0] - b[0];
    const dy = a[1] - b[1];
    const l = Math.hypot(dx, dy) || 1;
    return [dx / l, dy / l];
  };
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i + n - 1) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const d1 = toward(p0, p1);
    const d2 = toward(p2, p1);
    const a: V = [p1[0] + d1[0] * rad, p1[1] + d1[1] * rad];
    const b: V = [p1[0] + d2[0] * rad, p1[1] + d2[1] * rad];
    for (let s = 0; s <= seg; s++) {
      const t = s / seg;
      const u = 1 - t;
      out.push([u * u * a[0] + 2 * u * t * p1[0] + t * t * b[0], u * u * a[1] + 2 * u * t * p1[1] + t * t * b[1]]);
    }
  }
  return out;
}

/* ---------- canvas helpers ---------- */

const toPx = (x: number, y: number): V => [(x + 0.5) * S, (0.5 - y) * S];

function trace(g: CanvasRenderingContext2D, pts: V[], k = 1, cx = 0, cy = 0) {
  g.beginPath();
  pts.forEach(([x, y], i) => {
    const [a, b] = toPx(cx + (x - cx) * k, cy + (y - cy) * k);
    if (i) g.lineTo(a, b);
    else g.moveTo(a, b);
  });
  g.closePath();
}

function roundRectPath(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath();
  g.moveTo(x + r, y);
  g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r);
  g.closePath();
}

interface Spec {
  pts: V[];
  draw: (g: CanvasRenderingContext2D) => void;
}

function specFor(kind: Exclude<SignKind, "wheel">): Spec {
  switch (kind) {
    case "stop": {
      const pts = rounded(regular(8, 0.54, Math.PI / 8), 0.035);
      return {
        pts,
        draw(g) {
          trace(g, pts);
          g.fillStyle = RED;
          g.fill();
          trace(g, pts, 0.9);
          g.lineWidth = 12;
          g.strokeStyle = "#fff";
          g.stroke();
          g.fillStyle = "#fff";
          g.font = "900 150px Arial, Helvetica, sans-serif";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText("STOP", S / 2, S / 2 + 8);
        },
      };
    }
    case "danger": {
      const r = 0.577;
      const cy = -r / 4;
      const pts = rounded(regular(3, r, Math.PI / 2, cy), 0.06);
      return {
        pts,
        draw(g) {
          trace(g, pts);
          g.fillStyle = RED;
          g.fill();
          trace(g, pts, 0.66, 0, cy);
          g.fillStyle = "#fff";
          g.fill();
          g.fillStyle = "#111";
          roundRectPath(g, 236, 190, 40, 120, 14);
          g.fill();
          g.beginPath();
          g.arc(256, 345, 23, 0, Math.PI * 2);
          g.fill();
        },
      };
    }
    case "cedez": {
      const r = 0.577;
      const cy = r / 4;
      const pts = rounded(regular(3, r, -Math.PI / 2, cy), 0.06);
      return {
        pts,
        draw(g) {
          trace(g, pts);
          g.fillStyle = RED;
          g.fill();
          trace(g, pts, 0.6, 0, cy);
          g.fillStyle = "#fff";
          g.fill();
        },
      };
    }
    case "rond-point": {
      const pts = regular(64, 0.5, 0);
      return {
        pts,
        draw(g) {
          trace(g, pts);
          g.fillStyle = BLUE;
          g.fill();
          trace(g, pts, 0.92);
          g.lineWidth = 14;
          g.strokeStyle = "#fff";
          g.stroke();
          const R = 108;
          g.strokeStyle = "#fff";
          g.fillStyle = "#fff";
          g.lineWidth = 30;
          g.lineCap = "butt";
          for (let i = 0; i < 3; i++) {
            const a0 = (i * 120 * Math.PI) / 180 - 0.25;
            const a1 = a0 + (82 * Math.PI) / 180;
            g.beginPath();
            g.arc(S / 2, S / 2, R, a0, a1, false);
            g.stroke();
            // arrow head at the start of the arc, pointing counter-clockwise
            const px = S / 2 + R * Math.cos(a0);
            const py = S / 2 + R * Math.sin(a0);
            const tx = Math.sin(a0);
            const ty = -Math.cos(a0);
            const nx = Math.cos(a0);
            const ny = Math.sin(a0);
            g.beginPath();
            g.moveTo(px + tx * 40, py + ty * 40);
            g.lineTo(px + nx * 36, py + ny * 36);
            g.lineTo(px - nx * 36, py - ny * 36);
            g.closePath();
            g.fill();
          }
        },
      };
    }
    case "interdit": {
      const pts = regular(64, 0.5, 0);
      return {
        pts,
        draw(g) {
          trace(g, pts);
          g.fillStyle = RED;
          g.fill();
          trace(g, pts, 0.94);
          g.lineWidth = 10;
          g.strokeStyle = "#fff";
          g.stroke();
          g.fillStyle = "#fff";
          roundRectPath(g, S / 2 - 165, S / 2 - 36, 330, 72, 8);
          g.fill();
        },
      };
    }
    case "zone30": {
      const pts = regular(64, 0.5, 0);
      return {
        pts,
        draw(g) {
          trace(g, pts);
          g.fillStyle = RED;
          g.fill();
          trace(g, pts, 0.76);
          g.fillStyle = "#fff";
          g.fill();
          g.fillStyle = "#111";
          g.font = "900 210px Arial, Helvetica, sans-serif";
          g.textAlign = "center";
          g.textBaseline = "middle";
          g.fillText("30", S / 2, S / 2 + 14);
        },
      };
    }
    case "fleche": {
      const pts = rounded(rectPts(0.98, 0.98), 0.1);
      return {
        pts,
        draw(g) {
          trace(g, pts);
          g.fillStyle = BLUE;
          g.fill();
          trace(g, pts, 0.93);
          g.lineWidth = 10;
          g.strokeStyle = "#fff";
          g.stroke();
          g.fillStyle = "#fff";
          g.fillRect(105, 224, 190, 64);
          g.beginPath();
          g.moveTo(285, 150);
          g.lineTo(410, 256);
          g.lineTo(285, 362);
          g.closePath();
          g.fill();
        },
      };
    }
    case "permis": {
      const pts = rounded(rectPts(1, 0.63), 0.06);
      return {
        pts,
        draw(g) {
          const grad = g.createLinearGradient(0, 95, S, 417);
          grad.addColorStop(0, "#63f2b9");
          grad.addColorStop(1, "#14a06b");
          trace(g, pts);
          g.fillStyle = grad;
          g.fill();
          // photo
          g.fillStyle = "rgba(255,255,255,0.92)";
          roundRectPath(g, 38, 128, 130, 162, 14);
          g.fill();
          g.fillStyle = "#14a06b";
          g.beginPath();
          g.arc(103, 186, 28, 0, Math.PI * 2);
          g.fill();
          g.beginPath();
          g.ellipse(103, 290, 52, 50, 0, Math.PI, Math.PI * 2);
          g.fill();
          // text
          g.fillStyle = "#04100b";
          g.textAlign = "left";
          g.textBaseline = "alphabetic";
          g.font = "800 62px Arial, Helvetica, sans-serif";
          g.fillText("PERMIS B", 192, 178);
          g.font = "700 21px Arial, Helvetica, sans-serif";
          g.fillText("AUTO-ÉCOLE ROSTAND", 194, 214);
          g.fillStyle = "rgba(4,16,11,0.35)";
          g.fillRect(194, 244, 230, 10);
          g.fillRect(194, 266, 180, 10);
          g.fillRect(194, 288, 210, 10);
          // check badge
          g.fillStyle = "#fff";
          g.beginPath();
          g.arc(420, 372, 34, 0, Math.PI * 2);
          g.fill();
          g.strokeStyle = "#04100b";
          g.lineWidth = 10;
          g.lineCap = "round";
          g.lineJoin = "round";
          g.beginPath();
          g.moveTo(404, 372);
          g.lineTo(416, 386);
          g.lineTo(438, 357);
          g.stroke();
        },
      };
    }
  }
}

function buildWheel(): THREE.Group {
  const group = new THREE.Group();
  const dark = new THREE.MeshStandardMaterial({ color: 0x141b2d, roughness: 0.5, metalness: 0.25 });
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.4, 0.07, 28, 72), dark);
  const hub = new THREE.Mesh(
    new THREE.CylinderGeometry(0.15, 0.17, 0.12, 40),
    new THREE.MeshStandardMaterial({ color: NEON, roughness: 0.3, metalness: 0.2, emissive: NEON, emissiveIntensity: 0.55 }),
  );
  hub.rotation.x = Math.PI / 2;

  const spokeGeo = new THREE.BoxGeometry(0.28, 0.075, 0.06);
  const left = new THREE.Mesh(spokeGeo, dark);
  left.position.set(-0.25, 0, 0);
  const right = new THREE.Mesh(spokeGeo, dark);
  right.position.set(0.25, 0, 0);
  const bottom = new THREE.Mesh(spokeGeo, dark);
  bottom.rotation.z = Math.PI / 2;
  bottom.position.set(0, -0.25, 0);

  const marker = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.17, 0.17),
    new THREE.MeshStandardMaterial({ color: NEON, roughness: 0.4, metalness: 0.1, emissive: NEON, emissiveIntensity: 0.8 }),
  );
  marker.position.set(0, 0.4, 0);

  group.add(rim, hub, left, right, bottom, marker);
  return group;
}

export function createSign(kind: SignKind): THREE.Group {
  if (kind === "wheel") return buildWheel();

  const spec = specFor(kind);
  const group = new THREE.Group();
  const depth = 0.05;
  const bevel = 0.012;

  const shape = new THREE.Shape(spec.pts.map(([x, y]) => new THREE.Vector2(x, y)));
  const plateGeo = new THREE.ExtrudeGeometry(shape, {
    depth,
    bevelEnabled: true,
    bevelThickness: bevel,
    bevelSize: bevel,
    bevelSegments: 2,
    curveSegments: 1,
  });
  plateGeo.translate(0, 0, -depth / 2);
  const plate = new THREE.Mesh(plateGeo, new THREE.MeshStandardMaterial({ color: 0xe6eaf1, metalness: 0.75, roughness: 0.28 }));

  const canvas = document.createElement("canvas");
  canvas.width = S;
  canvas.height = S;
  const g = canvas.getContext("2d")!;
  spec.draw(g);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshStandardMaterial({
      map: tex,
      transparent: true,
      alphaTest: 0.5,
      roughness: 0.62,
      metalness: 0,
      emissive: 0xffffff,
      emissiveMap: tex,
      emissiveIntensity: 0.32,
    }),
  );
  face.position.z = depth / 2 + bevel + 0.001;

  group.add(plate, face);
  return group;
}

/** Free GPU memory held by a sign. */
export function disposeObject(obj: THREE.Object3D) {
  obj.traverse((child) => {
    const mesh = child as THREE.Mesh;
    if (!mesh.isMesh) return;
    mesh.geometry.dispose();
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      const std = m as THREE.MeshStandardMaterial;
      std.map?.dispose();
      m.dispose();
    });
  });
}