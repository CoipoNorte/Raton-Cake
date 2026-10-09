// ─────────────────────────────────────────────────────────────
//  Ratón · Persistencia local (récord histórico + ajustes)
//  Usa localStorage con protección ante modos privados.
//  La API está pensada para poder migrar a IndexedDB sin
//  cambiar el resto del juego.
// ─────────────────────────────────────────────────────────────

const KEY_BEST = "raton.best.v1";
const KEY_MUTED = "raton.muted.v1";
const KEY_PLAYS = "raton.plays.v1";

function safeGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* almacenamiento no disponible: el juego sigue funcionando */
  }
}

export function loadBest(): number {
  const raw = safeGet(KEY_BEST);
  const n = raw === null ? 0 : Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function saveBest(score: number): void {
  safeSet(KEY_BEST, String(Math.max(0, Math.floor(score))));
}

export function loadMuted(): boolean {
  return safeGet(KEY_MUTED) === "1";
}

export function saveMuted(muted: boolean): void {
  safeSet(KEY_MUTED, muted ? "1" : "0");
}

/** Partidas jugadas (se usa para mostrar el tutorial solo al inicio). */
export function loadPlays(): number {
  const raw = safeGet(KEY_PLAYS);
  const n = raw === null ? 0 : Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 0;
}

export function bumpPlays(): void {
  safeSet(KEY_PLAYS, String(loadPlays() + 1));
}
