import { TrendingUp, Clock, Globe } from "lucide-react";
import { useLang } from "../context/language-context";
import { LuxuryIcon } from "./luxury-icon";

export function HeroSection() {
  const { t } = useLang();

  return (
    <div className="relative py-20 md:py-24 overflow-hidden border-b border-[#D4AF37]/10">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[28rem] h-[28rem] rounded-full bg-[#D4AF37]/12 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[26rem] h-[26rem] rounded-full bg-[#FFD700]/8 blur-[100px]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(5,5,5,0.85)_100%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold tracking-[0.04em] text-white mb-6 leading-tight">
            {t("Live Gold Prices in", "أسعار الذهب الآن في")}{" "}
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#FFD700] bg-clip-text text-transparent">
              {t("Egypt", "مصر")}
            </span>
          </h1>
          <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto font-sans leading-relaxed tracking-wide">
            {t(
              "Track real-time gold prices, calculate values, and stay updated with market trends",
              "تابع أسعار الذهب لحظة بلحظة، احسب القيم، وابقَ على اطلاع بآخر تحركات السوق"
            )}
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {[
            { icon: Clock, label: t("Real-time Updates", "تحديثات فورية") },
            { icon: TrendingUp, label: t("Market Analysis", "تحليل السوق") },
            { icon: Globe, label: t("Egyptian Market", "السوق المصري") },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="group/badge flex items-center gap-3 rounded-full border border-[#D4AF37]/20 bg-white/[0.04] backdrop-blur-md px-5 py-2.5 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-[0_0_28px_rgba(212,175,55,0.15)]"
            >
              <LuxuryIcon icon={icon} size={20} interactive={false} className="group-hover/badge:scale-110" />
              <span className="text-white/90 text-sm font-medium tracking-wide">{label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D4AF37] opacity-40" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] shadow-[0_0_12px_rgba(255,215,0,0.6)]" />
          </div>
          <span className="text-white/50 text-sm tracking-wide font-sans">
            {t("Live market data", "بيانات السوق الحية")}
          </span>
        </div>
      </div>
    </div>
  );
}
