// ─────────────────────────────────────────────────────────────
//  Ratón · Datos de ingredientes y paleta pastel
// ─────────────────────────────────────────────────────────────

import type {
  Category,
  CreamId,
  Flavor,
  GlazeId,
  ToppingId,
} from "./types";

export const FLAVOR_META: Record<
  Flavor,
  { label: string; sponge: string; crust: string; dot: string }
> = {
  vanilla: { label: "Vainilla", sponge: "#FFEEC7", crust: "#F3D89A", dot: "#E4BE7E" },
  chocolate: { label: "Chocolate", sponge: "#A9745B", crust: "#8A5A41", dot: "#74482F" },
  strawberry: { label: "Fresa", sponge: "#FFD3DF", crust: "#F7AEC4", dot: "#E98CA9" },
  matcha: { label: "Matcha", sponge: "#D8E9BC", crust: "#B4D191", dot: "#98B874" },
  blueberry: { label: "Arándano", sponge: "#D4DBF6", crust: "#ACB8E8", dot: "#8E9CD4" },
};

export const CREAM_META: Record<
  CreamId,
  { label: string; color: string; shadow: string }
> = {
  vanilla: { label: "Vainilla", color: "#FFF6E6", shadow: "#EBD9BC" },
  strawberry: { label: "Fresa", color: "#FFDAE5", shadow: "#F2AFC4" },
  chocolate: { label: "Chocolate", color: "#C99B7C", shadow: "#A97C5C" },
  matcha: { label: "Matcha", color: "#E3EFCB", shadow: "#BCCE96" },
};

export const GLAZE_META: Record<
  GlazeId,
  { label: string; color: string; light: string; dark: string }
> = {
  vanilla: { label: "Vainilla", color: "#FFF1D2", light: "#FFFBEF", dark: "#EFD6A6" },
  chocolate: { label: "Chocolate", color: "#7E5238", light: "#96684A", dark: "#664026" },
  strawberry: { label: "Fresa", color: "#FF9EBE", light: "#FFC3D8", dark: "#F07FA4" },
  matcha: { label: "Matcha", color: "#ABC98E", light: "#C9E0AF", dark: "#8FAE6F" },
  blueberry: { label: "Arándano", color: "#97A5E8", light: "#BAC5F5", dark: "#7A89D4" },
};

export const TOPPING_META: Record<ToppingId, { label: string }> = {
  cherry: { label: "Cereza" },
  straw: { label: "Fresita" },
  sprinkles: { label: "Chispas" },
  star: { label: "Estrella" },
  heart: { label: "Corazón" },
  blueberry: { label: "Arándano" },
};

export const CATEGORY_META: Record<Category, { label: string; hint: string }> = {
  flavors: { label: "Bizcocho", hint: "Arrastra capas de bizcocho" },
  creams: { label: "Crema", hint: "Rellena con crema suave" },
  glazes: { label: "Glaseado", hint: "Baña con glaseado" },
  toppings: { label: "Toppings", hint: "Decora con toppings" },
};

export const FLAVORS = Object.keys(FLAVOR_META) as Flavor[];
export const CREAMS = Object.keys(CREAM_META) as CreamId[];
export const GLAZES = Object.keys(GLAZE_META) as GlazeId[];
export const TOPPINGS = Object.keys(TOPPING_META) as ToppingId[];

/** Colores para chispas confeti kawaii. */
export const CONFETTI_COLORS = [
  "#FF8FAB",
  "#FFC94D",
  "#7FD8F7",
  "#9BE39B",
  "#C9A7F5",
  "#FFB270",
];
