// ─────────────────────────────────────────────────────────────
//  Ratón · Aviso de orientación: el juego se juega en horizontal
// ─────────────────────────────────────────────────────────────

import { motion } from "framer-motion";
import { Smartphone } from "lucide-react";
import { Mouse } from "../components/Mouse";

export function RotateOverlay() {
  return (
    <div className="fixed inset-0 z-[90] hidden flex-col items-center justify-center gap-4 bg-[#FFF3F7] px-8 text-center portrait:flex">
      <Mouse mood="idle" body={false} className="w-24" />
      <motion.div
        animate={{ rotate: [0, 0, 90, 90, 0] }}
        transition={{ repeat: Infinity, duration: 2.6, times: [0, 0.25, 0.55, 0.8, 1], ease: "easeInOut" }}
        className="grid h-20 w-20 place-items-center rounded-3xl border border-white bg-white/80 shadow-lg"
      >
        <Smartphone size={38} className="text-[#E8658F]" strokeWidth={2.2} />
      </motion.div>
      <div>
        <p className="font-kawaii text-xl font-extrabold text-[#7A5C85]">
          ¡Gira tu móvil!
        </p>
        <p className="font-kawaii mt-1 text-sm font-bold text-[#A581B0]">
          Ratón se hornea mejor en horizontal
        </p>
      </div>
    </div>
  );
}
