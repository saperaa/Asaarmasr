import { useId } from "react";
import { cn } from "./ui/utils";

type GlyphProps = {
  className?: string;
  size?: number;
  "aria-hidden"?: boolean | "true" | "false";
};

/** Minimal line-art Pharaonic symbols — apply `text-[#D4AF37]` (and optional drop-shadow) on a wrapper. */
export function AnkhGlyph({ className, size = 24, ...rest }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0 text-[#D4AF37]", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <path
        d="M12 3.25C9.4 3.25 7.35 5.15 7.35 7.5c0 2.2 1.95 4.05 4.65 4.05s4.65-1.85 4.65-4.05c0-2.35-2.05-4.25-4.65-4.25zM12 11.35V20.5M8.2 15.85h7.6"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Simplified Wedjat / Eye of Horus */
export function EyeOfHorusGlyph({ className, size = 24, ...rest }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0 text-[#D4AF37]", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <path
        d="M3.5 12s3.5-5.2 8.5-5.2 8.5 5.2 8.5 5.2-3.5 5.2-8.5 5.2S3.5 12 3.5 12Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="2.35" stroke="currentColor" strokeWidth="1.05" fill="none" />
      <path
        d="M12 9.1v5.8M9.8 12h4.4"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path
        d="M6.2 10.2c.8-.35.85 1.25 0 1.9M8.8 8.9c.55-.65 1.55.15 1.65 1.1"
        stroke="currentColor"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Stylized scarab silhouette */
export function ScarabGlyph({ className, size = 24, ...rest }: GlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={cn("shrink-0 text-[#D4AF37]", className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      {...rest}
    >
      <ellipse cx="12" cy="13.5" rx="5.8" ry="3.6" stroke="currentColor" strokeWidth="1.1" fill="none" />
      <path
        d="M12 9.9c2.1 0 3.8-2.6 5.5-3.5M12 9.9c-2.1 0-3.8-2.6-5.5-3.5"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      <path
        d="M7 12.3c-1.9-.2-3.2-1.1-3.8-2.4M17 12.3c1.9-.2 3.2-1.1 3.8-2.4"
        stroke="currentColor"
        strokeWidth="0.95"
        strokeLinecap="round"
      />
      <path d="M10.2 15.8h3.6" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

const GLYPHS = {
  ankh: AnkhGlyph,
  eye: EyeOfHorusGlyph,
  scarab: ScarabGlyph,
} as const;

/** Horizontal gold rule + winged sun disk (metallic gradient) — pairs with hero Arabic title */
export function WingedSunTitleDivider({ className }: { className?: string }) {
  const gid = useId().replace(/:/g, "");
  const gradId = `hero-wing-sun-${gid}`;

  return (
    <div
      className={cn(
        "flex w-full max-w-[min(520px,92vw)] items-stretch justify-center gap-0 px-2 select-none pointer-events-none",
        className
      )}
      aria-hidden
    >
      <div className="flex min-w-0 flex-1 items-center">
        <span className="luxury-hero-title-rule-cap size-[7px] shrink-0 rotate-45 rounded-[1px] border border-[#C9A227]/90 shadow-[0_0_10px_rgba(255,215,0,0.45)]" />
        <span className="luxury-hero-title-rule-line h-px min-w-[1.5rem] flex-1 bg-gradient-to-r from-[#B8962E] via-[#FFD700] to-[#D4AF37]/35" />
      </div>

      <svg
        className="mx-1.5 shrink-0 [filter:drop-shadow(0_2px_12px_rgba(255,215,0,0.42))]"
        width="56"
        height="26"
        viewBox="0 0 56 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradId} x1="28" y1="0" x2="28" y2="26" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFBEB" />
            <stop offset="0.28" stopColor="#FFD700" />
            <stop offset="0.62" stopColor="#B8962E" />
            <stop offset="1" stopColor="#4A3812" />
          </linearGradient>
        </defs>
        <path
          fill={`url(#${gradId})`}
          d="M28 20.5c-5 0-9.2-1.8-12.6-4.8-2.1-1.9-3.8-4.2-5.2-6.6 4.6.4 8.8 2 12 4.4 2.2 1.7 4 3.7 5.3 5.8l.25.4.25-.4c1.3-2.1 3.1-4.1 5.3-5.8 3.2-2.4 7.4-4 12-4.4-1.4 2.4-3.1 4.7-5.2 6.6-3.4 3-7.6 4.8-12.6 4.8Z"
        />
        <path
          fill={`url(#${gradId})`}
          d="M15 10.2c3.8-3.4 8.8-5.3 13-5.3v1.2c-3.8 0-8.2 1.8-11.6 4.8-.9.8-1.7 1.7-2.4 2.6-.35-.95-.7-2.05-1-2.2Z"
        />
        <path
          fill={`url(#${gradId})`}
          d="M41 10.2c-3.8-3.4-8.8-5.3-13-5.3v1.2c3.8 0 8.2 1.8 11.6 4.8.9.8 1.7 1.7 2.4 2.6.35-.95.7-2.05 1-2.2Z"
        />
        <circle cx="28" cy="9.5" r="5.35" fill={`url(#${gradId})`} stroke="#6B5420" strokeWidth="0.45" />
        <ellipse cx="28" cy="8.35" rx="2.1" ry="1.25" fill="#FFFBEB" opacity="0.55" />
      </svg>

      <div className="flex min-w-0 flex-1 items-center">
        <span className="luxury-hero-title-rule-line h-px min-w-[1.5rem] flex-1 bg-gradient-to-l from-[#B8962E] via-[#FFD700] to-[#D4AF37]/35" />
        <span className="luxury-hero-title-rule-cap size-[7px] shrink-0 rotate-45 rounded-[1px] border border-[#C9A227]/90 shadow-[0_0_10px_rgba(255,215,0,0.45)]" />
      </div>
    </div>
  );
}

export type EgyptianDividerVariant = keyof typeof GLYPHS;

type DividerProps = {
  variant?: EgyptianDividerVariant;
  className?: string;
};

export function EgyptianDivider({ variant = "ankh", className }: DividerProps) {
  const G = GLYPHS[variant];
  return (
    <div
      className={cn(
        "flex items-center gap-5 py-8 md:py-10 px-2 select-none pointer-events-none",
        className
      )}
      aria-hidden
    >
      <div className="h-px flex-1 min-w-[2rem] bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-[#D4AF37]/22" />
      <G
        size={20}
        className="text-[#D4AF37]/50 [filter:drop-shadow(0_0_10px_rgba(212,175,55,0.2))]"
      />
      <div className="h-px flex-1 min-w-[2rem] bg-gradient-to-l from-transparent via-[#D4AF37]/35 to-[#D4AF37]/22" />
    </div>
  );
}

type AccentProps = {
  symbol: EgyptianDividerVariant;
  className?: string;
  size?: number;
};

/** Tiny heading flank accent */
export function EgyptianHeadingAccent({ symbol, className, size = 16 }: AccentProps) {
  const G = GLYPHS[symbol];
  return (
    <G
      size={size}
      className={cn(
        "text-[#D4AF37]/40 [filter:drop-shadow(0_0_6px_rgba(212,175,55,0.15))] shrink-0 mt-1.5",
        className
      )}
    />
  );
}
