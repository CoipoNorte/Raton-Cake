// ─────────────────────────────────────────────────────────────
//  Ratón · Ticket del pedido: miniatura del pastel objetivo
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { ReceiptText } from "lucide-react";
import type { Order } from "../game/types";
import { CREAM_META, GLAZE_META } from "../game/data";
import { CakeSVG } from "./CakeSVG";
import { IngredientIcon } from "./glyphs";

export function OrderTicket({ order }: { order: Order }) {
  // Agrupa toppings por tipo para mostrar ×N
  const counts = new Map<string, number>();
  for (const t of order.toppings) counts.set(t, (counts.get(t) ?? 0) + 1);

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

      {/* Miniatura del pastel objetivo */}
      <div className="grid min-h-0 flex-1 place-items-center px-1">
        <CakeSVG spec={order} className="max-h-full w-[92%]" />
      </div>

      {/* Detalle: crema + glaseado + toppings exactos */}
      <div className="space-y-1 px-2 pb-2">
        <div className="flex flex-wrap items-center justify-center gap-1">
          <span className="flex items-center gap-1 rounded-full bg-[#FFF0F5] px-2 py-0.5">
            <span
              className="h-2.5 w-2.5 rounded-full border border-black/10"
              style={{ background: GLAZE_META[order.glaze ?? "vanilla"].color }}
            />
            <span className="font-kawaii text-[9.5px] font-bold text-[#8A6B94]">
              Glaseado {GLAZE_META[order.glaze ?? "vanilla"].label}
            </span>
          </span>
          {order.cream && (
            <span className="flex items-center gap-1 rounded-full bg-[#FFF0F5] px-2 py-0.5">
              <span
                className="h-2.5 w-2.5 rounded-full border border-black/10"
                style={{ background: CREAM_META[order.cream].color }}
              />
              <span className="font-kawaii text-[9.5px] font-bold text-[#8A6B94]">
                Crema {CREAM_META[order.cream].label}
              </span>
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1">
          {[...counts.entries()].map(([t, n]) => (
            <span
              key={t}
              className="relative flex items-center justify-center rounded-xl border border-white bg-white/80 px-1 py-0.5 shadow-sm"
            >
              <IngredientIcon cat="toppings" id={t} size={24} />
              {n > 1 && (
                <span className="font-kawaii absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-[#FF8FAB] px-0.5 text-[9px] font-extrabold text-white">
                  ×{n}
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </motion.aside>
  );
}
