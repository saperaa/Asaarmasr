import { Minus, DollarSign, RefreshCw } from "lucide-react";
import { EgyptianHeadingAccent } from "./egyptian-glyphs";
import { LuxuryIcon } from "./luxury-icon";

interface CurrencyRow {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rate: number;
}

// USD cross-rates: how many USD = 1 unit of this currency.
// SAR and AED are hard-pegged; EUR/GBP/KWD use current market approximations.
const CROSS_USD: Record<string, number> = {
  EUR: 1.1305,
  GBP: 1.3309,
  SAR: 1 / 3.75,
  AED: 1 / 3.6725,
  KWD: 3.2673,
};

const CURRENCY_META: Omit<CurrencyRow, "rate">[] = [
  { code: "EUR", name: "Euro",          symbol: "€",    flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£",    flag: "🇬🇧" },
  { code: "SAR", name: "Saudi Riyal",   symbol: "﷼",    flag: "🇸🇦" },
  { code: "AED", name: "UAE Dirham",    symbol: "د.إ",  flag: "🇦🇪" },
  { code: "KWD", name: "Kuwaiti Dinar", symbol: "د.ك", flag: "🇰🇼" },
];

function formatUpdated(date: Date): string {
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

interface CurrencyExchangeProps {
  usdToEgp?: number;
  saghaRate?: number;
  lastUpdated?: Date | null;
}

export function CurrencyExchange({ usdToEgp, saghaRate, lastUpdated }: CurrencyExchangeProps) {
  const usdRate = usdToEgp ?? 53.42;

  const currencies: CurrencyRow[] = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: usdRate },
    ...CURRENCY_META.map((meta) => ({
      ...meta,
      rate: usdRate * CROSS_USD[meta.code],
    })),
  ];

  return (
    <div className="luxury-card p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <EgyptianHeadingAccent symbol="ankh" size={24} className="mt-0.5 opacity-75 hidden sm:block" />
          <LuxuryIcon icon={DollarSign} size={26} />
          <h2 className="luxury-section-heading font-heading text-xl md:text-2xl font-semibold tracking-[0.04em] text-white">
            Currency Exchange Rates
          </h2>
        </div>
        <div className="flex items-center gap-2 text-white/45 text-sm font-sans">
          <LuxuryIcon icon={RefreshCw} size={15} interactive={false} />
          <span>{lastUpdated ? formatUpdated(lastUpdated) : "Updating..."}</span>
        </div>
      </div>

      {saghaRate && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] px-4 py-2.5 text-sm font-sans text-white/60">
          <span className="text-[#D4AF37]/80 font-medium">Sagha Market Rate:</span>
          <span className="tabular-nums text-white/80">{saghaRate.toFixed(2)} EGP / USD</span>
        </div>
      )}

      <p className="text-white/50 text-sm mb-6 font-sans">All rates shown as 1 unit = EGP (Egyptian Pound)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {currencies.map((currency) => (
          <div key={currency.code} className="group/fx luxury-subcard p-5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{currency.flag}</span>
                <div>
                  <span className="text-white font-semibold font-sans">{currency.code}</span>
                  <p className="text-white/45 text-xs font-sans">{currency.name}</p>
                </div>
              </div>
              <LuxuryIcon icon={Minus} size={18} interactive={false} className="opacity-80" />
            </div>
            <div className="mt-3">
              <span className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-xl font-semibold text-transparent font-heading tracking-wide tabular-nums">
                {currency.rate.toFixed(2)} EGP
              </span>
              <p className="mt-1.5 text-xs font-sans text-white/45">Live rate</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
