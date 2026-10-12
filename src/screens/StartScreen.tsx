// ─────────────────────────────────────────────────────────────
//  Ratón · Pantalla de inicio
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { ConciergeBell, Hand, Play, Trophy } from "lucide-react";
import { Mouse } from "../components/Mouse";

const TITLE = "RATÓN";

export function StartScreen({
  best,
  onPlay,
}: {
  best: number;
  onPlay: () => void;
}) {
  return (
    <div className="relative z-10 flex h-full items-center justify-center gap-4 px-4 portrait:flex-col portrait:gap-2 portrait:px-6 sm:gap-10 sm:px-10">
      {/* Mascota flotante */}
      <motion.div
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 18 }}
      >
        <motion.div
          animate={{ y: [0, -12, 0], rotate: [0, -1.5, 0] }}
          transition={{ repeat: Infinity, duration: 3.4, ease: "easeInOut" }}
          className="w-[clamp(140px,46vh,250px)] portrait:w-[clamp(104px,25vh,168px)]"
        >
          <Mouse
            mood="happy"
            className="w-full drop-shadow-[0_18px_24px_rgba(210,130,165,0.35)]"
          />
        </motion.div>
      </motion.div>

      {/* Presentación */}
      <div className="flex max-w-[440px] flex-col items-center text-center">
        <motion.span
          initial={{ y: -14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="font-kawaii rounded-full border border-white/80 bg-white/75 px-3 py-1 text-[10px] font-extrabold tracking-[0.28em] text-[#C08FB0] shadow-sm"
        >
          ねずみのケーキやさん
        </motion.span>

        <h1
          className="font-kawaii -my-1 flex text-[clamp(46px,13vh,84px)] font-extrabold tracking-[0.06em] text-[#7A5C85] portrait:text-[clamp(38px,12vw,66px)]"
          style={{ textShadow: "0 3px 0 #FFFFFF, 0 10px 22px rgba(232,101,143,0.35)" }}
          aria-label="Ratón"
        >
          {TITLE.split("").map((ch, i) => (
            <motion.span
              key={i}
              initial={{ y: -34, opacity: 0, rotate: i % 2 ? 9 : -9 }}
              animate={{ y: 0, opacity: 1, rotate: i % 2 ? 2.5 : -2.5 }}
              transition={{ delay: 0.16 + i * 0.06, type: "spring", stiffness: 300, damping: 14 }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-kawaii mt-1 max-w-[340px] text-[13px] font-bold leading-snug text-[#A581B0]"
        >
          La pastelería más tierna: hornea, glasea y decora tantos pasteles como
          puedas antes de que suene la campana.
        </motion.p>

        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, type: "spring", stiffness: 300, damping: 16 }}
          className="mt-3 flex items-center gap-3"
        >
          <motion.button
            onClick={onPlay}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            className="font-kawaii flex items-center gap-2 rounded-full bg-gradient-to-b from-[#FF9FBC] to-[#FF6E9C] px-9 py-3 text-xl font-extrabold tracking-widest text-white shadow-[0_14px_28px_-10px_rgba(232,101,143,0.9)]"
          >
            <Play size={22} fill="currentColor" />
            ¡A HORNEAR!
          </motion.button>
          <span className="font-kawaii flex items-center gap-1.5 rounded-full border border-[#FFD98A] bg-[#FFF6E3] px-3.5 py-2 text-sm font-extrabold text-[#E8930C] shadow-sm">
            <Trophy size={16} strokeWidth={2.5} />
            {best}
          </span>
        </motion.div>

        {/* Mini tutorial */}
        <motion.div
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.75 }}
          className="mt-4 grid grid-cols-3 gap-2 portrait:mt-3 portrait:gap-1.5"
        >
          {[
            { icon: Hand, text: "Arrastra ingredientes al stand" },
            { icon: ConciergeBell, text: "Sírvelo idéntico al pedido" },
            { icon: Trophy, text: "Encadena combos y récords" },
          ].map(({ icon: Icon, text }) => (
            <div
              key={text}
              className="flex flex-col items-center gap-1 rounded-2xl border border-white/80 bg-white/65 px-2 py-2 shadow-sm backdrop-blur-sm"
            >
              <Icon size={17} className="text-[#E8658F]" strokeWidth={2.5} />
              <span className="font-kawaii text-[9.5px] font-bold leading-tight text-[#9A7BA2]">
                {text}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
