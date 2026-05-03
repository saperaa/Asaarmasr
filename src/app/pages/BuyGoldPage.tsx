import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { BuyGoldSection } from "../components/buy-gold-section";
import { LuxuryAmbientBackdrop } from "../components/luxury-ambient-backdrop";

export function BuyGoldPage() {
  return (
    <div className="relative min-h-screen luxury-page-gradient font-sans text-white">
      <LuxuryAmbientBackdrop />
      <Header />
      <main className="relative z-[1] py-8">
        <BuyGoldSection />
      </main>
      <Footer />
    </div>
  );
}
