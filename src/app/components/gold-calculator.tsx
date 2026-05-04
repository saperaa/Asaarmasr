import { useState } from "react";
import { ScarabGlyph } from "./egyptian-glyphs";
import { LuxuryRippleButton } from "./luxury-ripple-button";
import type { GoldApiResponse } from "../hooks/use-gold-api";

type GoldType = "24K" | "21K" | "18K" | "14K";

interface GoldCalculatorProps {
  goldData?: GoldApiResponse | null;
}

export function GoldCalculator({ goldData }: GoldCalculatorProps) {
  const [grams, setGrams] = useState<string>("");
  const [goldType, setGoldType] = useState<GoldType>("24K");

  const goldPrices: Record<GoldType, number> = {
    "24K": goldData?.prices.gram_24k.buy ?? 4285,
    "21K": goldData?.prices.gram_21k.buy ?? 3749,
    "18K": goldData?.prices.gram_18k.buy ?? 3214,
    "14K": goldData?.prices.gram_14k.buy ?? 2500,
  };

  const totalPrice = () => {
    const g = parseFloat(grams);
    if (isNaN(g) || g <= 0) return 0;
    return g * goldPrices[goldType];
  };

  const total = totalPrice();

  return (
    <div className="luxury-card p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8">
        <ScarabGlyph
          size={26}
          className="shrink-0 text-[#D4AF37]/90 [filter:drop-shadow(0_0_12px_rgba(212,175,55,0.32))]"
        />
        <h2 className="luxury-section-heading font-heading text-xl md:text-2xl font-semibold tracking-[0.04em] text-white">Gold Price Calculator</h2>
      </div>

      <div className="space-y-5 font-sans">
        <div>
          <label className="block text-white/50 mb-3 text-sm tracking-wide">Select Gold Type</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(goldPrices) as GoldType[]).map((type) => (
              <LuxuryRippleButton
                key={type}
                type="button"
                onClick={() => setGoldType(type)}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ${
                  goldType === type
                    ? "luxury-btn-gold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0a0a0a] shadow-[0_4px_24px_rgba(212,175,55,0.3)]"
                    : "luxury-btn-outline-glow bg-white/[0.05] text-white/55 border border-[#D4AF37]/15 hover:border-[#D4AF37]/35"
                }`}
              >
                {type}
              </LuxuryRippleButton>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-white/50 mb-3 text-sm tracking-wide">Enter Weight (grams)</label>
          <input
            type="number"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
            placeholder="0.0"
            className="w-full rounded-2xl border border-[#D4AF37]/20 bg-black/40 backdrop-blur-sm px-4 py-3.5 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 focus:border-[#D4AF37]/50 transition-shadow"
            min={0}
            step="0.01"
          />
        </div>

        <div className="rounded-2xl border border-[#D4AF37]/18 bg-black/35 backdrop-blur-md p-5">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-white/45">Price per gram ({goldType})</span>
            <span className="text-white tabular-nums">{goldPrices[goldType].toLocaleString()} EGP</span>
          </div>
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-white/45">Weight</span>
            <span className="text-white tabular-nums">{grams || "0"} grams</span>
          </div>
          <div className="border-t border-[#D4AF37]/20 pt-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="text-lg text-white font-heading font-medium tracking-wide">Total Price</span>
              <span className="text-2xl font-heading font-semibold tracking-wide bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent tabular-nums">
                {total.toLocaleString(undefined, { maximumFractionDigits: 2 })} EGP
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
