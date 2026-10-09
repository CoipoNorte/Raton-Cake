// ─────────────────────────────────────────────────────────────
//  Ratón · Mascota "Ratón" — ratoncita repostera kawaii (SVG)
// ─────────────────────────────────────────────────────────────

export type MouseMood = "idle" | "happy" | "sad" | "wow";

const FUR = "#E9E2EE";
const FUR_DARK = "#D5CAE0";
const EAR_IN = "#FFC9DA";
const APRON = "#FFB7CC";
const APRON_DARK = "#F79FC0";

export function Mouse({
  mood = "idle",
  body = true,
  className,
}: {
  mood?: MouseMood;
  body?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 220 240"
      className={className}
      role="img"
      aria-label="Ratón repostera"
      style={{ display: "block" }}
    >
      {/* Cuerpo con delantal */}
      {body && (
        <g>
          <ellipse cx="62" cy="196" rx="14" ry="26" fill={FUR} transform="rotate(18 62 196)" />
          <ellipse cx="158" cy="196" rx="14" ry="26" fill={FUR} transform="rotate(-18 158 196)" />
          <ellipse cx="110" cy="198" rx="50" ry="52" fill={FUR} />
          <path
            d="M72,176 Q110,160 148,176 L148,230 Q110,250 72,230 Z"
            fill={APRON}
            stroke={APRON_DARK}
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path d="M86,160 L94,180 M134,160 L126,180" stroke={APRON_DARK} strokeWidth="6" strokeLinecap="round" />
          <path
            d="M110,210 C100,203 102,193 110,197 C118,193 120,203 110,210 Z"
            fill="#FFF0F5"
          />
          <ellipse cx="86" cy="246" rx="16" ry="7" fill={FUR_DARK} />
          <ellipse cx="134" cy="246" rx="16" ry="7" fill={FUR_DARK} />
        </g>
      )}

      {/* Orejas */}
      <circle cx="62" cy="52" r="30" fill={FUR} stroke={FUR_DARK} strokeWidth="3" />
      <circle cx="62" cy="52" r="18" fill={EAR_IN} />
      <circle cx="158" cy="52" r="30" fill={FUR} stroke={FUR_DARK} strokeWidth="3" />
      <circle cx="158" cy="52" r="18" fill={EAR_IN} />

      {/* Gorro de chef */}
      <g>
        <circle cx="84" cy="26" r="17" fill="#FFFFFF" />
        <circle cx="110" cy="18" r="19" fill="#FFFFFF" />
        <circle cx="136" cy="26" r="17" fill="#FFFFFF" />
        <rect x="72" y="30" width="76" height="18" rx="9" fill="#FFFFFF" stroke="#EEE4F0" strokeWidth="2" />
        <path d="M104,39 C101,37 101.5,34 104,35.2 C106.5,34 107,37 104,39 Z" fill="#FF8FB5" transform="translate(6 0)" />
      </g>

      {/* Cabeza */}
      <circle cx="110" cy="102" r="58" fill={FUR} stroke={FUR_DARK} strokeWidth="3" />

      {/* Bigotes */}
      <g stroke="#C7BCD4" strokeWidth="2.4" strokeLinecap="round">
        <line x1="42" y1="104" x2="68" y2="108" />
        <line x1="43" y1="118" x2="68" y2="114" />
        <line x1="178" y1="104" x2="152" y2="108" />
        <line x1="177" y1="118" x2="152" y2="114" />
      </g>

      {/* Rubor */}
      <ellipse cx="72" cy="116" rx="9" ry="5" fill="#FFACC6" opacity="0.85" />
      <ellipse cx="148" cy="116" rx="9" ry="5" fill="#FFACC6" opacity="0.85" />

      {/* Ojos según humor */}
      {mood === "idle" && (
        <g className="mouse-blink" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <circle cx="88" cy="98" r="5.5" fill="#4A3D52" />
          <circle cx="132" cy="98" r="5.5" fill="#4A3D52" />
          <circle cx="90" cy="96" r="1.8" fill="#FFFFFF" />
          <circle cx="134" cy="96" r="1.8" fill="#FFFFFF" />
        </g>
      )}
      {mood === "happy" && (
        <g fill="none" stroke="#4A3D52" strokeWidth="4" strokeLinecap="round">
          <path d="M80,100 Q88,91 96,100" />
          <path d="M124,100 Q132,91 140,100" />
        </g>
      )}
      {mood === "sad" && (
        <g>
          <path d="M78,86 L96,91 M142,86 L124,91" stroke="#4A3D52" strokeWidth="3.6" strokeLinecap="round" />
          <circle cx="88" cy="100" r="5" fill="#4A3D52" />
          <circle cx="132" cy="100" r="5" fill="#4A3D52" />
          <circle cx="89.5" cy="98" r="1.6" fill="#FFFFFF" />
          <circle cx="133.5" cy="98" r="1.6" fill="#FFFFFF" />
        </g>
      )}
      {mood === "wow" && (
        <g>
          <circle cx="88" cy="98" r="7.5" fill="#FFFFFF" stroke="#4A3D52" strokeWidth="3" />
          <circle cx="132" cy="98" r="7.5" fill="#FFFFFF" stroke="#4A3D52" strokeWidth="3" />
          <circle cx="88" cy="98" r="3" fill="#4A3D52" />
          <circle cx="132" cy="98" r="3" fill="#4A3D52" />
        </g>
      )}

      {/* Nariz y boca */}
      <path d="M110,106 C106,106 104.5,109 107,112 C108.5,113.6 111.5,113.6 113,112 C115.5,109 114,106 110,106 Z" fill="#FF8FB5" />
      {mood === "idle" && (
        <path d="M101,117 Q110,124 119,117" fill="none" stroke="#4A3D52" strokeWidth="3" strokeLinecap="round" />
      )}
      {(mood === "happy" || mood === "wow") && (
        <g>
          <path d="M98,115 Q110,135 122,115 Q110,121 98,115 Z" fill="#8A4B5E" stroke="#4A3D52" strokeWidth="2.4" strokeLinejoin="round" />
          <ellipse cx="110" cy="121" rx="5.5" ry="3.4" fill="#FF9FB5" />
        </g>
      )}
      {mood === "sad" && (
        <path d="M101,121 Q105.5,115 110,121 Q114.5,127 119,121" fill="none" stroke="#4A3D52" strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}
