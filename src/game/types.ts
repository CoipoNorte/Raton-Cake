// ─────────────────────────────────────────────────────────────
//  Ratón · Pastelería Kawaii — Tipos del juego
// ─────────────────────────────────────────────────────────────

export type Flavor =
  | "vanilla"
  | "chocolate"
  | "strawberry"
  | "matcha"
  | "blueberry";

export type CreamId = "vanilla" | "strawberry" | "chocolate" | "matcha";

export type GlazeId =
  | "vanilla"
  | "chocolate"
  | "strawberry"
  | "matcha"
  | "blueberry";

export type ToppingId =
  | "cherry"
  | "straw"
  | "sprinkles"
  | "star"
  | "heart"
  | "blueberry";

export type Category = "flavors" | "creams" | "glazes" | "toppings";

/** Receta / estado de un pastel (capas de abajo hacia arriba). */
export interface CakeSpec {
  layers: Flavor[];
  cream: CreamId | null;
  glaze: GlazeId | null;
  toppings: ToppingId[];
}

/** Pedido de un cliente: una receta + identificador para animaciones. */
export interface Order extends CakeSpec {
  id: number;
}

export const EMPTY_CAKE: CakeSpec = {
  layers: [],
  cream: null,
  glaze: null,
  toppings: [],
};

export const MAX_LAYERS = 3;
export const MAX_TOPPINGS = 7;
export const GAME_SECONDS = 90;
export const TIME_BONUS = 3; // segundos extra por pastel perfecto
export const TIME_CAP = 99; // tope del cronómetro
