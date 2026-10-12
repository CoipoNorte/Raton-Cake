// ─────────────────────────────────────────────────────────────
//  Ratón · Hook de orientación: true si el viewport es vertical
//  Permite reorganizar la mesa (móvil vertical / tablet / PC)
// ─────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";

export function useIsPortrait(): boolean {
  const [portrait, setPortrait] = useState<boolean>(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(orientation: portrait)").matches
      : false
  );

  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const onChange = (e: MediaQueryListEvent) => setPortrait(e.matches);
    setPortrait(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return portrait;
}
