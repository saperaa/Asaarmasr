import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, TrendingUp } from "lucide-react";
import { EgyptianHeadingAccent } from "./egyptian-glyphs";
import { LuxuryIcon } from "./luxury-icon";

const API = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:3001";

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  trend: "up" | "neutral" | "down";
  createdAt: string;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    fetch(`${API}/api/public/blog`)
      .then((r) => r.json())
      .then((data) => setArticles(Array.isArray(data) ? data.slice(0, 4) : []))
      .catch(() => {});
  }, []);

  return (
    <div className="luxury-card p-4 sm:p-6 md:p-8">
      <div className="flex items-start gap-3 md:gap-4 mb-6 md:mb-8">
        <EgyptianHeadingAccent symbol="eye" size={22} className="mt-1 opacity-80 hidden sm:block" />
        <h2 className="luxury-section-heading font-heading text-lg sm:text-xl md:text-2xl font-semibold tracking-[0.04em] text-white flex-1 mb-0">
          Latest Gold Market News
        </h2>
      </div>

      {articles.length === 0 ? (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="luxury-subcard p-4 sm:p-5 animate-pulse">
              <div className="h-4 bg-white/10 rounded mb-3 w-3/4" />
              <div className="h-3 bg-white/5 rounded mb-1 w-1/3" />
              <div className="h-3 bg-white/5 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          {articles.map((article) => (
            <Link key={article.id} to={`/blog/${article.id}`} className="group/news luxury-subcard p-4 sm:p-5 hover:border-[#D4AF37]/40 transition-all">
              <div className="flex items-start justify-between mb-2 gap-2">
                <h3 className="text-white font-sans font-medium text-sm sm:text-base leading-snug flex-1 min-w-0 group-hover/news:text-[#FFD700] transition-colors">
                  {article.title}
                </h3>
                {article.trend === "up" && (
                  <LuxuryIcon icon={TrendingUp} size={16} interactive={false} className="shrink-0 mt-0.5 group-hover/news:scale-110" />
                )}
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/45 mb-2 font-sans">
                <LuxuryIcon icon={Calendar} size={13} interactive={false} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <p className="text-white/50 text-xs sm:text-sm font-sans leading-relaxed">{article.summary}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
