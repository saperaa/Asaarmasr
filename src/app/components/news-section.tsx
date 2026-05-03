import { Calendar, TrendingUp } from "lucide-react";
import { EgyptianHeadingAccent } from "./egyptian-glyphs";
import { LuxuryIcon } from "./luxury-icon";

const newsArticles = [
  {
    title: "Gold Prices Rise as Global Economic Uncertainty Increases",
    date: "March 14, 2026",
    summary:
      "Gold prices in Egypt continue to climb as investors seek safe-haven assets amid global economic concerns.",
    trend: "up",
  },
  {
    title: "Central Bank Announces New Gold Import Regulations",
    date: "March 13, 2026",
    summary:
      "New regulations aim to stabilize the local gold market and ensure transparency in pricing.",
    trend: "neutral",
  },
  {
    title: "Egyptian Gold Exports Reach Record High",
    date: "March 12, 2026",
    summary:
      "Egypt's gold exports have reached unprecedented levels, boosting the local economy.",
    trend: "up",
  },
  {
    title: "Consumer Demand for 21K Gold Jewelry Surges",
    date: "March 11, 2026",
    summary:
      "Local jewelers report increased demand for 21K gold jewelry ahead of the wedding season.",
    trend: "up",
  },
];

export function NewsSection() {
  return (
    <div className="luxury-card p-6 md:p-8">
      <div className="flex items-start gap-3 md:gap-4 mb-8">
        <EgyptianHeadingAccent symbol="eye" size={22} className="mt-1 opacity-80 hidden sm:block" />
        <h2 className="luxury-section-heading font-heading text-xl md:text-2xl font-semibold tracking-[0.04em] text-white flex-1 mb-0">
          Latest Gold Market News
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {newsArticles.map((article, index) => (
          <div
            key={index}
            className="group/news luxury-subcard cursor-pointer p-5"
          >
            <div className="flex items-start justify-between mb-2 gap-2">
              <h3 className="text-white font-sans font-medium pr-2 leading-snug">{article.title}</h3>
              {article.trend === "up" && (
                <LuxuryIcon icon={TrendingUp} size={18} interactive={false} className="shrink-0 mt-0.5 group-hover/news:scale-110" />
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-white/45 mb-2 font-sans">
              <LuxuryIcon icon={Calendar} size={14} interactive={false} />
              <span>{article.date}</span>
            </div>
            <p className="text-white/50 text-sm font-sans leading-relaxed">{article.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
