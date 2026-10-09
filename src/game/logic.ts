// ─────────────────────────────────────────────────────────────
//  Ratón · Lógica: generación de pedidos, validación y puntos
// ─────────────────────────────────────────────────────────────

import { CREAMS, FLAVORS, GLAZES, TOPPINGS } from "./data";
import type { CakeSpec, Order } from "./types";

const pick = <T,>(arr: readonly T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

const chance = (p: number) => Math.random() < p;

let orderSeq = 1;

/**
 * Genera un pedido con dificultad progresiva según cuántos pasteles
 * lleva completados el jugador (`index` empieza en 0).
 */
export function generateOrder(index: number): Order {
  // Capas: al inicio 1-2, luego 2-3.
  let layerCount: number;
  if (index < 1) layerCount = pick([1, 2] as const);
  else if (index < 3) layerCount = pick([1, 2, 2] as const);
  else layerCount = pick([2, 2, 3, chance(0.35) ? 1 : 2] as const);

  const layers = Array.from({ length: layerCount }, () => pick(FLAVORS));
  // Evita 3 capas idénticas seguidas (visualmente pobre).
  if (layerCount === 3 && layers[0] === layers[1] && layers[1] === layers[2]) {
    layers[2] = pick(FLAVORS.filter((f) => f !== layers[0]));
  }

  const toppingGoal = index < 2 ? pick([1, 2]) : pick([1, 2, 2, 3]);
  const toppings = Array.from({ length: toppingGoal }, () =>
    index < 4
      ? // Al inicio, toppings sin repetir para aprender.
        pick(TOPPINGS)
      : pick(TOPPINGS)
  );
  // En los primeros pedidos evita duplicados de toppings.
  if (index < 4) {
    const unique = [...new Set(toppings)];
    toppings.splice(0, toppings.length, ...unique.slice(0, toppingGoal));
  }

  return {
    id: orderSeq++,
    layers,
    cream: layerCount > 1 ? pick(CREAMS) : null,
    glaze: pick(GLAZES),
    toppings,
  };
}

/** ¿El pastel construido coincide exactamente con el pedido? */
export function matchesOrder(order: CakeSpec, build: CakeSpec): boolean {
  if (order.layers.length !== build.layers.length) return false;
  for (let i = 0; i < order.layers.length; i++) {
    if (order.layers[i] !== build.layers[i]) return false;
  }
  if (order.cream !== build.cream) return false;
  if (order.glaze !== build.glaze) return false;
  if (!sameToppings(order.toppings, build.toppings)) return false;
  return true;
}

function sameToppings(a: readonly string[], b: readonly string[]): boolean {
  if (a.length !== b.length) return false;
  const count = new Map<string, number>();
  for (const t of a) count.set(t, (count.get(t) ?? 0) + 1);
  for (const t of b) {
    const left = count.get(t);
    if (!left) return false;
    count.set(t, left - 1);
  }
  return true;
}

/** Puntos base según la complejidad del pedido. */
export function basePrice(spec: CakeSpec): number {
  return 60 + 35 * spec.layers.length + 12 * spec.toppings.length;
}

/** Multiplicador de combo (x1, x1.25, x1.5 ... hasta x2.5). */
export function comboMultiplier(combo: number): number {
  return Math.min(2.5, 1 + 0.25 * Math.max(0, combo - 1));
}

export function priceFor(spec: CakeSpec, combo: number): number {
  return Math.round(basePrice(spec) * comboMultiplier(combo));
}
