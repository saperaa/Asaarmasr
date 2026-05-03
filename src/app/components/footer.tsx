import { Facebook, Twitter, Instagram, Linkedin, AlertCircle } from "lucide-react";
import { LuxuryIcon } from "./luxury-icon";

const BRAND_MARK = `${import.meta.env.BASE_URL}gold.png`;

export function Footer() {
  return (
    <footer className="relative z-[1] mt-20 border-t border-[#D4AF37]/12 bg-[#030303]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10 flex items-start gap-4 rounded-[18px] border border-[#D4AF37]/18 bg-white/[0.04] backdrop-blur-xl p-5 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
          <LuxuryIcon icon={AlertCircle} size={22} interactive={false} className="shrink-0 mt-0.5" />
          <div className="text-sm text-white/55 font-sans leading-relaxed">
            <strong className="text-white font-heading font-semibold tracking-wide">Market Disclaimer:</strong> The gold prices
            displayed on this website are for informational purposes only and may not
            reflect real-time market prices. Prices are subject to change without notice.
            Please consult with licensed gold dealers for actual trading prices. We are not
            responsible for any financial decisions made based on this information.
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src={BRAND_MARK}
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-xl object-contain ring-1 ring-[#D4AF37]/25 bg-[#030305]/80 p-0.5"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}favicon.png`;
                }}
              />
              <div className="flex flex-col leading-tight min-w-0">
                <span className="font-heading font-semibold tracking-[0.06em] text-white">Asaar Masr</span>
                <span
                  dir="rtl"
                  className="font-arabic-display text-[11px] font-medium bg-gradient-to-l from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent"
                >
                  أسعار مصر
                </span>
                <span className="font-sans text-[9px] font-light uppercase tracking-[0.28em] bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent mt-0.5">
                  Gold & Currency Tracker Egypt
                </span>
              </div>
            </div>
            <p className="text-white/50 text-sm font-sans leading-relaxed">
              Your trusted source for real-time gold prices in Egypt. Track market trends,
              calculate gold values, and stay informed with the latest news.
            </p>
          </div>

          <div>
            <h3 className="font-heading font-semibold tracking-wide text-white mb-4">Quick Links</h3>
            <ul className="space-y-2.5 font-sans text-sm">
              <li>
                <a href="#home" className="text-white/50 hover:text-[#FFD700] transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#prices" className="text-white/50 hover:text-[#FFD700] transition-colors">
                  Gold Prices
                </a>
              </li>
              <li>
                <a href="#calculator" className="text-white/50 hover:text-[#FFD700] transition-colors">
                  Calculator
                </a>
              </li>
              <li>
                <a href="#news" className="text-white/50 hover:text-[#FFD700] transition-colors">
                  News
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading font-semibold tracking-wide text-white mb-4">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: "#" },
                { icon: Twitter, href: "#" },
                { icon: Instagram, href: "#" },
                { icon: Linkedin, href: "#" },
              ].map(({ icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="group/so flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF37]/20 bg-white/[0.04] backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/45 hover:shadow-[0_0_24px_rgba(212,175,55,0.2)]"
                >
                  <LuxuryIcon icon={icon} size={20} interactive={false} className="group-hover/so:scale-110" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-[#D4AF37]/12 pt-8 text-center">
          <p className="text-white/45 text-sm font-sans">© 2026 Asaar Masr. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
