import type { LucideIcon } from "lucide-react";
import { Clock, ChevronRight, Star, BarChart2, Gem, BookOpen } from "lucide-react";
import { AnkhGlyph } from "./egyptian-glyphs";
import { LuxuryIcon } from "./luxury-icon";

const articles: {
  icon: LucideIcon;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  readTime: string;
  tags: string[];
}[] = [
  {
    icon: Gem,
    category: "Beginner",
    categoryColor: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    title: "Understanding Gold Karats: 24K, 21K, 18K Explained",
    excerpt: "Learn the difference between gold purities and how they affect pricing, durability, and suitability for jewelry vs. investment.",
    readTime: "5 min read",
    tags: ["Basics", "Karats", "Jewelry"],
  },
  {
    icon: BarChart2,
    category: "Intermediate",
    categoryColor: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    title: "How to Invest in Gold in Egypt: A Complete Guide",
    excerpt: "Explore the different ways to invest in gold — from physical bars and coins to gold certificates and ETFs available in the Egyptian market.",
    readTime: "8 min read",
    tags: ["Investment", "Strategy", "Egypt"],
  },
  {
    icon: Star,
    category: "Advanced",
    categoryColor: "text-violet-300 bg-violet-400/10 border-violet-400/20",
    title: "Gold vs. Stocks: Which is More Profitable in Egypt?",
    excerpt: "A data-driven comparison of gold and stock market performance in Egypt over the past decade, including risk analysis and portfolio strategies.",
    readTime: "12 min read",
    tags: ["Analysis", "Stocks", "Risk"],
  },
  {
    icon: BookOpen,
    category: "Beginner",
    categoryColor: "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
    title: "What Drives Gold Prices? Key Factors Explained",
    excerpt: "Understand the global and local factors that influence gold prices — from USD strength and inflation to central bank policies and seasonal demand.",
    readTime: "6 min read",
    tags: ["Economics", "Prices", "Basics"],
  },
  {
    icon: Gem,
    category: "Intermediate",
    categoryColor: "text-sky-300 bg-sky-400/10 border-sky-400/20",
    title: "Gold Jewelry vs. Gold Bars: What Should You Buy?",
    excerpt: "Compare the pros and cons of buying gold jewelry versus gold bars or coins as an investment, including resale value and workmanship costs.",
    readTime: "7 min read",
    tags: ["Jewelry", "Bars", "Investment"],
  },
  {
    icon: BarChart2,
    category: "Advanced",
    categoryColor: "text-violet-300 bg-violet-400/10 border-violet-400/20",
    title: "Reading Gold Price Charts: A Technical Guide",
    excerpt: "Learn how to read and interpret gold price charts, identify trends, and use technical indicators to make better buying and selling decisions.",
    readTime: "10 min read",
    tags: ["Charts", "Technical", "Trading"],
  },
];

export function EducationalArticles() {
  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <AnkhGlyph
            size={30}
            className="shrink-0 text-[#D4AF37]/90 [filter:drop-shadow(0_0_14px_rgba(212,175,55,0.32))]"
          />
          <div>
            <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold tracking-[0.05em] text-white">Educational Articles</h2>
            <p className="text-white/50 mt-2 font-sans">Learn everything about gold investment</p>
          </div>
        </div>
        <button
          type="button"
          className="luxury-btn-outline-glow group/va hidden md:flex items-center gap-2 rounded-lg px-2 py-1 font-sans text-sm font-semibold text-[#D4AF37] transition-all duration-[420ms] ease-out hover:text-[#FFD700]"
        >
          View All <LuxuryIcon icon={ChevronRight} size={18} className="group-hover/va:translate-x-0.5 transition-transform" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article, index) => (
          <div
            key={index}
            className="group/edu luxury-card p-6 flex flex-col cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="rounded-xl border border-[#D4AF37]/15 bg-black/35 p-2.5 backdrop-blur-sm">
                <LuxuryIcon icon={article.icon} size={28} interactive={false} className="group-hover/edu:scale-105" />
              </div>
              <span className={`text-xs font-semibold font-sans px-2.5 py-1 rounded-lg border ${article.categoryColor}`}>{article.category}</span>
            </div>
            <h3 className="font-heading text-lg font-semibold tracking-wide text-white mb-2 group-hover/edu:text-[#FFD700] transition-colors leading-snug">
              {article.title}
            </h3>
            <p className="text-white/50 text-sm mb-4 leading-relaxed font-sans flex-1">{article.excerpt}</p>
            <div className="flex items-center justify-between gap-2 mt-auto">
              <div className="flex gap-2 flex-wrap">
                {article.tags.map((tag) => (
                  <span key={tag} className="text-xs text-white/45 bg-white/[0.06] border border-white/[0.06] px-2 py-0.5 rounded-md font-sans">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1 text-white/45 text-xs shrink-0 font-sans">
                <LuxuryIcon icon={Clock} size={12} interactive={false} />
                <span>{article.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
