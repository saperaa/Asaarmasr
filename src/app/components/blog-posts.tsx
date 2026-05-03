import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  User,
  ArrowRight,
  TrendingUp,
  Award,
  Banknote,
  Gem,
  Landmark,
  History,
} from "lucide-react";
import { ScarabGlyph } from "./egyptian-glyphs";
import { LuxuryIcon } from "./luxury-icon";

const blogIconHover =
  "group-hover/blog:scale-[1.06] group-hover/blog:[filter:drop-shadow(0_0_12px_rgba(255,215,0,0.65))_drop-shadow(0_0_24px_rgba(212,175,55,0.35))]";

const blogPosts: {
  icon: LucideIcon;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  readTime: string;
}[] = [
  {
    icon: TrendingUp,
    category: "Market Analysis",
    categoryColor: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    title: "Gold Hits New Record High in Egypt as Pound Weakens",
    excerpt:
      "As the Egyptian Pound faces renewed pressure, gold prices have surged to record highs. We analyze the market forces at play and what this means for everyday Egyptians.",
    author: "Ahmed Hassan",
    date: "March 15, 2026",
    readTime: "4 min",
  },
  {
    icon: Award,
    category: "Investment Tips",
    categoryColor: "text-amber-300 bg-amber-400/10 border-amber-400/20",
    title: "5 Things to Know Before Buying Gold in Egypt",
    excerpt:
      "Whether you're a first-time buyer or an experienced investor, these five tips will help you navigate the Egyptian gold market confidently and avoid common pitfalls.",
    author: "Sara Mostafa",
    date: "March 13, 2026",
    readTime: "6 min",
  },
  {
    icon: Banknote,
    category: "Currency",
    categoryColor: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    title: "How USD/EGP Rate Impacts Your Gold Purchase",
    excerpt:
      "The relationship between the US Dollar and Egyptian Pound directly affects gold prices in Egypt. Learn how to use currency trends to time your purchases more effectively.",
    author: "Omar Khalil",
    date: "March 11, 2026",
    readTime: "5 min",
  },
  {
    icon: Gem,
    category: "Lifestyle",
    categoryColor: "text-rose-300 bg-rose-400/10 border-rose-400/20",
    title: "Wedding Season Guide: Getting the Best Gold Price",
    excerpt:
      "Wedding season drives huge demand for gold jewelry in Egypt. Our guide explains how to compare prices, choose the right karat, and get the best deal.",
    author: "Nour Ibrahim",
    date: "March 9, 2026",
    readTime: "7 min",
  },
  {
    icon: Landmark,
    category: "Policy",
    categoryColor: "text-violet-300 bg-violet-400/10 border-violet-400/20",
    title: "Central Bank's New Gold Policy: What It Means for Investors",
    excerpt:
      "The Central Bank of Egypt recently announced new regulations for gold trading. We break down the changes and explain how they will affect individual investors.",
    author: "Ahmed Hassan",
    date: "March 7, 2026",
    readTime: "8 min",
  },
  {
    icon: History,
    category: "Historical Data",
    categoryColor: "text-orange-300 bg-orange-400/10 border-orange-400/20",
    title: "Gold Price in Egypt: A 10-Year Historical Review",
    excerpt:
      "We look back at a decade of gold prices in Egypt, examining the major events that caused price spikes and drops, and what history can tell us about the future.",
    author: "Sara Mostafa",
    date: "March 5, 2026",
    readTime: "10 min",
  },
];

export function BlogPosts() {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <ScarabGlyph
            size={30}
            className="shrink-0 text-[#D4AF37]/90 [filter:drop-shadow(0_0_14px_rgba(212,175,55,0.32))]"
          />
          <div>
            <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold tracking-[0.05em] text-white">Blog & Insights</h2>
            <p className="text-white/50 mt-2 font-sans">In-depth articles and market insights</p>
          </div>
        </div>
        <button
          type="button"
          className="luxury-btn-outline-glow group/va hidden md:flex items-center gap-2 rounded-lg px-2 py-1 font-sans text-sm font-semibold text-[#D4AF37] transition-all duration-[420ms] ease-out hover:text-[#FFD700]"
        >
          View All <LuxuryIcon icon={ArrowRight} size={18} className="group-hover/va:translate-x-0.5 transition-transform" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogPosts.map((post, index) => (
          <div
            key={index}
            className="group/blog luxury-card flex flex-col overflow-hidden p-0 border-[#D4AF37]/18"
          >
            <div className="relative h-36 border-b border-[#D4AF37]/12 bg-gradient-to-br from-white/[0.06] via-black/50 to-black/70 backdrop-blur-sm flex items-center justify-center overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.35]"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(212, 175, 55, 0.12), transparent 65%)",
                }}
              />
              <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-black/40 shadow-[0_0_28px_rgba(212,175,55,0.12)] transition-transform duration-300 group-hover/blog:scale-105 group-hover/blog:border-[#D4AF37]/40 group-hover/blog:shadow-[0_0_36px_rgba(255,215,0,0.18)]">
                <LuxuryIcon icon={post.icon} size={40} interactive={false} className={blogIconHover} />
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className={`text-xs font-semibold font-sans px-2.5 py-1 rounded-lg border w-fit mb-3 ${post.categoryColor}`}>
                {post.category}
              </span>
              <h3 className="font-heading text-lg font-semibold tracking-wide text-white mb-2 group-hover/blog:text-[#FFD700] transition-colors leading-snug flex-1">
                {post.title}
              </h3>
              <p className="text-white/50 text-sm mb-4 leading-relaxed font-sans line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between text-xs text-white/45 pt-3 border-t border-[#D4AF37]/12 font-sans">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <LuxuryIcon icon={User} size={12} interactive={false} />
                    {post.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <LuxuryIcon icon={Calendar} size={12} interactive={false} />
                    {post.date}
                  </span>
                </div>
                <span className="text-[#D4AF37] font-medium">{post.readTime} read</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
