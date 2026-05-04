import { TrendingUp, TrendingDown } from "lucide-react";
import { LuxuryIcon } from "./luxury-icon";
import type { GoldApiResponse } from "../hooks/use-gold-api";

interface PriceRow {
  type: string;
  buyPrice: number;
  sellPrice: number;
  dailyChange: number | null;
}

const STATIC_FALLBACK: PriceRow[] = [
  { type: "24K Gold", buyPrice: 4285, sellPrice: 4305, dailyChange: 2.5 },
  { type: "21K Gold", buyPrice: 3749, sellPrice: 3767, dailyChange: 2.2 },
  { type: "18K Gold", buyPrice: 3214, sellPrice: 3229, dailyChange: 1.8 },
  { type: "14K Gold", buyPrice: 2500, sellPrice: 2515, dailyChange: -0.5 },
  { type: "Gold Pound", buyPrice: 34280, sellPrice: 34440, dailyChange: 3.1 },
  { type: "Gold Ounce", buyPrice: 133350, sellPrice: 133950, dailyChange: 2.8 },
];

function buildRows(data: GoldApiResponse): PriceRow[] {
  return [
    { type: "24K Gold", buyPrice: data.prices.gram_24k.buy, sellPrice: data.prices.gram_24k.sell, dailyChange: null },
    { type: "22K Gold", buyPrice: data.prices.gram_22k.buy, sellPrice: data.prices.gram_22k.sell, dailyChange: null },
    { type: "21K Gold", buyPrice: data.prices.gram_21k.buy, sellPrice: data.prices.gram_21k.sell, dailyChange: null },
    { type: "18K Gold", buyPrice: data.prices.gram_18k.buy, sellPrice: data.prices.gram_18k.sell, dailyChange: null },
    { type: "14K Gold", buyPrice: data.prices.gram_14k.buy, sellPrice: data.prices.gram_14k.sell, dailyChange: null },
    { type: "Gold Pound", buyPrice: data.prices.gold_pound, sellPrice: data.prices.gold_pound, dailyChange: null },
    { type: "Gold Ounce", buyPrice: data.prices.ounce_egp, sellPrice: data.prices.ounce_egp, dailyChange: null },
  ];
}

interface PriceTableProps {
  goldData?: GoldApiResponse | null;
}

export function PriceTable({ goldData }: PriceTableProps) {
  const priceData = goldData ? buildRows(goldData) : STATIC_FALLBACK;

  return (
    <div className="luxury-card overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#D4AF37]/20 bg-black/40 backdrop-blur-md">
              <th className="text-left px-6 py-4 text-white/50 font-sans text-sm font-medium tracking-wide">Gold Type</th>
              <th className="text-right px-6 py-4 text-white/50 font-sans text-sm font-medium tracking-wide">Buy Price</th>
              <th className="text-right px-6 py-4 text-white/50 font-sans text-sm font-medium tracking-wide">Sell Price</th>
              <th className="text-right px-6 py-4 text-white/50 font-sans text-sm font-medium tracking-wide">Daily Change</th>
            </tr>
          </thead>
          <tbody>
            {priceData.map((row, index) => {
              const isPositive = (row.dailyChange ?? 0) >= 0;
              return (
                <tr
                  key={index}
                  className="border-b border-[#D4AF37]/10 transition-colors hover:bg-[#D4AF37]/[0.06]"
                >
                  <td className="px-6 py-4 text-white font-sans">{row.type}</td>
                  <td className="px-6 py-4 text-right font-heading text-[#D4AF37]/95 font-medium tabular-nums">
                    {row.buyPrice.toLocaleString()} EGP
                  </td>
                  <td className="px-6 py-4 text-right font-heading text-[#D4AF37]/95 font-medium tabular-nums">
                    {row.sellPrice.toLocaleString()} EGP
                  </td>
                  <td className="px-6 py-4 text-right">
                    {row.dailyChange !== null ? (
                      <div className="flex items-center justify-end gap-2 font-sans">
                        <LuxuryIcon icon={isPositive ? TrendingUp : TrendingDown} size={16} interactive={false} />
                        <span className={`font-semibold tabular-nums ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
                          {isPositive ? "+" : ""}
                          {row.dailyChange.toFixed(2)}%
                        </span>
                      </div>
                    ) : (
                      <span className="text-white/30 text-sm">—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
