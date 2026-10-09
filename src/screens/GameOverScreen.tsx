// ─────────────────────────────────────────────────────────────
//  Ratón · Pantalla de fin de partida
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { CakeSlice, Home, RotateCcw, Star, Trophy } from "lucide-react";
import { Burst } from "../components/Confetti";
import { Mouse } from "../components/Mouse";
import type { GameResult } from "./GameScreen";

function Stat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: typeof Star;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 rounded-2xl border border-white bg-white/80 px-2 py-2 shadow-sm">
      <Icon size={18} className={color} strokeWidth={2.5} />
      <motion.span
        initial={{ scale: 0.4 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 320, damping: 14, delay: 0.35 }}
        className="font-kawaii text-2xl font-extrabold tabular-nums leading-none text-[#7A5C85]"
      >
        {value}
      </motion.span>
      <span className="font-kawaii text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#C6A3C0]">
        {label}
      </span>
    </div>
  );
}

export function GameOverScreen({
  result,
  best,
  onRetry,
  onMenu,
}: {
  result: GameResult;
  best: number;
  onRetry: () => void;
  onMenu: () => void;
}) {
  return (
    <div className="absolute inset-0 z-30 grid place-items-center bg-[#7A5C85]/25 p-4 backdrop-blur-[3px]">
      {result.record && (
        <>
          <Burst seed={11} count={18} spread={220} />
          <Burst seed={77} count={18} spread={260} />
        </>
      )}

      <motion.div
        initial={{ scale: 0.7, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="w-full max-w-[410px] rounded-[32px] border border-white/80 bg-white/85 px-6 py-5 text-center shadow-[0_30px_60px_-24px_rgba(150,80,120,0.55)] backdrop-blur-md"
      >
        <motion.div
          animate={
            result.record ? { y: [0, -10, 0], rotate: [0, -3, 0] } : { y: 0 }
          }
          transition={{ repeat: result.record ? Infinity : 0, duration: 1.6 }}
          className="mx-auto -mt-14 w-[110px]"
        >
          <Mouse
            mood={result.record ? "wow" : "happy"}
            className="w-full drop-shadow-[0_12px_18px_rgba(210,130,165,0.4)]"
          />
        </motion.div>

        {result.record && (
          <motion.span
            initial={{ scale: 0, rotate: -8 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 340, damping: 12 }}
            className="font-kawaii mx-auto mt-1 inline-block rounded-full bg-gradient-to-r from-[#FFC24B] to-[#FF8FAB] px-4 py-1 text-[11px] font-extrabold tracking-[0.22em] text-white shadow-md"
          >
            ¡NUEVO RÉCORD!
          </motion.span>
        )}

        <h2 className="font-kawaii mt-1 text-2xl font-extrabold text-[#7A5C85]">
          {result.record ? "¡Eres leyenda pastelera!" : "¡Hornada terminada!"}
        </h2>
        <p className="font-kawaii text-[11.5px] font-bold text-[#A581B0]">
          {result.record
            ? "ねずみもびっくり — la clientela no para de pedir."
            : "Buen trabajo, la próxima hornada será aún más dulce."}
        </p>

        <div className="mt-3 flex gap-2">
          <Stat icon={Star} value={result.score} label="Puntos" color="text-[#FFC24B]" />
          <Stat icon={CakeSlice} value={result.cakes} label="Pasteles" color="text-[#FF8FAB]" />
          <Stat icon={Trophy} value={best} label="Récord" color="text-[#E8A33D]" />
        </div>

        <div className="mt-4 flex items-center justify-center gap-2.5">
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="font-kawaii flex items-center gap-2 rounded-full bg-gradient-to-b from-[#FF9FBC] to-[#FF6E9C] px-7 py-2.5 text-base font-extrabold tracking-wider text-white shadow-[0_12px_24px_-10px_rgba(232,101,143,0.9)]"
          >
            <RotateCcw size={18} strokeWidth={2.6} />
            OTRA VEZ
          </motion.button>
          <motion.button
            onClick={onMenu}
            whileTap={{ scale: 0.92 }}
            className="font-kawaii flex items-center gap-2 rounded-full border-2 border-[#F3C9DA] bg-white/80 px-5 py-2.5 text-base font-extrabold tracking-wider text-[#C08FB0]"
          >
            <Home size={17} strokeWidth={2.6} />
            Menú
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
