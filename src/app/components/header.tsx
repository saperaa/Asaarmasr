import { Menu, X, Languages, ChevronDown } from "lucide-react";
import { useState, type SyntheticEvent } from "react";
import { Link, useLocation } from "react-router";
import { useNavActiveSection } from "../hooks/use-nav-active-section";
import { useLang } from "../context/language-context";
import { AnkhGlyph, EyeOfHorusGlyph, ScarabGlyph } from "./egyptian-glyphs";
import { LuxuryIcon } from "./luxury-icon";
import { cn } from "./ui/utils";

type SimpleNav = { kind: "link"; href: string; en: string; ar: string };

const simpleLinks: SimpleNav[] = [
  { kind: "link", href: "/#home", en: "Home", ar: "الرئيسية" },
  { kind: "link", href: "/#prices", en: "Gold Prices", ar: "أسعار الذهب" },
];

const buyGoldItems = [
  { href: "/buy-gold", Glyph: ScarabGlyph, en: "Gold Bars", ar: "سبائك ذهب" },
  { href: "/buy-gold", Glyph: EyeOfHorusGlyph, en: "Gold Coins", ar: "عملات ذهبية" },
  { href: "/buy-gold", Glyph: AnkhGlyph, en: "Gold Jewelry", ar: "مجوهرات ذهب" },
] as const;

const simpleLinksAfter: SimpleNav[] = [
  { kind: "link", href: "/#currency", en: "Currency", ar: "العملات" },
  { kind: "link", href: "/#calculator", en: "Calculator", ar: "الحاسبة" },
  { kind: "link", href: "/blog", en: "Blog", ar: "المدونة" },
  { kind: "link", href: "/#faq", en: "FAQ", ar: "الأسئلة الشائعة" },
  { kind: "link", href: "/#contact", en: "Contact", ar: "تواصل معنا" },
];

const BRAND_MARK = `${import.meta.env.BASE_URL}gold.png`;

function brandIconFallback(e: SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.src = `${import.meta.env.BASE_URL}favicon.png`;
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [buyOpenMobile, setBuyOpenMobile] = useState(false);
  const { toggleLang, lang } = useLang();
  const activeSection = useNavActiveSection();
  const { pathname } = useLocation();

  const sectionId = (href: string) => href.replace(/^\/?#/, "");

  const onHome = pathname === "/";
  const blogActive = pathname.startsWith("/blog");

  const isActive = (href: string) => {
    if (href === "/blog") return blogActive;
    return onHome && activeSection === sectionId(href);
  };

  const desktopNavClass = (href: string) =>
    cn("nav-gold-link", isActive(href) && "nav-gold-link-active");

  const mobileNavClass = (href: string) =>
    cn(
      "py-2.5 transition-all duration-300",
      isActive(href)
        ? "text-[#FFD700] drop-shadow-[0_0_12px_rgba(212,175,55,0.35)]"
        : "text-white/90 hover:text-[#FFD700]"
    );

  const buyGoldActive = pathname === "/buy-gold";

  return (
    <header className="relative sticky top-0 z-50 border-b border-[#D4AF37]/15 bg-[#050505]/72 backdrop-blur-xl backdrop-saturate-150 shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/35 to-transparent"
        aria-hidden
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between min-h-[4.5rem] md:min-h-20 py-2 md:py-0">
          <a
            href="/"
            aria-label="Asaar Masr — Home"
            className={cn(
              "group/logo flex min-w-0 max-w-[min(100%,32rem)] items-center gap-2.5 sm:gap-3 rounded-xl py-1 ps-1 pe-2 -ms-1 sm:ps-2",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]"
            )}
          >
            <div className="relative z-[1] flex min-w-0 items-center gap-2.5 sm:gap-3">
              <div
                className={cn(
                  "relative shrink-0 rounded-2xl p-0.5",
                  "bg-gradient-to-br from-[#D4AF37]/50 via-[#D4AF37]/15 to-[#FFD700]/35",
                  "shadow-[0_0_28px_rgba(212,175,55,0.18)] transition-all duration-300",
                  "group-hover/logo:shadow-[0_0_36px_rgba(255,215,0,0.28)]"
                )}
              >
                <div className="overflow-hidden rounded-[0.9rem] bg-[#030305] p-0 ring-1 ring-white/[0.08]">
                  <img
                    src={BRAND_MARK}
                    alt=""
                    width={112}
                    height={112}
                    className="h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 object-contain object-center p-1 hover:scale-[1.06] transition-transform duration-500"
                    onError={brandIconFallback}
                  />
                </div>
              </div>
              <div className="flex min-w-0 flex-col leading-tight text-start">
                {lang === "ar" ? (
                  <>
                    <span
                      dir="rtl"
                      className="font-arabic-display text-lg sm:text-xl md:text-2xl font-semibold tracking-wide bg-gradient-to-l from-[#FFD700] via-[#F4D03F] to-[#D4AF37] bg-clip-text text-transparent [filter:drop-shadow(0_0_12px_rgba(255,215,0,0.35))]"
                    >
                      أسعار مصر
                    </span>
                    <span className="font-heading text-[11px] sm:text-xs font-medium tracking-[0.12em] text-white/70 uppercase mt-0.5 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
                      Asaar Masr
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-heading text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.06em] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
                      Asaar Masr
                    </span>
                    <span
                      dir="rtl"
                      className="font-arabic-display text-[13px] sm:text-sm font-medium tracking-wide bg-gradient-to-l from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent opacity-95 -mt-0.5 [filter:drop-shadow(0_0_10px_rgba(0,0,0,0.75))]"
                    >
                      أسعار مصر
                    </span>
                  </>
                )}
                <span
                  className="mt-1 max-w-[14rem] sm:max-w-none truncate sm:whitespace-normal font-sans text-[9px] sm:text-[10px] font-light uppercase tracking-[0.32em] sm:tracking-[0.38em] bg-gradient-to-r from-[#D4AF37] via-[#F4D03F] to-[#FFD700] bg-clip-text text-transparent opacity-95 [text-shadow:0_1px_14px_rgba(0,0,0,0.8)]"
                  lang="en"
                >
                  Gold & Currency Tracker Egypt
                </span>
              </div>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-6">
            {simpleLinks.map((link) => (
              <a key={link.href} href={link.href} className={desktopNavClass(link.href)}>
                {lang === "ar" ? link.ar : link.en}
              </a>
            ))}

            {/* Buy Gold — routes to /buy-gold */}
            <div className="relative group/buy focus-within/buy:z-50">
              <Link
                to="/buy-gold"
                className={cn("nav-gold-link flex items-center gap-1", buyGoldActive && "nav-gold-link-active")}
              >
                {lang === "ar" ? "شراء الذهب" : "Buy Gold"}
              </Link>
              <div
                className="absolute start-0 top-full mt-3 min-w-[240px] rounded-2xl border border-[#D4AF37]/20 bg-[#0a0a0a]/92 backdrop-blur-xl py-2 shadow-[0_24px_56px_rgba(0,0,0,0.6),0_0_0_1px_rgba(212,175,55,0.06)] z-50
                invisible opacity-0 translate-y-2 pointer-events-none
                transition-all duration-300 ease-out
                group-hover/buy:visible group-hover/buy:opacity-100 group-hover/buy:translate-y-0 group-hover/buy:pointer-events-auto
                group-focus-within/buy:visible group-focus-within/buy:opacity-100 group-focus-within/buy:translate-y-0 group-focus-within/buy:pointer-events-auto"
              >
                {buyGoldItems.map((item) => (
                  <Link
                    key={item.en}
                    to={item.href}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-white/90 transition-colors hover:bg-[#D4AF37]/10 hover:text-[#FFD700]"
                  >
                    <item.Glyph
                      size={18}
                      className="shrink-0 text-[#D4AF37]/85 [filter:drop-shadow(0_0_10px_rgba(212,175,55,0.28))]"
                    />
                    <span>{lang === "ar" ? item.ar : item.en}</span>
                  </Link>
                ))}
              </div>
            </div>

            {simpleLinksAfter.map((link) =>
              link.href.startsWith("/#") ? (
                <a key={link.href} href={link.href} className={desktopNavClass(link.href)}>
                  {lang === "ar" ? link.ar : link.en}
                </a>
              ) : (
                <Link key={link.href} to={link.href} className={desktopNavClass(link.href)}>
                  {lang === "ar" ? link.ar : link.en}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={toggleLang}
              className="group/lang flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl border border-[#D4AF37]/30 bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:border-[#D4AF37]/55 hover:bg-[#D4AF37]/10 hover:shadow-[0_0_20px_rgba(212,175,55,0.15)]"
              title="Switch language"
            >
              <LuxuryIcon icon={Languages} size={16} className="group-hover/lang:scale-110" />
              <span className="text-xs sm:text-sm font-medium text-[#D4AF37] tracking-wide whitespace-nowrap">
                {lang === "en" ? "العربية" : "English"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-white/90 hover:bg-white/[0.06] transition-colors"
              aria-expanded={mobileMenuOpen}
              aria-label="Menu"
            >
              {mobileMenuOpen ? <LuxuryIcon icon={X} size={24} /> : <LuxuryIcon icon={Menu} size={24} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-[#D4AF37]/15 animate-in fade-in slide-in-from-top-2 duration-300">
            <nav className="flex flex-col gap-1">
              {simpleLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={mobileNavClass(link.href)}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {lang === "ar" ? link.ar : link.en}
                </a>
              ))}

              <div className="border-t border-[#D4AF37]/10 my-1 pt-2">
                <button
                  type="button"
                  onClick={() => setBuyOpenMobile(!buyOpenMobile)}
                  className={cn(
                    "flex w-full items-center justify-between py-2.5 text-left transition-colors",
                    buyGoldActive ? "text-[#FFD700]" : "text-white/90 hover:text-[#FFD700]"
                  )}
                >
                  <span>{lang === "ar" ? "شراء الذهب" : "Buy Gold"}</span>
                  <LuxuryIcon
                    icon={ChevronDown}
                    size={18}
                    interactive={false}
                    className={`transition-transform duration-300 ${buyOpenMobile ? "rotate-180" : ""}`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-out ${
                    buyOpenMobile ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ms-2 border-s border-[#D4AF37]/20 ps-3 space-y-1 pb-2">
                    {buyGoldItems.map((item) => (
                      <Link
                        key={item.en}
                        to={item.href}
                        className="flex items-center gap-2 py-2 text-sm text-white/80 hover:text-[#FFD700] transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <item.Glyph
                          size={16}
                          className="shrink-0 text-[#D4AF37]/85 [filter:drop-shadow(0_0_8px_rgba(212,175,55,0.25))]"
                        />
                        {lang === "ar" ? item.ar : item.en}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {simpleLinksAfter.map((link) =>
                link.href.startsWith("/#") ? (
                  <a key={link.href} href={link.href} className={mobileNavClass(link.href)} onClick={() => setMobileMenuOpen(false)}>
                    {lang === "ar" ? link.ar : link.en}
                  </a>
                ) : (
                  <Link key={link.href} to={link.href} className={mobileNavClass(link.href)} onClick={() => setMobileMenuOpen(false)}>
                    {lang === "ar" ? link.ar : link.en}
                  </Link>
                )
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
