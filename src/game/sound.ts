// ─────────────────────────────────────────────────────────────
//  Ratón · Mini sintetizador WebAudio — soniditos kawaii
//  Sin archivos externos: todo se genera en el navegador.
// ─────────────────────────────────────────────────────────────

interface ToneOptions {
  f0: number;
  f1?: number;
  type?: OscillatorType;
  gain?: number;
  dur?: number;
  delay?: number;
}

class SoundKit {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  muted = false;

  /** Debe llamarse tras un gesto del usuario (autoplay policies). */
  unlock(): void {
    this.ensure();
  }

  setMuted(m: boolean): void {
    this.muted = m;
  }

  private ensure(): boolean {
    if (typeof window === "undefined") return false;
    if (!this.ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return false;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return true;
  }

  private tone({ f0, f1, type = "sine", gain = 0.4, dur = 0.12, delay = 0 }: ToneOptions): void {
    if (this.muted || !this.ensure() || !this.ctx || !this.master) return;
    const t0 = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(1, f0), t0);
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1 ?? f0), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.linearRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  // ── Efectos del juego ──────────────────────────────────────

  click(): void {
    this.tone({ f0: 980, f1: 900, type: "triangle", gain: 0.14, dur: 0.05 });
  }

  /** Capa de bizcocho al caer: ¡plof! */
  place(): void {
    this.tone({ f0: 360, f1: 150, type: "sine", gain: 0.5, dur: 0.11 });
    this.tone({ f0: 720, f1: 500, type: "triangle", gain: 0.1, dur: 0.05 });
  }

  cream(): void {
    this.tone({ f0: 540, f1: 330, type: "sine", gain: 0.28, dur: 0.14 });
  }

  glaze(): void {
    this.tone({ f0: 760, f1: 290, type: "triangle", gain: 0.16, dur: 0.26 });
    this.tone({ f0: 380, f1: 190, type: "sine", gain: 0.2, dur: 0.2, delay: 0.05 });
  }

  topping(): void {
    this.tone({ f0: 880, f1: 1340, type: "triangle", gain: 0.22, dur: 0.08 });
  }

  undo(): void {
    this.tone({ f0: 500, f1: 260, type: "sine", gain: 0.2, dur: 0.1 });
  }

  trash(): void {
    this.tone({ f0: 220, f1: 90, type: "sawtooth", gain: 0.1, dur: 0.14 });
  }

  /** Pedido perfecto: arpegio ascendente, más agudo con combo alto. */
  success(combo: number): void {
    const base = [523.25, 659.25, 783.99];
    base.forEach((f, i) =>
      this.tone({ f0: f, type: "triangle", gain: 0.24, dur: 0.12, delay: i * 0.07 })
    );
    if (combo >= 2) {
      this.tone({ f0: 1046.5, type: "triangle", gain: 0.22, dur: 0.16, delay: 0.21 });
    }
    if (combo >= 4) {
      this.tone({ f0: 1318.5, type: "sine", gain: 0.18, dur: 0.2, delay: 0.28 });
    }
  }

  fail(): void {
    this.tone({ f0: 300, type: "triangle", gain: 0.16, dur: 0.12 });
    this.tone({ f0: 240, type: "triangle", gain: 0.16, dur: 0.16, delay: 0.1 });
  }

  tick(): void {
    this.tone({ f0: 1750, type: "square", gain: 0.05, dur: 0.035 });
  }

  fanfare(): void {
    const seq = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
    seq.forEach((f, i) =>
      this.tone({ f0: f, type: "triangle", gain: 0.2, dur: 0.14, delay: i * 0.09 })
    );
  }
}

export const sound = new SoundKit();
