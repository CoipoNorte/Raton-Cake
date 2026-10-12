// ─────────────────────────────────────────────────────────────
//  Ratón · HUD flotante y minimalista
//  Prioriza el área jugable: la barra de tiempo se pega al borde
//  superior y los contadores viven en pastillas pequeñas que
//  flotan sobre la escena (sin robar altura a la mesa).
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { CakeSlice, Sparkles, Star, Volume2, VolumeX } from "lucide-react";
import { GAME_SECONDS } from "../game/types";

/** Alto que ocupa el HUD sobre la escena (para el padding del juego). */
export const HUD_HEIGHT = 34;

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-1 rounded-full border border-white/80 bg-white/80 px-2 py-0.5 shadow-[0_5px_14px_-8px_rgba(190,120,150,0.6)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function HUD({
  leftMs,
  score,
  cakes,
  combo,
  muted,
  onToggleMute,
}: {
  leftMs: number;
  score: number;
  cakes: number;
  combo: number;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const seconds = Math.max(0, Math.ceil(leftMs / 1000));
  const pct = Math.min(1, Math.max(0, leftMs / (GAME_SECONDS * 1000)));
  const urgent = seconds <= 10;

  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-30">
      {/* Barra de tiempo pegada al borde: cero espacio desperdiciado */}
      <div className="h-[5px] w-full bg-white/55">
        <div
          className="h-full rounded-r-full transition-[width] duration-150 ease-linear"
          style={{
            width: `${pct * 100}%`,
            background: urgent
              ? "linear-gradient(90deg,#FF9FB5,#FF5A7A)"
              : "linear-gradient(90deg,#9BE3C4,#7FD8F7)",
          }}
        />
      </div>

      <div className="relative flex items-start justify-between px-2 pt-1">
        {/* Izquierda: puntos, pasteles y combo */}
        <div className="flex items-center gap-1">
          <Pill>
            <Star size={13} className="text-[#FFC24B]" strokeWidth={2.8} fill="#FFE9B8" />
            <motion.span
              key={score}
              initial={{ scale: 1.3 }}
              animate={{ scale: 1 }}
              className="font-kawaii min-w-[2ch] text-sm font-extrabold tabular-nums leading-none text-[#7A5C85]"
            >
              {score}
            </motion.span>
          </Pill>
          <Pill>
            <CakeSlice size={13} className="text-[#FF8FAB]" strokeWidth={2.8} />
            <span className="font-kawaii text-sm font-extrabold tabular-nums leading-none text-[#7A5C85]">
              {cakes}
            </span>
          </Pill>
          {combo >= 2 && (
            <motion.span
              key={combo}
              initial={{ scale: 0.4, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 14 }}
            >
              <Pill className="border-[#FFD98A] bg-[#FFF3DA]">
                <Sparkles size={12} className="text-[#E8930C]" strokeWidth={2.8} />
                <span className="font-kawaii text-sm font-extrabold leading-none text-[#E8930C]">
                  ×{combo}
                </span>
              </Pill>
            </motion.span>
          )}
        </div>

        {/* Centro: cronómetro */}
        <motion.div
          animate={urgent ? { scale: [1, 1.12, 1] } : { scale: 1 }}
          transition={urgent ? { repeat: Infinity, duration: 1 } : undefined}
          className="absolute left-1/2 top-1 -translate-x-1/2"
        >
          <div
            className={`flex items-baseline gap-0.5 rounded-full border px-2.5 py-0.5 shadow-[0_5px_14px_-8px_rgba(190,120,150,0.6)] backdrop-blur-sm ${
              urgent
                ? "border-[#FFB7CC] bg-[#FFE5EF]/90"
                : "border-white/80 bg-white/80"
            }`}
          >
            <span
              className={`font-kawaii text-base font-extrabold tabular-nums leading-none ${
                urgent ? "text-[#FF5A7A]" : "text-[#7A5C85]"
              }`}
            >
              {seconds}
            </span>
            <span className="font-kawaii text-[9px] font-bold text-[#B48BAE]">s</span>
          </div>
        </motion.div>

        {/* Derecha: silencio */}
        <button
          onClick={onToggleMute}
          className="pointer-events-auto grid h-7 w-7 shrink-0 place-items-center rounded-full border border-white/80 bg-white/80 text-[#B48BAE] shadow-[0_5px_14px_-8px_rgba(190,120,150,0.6)] backdrop-blur-sm transition-transform active:scale-90"
          aria-label={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
      </div>
    </div>
  );
}
