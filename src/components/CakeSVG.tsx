// ─────────────────────────────────────────────────────────────
//  Ratón · Pastel procedural en SVG
//  Dibuja pedestal, capas, costuras de crema, glaseado con
//  goteo y toppings. Se reutiliza animado (stand) y estático
//  (ticket del pedido).
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import {
  CREAM_META,
  FLAVOR_META,
  GLAZE_META,
} from "../game/data";
import type { CakeSpec } from "../game/types";
import { ToppingGlyph } from "./glyphs";

const CX = 170;
const PLATE_TOP = 192;
const LAYER_H = 40;
const WIDTHS = [178, 156, 134]; // abajo → arriba
const RIM = 10; // alto de la elipse superior de cada capa

/** Posiciones de toppings sobre la superficie superior. */
const SLOTS: Array<[number, number]> = [
  [0, -5],
  [-32, 1],
  [32, 1],
  [-16, 5],
  [16, 5],
  [0, 8],
  [-46, 4],
  [46, 4],
];

/** Pequeño hash determinista para gotas y motas. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

const spring = (stiffness: number, damping: number) => ({
  type: "spring" as const,
  stiffness,
  damping,
});

function DollopRow({
  y,
  halfWidth,
  color,
  shadow,
  animated,
}: {
  y: number;
  halfWidth: number;
  color: string;
  shadow: string;
  animated: boolean;
}) {
  const spacing = 17;
  const count = Math.max(3, Math.floor((halfWidth * 2) / spacing));
  const dots = Array.from({ length: count }, (_, i) => {
    const x = CX - halfWidth + 7 + (i * (halfWidth * 2 - 14)) / (count - 1);
    return x;
  });
  const body = (
    <g>
      {dots.map((x, i) => (
        <g key={i}>
          <circle cx={x} cy={y} r={7.4} fill={color} stroke={shadow} strokeWidth="1.6" />
          <circle cx={x - 2} cy={y - 2.6} r={2} fill="#FFFFFF" opacity="0.7" />
        </g>
      ))}
    </g>
  );
  if (!animated) return body;
  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={spring(420, 20)}
    >
      {body}
    </motion.g>
  );
}

export function CakeSVG({
  spec,
  animated = false,
  className,
}: {
  spec: CakeSpec;
  animated?: boolean;
  className?: string;
}) {
  const { layers, cream, glaze, toppings } = spec;
  const n = layers.length;
  const topY = PLATE_TOP - n * LAYER_H;
  const topW = n > 0 ? WIDTHS[n - 1] : 0;
  const slotScale = Math.max(0.72, topW / 178);

  // Capa i (de abajo hacia arriba)
  const layerNode = (i: number) => {
    const flavor = layers[i];
    const m = FLAVOR_META[flavor];
    const w = WIDTHS[i];
    const t = PLATE_TOP - (i + 1) * LAYER_H;
    const seed = hash(`${flavor}-${i}`);
    const crumbs = [0.18, 0.45, 0.66, 0.86].map((p, k) => ({
      x: CX - w / 2 + 12 + p * (w - 24) + ((seed >> (k * 3)) % 7) - 3,
      y: t + 16 + ((seed >> (k * 5)) % 14),
    }));
    const body = (
      <g>
        <rect x={CX - w / 2} y={t} width={w} height={LAYER_H} rx={9} fill={m.sponge} />
        {crumbs.map((c, k) => (
          <circle key={k} cx={c.x} cy={c.y} r={2.1} fill={m.dot} opacity={0.75} />
        ))}
        <ellipse cx={CX} cy={t} rx={w / 2 + 0.5} ry={RIM} fill={m.crust} />
        <ellipse cx={CX} cy={t - 1.4} rx={w / 2 - 8} ry={RIM - 3.4} fill={m.sponge} opacity={0.9} />
      </g>
    );
    if (!animated) return <g key={`layer-${i}`}>{body}</g>;
    return (
      <motion.g
        key={`layer-${i}-${flavor}`}
        initial={{ y: -190, opacity: 0, rotate: i % 2 === 0 ? -4 : 4 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        style={{ transformBox: "fill-box", transformOrigin: "center" }}
        transition={spring(430, 21)}
      >
        {body}
      </motion.g>
    );
  };

  const glazeNode = () => {
    if (!glaze || n === 0) return null;
    const g = GLAZE_META[glaze];
    const rx = topW / 2 + 3;
    const seed = hash(`glaze-${glaze}-${n}`);
    const drips = 7;
    const dx = (rx * 2) / drips;
    let d = `M ${CX - rx} ${topY} Q ${CX} ${topY + RIM * 2 + 2} ${CX + rx} ${topY}`;
    for (let s = 0; s < drips; s++) {
      const depth = 12 + ((seed >> (s * 4)) % 13); // 12..24
      d += ` q ${-dx * 0.42} ${depth} ${-dx} 0`;
    }
    d += " Z";
    const body = (
      <g>
        <path d={d} fill={g.color} />
        <ellipse cx={CX} cy={topY} rx={rx} ry={RIM + 1.5} fill={g.color} />
        <ellipse cx={CX} cy={topY - 2.6} rx={rx * 0.8} ry={RIM - 3.6} fill={g.light} opacity={0.85} />
        <path
          d={`M ${CX - rx + 6} ${topY + 6} Q ${CX} ${topY + RIM + 9} ${CX + rx - 6} ${topY + 6}`}
          fill="none"
          stroke={g.dark}
          strokeWidth="2"
          opacity={0.28}
          strokeLinecap="round"
        />
      </g>
    );
    if (!animated) return body;
    return (
      <motion.g
        key={`glaze-${glaze}-${n}`}
        initial={{ opacity: 0, scaleY: 0.15 }}
        animate={{ opacity: 1, scaleY: 1 }}
        style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
        transition={spring(260, 19)}
      >
        {body}
      </motion.g>
    );
  };

  return (
    <svg viewBox="0 0 340 272" className={className} style={{ display: "block" }}>
      {/* Sombra de mesa + pedestal */}
      <ellipse cx={CX} cy={250} rx={118} ry={12} fill="#C97B96" opacity={0.14} />
      <ellipse cx={CX} cy={233} rx={42} ry={9} fill="#A8DCCB" stroke="#8FCEBA" strokeWidth="2" />
      <rect x={CX - 11} y={202} width={22} height={32} rx={10} fill="#BFE7D8" stroke="#8FCEBA" strokeWidth="2" />
      <ellipse cx={CX} cy={201} rx={117} ry={15} fill="#D4F2E6" stroke="#8FCEBA" strokeWidth="2.5" />
      <ellipse cx={CX} cy={198.5} rx={96} ry={10.5} fill="#EBFBF4" />

      {/* Capas */}
      {layers.map((_, i) => layerNode(i))}

      {/* Costuras de crema (entre capas y borde superior) */}
      {cream &&
        layers.map((_, i) => {
          const isTopRim = i === n - 1;
          const y = PLATE_TOP - (i + 1) * LAYER_H;
          const half = isTopRim ? WIDTHS[i] / 2 - 4 : WIDTHS[i + 1] / 2 + 9;
          return (
            <DollopRow
              key={`cream-${i}`}
              y={y}
              halfWidth={half}
              color={CREAM_META[cream].color}
              shadow={CREAM_META[cream].shadow}
              animated={animated}
            />
          );
        })}

      {/* Glaseado */}
      {glazeNode()}

      {/* Toppings */}
      {toppings.map((tp, j) => {
        if (j >= SLOTS.length || n === 0) return null;
        const [ox, oy] = SLOTS[j];
        const x = CX + ox * slotScale;
        const y = topY + oy * (slotScale * 0.9 + 0.2);
        if (!animated)
          return <ToppingGlyph key={`tp-${j}`} id={tp} x={x} y={y} s={1.15 * slotScale + 0.28} />;
        return (
          <g key={`tp-${j}`} transform={`translate(${x} ${y})`}>
            <motion.g
              initial={{ scale: 0, rotate: -50, y: -14 }}
              animate={{ scale: 1, rotate: 0, y: 0 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              transition={spring(560, 15)}
            >
              <ToppingGlyph id={tp} s={1.15 * slotScale + 0.28} />
            </motion.g>
          </g>
        );
      })}
    </svg>
  );
}
