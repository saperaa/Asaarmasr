import { MapPin, Phone, Store } from "lucide-react";
import { useCrm } from "../context/crm-context";
import { useLang } from "../context/language-context";
import { ScrollReveal } from "./scroll-reveal";
import { EgyptianHeadingAccent } from "./egyptian-glyphs";

export function StoresSection() {
  const { stores } = useCrm();
  const { t, isAr } = useLang();

  const activeStores = stores.filter((s) => s.active);

  if (activeStores.length === 0) return null;

  return (
    <section id="stores" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ScrollReveal>
        <div className="flex items-start gap-3 md:gap-4 mb-8">
          <EgyptianHeadingAccent symbol="ankh" size={20} className="mt-1 opacity-80 hidden md:block" />
          <div>
            <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold text-white mb-1 leading-tight md:leading-snug">
              {t("Our Stores", "متاجرنا")}
            </h2>
            <p className="text-white/45 text-sm font-sans">
              {t("Visit us at one of our locations across Egypt.", "زورنا في أحد مواقعنا في مصر.")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeStores.map((store) => (
            <div
              key={store.id}
              className="luxury-card rounded-[20px] border border-[#D4AF37]/20 bg-white/[0.035] backdrop-blur-xl overflow-hidden shadow-[0_12px_48px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-[#D4AF37]/35 hover:shadow-[0_20px_56px_rgba(0,0,0,0.5),0_0_40px_rgba(212,175,55,0.1)] hover:-translate-y-1"
            >
              {/* Store image */}
              <div className="w-full h-36 bg-gradient-to-br from-[#D4AF37]/10 to-[#FFD700]/5 flex items-center justify-center overflow-hidden">
                {store.imageUrl ? (
                  <img
                    src={store.imageUrl}
                    alt={isAr ? store.name_ar : store.name_en}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Store className="w-12 h-12 text-[#D4AF37]/25" />
                )}
              </div>

              <div className="p-5">
                <h3
                  className="font-heading text-lg font-semibold text-white mb-0.5"
                  dir={isAr ? "rtl" : "ltr"}
                >
                  {isAr ? store.name_ar : store.name_en}
                </h3>
                <p className="text-[#D4AF37]/70 text-xs font-medium mb-3">
                  {isAr ? store.city_ar : store.city_en}
                </p>

                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-white/50 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#D4AF37]/50 mt-0.5 shrink-0" />
                    <span dir={isAr ? "rtl" : "ltr"}>
                      {isAr ? store.address_ar : store.address_en}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-xs">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]/50 shrink-0" />
                    <span dir="ltr">{store.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
