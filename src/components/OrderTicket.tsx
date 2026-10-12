// ─────────────────────────────────────────────────────────────
//  Ratón · Ticket del pedido: miniatura del pastel objetivo
//  - OrderTicket: tarjeta vertical (horizontal/tablet/PC)
//  - OrderTicketCompact: barra horizontal (móvil en vertical)
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { ReceiptText } from "lucide-react";
import type { Order } from "../game/types";
import { CREAM_META, GLAZE_META } from "../game/data";
import { CakeSVG } from "./CakeSVG";
import { IngredientIcon } from "./glyphs";

/** Cuenta toppings por tipo → Map("cherry" → 2) para mostrar ×N. */
function toppingCounts(order: Order): Map<string, number> {
  const counts = new Map<string, number>();
  for (const t of order.toppings) counts.set(t, (counts.get(t) ?? 0) + 1);
  return counts;
}

function GlazeTag({ order }: { order: Order }) {
  const glaze = GLAZE_META[order.glaze ?? "vanilla"];
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#FFF0F5] px-2 py-0.5">
      <span
        className="h-2.5 w-2.5 rounded-full border border-black/10"
        style={{ background: glaze.color }}
      />
      <span className="font-kawaii text-[9.5px] font-bold text-[#8A6B94]">
        Glaseado {glaze.label}
      </span>
    </span>
  );
}

function CreamTag({ order }: { order: Order }) {
  if (!order.cream) return null;
  const cream = CREAM_META[order.cream];
  return (
    <span className="flex items-center gap-1 rounded-full bg-[#FFF0F5] px-2 py-0.5">
      <span
        className="h-2.5 w-2.5 rounded-full border border-black/10"
        style={{ background: cream.color }}
      />
      <span className="font-kawaii text-[9.5px] font-bold text-[#8A6B94]">
        Crema {cream.label}
      </span>
    </span>
  );
}

function ToppingChips({ order, size }: { order: Order; size: number }) {
  const counts = toppingCounts(order);
  return (
    <>
      {[...counts.entries()].map(([t, n]) => (
        <span
          key={t}
          className="relative flex items-center justify-center rounded-xl border border-white bg-white/80 px-1 py-0.5 shadow-sm"
        >
          <IngredientIcon cat="toppings" id={t} size={size} />
          {n > 1 && (
            <span className="font-kawaii absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#FF8FAB] px-0.5 text-[9px] font-extrabold text-white">
              ×{n}
            </span>
          )}
        </span>
      ))}
    </>
  );
}

/** Tarjeta vertical completa (modo horizontal). */
export function OrderTicket({ order }: { order: Order }) {
  return (
    <motion.aside
      key={order.id}
      initial={{ x: -26, opacity: 0, rotate: -1.5 }}
      animate={{ x: 0, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-[0_12px_28px_-14px_rgba(190,120,150,0.5)] backdrop-blur-sm"
    >
      <div className="flex items-center gap-1.5 border-b-2 border-dashed border-[#F3C9DA] px-3 py-1.5">
        <ReceiptText size={15} className="text-[#E58AAE]" strokeWidth={2.6} />
        <span className="font-kawaii text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#B48BAE]">
          Pedido
        </span>
        <span className="font-kawaii ml-auto rounded-full bg-[#FFEFD6] px-2 py-0.5 text-[11px] font-extrabold text-[#E8930C]">
          #{order.id}
        </span>
      </div>

      {/* Miniatura del pastel objetivo (encuadre ajustado = más nítido) */}
      <div className="min-h-0 flex-1 p-1.5">
        <div className="grid h-full w-full place-items-center rounded-2xl border border-white/70 bg-white/70 p-1.5 shadow-inner">
          <CakeSVG
            spec={order}
            fit
            className="max-h-full w-full drop-shadow-[0_6px_10px_rgba(190,120,150,0.28)]"
          />
        </div>
      </div>

      {/* Detalle: crema + glaseado + toppings exactos */}
      <div className="space-y-1 px-2 pb-2">
        <div className="flex flex-wrap items-center justify-center gap-1">
          <GlazeTag order={order} />
          <CreamTag order={order} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1">
          <ToppingChips order={order} size={24} />
        </div>
      </div>
    </motion.aside>
  );
}

/** Barra horizontal compacta (móvil en vertical). */
export function OrderTicketCompact({ order }: { order: Order }) {
  return (
    <motion.aside
      key={order.id}
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 22 }}
      className="flex w-full items-center gap-2 rounded-2xl border border-white/80 bg-white/60 px-2 py-1 shadow-[0_12px_28px_-14px_rgba(190,120,150,0.5)] backdrop-blur-sm"
    >
      {/* Miniatura del pastel objetivo (encuadre ajustado = más nítido) */}
      <div className="grid w-[88px] shrink-0 place-items-center rounded-xl border border-white/70 bg-white/70 p-1">
        <CakeSVG
          spec={order}
          fit
          className="w-full drop-shadow-[0_4px_8px_rgba(190,120,150,0.28)]"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <ReceiptText size={12} className="text-[#E58AAE]" strokeWidth={2.6} />
          <span className="font-kawaii text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#B48BAE]">
            Pedido
          </span>
          <span className="font-kawaii rounded-full bg-[#FFEFD6] px-1.5 py-px text-[9px] font-extrabold text-[#E8930C]">
            #{order.id}
          </span>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1">
          <GlazeTag order={order} />
          <CreamTag order={order} />
          <ToppingChips order={order} size={18} />
        </div>
      </div>
    </motion.aside>
  );
}
