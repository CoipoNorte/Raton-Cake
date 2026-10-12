// ─────────────────────────────────────────────────────────────
//  Ratón · Bandeja de ingredientes con pestañas y fichas
//  arrastrables (puntero táctil / ratón).
// ─────────────────────────────────────────────────────────────

import {
  Cherry,
  Droplets,
  IceCreamBowl,
  Layers,
} from "lucide-react";
import type { Category } from "../game/types";
import {
  CATEGORY_META,
  CREAM_META,
  CREAMS,
  FLAVOR_META,
  FLAVORS,
  GLAZE_META,
  GLAZES,
  TOPPING_META,
  TOPPINGS,
} from "../game/data";
import { IngredientIcon } from "./glyphs";

const TABS: Array<{ id: Category; icon: typeof Layers }> = [
  { id: "flavors", icon: Layers },
  { id: "creams", icon: IceCreamBowl },
  { id: "glazes", icon: Droplets },
  { id: "toppings", icon: Cherry },
];

function labelFor(cat: Category, id: string): string {
  if (cat === "flavors") return FLAVOR_META[id as keyof typeof FLAVOR_META].label;
  if (cat === "creams") return CREAM_META[id as keyof typeof CREAM_META].label;
  if (cat === "glazes") return GLAZE_META[id as keyof typeof GLAZE_META].label;
  return TOPPING_META[id as keyof typeof TOPPING_META].label;
}

function itemsFor(cat: Category): string[] {
  if (cat === "flavors") return FLAVORS;
  if (cat === "creams") return CREAMS;
  if (cat === "glazes") return GLAZES;
  return TOPPINGS;
}

export function Tray({
  tab,
  onTab,
  dragging,
  onChipDown,
  compact = false,
}: {
  tab: Category;
  onTab: (t: Category) => void;
  dragging: { cat: Category; id: string } | null;
  onChipDown: (e: React.PointerEvent, cat: Category, id: string) => void;
  compact?: boolean;
}) {
  const items = itemsFor(tab);

  return (
    <div className="flex h-full min-h-0 w-full flex-col rounded-3xl border border-white/80 bg-white/60 p-1.5 shadow-[0_12px_28px_-14px_rgba(190,120,150,0.5)] backdrop-blur-sm">
      {/* Pestañas */}
      <div className="flex gap-1">
        {TABS.map(({ id, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => onTab(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-2xl py-1 transition-all active:scale-95 ${
                active
                  ? "bg-[#FF8FAB] text-white shadow-[0_6px_14px_-6px_rgba(255,120,160,0.9)]"
                  : "bg-white/70 text-[#C08FB0] hover:bg-white"
              }`}
              aria-label={CATEGORY_META[id].label}
            >
              <Icon size={17} strokeWidth={2.5} />
              <span className="font-kawaii text-[9px] font-extrabold uppercase tracking-wider">
                {CATEGORY_META[id].label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Fichas arrastrables */}
      <div
        className={`no-scrollbar mt-1.5 grid min-h-0 flex-1 auto-rows-fr gap-1.5 overflow-y-auto ${
          compact ? "grid-cols-6" : "grid-cols-3"
        }`}
      >
        {items.map((id) => {
          const isDragging = dragging?.cat === tab && dragging.id === id;
          return (
            <div
              key={id}
              onPointerDown={(e) => onChipDown(e, tab, id)}
              className={`flex cursor-grab touch-none select-none flex-col items-center justify-center gap-0.5 rounded-2xl border-2 bg-white/90 px-0.5 shadow-[0_5px_12px_-6px_rgba(190,120,150,0.5)] transition-all duration-150 active:cursor-grabbing ${compact ? "py-1" : "py-1.5"} ${
                isDragging
                  ? "scale-95 border-[#FF8FAB] opacity-40"
                  : "border-white hover:-translate-y-0.5 hover:border-[#FFD3E0] hover:shadow-[0_9px_16px_-8px_rgba(190,120,150,0.65)]"
              }`}
            >
              <IngredientIcon cat={tab} id={id} size={compact ? 30 : 34} />
              <span className="font-kawaii text-[9.5px] font-bold text-[#9A7BA2]">
                {labelFor(tab, id)}
              </span>
            </div>
          );
        })}
      </div>

      {!compact && (
        <p className="font-kawaii mt-1 text-center text-[9.5px] font-bold text-[#C6A3C0]">
          {CATEGORY_META[tab].hint}
        </p>
      )}
    </div>
  );
}
