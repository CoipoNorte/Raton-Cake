// ─────────────────────────────────────────────────────────────
//  Ratón · Glifos SVG de ingredientes (estilo kawaii plano)
// ─────────────────────────────────────────────────────────────

import type { Category, CreamId, Flavor, GlazeId, ToppingId } from "../game/types";
import { CREAM_META, FLAVOR_META, GLAZE_META } from "../game/data";

const STAR_PATH =
  "M0,-7.5 L1.88,-2.59 L7.13,-2.32 L3.04,0.99 L4.41,6.07 L0,3.2 " +
  "L-4.41,6.07 L-3.04,0.99 L-7.13,-2.32 L-1.88,-2.59 Z";

const HEART_PATH =
  "M0,6.5 C-9,-0.5 -7.5,-8 0,-3.6 C7.5,-8 9,-0.5 0,6.5 Z";

/** Glifo de topping centrado en el origen (caja ~20×20). */
export function ToppingGlyph({
  id,
  x = 0,
  y = 0,
  s = 1,
}: {
  id: ToppingId;
  x?: number;
  y?: number;
  s?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {id === "cherry" && (
        <g>
          <path d="M0,-2.5 C1.8,-7 4.6,-8.6 7,-9.4" fill="none" stroke="#6FA95C" strokeWidth="1.7" strokeLinecap="round" />
          <ellipse cx="7.4" cy="-9.6" rx="3" ry="1.6" fill="#7CB56B" transform="rotate(-28 7.4 -9.6)" />
          <circle cx="0" cy="3" r="6.6" fill="#FF5A6E" />
          <circle cx="-2.2" cy="0.9" r="1.7" fill="#FFFFFF" opacity="0.65" />
        </g>
      )}
      {id === "straw" && (
        <g>
          <path d="M0,-6.8 C6.6,-6.8 8.2,0.2 0,9.2 C-8.2,0.2 -6.6,-6.8 0,-6.8 Z" fill="#FF6F87" />
          <ellipse cx="-3.4" cy="-7" rx="2.7" ry="1.7" fill="#6FBF73" transform="rotate(-24 -3.4 -7)" />
          <ellipse cx="0" cy="-7.8" rx="2.7" ry="1.7" fill="#7CC97E" />
          <ellipse cx="3.4" cy="-7" rx="2.7" ry="1.7" fill="#6FBF73" transform="rotate(24 3.4 -7)" />
          <circle cx="-2.9" cy="-0.6" r="0.9" fill="#FFE7B0" />
          <circle cx="2.9" cy="-0.6" r="0.9" fill="#FFE7B0" />
          <circle cx="0" cy="3.4" r="0.9" fill="#FFE7B0" />
          <circle cx="-1.6" cy="1.6" r="0.8" fill="#FFE7B0" />
          <circle cx="1.6" cy="1.6" r="0.8" fill="#FFE7B0" />
        </g>
      )}
      {id === "sprinkles" && (
        <g>
          <rect x="-1.3" y="-3.5" width="2.6" height="7" rx="1.3" fill="#FF8FAB" transform="translate(-6 -3) rotate(-35)" />
          <rect x="-1.3" y="-3.5" width="2.6" height="7" rx="1.3" fill="#FFC24B" transform="translate(0 -5) rotate(15)" />
          <rect x="-1.3" y="-3.5" width="2.6" height="7" rx="1.3" fill="#7FD8F7" transform="translate(6 -2) rotate(55)" />
          <rect x="-1.3" y="-3.5" width="2.6" height="7" rx="1.3" fill="#9BE39B" transform="translate(-3 4) rotate(80)" />
          <rect x="-1.3" y="-3.5" width="2.6" height="7" rx="1.3" fill="#C9A7F5" transform="translate(4 4.5) rotate(-60)" />
        </g>
      )}
      {id === "star" && (
        <g>
          <path d={STAR_PATH} fill="#FFC94D" stroke="#F0A93B" strokeWidth="1.1" strokeLinejoin="round" />
          <circle cx="-2" cy="-2" r="1.2" fill="#FFF3D0" />
        </g>
      )}
      {id === "heart" && (
        <g>
          <path d={HEART_PATH} fill="#FF8FB5" stroke="#F2779F" strokeWidth="1" strokeLinejoin="round" />
          <circle cx="-2.6" cy="-2.4" r="1.3" fill="#FFFFFF" opacity="0.6" />
        </g>
      )}
      {id === "blueberry" && (
        <g>
          <circle cx="0" cy="0.8" r="6.8" fill="#7C8FE0" />
          <path d="M0,-6.6 L1.6,-3.4 L4.6,-4.6 L3,-1.6 L6,-0.4 L2.6,0.6 L3.4,3.6 L0.6,1.9 L-1.4,4.4 L-1.6,1 L-4.8,1.4 L-2.9,-1.2 L-5.4,-3 L-2,-3.3 Z" fill="#5C6BC0" transform="translate(0 -2.4) scale(0.62)" />
          <circle cx="-2.4" cy="-1" r="1.6" fill="#FFFFFF" opacity="0.55" />
        </g>
      )}
    </g>
  );
}

// ── Iconos de bandeja (caja 48×48) ───────────────────────────

function FlavorSwatch({ flavor }: { flavor: Flavor }) {
  const m = FLAVOR_META[flavor];
  return (
    <g>
      <rect x="9" y="18" width="30" height="14" rx="5" fill={m.sponge} />
      <ellipse cx="24" cy="18" rx="15" ry="5" fill={m.crust} />
      <circle cx="18" cy="25" r="1.6" fill={m.dot} />
      <circle cx="26" cy="27.5" r="1.6" fill={m.dot} />
      <circle cx="31" cy="24" r="1.6" fill={m.dot} />
      <ellipse cx="24" cy="41" rx="17" ry="3" fill="#000000" opacity="0.05" />
    </g>
  );
}

function CreamSwirl({ cream }: { cream: CreamId }) {
  const m = CREAM_META[cream];
  return (
    <g>
      <ellipse cx="24" cy="41" rx="16" ry="3" fill="#000000" opacity="0.05" />
      <circle cx="24" cy="32" r="10" fill={m.color} stroke={m.shadow} strokeWidth="1.4" />
      <circle cx="24" cy="23" r="7" fill={m.color} stroke={m.shadow} strokeWidth="1.4" />
      <circle cx="24" cy="15.5" r="4.4" fill={m.color} stroke={m.shadow} strokeWidth="1.4" />
      <circle cx="22" cy="30" r="2.4" fill="#FFFFFF" opacity="0.7" />
    </g>
  );
}

function GlazeDrop({ glaze }: { glaze: GlazeId }) {
  const m = GLAZE_META[glaze];
  return (
    <g>
      <ellipse cx="24" cy="41" rx="16" ry="3" fill="#000000" opacity="0.05" />
      <path
        d="M10,22 Q24,12 38,22 L38,26 Q38,30 34.5,30 Q32,30 32,33.5 Q32,36.5 29.5,36.5 Q27,36.5 27,33 L27,30 Q27,28 24,28 Q21,28 21,31.5 Q21,35 18,35 Q15,35 15,31 L15,29 Q15,27 13,26.6 Q10,26 10,22 Z"
        fill={m.color}
        stroke={m.dark}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <ellipse cx="24" cy="20" rx="11" ry="4" fill={m.light} opacity="0.8" />
    </g>
  );
}

/** Icono genérico de ingrediente (para fichas, pedidos y fantasma). */
export function IngredientIcon({
  cat,
  id,
  size = 40,
}: {
  cat: Category;
  id: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      aria-hidden="true"
      style={{ display: "block", overflow: "visible" }}
    >
      {cat === "flavors" && <FlavorSwatch flavor={id as Flavor} />}
      {cat === "creams" && <CreamSwirl cream={id as CreamId} />}
      {cat === "glazes" && <GlazeDrop glaze={id as GlazeId} />}
      {cat === "toppings" && <ToppingGlyph id={id as ToppingId} x={24} y={24} s={1.7} />}
    </svg>
  );
}
