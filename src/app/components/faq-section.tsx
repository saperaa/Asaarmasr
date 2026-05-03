import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { EyeOfHorusGlyph } from "./egyptian-glyphs";
import { LuxuryIcon } from "./luxury-icon";

const faqs = [
  {
    question: "How often are gold prices updated on this website?",
    answer: "Gold prices on Asaar Masr are updated every few minutes during active market hours. Our data reflects the latest Egyptian market prices from local dealers and exchanges. The timestamp on each price card shows when the last update occurred.",
  },
  {
    question: "What is the difference between 24K, 21K, and 18K gold?",
    answer: "The karat (K) indicates the purity of gold. 24K is pure gold (99.9%), 21K is 87.5% pure gold mixed with other metals, and 18K is 75% pure gold. In Egypt, 21K is the most popular for jewelry. Higher purity means higher price per gram but also softer metal.",
  },
  {
    question: "Why do gold prices in Egypt differ from international prices?",
    answer: "Egyptian gold prices are affected by multiple factors: the international gold price in USD, the USD/EGP exchange rate, local import taxes and duties, dealer margins, and local supply and demand. This is why local prices may differ from global spot prices.",
  },
  {
    question: "How is the Gold Pound price calculated?",
    answer: "The Egyptian Gold Pound (جنيه ذهب) is a traditional gold coin weighing approximately 8 grams of 21K gold. Its price is calculated based on the current 21K gold price per gram multiplied by the coin's weight, plus a small premium for minting.",
  },
  {
    question: "Is it a good time to buy gold now?",
    answer: "We provide price data and educational content to help you make informed decisions, but we do not provide financial advice. Gold is generally considered a safe-haven asset during economic uncertainty. We recommend consulting a licensed financial advisor before making investment decisions.",
  },
  {
    question: "How can I calculate how much my gold is worth?",
    answer: "Use our interactive Gold Price Calculator on this page. Simply select the karat (24K, 21K, 18K, or 14K) and enter the weight in grams. The calculator will instantly show you the current market value in Egyptian Pounds.",
  },
  {
    question: "Are the currency exchange rates on this website accurate?",
    answer: "The currency exchange rates displayed are for informational purposes and are updated regularly throughout the day. For actual transactions, please consult your bank or a licensed exchange bureau, as rates may vary.",
  },
  {
    question: "Can I use this website in Arabic?",
    answer: "We are actively working on a full Arabic version of the website. Currently, some content is available in both Arabic and English. Follow us on social media to be notified when the full Arabic interface is launched.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (index: number) => setOpenIndex(openIndex === index ? null : index);

  return (
    <div>
      <div className="flex items-center gap-4 mb-10">
        <EyeOfHorusGlyph
          size={30}
          className="shrink-0 text-[#D4AF37]/90 [filter:drop-shadow(0_0_14px_rgba(212,175,55,0.35))]"
        />
        <div>
          <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold tracking-[0.05em] text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-white/50 mt-2 font-sans">Everything you need to know about gold prices in Egypt</p>
        </div>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`rounded-2xl border backdrop-blur-md overflow-hidden transition-all duration-300 ${
              openIndex === index
                ? "border-[#D4AF37]/35 bg-white/[0.05] shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
                : "border-[#D4AF37]/15 bg-white/[0.025] hover:border-[#D4AF37]/28"
            }`}
          >
            <button type="button" onClick={() => toggle(index)} className="w-full flex items-center justify-between p-5 text-left group/faq">
              <span className="text-white font-sans font-medium pr-4">{faq.question}</span>
              <LuxuryIcon
                icon={ChevronDown}
                size={22}
                interactive={false}
                className={`shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""}`}
              />
            </button>
            <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-[28rem]" : "max-h-0"}`}>
              <div className="px-5 pb-5 border-t border-[#D4AF37]/15 pt-4">
                <p className="text-white/55 leading-relaxed font-sans">{faq.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
