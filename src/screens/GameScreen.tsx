// ─────────────────────────────────────────────────────────────
//  Ratón · Pantalla de juego (horizontal, táctil, adictivo)
// ─────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { ConciergeBell, Hand, Trash2, Undo2 } from "lucide-react";
import { CakeSVG } from "../components/CakeSVG";
import { Burst } from "../components/Confetti";
import { IngredientIcon } from "../components/glyphs";
import { HUD } from "../components/HUD";
import { Mouse, type MouseMood } from "../components/Mouse";
import { OrderTicket } from "../components/OrderTicket";
import { Tray } from "../components/Tray";
import { generateOrder, matchesOrder, priceFor } from "../game/logic";
import { sound } from "../game/sound";
import { bumpPlays, saveBest } from "../game/storage";
import type {
  CakeSpec,
  Category,
  CreamId,
  Flavor,
  GlazeId,
  Order,
  ToppingId,
} from "../game/types";
import {
  EMPTY_CAKE,
  GAME_SECONDS,
  MAX_LAYERS,
  MAX_TOPPINGS,
  TIME_BONUS,
  TIME_CAP,
} from "../game/types";

export interface GameResult {
  score: number;
  cakes: number;
  record: boolean;
}

interface DragState {
  cat: Category;
  id: string;
  over: boolean;
}

interface Toast {
  id: number;
  text: string;
  tone: "score" | "time" | "warn";
}

const TOAST_STYLE: Record<Toast["tone"], string> = {
  score: "border-[#FFD98A] bg-[#FFF3DA] text-[#E8930C]",
  time: "border-[#9BE3C4] bg-[#E4FBF1] text-[#1F9E77]",
  warn: "border-[#FFB7CC] bg-[#FFE5EF] text-[#E8658F]",
};

/** ¿Qué pestaña conviene mostrar después de cada acción? */
function suggestTab(b: CakeSpec, o: Order): Category {
  if (b.layers.length === 0) return "flavors";
  if (b.layers.length < o.layers.length) {
    if (o.cream && !b.cream) return "creams";
    return "flavors";
  }
  if (!b.glaze) return "glazes";
  return "toppings";
}

export function GameScreen({
  best,
  muted,
  onToggleMute,
  onFinish,
}: {
  best: number;
  muted: boolean;
  onToggleMute: () => void;
  onFinish: (r: GameResult) => void;
}) {
  const [order, setOrder] = useState<Order>(() => generateOrder(0));
  const orderIdx = useRef(0);
  const [build, setBuild] = useState<CakeSpec>(EMPTY_CAKE);
  const [history, setHistory] = useState<CakeSpec[]>([]);
  const [score, setScore] = useState(0);
  const [cakes, setCakes] = useState(0);
  const [combo, setCombo] = useState(1);
  const [leftMs, setLeftMs] = useState(GAME_SECONDS * 1000);
  const [drag, setDrag] = useState<DragState | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [bursts, setBursts] = useState<number[]>([]);
  const [fly, setFly] = useState<{ spec: CakeSpec; id: number } | null>(null);
  const [mood, setMood] = useState<MouseMood>("idle");
  const [tab, setTab] = useState<Category>("flavors");
  const [hint, setHint] = useState(true);

  const scoreRef = useRef(0);
  const cakesRef = useRef(0);
  const comboRef = useRef(1);
  const endAt = useRef(0);
  const finished = useRef(false);
  const toastSeq = useRef(0);
  const burstSeq = useRef(0);
  const flySeq = useRef(0);
  const moodTimer = useRef<number | undefined>(undefined);
  const standRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const ghostPos = useRef({ x: 0, y: 0 });
  const shake = useAnimationControls();

  // ── Fin de partida ─────────────────────────────────────────
  const finish = useCallback(() => {
    bumpPlays();
    const finalScore = scoreRef.current;
    const isRecord = finalScore > best && finalScore > 0;
    if (isRecord) {
      saveBest(finalScore);
      sound.fanfare();
    } else {
      sound.success(1);
    }
    window.setTimeout(() => {
      onFinish({ score: finalScore, cakes: cakesRef.current, record: isRecord });
    }, 650);
  }, [best, onFinish]);

  // ── Cronómetro ─────────────────────────────────────────────
  useEffect(() => {
    endAt.current = Date.now() + GAME_SECONDS * 1000;
    let lastTick = Infinity;
    const iv = window.setInterval(() => {
      if (finished.current) return;
      const r = endAt.current - Date.now();
      setLeftMs(r);
      const s = Math.ceil(r / 1000);
      if (s <= 5 && s > 0 && s < lastTick) {
        lastTick = s;
        sound.tick();
      }
      if (r <= 0) {
        finished.current = true;
        window.clearInterval(iv);
        setLeftMs(0);
        finish();
      }
    }, 100);
    return () => window.clearInterval(iv);
  }, [finish]);

  // ── Helpers ────────────────────────────────────────────────
  const addToast = (text: string, tone: Toast["tone"]) => {
    const id = ++toastSeq.current;
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 1150);
  };

  const setMoodFor = (m: MouseMood, ms: number) => {
    window.clearTimeout(moodTimer.current);
    setMood(m);
    moodTimer.current = window.setTimeout(() => setMood("idle"), ms);
  };
  useEffect(() => () => window.clearTimeout(moodTimer.current), []);

  const applyGhost = (x: number, y: number) => {
    ghostPos.current = { x, y };
    if (ghostRef.current) {
      ghostRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -62%)`;
    }
  };
  useEffect(() => {
    if (drag) applyGhost(ghostPos.current.x, ghostPos.current.y);
  }, [drag]);

  const isOverStand = (x: number, y: number): boolean => {
    const el = standRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return (
      x >= r.left - 20 && x <= r.right + 20 && y >= r.top - 60 && y <= r.bottom + 8
    );
  };

  const commit = (next: CakeSpec) => {
    setHistory((h) => [...h.slice(-14), build]);
    setBuild(next);
    setTab(suggestTab(next, order));
  };

  const warn = (msg: string) => {
    addToast(msg, "warn");
    sound.undo();
  };

  // ── Arrastrar y soltar ─────────────────────────────────────
  const startDrag = (e: React.PointerEvent, cat: Category, id: string) => {
    if (finished.current) return;
    e.preventDefault();
    sound.click();
    setDrag({ cat, id, over: false });
    applyGhost(e.clientX, e.clientY);

    const move = (ev: PointerEvent) => {
      ev.preventDefault();
      applyGhost(ev.clientX, ev.clientY);
      const over = isOverStand(ev.clientX, ev.clientY);
      setDrag((d) => (d && d.over !== over ? { ...d, over } : d));
    };
    const up = (ev: PointerEvent) => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      const over = isOverStand(ev.clientX, ev.clientY);
      setDrag(null);
      if (over && !finished.current) drop(cat, id);
    };
    window.addEventListener("pointermove", move, { passive: false });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
  };

  const drop = (cat: Category, id: string) => {
    if (cat === "flavors") {
      if (build.layers.length >= MAX_LAYERS) return warn("¡Máximo 3 pisos, peque!");
      commit({ ...build, layers: [...build.layers, id as Flavor] });
      sound.place();
      setHint(false);
    } else if (cat === "creams") {
      if (build.layers.length === 0) return warn("¡Primero el bizcocho!");
      commit({ ...build, cream: id as CreamId });
      sound.cream();
    } else if (cat === "glazes") {
      if (build.layers.length === 0) return warn("¡Primero el bizcocho!");
      commit({ ...build, glaze: id as GlazeId });
      sound.glaze();
    } else {
      if (build.layers.length === 0) return warn("¡Primero el bizcocho!");
      if (build.toppings.length >= MAX_TOPPINGS)
        return warn("¡Ya está súper decorado!");
      commit({ ...build, toppings: [...build.toppings, id as ToppingId] });
      sound.topping();
    }
  };

  // ── Servir / deshacer / limpiar ────────────────────────────
  const canServe = build.layers.length > 0 && build.glaze !== null;

  const serve = () => {
    if (!canServe || finished.current) return;
    if (matchesOrder(order, build)) {
      const comboNow = comboRef.current;
      const pts = priceFor(order, comboNow);
      scoreRef.current += pts;
      setScore(scoreRef.current);
      cakesRef.current += 1;
      setCakes(cakesRef.current);
      endAt.current = Math.min(
        endAt.current + TIME_BONUS * 1000,
        Date.now() + TIME_CAP * 1000
      );
      sound.success(comboNow);
      addToast(`+${pts}`, "score");
      addToast(`+${TIME_BONUS}s`, "time");
      const bid = ++burstSeq.current;
      setBursts((b) => [...b, bid]);
      window.setTimeout(() => setBursts((b) => b.filter((x) => x !== bid)), 1100);
      setMoodFor("happy", 950);
      comboRef.current = Math.min(comboNow + 1, 7);
      setCombo(comboRef.current);
      setFly({ spec: build, id: ++flySeq.current });
      setBuild(EMPTY_CAKE);
      setHistory([]);
      setTab("flavors");
      orderIdx.current += 1;
      setOrder(generateOrder(orderIdx.current));
    } else {
      comboRef.current = 1;
      setCombo(1);
      sound.fail();
      setMoodFor("sad", 1100);
      void shake.start({
        x: [0, -13, 13, -9, 9, -4, 0],
        transition: { duration: 0.5 },
      });
      addToast("¡Ups! No coincide con el pedido", "warn");
    }
  };

  const undo = () => {
    if (history.length === 0) return;
    setBuild(history[history.length - 1]);
    setHistory((h) => h.slice(0, -1));
    sound.undo();
  };

  const clearCake = () => {
    if (build.layers.length === 0 && build.glaze === null) return;
    setHistory((h) => [...h.slice(-14), build]);
    setBuild(EMPTY_CAKE);
    setTab("flavors");
    sound.trash();
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="relative z-10 flex h-full min-h-0 flex-col overflow-hidden">
      <HUD
        best={best}
        cakes={cakes}
        combo={combo}
        leftMs={leftMs}
        muted={muted}
        onToggleMute={onToggleMute}
        score={score}
      />

      <div className="flex min-h-0 flex-1 gap-2 px-3 pb-2.5 pt-2">
        {/* Pedido */}
        <div className="w-[25%] min-w-[164px] max-w-[235px]">
          <OrderTicket order={order} />
        </div>

        {/* Zona de trabajo */}
        <section className="relative min-w-0 flex-1">
          <motion.div
            ref={standRef}
            animate={shake}
            className="absolute inset-x-0 bottom-[58px] top-0 flex items-end justify-center"
          >
            <div className="animate-breathe relative aspect-[340/272] h-full max-h-[330px]">
              <CakeSVG spec={build} animated className="h-full w-full" />
            </div>

            {/* Pastel volador al servir */}
            {fly && (
              <motion.div
                key={fly.id}
                className="pointer-events-none absolute bottom-0 left-1/2 aspect-[340/272] h-full max-h-[330px]"
                style={{ x: "-50%" }}
                initial={{ y: 0, opacity: 1, rotate: 0 }}
                animate={{ y: -300, opacity: 0, rotate: 9 }}
                transition={{ duration: 0.55, ease: "backIn" }}
                onAnimationComplete={() => setFly(null)}
              >
                <CakeSVG spec={fly.spec} className="h-full w-full" />
              </motion.div>
            )}

            {/* Anillo de destino al arrastrar */}
            {drag?.over && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                className="pointer-events-none absolute inset-x-6 bottom-0 top-1 grid place-items-end rounded-[36px] border-4 border-dashed border-[#FF8FAB] bg-[#FFE5EF]/30 pb-2"
              >
                <span className="font-kawaii rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-[#E8658F] shadow">
                  ¡Suelta aquí!
                </span>
              </motion.div>
            )}

            {/* Consejo inicial */}
            {hint && build.layers.length === 0 && !drag && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-white bg-white/90 px-3 py-1.5 shadow-md"
              >
                <motion.span
                  animate={{ x: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                >
                  <Hand size={14} className="text-[#E8658F]" />
                </motion.span>
                <span className="font-kawaii text-[11px] font-extrabold text-[#9A7BA2]">
                  ¡Arrastra un bizcocho hasta el stand!
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Ratita reaccionando */}
          <motion.div
            className="pointer-events-none absolute -bottom-1 left-1 z-10 w-[74px]"
            animate={
              mood === "happy"
                ? { y: [0, -16, 0], rotate: [0, -5, 0] }
                : mood === "sad"
                  ? { rotate: [0, -5, 5, -2, 0] }
                  : { y: 0 }
            }
            transition={{ duration: 0.6 }}
          >
            <Mouse mood={mood} className="w-full" />
          </motion.div>

          {/* Toasts flotantes */}
          <div className="pointer-events-none absolute left-1/2 top-1 z-30 flex -translate-x-1/2 flex-col items-center gap-1">
            <AnimatePresence>
              {toasts.map((t) => (
                <motion.div
                  key={t.id}
                  initial={{ y: 10, opacity: 0, scale: 0.7 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -16, opacity: 0, scale: 0.9 }}
                  transition={{ type: "spring", stiffness: 480, damping: 22 }}
                  className={`font-kawaii rounded-full border-2 px-3 py-1 text-sm font-extrabold shadow-md ${TOAST_STYLE[t.tone]}`}
                >
                  {t.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Confetti de éxito */}
          {bursts.map((id) => (
            <Burst key={id} seed={id * 991 + 7} />
          ))}

          {/* Controles */}
          <div className="absolute inset-x-0 bottom-0 flex h-[54px] items-center justify-center gap-2">
            <button
              onClick={undo}
              disabled={history.length === 0}
              aria-label="Deshacer"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/80 text-[#B48BAE] shadow-md transition-all enabled:hover:bg-white enabled:active:scale-90 disabled:opacity-40"
            >
              <Undo2 size={18} strokeWidth={2.5} />
            </button>

            <motion.button
              onClick={serve}
              disabled={!canServe}
              whileTap={canServe ? { scale: 0.9 } : undefined}
              className={`font-kawaii flex h-12 items-center gap-2 rounded-full px-7 text-lg font-extrabold tracking-wide shadow-[0_10px_22px_-8px_rgba(232,101,143,0.85)] transition-all ${
                canServe
                  ? "animate-pulse-soft bg-gradient-to-b from-[#FF9FBC] to-[#FF6E9C] text-white"
                  : "cursor-not-allowed bg-white/60 text-[#C6A3C0]"
              }`}
            >
              <ConciergeBell size={21} strokeWidth={2.4} />
              SERVIR
            </motion.button>

            <button
              onClick={clearCake}
              disabled={build.layers.length === 0 && build.glaze === null}
              aria-label="Limpiar pastel"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/80 bg-white/80 text-[#B48BAE] shadow-md transition-all enabled:hover:bg-white enabled:active:scale-90 disabled:opacity-40"
            >
              <Trash2 size={18} strokeWidth={2.5} />
            </button>
          </div>
        </section>

        {/* Bandeja */}
        <div className="w-[28%] min-w-[208px] max-w-[292px]">
          <Tray
            tab={tab}
            onTab={(t) => {
              setTab(t);
              sound.click();
            }}
            dragging={drag}
            onChipDown={startDrag}
          />
        </div>
      </div>

      {/* Fantasma del ingrediente arrastrado */}
      {drag && (
        <div ref={ghostRef} className="pointer-events-none fixed left-0 top-0 z-[70]">
          <motion.div
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1.15, rotate: [-7, 7, -7] }}
            transition={{
              scale: { type: "spring", stiffness: 420, damping: 15 },
              rotate: { repeat: Infinity, duration: 0.7, ease: "easeInOut" },
            }}
            className="rounded-2xl border-2 border-white bg-white/95 p-1.5 shadow-[0_14px_30px_-10px_rgba(190,90,130,0.6)]"
          >
            <IngredientIcon cat={drag.cat} id={drag.id} size={46} />
          </motion.div>
        </div>
      )}
    </div>
  );
}
