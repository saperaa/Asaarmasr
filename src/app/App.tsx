import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { Routes, Route } from "react-router";
import { Header } from "./components/header";
const CinematicHero3D = lazy(() =>
  import("./components/cinematic-hero-3d").then((m) => ({ default: m.CinematicHero3D }))
);
import { PriceCard } from "./components/price-card";
import { PriceTable } from "./components/price-table";
import { PriceChart } from "./components/price-chart";
import { GoldCalculator } from "./components/gold-calculator";
import { NewsSection } from "./components/news-section";
import { CurrencyExchange } from "./components/currency-exchange";
import { FaqSection } from "./components/faq-section";
import { BlogPosts } from "./components/blog-posts";
import { Footer } from "./components/footer";
import { EgyptianDivider, EgyptianHeadingAccent } from "./components/egyptian-glyphs";
import { LandingIntro } from "./components/landing-intro";
import { LuxuryAmbientBackdrop } from "./components/luxury-ambient-backdrop";
import { LuxuryRippleButton } from "./components/luxury-ripple-button";
import { ScrollReveal } from "./components/scroll-reveal";
import { AuthProvider } from "./context/auth-context";
import { CrmProvider } from "./context/crm-context";
import { useLang } from "./context/language-context";
import { useGoldApi } from "./hooks/use-gold-api";
import { BuyGoldPage } from "./pages/BuyGoldPage";
import { CrmLoginPage } from "./pages/crm/CrmLoginPage";
import { CrmProtectedRoute } from "./pages/crm/CrmProtectedRoute";
import { CrmDashboardPage } from "./pages/crm/CrmDashboardPage";
import { CrmOrdersPage } from "./pages/crm/CrmOrdersPage";
import { CrmProductsPage } from "./pages/crm/CrmProductsPage";
import { CrmStoresPage } from "./pages/crm/CrmStoresPage";
import { CrmUsersPage } from "./pages/crm/CrmUsersPage";
import { CrmBlogPage } from "./pages/crm/CrmBlogPage";
import { BlogListPage } from "./pages/BlogListPage";
import { BlogArticlePage } from "./pages/BlogArticlePage";
import { StoresSection } from "./components/stores-section";

const INTRO_STORAGE_KEY = "asaarMasrIntroDismissed";

function AppInner() {
  const [showIntro, setShowIntro] = useState(false);

  const handleIntroComplete = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, "1");
    } catch {
      /* private mode / quota */
    }
    setShowIntro(false);
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [showIntro]);

  const { t } = useLang();
  const { data: goldData, changes, lastUpdated } = useGoldApi();

  const liveGoldPrices = goldData
    ? [
        {
          title: "24K Gold",
          price: goldData.prices.gram_24k.buy,
          change: changes?.gram_24k.change ?? 0,
          changePercent: changes?.gram_24k.changePercent ?? 0,
        },
        {
          title: "21K Gold",
          price: goldData.prices.gram_21k.buy,
          change: changes?.gram_21k.change ?? 0,
          changePercent: changes?.gram_21k.changePercent ?? 0,
        },
        {
          title: "18K Gold",
          price: goldData.prices.gram_18k.buy,
          change: changes?.gram_18k.change ?? 0,
          changePercent: changes?.gram_18k.changePercent ?? 0,
        },
        {
          title: "Gold Pound",
          price: goldData.prices.gold_pound,
          change: changes?.gold_pound.change ?? 0,
          changePercent: changes?.gold_pound.changePercent ?? 0,
        },
      ]
    : [
        { title: "24K Gold", price: 4285, change: 12.5, changePercent: 2.5 },
        { title: "21K Gold", price: 3749, change: 8.3, changePercent: 2.2 },
        { title: "18K Gold", price: 3214, change: 5.8, changePercent: 1.8 },
        { title: "Gold Pound", price: 34280, change: 105.4, changePercent: 3.1 },
      ];

  return (
    <>
      {showIntro ? <LandingIntro onComplete={handleIntroComplete} /> : null}
      <div className="relative min-h-screen luxury-page-gradient font-sans text-white">
        <LuxuryAmbientBackdrop />
        <Header />

        <main className="relative z-[1]">
          {/* Hero */}
          <section id="home">
            <Suspense fallback={<div className="h-[360px] sm:h-[380px] max-h-[400px] min-h-[300px] flex items-center justify-center"><div className="h-48 w-36 animate-pulse rounded-xl bg-[#D4AF37]/10 ring-1 ring-[#D4AF37]/20" /></div>}>
              <CinematicHero3D />
            </Suspense>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EgyptianDivider variant="eye" />
          </div>

          {/* Live Gold Price Cards — display only, no Buy button */}
          <section id="prices" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <div className="flex items-start gap-3 md:gap-4 mb-8">
                <EgyptianHeadingAccent symbol="scarab" size={20} className="mt-1 opacity-80 hidden md:block" />
                <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold text-white flex-1 mb-0 leading-tight md:leading-snug">
                  {t("Live Gold Prices", "أسعار الذهب الآن")}
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {liveGoldPrices.map((price, index) => (
                  <PriceCard
                    key={index}
                    title={price.title}
                    price={price.price}
                    change={price.change}
                    changePercent={price.changePercent}
                  />
                ))}
              </div>
            </ScrollReveal>
          </section>

          {/* Currency Exchange */}
          <section id="currency" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <CurrencyExchange usdToEgp={goldData?.usd_to_egp} saghaRate={goldData?.sagha_dollar_rate} lastUpdated={lastUpdated} />
            </ScrollReveal>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EgyptianDivider variant="scarab" />
          </div>

          {/* Price Table */}
          <section id="table" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <div className="flex items-start gap-3 md:gap-4 mb-8">
                <EgyptianHeadingAccent symbol="ankh" size={20} className="mt-1 opacity-80 hidden md:block" />
                <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold text-white flex-1 mb-0 leading-tight md:leading-snug">
                  {t("Detailed Price Table", "جدول الأسعار التفصيلي")}
                </h2>
              </div>
              <PriceTable goldData={goldData} />
            </ScrollReveal>
          </section>

          {/* Price Chart */}
          <section id="chart" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <PriceChart />
            </ScrollReveal>
          </section>

          {/* Calculator + News */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <div className="grid lg:grid-cols-2 gap-8">
                <div id="calculator">
                  <GoldCalculator goldData={goldData} />
                </div>
                <div id="news">
                  <NewsSection />
                </div>
              </div>
            </ScrollReveal>
          </section>

          {/* Blog Posts */}
          <section id="blog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <BlogPosts />
            </ScrollReveal>
          </section>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <EgyptianDivider variant="ankh" />
          </div>

          {/* Stores */}
          <StoresSection />

          {/* FAQ */}
          <section id="faq" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <FaqSection />
            </ScrollReveal>
          </section>

          {/* Contact */}
          <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <ScrollReveal>
              <div className="luxury-card rounded-[20px] border border-[#D4AF37]/20 bg-white/[0.035] backdrop-blur-xl p-8 md:p-10 text-center shadow-[0_12px_48px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-[#D4AF37]/35 hover:shadow-[0_20px_56px_rgba(0,0,0,0.5),0_0_40px_rgba(212,175,55,0.1)]">
                <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold text-white mb-4 leading-tight md:leading-snug">
                  {t("Get In Touch", "تواصل معنا")}
                </h2>
                <p className="text-white/55 mb-8 max-w-2xl mx-auto font-sans leading-relaxed">
                  {t(
                    "Have questions about gold prices or need assistance? Contact our team for expert guidance on gold trading and market insights.",
                    "هل لديك أسئلة حول أسعار الذهب أو تحتاج إلى مساعدة؟ تواصل مع فريقنا للحصول على إرشادات متخصصة."
                  )}
                </p>
                <LuxuryRippleButton
                  type="button"
                  className="luxury-btn-gold group/cta inline-flex rounded-2xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] px-10 py-3.5 font-sans font-semibold text-[#0a0a0a] shadow-[0_8px_32px_rgba(212,175,55,0.35)]"
                >
                  {t("Contact Us", "تواصل معنا")}
                </LuxuryRippleButton>
              </div>
            </ScrollReveal>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <CrmProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppInner />} />
          <Route path="/buy-gold" element={<BuyGoldPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:id" element={<BlogArticlePage />} />

          {/* CRM Routes */}
          <Route path="/crm" element={<CrmLoginPage />} />
          <Route
            path="/crm/dashboard"
            element={
              <CrmProtectedRoute>
                <CrmDashboardPage />
              </CrmProtectedRoute>
            }
          />
          <Route
            path="/crm/orders"
            element={
              <CrmProtectedRoute>
                <CrmOrdersPage />
              </CrmProtectedRoute>
            }
          />
          <Route
            path="/crm/products"
            element={
              <CrmProtectedRoute adminOnly>
                <CrmProductsPage />
              </CrmProtectedRoute>
            }
          />
          <Route
            path="/crm/stores"
            element={
              <CrmProtectedRoute adminOnly>
                <CrmStoresPage />
              </CrmProtectedRoute>
            }
          />
          <Route
            path="/crm/users"
            element={
              <CrmProtectedRoute adminOnly>
                <CrmUsersPage />
              </CrmProtectedRoute>
            }
          />
          <Route
            path="/crm/blog"
            element={
              <CrmProtectedRoute adminOnly>
                <CrmBlogPage />
              </CrmProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </CrmProvider>
  );
}
