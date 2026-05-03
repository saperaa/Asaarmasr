import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { LuxuryRippleButton } from "./luxury-ripple-button";
import { EgyptianHeadingAccent } from "./egyptian-glyphs";

const dailyData = [
  { time: "00:00", price: 4270 },
  { time: "04:00", price: 4272 },
  { time: "08:00", price: 4275 },
  { time: "12:00", price: 4280 },
  { time: "16:00", price: 4282 },
  { time: "20:00", price: 4285 },
];

const weeklyData = [
  { time: "Mon", price: 4250 },
  { time: "Tue", price: 4260 },
  { time: "Wed", price: 4265 },
  { time: "Thu", price: 4270 },
  { time: "Fri", price: 4275 },
  { time: "Sat", price: 4280 },
  { time: "Sun", price: 4285 },
];

const monthlyData = [
  { time: "Week 1", price: 4200 },
  { time: "Week 2", price: 4220 },
  { time: "Week 3", price: 4240 },
  { time: "Week 4", price: 4285 },
];

type Period = "daily" | "weekly" | "monthly";

export function PriceChart() {
  const [period, setPeriod] = useState<Period>("daily");

  const getData = () => {
    switch (period) {
      case "daily":
        return dailyData;
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      default:
        return dailyData;
    }
  };

  const PeriodBtn = ({ p, label }: { p: Period; label: string }) => (
    <LuxuryRippleButton
      type="button"
      onClick={() => setPeriod(p)}
      className={`rounded-xl px-4 py-2.5 text-sm font-medium font-sans transition-all duration-300 ${
        period === p
          ? "luxury-btn-gold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0a0a0a] shadow-[0_4px_24px_rgba(212,175,55,0.35)]"
          : "luxury-btn-outline-glow bg-white/[0.05] text-white/55 border border-white/[0.08] hover:border-[#D4AF37]/35 hover:text-white"
      }`}
    >
      {label}
    </LuxuryRippleButton>
  );

  return (
    <div className="luxury-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <EgyptianHeadingAccent symbol="scarab" size={22} className="mt-0.5 opacity-80 hidden sm:block shrink-0" />
          <h2 className="luxury-section-heading font-heading text-xl md:text-2xl font-semibold tracking-[0.04em] text-white">
            Gold Price Chart (24K)
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <PeriodBtn p="daily" label="Daily" />
          <PeriodBtn p="weekly" label="Weekly" />
          <PeriodBtn p="monthly" label="Monthly" />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={getData()} key={period}>
          <defs>
            <linearGradient id={`colorPrice-${period}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,175,55,0.12)" />
          <XAxis dataKey="time" stroke="rgba(255,255,255,0.35)" tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} />
          <YAxis stroke="rgba(255,255,255,0.35)" domain={["dataMin - 10", "dataMax + 10"]} tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10,10,10,0.92)",
              border: "1px solid rgba(212,175,55,0.35)",
              borderRadius: "16px",
              backdropFilter: "blur(12px)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
            }}
            labelStyle={{ color: "#FFD700", fontFamily: "var(--font-heading)" }}
            itemStyle={{ color: "#fff" }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#D4AF37"
            strokeWidth={2}
            fill={`url(#colorPrice-${period})`}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
