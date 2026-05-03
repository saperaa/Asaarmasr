import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "./ui/utils";
import { useLang } from "../context/language-context";

const LOADING_MESSAGES_EN = [
  "Loading gold prices...",
  "Syncing currency rates...",
  "Connecting to Egyptian market...",
];

const LOADING_MESSAGES_AR = [
  "جاري تحميل أسعار الذهب...",
  "مزامنة أسعار العملات...",
  "الاتصال بالسوق المصري...",
];

type LandingIntroProps = {
  onComplete: () => void;
};

export function LandingIntro({ onComplete }: LandingIntroProps) {
  const { lang } = useLang();
  const patternId = useId().replace(/:/g, "");
  const lotusPatternId = `lotus-diamond-${patternId}`;
  const zigPatternId = `zig-h-${patternId}`;
  const [exiting, setExiting] = useState(false);
  const [displayLine, setDisplayLine] = useState("");
  const msgIndexRef = useRef(0);
  const charIndexRef = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    clearTimers();
    const messagesList = lang === "ar" ? LOADING_MESSAGES_AR : LOADING_MESSAGES_EN;
    msgIndexRef.current = 0;
    charIndexRef.current = 0;
    setDisplayLine("");

    const reduced =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const step = () => {
        setDisplayLine(messagesList[msgIndexRef.current % messagesList.length]);
        msgIndexRef.current += 1;
        timeoutRef.current = setTimeout(step, 2200);
      };
      step();
      return clearTimers;
    }

    const typeNext = () => {
      const msg = messagesList[msgIndexRef.current % messagesList.length];
      if (charIndexRef.current <= msg.length) {
        setDisplayLine(msg.slice(0, charIndexRef.current));
        charIndexRef.current += 1;
        timeoutRef.current = setTimeout(typeNext, 38);
      } else {
        timeoutRef.current = setTimeout(() => {
          msgIndexRef.current += 1;
          charIndexRef.current = 0;
          setDisplayLine("");
          typeNext();
        }, 1800);
      }
    };
    typeNext();
    return clearTimers;
  }, [lang, clearTimers]);

  const handleEnter = () => {
    if (exiting) return;
    clearTimers();
    setExiting(true);
  };

  const onOverlayTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (!exiting || e.target !== e.currentTarget) return;
    if (e.propertyName !== "opacity") return;
    onComplete();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="landing-intro-title"
      className={cn(
        "fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden px-6",
        "transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
        exiting ? "pointer-events-none opacity-0 scale-[1.03] blur-sm" : "opacity-100 scale-100 blur-0"
      )}
      onTransitionEnd={onOverlayTransitionEnd}
    >
      {/* Base & cinematic gradient */}
      <div className="absolute inset-0 bg-[#03050a]" aria-hidden />
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#0c1428]/95 via-[#050508] to-[#020203]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_-10%,rgba(212,175,55,0.14),transparent_55%),radial-gradient(ellipse_70%_50%_at_100%_100%,rgba(30,58,138,0.18),transparent_45%),radial-gradient(ellipse_60%_40%_at_0%_80%,rgba(212,175,55,0.08),transparent_40%)]"
        aria-hidden
      />

      {/* Egyptian geometric pattern overlay */}
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.14] text-[#D4AF37]"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <defs>
          <pattern id={lotusPatternId} width="72" height="72" patternUnits="userSpaceOnUse">
            <path
              d="M36 4 L68 36 L36 68 L4 36 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.35"
              opacity="0.5"
            />
            <path d="M36 20 L52 36 L36 52 L20 36 Z" fill="none" stroke="currentColor" strokeWidth="0.25" opacity="0.35" />
          </pattern>
          <pattern id={zigPatternId} width="120" height="16" patternUnits="userSpaceOnUse">
            <path
              d="M0 8 L15 2 L30 8 L45 2 L60 8 L75 2 L90 8 L105 2 L120 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.4"
              opacity="0.4"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${lotusPatternId})`} />
        <rect width="100%" height="100%" fill={`url(#${zigPatternId})`} opacity="0.25" />
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-[#0a0f1a]/60 pointer-events-none" aria-hidden />

      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        <h1
          id="landing-intro-title"
          dir="rtl"
          className="font-arabic-display text-5xl font-semibold leading-tight tracking-wide sm:text-6xl md:text-7xl lg:text-8xl"
          style={{
            background: "linear-gradient(135deg, #D4AF37 0%, #F4D03F 45%, #FFD700 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            filter: "drop-shadow(0 0 28px rgba(255, 215, 0, 0.35)) drop-shadow(0 0 60px rgba(212, 175, 55, 0.2))",
          }}
        >
          أسعار مصر
        </h1>

        <p
          className="mt-6 font-sans text-[11px] font-light uppercase tracking-[0.45em] text-[#D4AF37]/75 md:text-xs"
          lang="en"
        >
          Gold &amp; Currency Tracker Egypt
        </p>

        <div
          className="mt-10 flex min-h-[2.5rem] items-center justify-center font-mono text-sm text-[#D4AF37]/75 md:text-base"
          aria-live="polite"
        >
          <span className="tabular-nums">{displayLine}</span>
          <span className="ms-0.5 inline-block h-5 w-px animate-pulse bg-[#FFD700]/80" aria-hidden />
        </div>

        <button
          type="button"
          onClick={handleEnter}
          disabled={exiting}
          className={cn(
            "mt-14 rounded-2xl border border-[#D4AF37]/45 bg-white/[0.06] px-10 py-3.5 font-sans text-sm font-semibold uppercase tracking-[0.25em] text-[#FFD700] backdrop-blur-xl",
            "shadow-[0_0_0_1px_rgba(212,175,55,0.12)_inset,0_8px_32px_rgba(0,0,0,0.35)]",
            "transition-all duration-300 ease-out",
            "hover:border-[#FFD700]/70 hover:bg-[#D4AF37]/10 hover:shadow-[0_0_40px_rgba(212,175,55,0.25),0_0_0_1px_rgba(255,215,0,0.2)_inset]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050508]",
            exiting && "opacity-60"
          )}
        >
          {lang === "ar" ? "استكشف الآن" : "Explore Now"}
        </button>
      </div>

      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent opacity-90"
        aria-hidden
      />
    </div>
  );
}
