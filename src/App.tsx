// ─────────────────────────────────────────────────────────────
//  Ratón · Pastelería Kawaii — App principal
//  Hornea pasteles contra el reloj al estilo kawaii.
// ─────────────────────────────────────────────────────────────

import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import { Background } from "./components/Background";
import { GameScreen, type GameResult } from "./screens/GameScreen";
import { GameOverScreen } from "./screens/GameOverScreen";
import { StartScreen } from "./screens/StartScreen";
import { sound } from "./game/sound";
import { loadBest, loadMuted, saveMuted } from "./game/storage";

type Screen = "start" | "play" | "over";

export default function App() {
  const [screen, setScreen] = useState<Screen>("start");
  const [gameKey, setGameKey] = useState(0);
  const [best, setBest] = useState<number>(() => loadBest());
  const [result, setResult] = useState<GameResult | null>(null);
  const [muted, setMuted] = useState<boolean>(() => {
    const m = loadMuted();
    sound.setMuted(m);
    return m;
  });

  const toggleMute = useCallback(() => {
    setMuted((m) => {
      sound.setMuted(!m);
      saveMuted(!m);
      if (m) sound.click();
      return !m;
    });
  }, []);

  const startGame = useCallback(() => {
    sound.unlock();
    sound.click();
    setGameKey((k) => k + 1);
    setScreen("play");
  }, []);

  const finishGame = useCallback(
    (r: GameResult) => {
      setResult(r);
      setBest((b) => Math.max(b, r.score));
      setScreen("over");
    },
    []
  );

  const goMenu = useCallback(() => {
    sound.click();
    setScreen("start");
  }, []);

  return (
    <div
      className="font-kawaii fixed inset-0 h-dvh w-full touch-manipulation overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      <Background />

      <AnimatePresence mode="wait">
        {screen === "start" && (
          <motion.div
            key="start"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            <StartScreen best={best} onPlay={startGame} />
          </motion.div>
        )}

        {screen === "play" && (
          <motion.div
            key={`play-${gameKey}`}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.25 }}
          >
            <GameScreen
              best={best}
              muted={muted}
              onToggleMute={toggleMute}
              onFinish={finishGame}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {screen === "over" && result && (
        <>
          {/* El menú queda difuminado detrás del marcador */}
          <div className="absolute inset-0 opacity-90">
            <StartScreen best={best} onPlay={startGame} />
          </div>
          <GameOverScreen
            result={result}
            best={best}
            onRetry={startGame}
            onMenu={goMenu}
          />
        </>
      )}

      {/* Silencio global fuera de la partida (en juego vive en el HUD) */}
      {screen !== "play" && (
        <button
          onClick={toggleMute}
          aria-label={muted ? "Activar sonido" : "Silenciar"}
          className="absolute right-3 top-3 z-40 grid h-10 w-10 place-items-center rounded-full border border-white/80 bg-white/75 text-[#B48BAE] shadow-md backdrop-blur-sm transition-transform active:scale-90"
        >
          {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      )}
    </div>
  );
}
