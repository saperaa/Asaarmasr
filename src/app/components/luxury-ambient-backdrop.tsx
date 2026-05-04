import { useId } from "react";
import { useLuxuryParallax } from "../hooks/use-luxury-parallax";

/**
 * Site-wide ambient: particles, drifting gold light, Egyptian lattice, parallax on scroll.
 * Fixed behind content; respects prefers-reduced-motion via CSS.
 */
const PARTICLE_COUNT = 36;

const BASE = import.meta.env.BASE_URL.endsWith("/") ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`;
const PHARAONIC_TILE_URL = `${BASE}pharaonic-pattern.png`;

export function LuxuryAmbientBackdrop() {
  const pid = useId().replace(/:/g, "");
  const patternId = `luxury-geo-lattice-${pid}`;
  const parallaxY = useLuxuryParallax(0.028);

  return (
    <div
      className="luxury-ambient-root pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ transform: `translate3d(0, ${-parallaxY}px, 0)` }}
      aria-hidden
    >
      <svg
        className="luxury-lattice-ambient absolute inset-0 h-full w-full text-[#D4AF37]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <pattern id={patternId} width="56" height="56" patternUnits="userSpaceOnUse">
            <path
              d="M28 0L56 28L28 56L0 28ZM28 10L46 28L28 46L10 28Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.35"
              opacity="0.9"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} className="opacity-[0.038]" />
      </svg>

      {/* Tiled Pharaonic silhouettes — low opacity + slow drift; screen drops tile black to keep depth */}
      <div
        className="luxury-pharaonic-tile absolute inset-0"
        style={{
          backgroundImage: `url(${PHARAONIC_TILE_URL})`,
          backgroundRepeat: "repeat",
          mixBlendMode: "screen",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,rgba(212,175,55,0.07)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_100%,rgba(255,215,0,0.04)_0%,transparent_45%)]" />

      <div className="luxury-gradient-drift-a absolute -left-[20%] top-[-30%] h-[85vh] w-[70vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.12)_0%,transparent_62%)] blur-3xl" />
      <div className="luxury-gradient-drift-b absolute -right-[15%] bottom-[-25%] h-[75vh] w-[65vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,215,0,0.08)_0%,transparent_60%)] blur-3xl" />
      <div className="luxury-gradient-drift-c absolute left-[30%] top-[40%] h-[50vh] w-[40vw] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.05)_0%,transparent_55%)] blur-3xl opacity-90" />

      <div
        className="luxury-light-ray luxury-light-ray-1 absolute left-[-10%] top-0 h-[130vh] w-[55vw]"
        style={{
          background:
            "linear-gradient(102deg, transparent 42%, rgba(212, 175, 55, 0.085) 50%, transparent 58%)",
        }}
      />
      <div
        className="luxury-light-ray luxury-light-ray-2 absolute right-[-5%] top-[-10%] h-[120vh] w-[45vw]"
        style={{
          background:
            "linear-gradient(72deg, transparent 40%, rgba(255, 215, 0, 0.06) 50%, transparent 60%)",
        }}
      />
      <div
        className="luxury-light-ray luxury-light-ray-3 absolute left-[20%] top-[15%] h-[90vh] w-[35vw] opacity-70"
        style={{
          background:
            "linear-gradient(118deg, transparent 48%, rgba(212, 175, 55, 0.05) 52%, transparent 56%)",
        }}
      />

      <div className="absolute inset-0">
        {Array.from({ length: PARTICLE_COUNT }).map((_, i) => {
          const s = 1.2 + (i % 5) * 0.45;
          return (
            <span
              key={i}
              className="luxury-particle pointer-events-none absolute rounded-full bg-[#D4AF37]"
              style={{
                width: s,
                height: s,
                left: `${((i * 41) % 97) + 1}%`,
                top: `${((i * 67) % 93) + 3}%`,
                opacity: 0.07 + (i % 6) * 0.015,
                animationDelay: `${-(i * 0.85)}s`,
                animationDuration: `${22 + (i % 11)}s`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
