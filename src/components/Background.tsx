// ─────────────────────────────────────────────────────────────
//  Ratón · Fondo pastel kawaii con chispas flotantes
// ─────────────────────────────────────────────────────────────

const SPRINKLES: Array<{
  left: string;
  top: string;
  color: string;
  rot: number;
  h: number;
  dur: number;
  delay: number;
  round: boolean;
}> = [
  { left: "6%", top: "18%", color: "#FFB7CC", rot: 24, h: 22, dur: 7, delay: 0, round: false },
  { left: "12%", top: "66%", color: "#A8DCF0", rot: -32, h: 18, dur: 8.5, delay: 0.6, round: false },
  { left: "20%", top: "38%", color: "#C9A7F5", rot: 65, h: 16, dur: 6.4, delay: 1.2, round: true },
  { left: "30%", top: "80%", color: "#FFD98A", rot: -15, h: 22, dur: 9, delay: 0.3, round: false },
  { left: "38%", top: "12%", color: "#9BE39B", rot: 48, h: 15, dur: 7.4, delay: 1.8, round: false },
  { left: "52%", top: "85%", color: "#FFB7CC", rot: 8, h: 20, dur: 6.8, delay: 0.9, round: false },
  { left: "63%", top: "14%", color: "#FFD98A", rot: -54, h: 17, dur: 8.2, delay: 0.2, round: true },
  { left: "72%", top: "72%", color: "#C9A7F5", rot: 33, h: 21, dur: 7.7, delay: 1.5, round: false },
  { left: "82%", top: "30%", color: "#9BE39B", rot: -22, h: 16, dur: 6.2, delay: 0.4, round: false },
  { left: "90%", top: "58%", color: "#A8DCF0", rot: 72, h: 19, dur: 9.4, delay: 1.1, round: false },
  { left: "46%", top: "30%", color: "#FF8FAB", rot: -70, h: 14, dur: 8.8, delay: 2.1, round: true },
  { left: "57%", top: "55%", color: "#7FD8F7", rot: 18, h: 15, dur: 7.1, delay: 2.6, round: false },
];

const BLOBS: Array<{ left: string; top: string; size: number; color: string; dur: number }> = [
  { left: "-8%", top: "-14%", size: 380, color: "#FFE3EE", dur: 11 },
  { left: "72%", top: "-18%", size: 340, color: "#E3F2FF", dur: 13 },
  { left: "-10%", top: "58%", size: 360, color: "#FFF3DA", dur: 12 },
  { left: "80%", top: "62%", size: 380, color: "#F0E6FF", dur: 14 },
];

export function Background() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Degradado base */}
      <div className="absolute inset-0 bg-[linear-gradient(165deg,#FFF8EF_0%,#FFEDF3_52%,#EAF6FF_100%)]" />
      {/* Lunares sutiles */}
      <div className="bg-dots absolute inset-0 opacity-60" />
      {/* Manchas suaves */}
      {BLOBS.map((b, i) => (
        <div
          key={i}
          className="animate-floaty absolute rounded-full blur-3xl"
          style={{
            left: b.left,
            top: b.top,
            width: b.size,
            height: b.size,
            background: b.color,
            opacity: 0.75,
            animationDuration: `${b.dur}s`,
          }}
        />
      ))}
      {/* Chispas a la deriva */}
      {SPRINKLES.map((s, i) => (
        <div
          key={i}
          className="animate-floaty absolute"
          style={{
            left: s.left,
            top: s.top,
            width: s.round ? 12 : 6,
            height: s.round ? 12 : s.h,
            background: s.color,
            opacity: 0.5,
            borderRadius: 999,
            ["--rot" as string]: `${s.rot}deg`,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
