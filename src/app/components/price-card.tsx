import { TrendingUp, TrendingDown } from "lucide-react";
import { LuxuryIcon } from "./luxury-icon";
import { useLang } from "../context/language-context";

interface PriceCardProps {
  title: string;
  price: number;
  change: number;
  changePercent: number;
}

const iconCardHover =
  "group-hover/card:scale-[1.06] group-hover/card:[filter:drop-shadow(0_0_10px_rgba(255,215,0,0.65))_drop-shadow(0_0_22px_rgba(212,175,55,0.3))]";

export function PriceCard({ title, price, change, changePercent }: PriceCardProps) {
  const isPositive = change >= 0;
  const { t } = useLang();

  return (
    <div className="group/card luxury-card p-6 md:p-7">
      <div className="flex items-start justify-between mb-5">
        <h3 className="font-heading text-lg font-medium tracking-wide text-white/70">{title}</h3>
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border backdrop-blur-sm ${
            isPositive
              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/25 bg-red-500/10 text-red-400"
          }`}
        >
          <LuxuryIcon
            icon={isPositive ? TrendingUp : TrendingDown}
            size={16}
            interactive={false}
            className={iconCardHover}
          />
          <span className="text-xs font-semibold tabular-nums">{Math.abs(changePercent).toFixed(2)}%</span>
        </div>
      </div>
      <div className="mb-3">
        <div className="font-heading text-3xl md:text-4xl font-semibold tracking-wide bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent">
          {price.toLocaleString()} <span className="text-lg md:text-xl font-sans text-white/50">EGP</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm font-sans">
        <span className={`font-medium tabular-nums ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
          {isPositive ? "+" : ""}
          {change.toFixed(2)} EGP
        </span>
        <span className="text-white/40">{t("today", "اليوم")}</span>
      </div>
    </div>
  );
}
