// ─────────────────────────────────────────────────────────────
//  Ratón · Explosión de confetti kawaii (partículas DOM)
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { CONFETTI_COLORS } from "../game/data";

function rand(seed: number): number {
  let t = seed + 0x6d2b79f5;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function Burst({
  seed = 1,
  count = 16,
  spread = 160,
}: {
  seed?: number;
  count?: number;
  spread?: number;
}) {
  const pieces = Array.from({ length: count }, (_, i) => {
    const a = rand(seed * 97 + i * 13) * Math.PI * 2;
    const d = spread * (0.45 + rand(seed * 31 + i * 7) * 0.75);
    return {
      dx: Math.cos(a) * d,
      dy: Math.sin(a) * d * 0.85 - spread * 0.28,
      rot: (rand(seed + i) - 0.5) * 340,
      w: 6 + rand(seed + i * 3) * 7,
      h: 8 + rand(seed + i * 5) * 10,
      circle: rand(seed + i * 11) > 0.6,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      delay: rand(seed + i * 17) * 0.06,
    };
  });

  return (
    <div className="pointer-events-none absolute left-1/2 top-[42%] z-40" aria-hidden="true">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          className="absolute block"
          style={{
            width: p.w,
            height: p.circle ? p.w : p.h,
            borderRadius: p.circle ? 999 : 3,
            background: p.color,
            x: "-50%",
            y: "-50%",
          }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            x: p.dx,
            y: [0, p.dy, p.dy + 90],
            rotate: p.rot,
            opacity: [1, 1, 0],
            scale: [1, 1, 0.6],
          }}
          transition={{ duration: 1, delay: p.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
