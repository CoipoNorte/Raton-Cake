// ─────────────────────────────────────────────────────────────
//  Ratón · Barra superior: cronómetro, puntos, pasteles, récord
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import {
  CakeSlice,
  Sparkles,
  Star,
  Timer,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { GAME_SECONDS } from "../game/types";
import { Mouse } from "./Mouse";

function Pill({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full border border-white/80 bg-white/75 px-3 py-1 shadow-[0_6px_16px_-8px_rgba(190,120,150,0.55)] backdrop-blur-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function HUD({
  leftMs,
  score,
  cakes,
  best,
  combo,
  muted,
  onToggleMute,
}: {
  leftMs: number;
  score: number;
  cakes: number;
  best: number;
  combo: number;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const seconds = Math.max(0, Math.ceil(leftMs / 1000));
  const pct = Math.min(1, Math.max(0, leftMs / (GAME_SECONDS * 1000)));
  const urgent = seconds <= 10;

  return (
    <header className="relative z-20 flex items-center gap-2 px-3 pt-2">
      {/* Logo mini */}
      <Pill className="shrink-0 gap-2 py-0.5 pr-3">
        <span className="grid h-9 w-9 place-items-center">
          <Mouse mood="idle" body={false} className="h-9 w-9" />
        </span>
        <span className="font-kawaii hidden leading-none sm:block">
          <span className="block text-sm font-extrabold tracking-wide text-[#7A5C85]">
            RATÓN
          </span>
          <span className="block text-[9px] font-bold tracking-[0.2em] text-[#C08FB0]">
            ケーキやさん
          </span>
        </span>
      </Pill>

      {/* Cronómetro central */}
      <div className="mx-auto flex min-w-0 flex-col items-center">
        <Pill className={`gap-2 ${urgent ? "animate-pulse-soft" : ""}`}>
          <Timer
            size={18}
            className={urgent ? "text-[#FF5A7A]" : "text-[#8FB8FF]"}
            strokeWidth={2.6}
          />
          <span
            className={`font-kawaii text-xl font-extrabold tabular-nums leading-none ${
              urgent ? "text-[#FF5A7A]" : "text-[#7A5C85]"
            }`}
          >
            {seconds}
            <span className="ml-0.5 text-[10px] font-bold text-[#B48BAE]">s</span>
          </span>
        </Pill>
        <div className="mt-1 h-1.5 w-36 overflow-hidden rounded-full bg-white/70 sm:w-48">
          <div
            className="h-full rounded-full transition-[width] duration-150 ease-linear"
            style={{
              width: `${pct * 100}%`,
              background: urgent
                ? "linear-gradient(90deg,#FF9FB5,#FF5A7A)"
                : "linear-gradient(90deg,#9BE3C4,#7FD8F7)",
            }}
          />
        </div>
      </div>

      {/* Marcadores */}
      <div className="flex shrink-0 items-center gap-1.5">
        {combo >= 2 && (
          <motion.span
            key={combo}
            initial={{ scale: 0.4, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 14 }}
          >
            <Pill className="border-[#FFD98A] bg-[#FFF3DA] text-[#E8930C]">
              <Sparkles size={15} strokeWidth={2.6} />
              <span className="font-kawaii text-sm font-extrabold">×{combo}</span>
            </Pill>
          </motion.span>
        )}
        <Pill>
          <Star size={16} className="text-[#FFC24B]" strokeWidth={2.6} fill="#FFE9B8" />
          <motion.span
            key={score}
            initial={{ scale: 1.35 }}
            animate={{ scale: 1 }}
            className="font-kawaii min-w-[2ch] text-lg font-extrabold tabular-nums text-[#7A5C85]"
          >
            {score}
          </motion.span>
        </Pill>
        <Pill>
          <CakeSlice size={16} className="text-[#FF8FAB]" strokeWidth={2.6} />
          <span className="font-kawaii text-lg font-extrabold tabular-nums text-[#7A5C85]">
            {cakes}
          </span>
        </Pill>
        <Pill className="hidden md:flex">
          <Trophy size={15} className="text-[#E8A33D]" strokeWidth={2.6} />
          <span className="font-kawaii text-sm font-extrabold tabular-nums text-[#B4895A]">
            {best}
          </span>
        </Pill>
        <button
          onClick={onToggleMute}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/80 bg-white/75 text-[#B48BAE] shadow-[0_6px_16px_-8px_rgba(190,120,150,0.55)] backdrop-blur-sm transition-transform active:scale-90"
          aria-label={muted ? "Activar sonido" : "Silenciar"}
        >
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
      </div>
    </header>
  );
}
