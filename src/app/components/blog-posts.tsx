import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Calendar, User, ArrowRight, TrendingUp, Award, Banknote, Gem, Landmark, History, FileText, Clock,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ScarabGlyph } from "./egyptian-glyphs";
import { LuxuryIcon } from "./luxury-icon";

const API = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:3001";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  category: string;
  author: string;
  readTime: string;
  imageUrl: string;
  trend: "up" | "neutral" | "down";
  createdAt: string;
}

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "Market Analysis": TrendingUp,
  "Investment Tips": Award,
  "Currency":        Banknote,
  "Lifestyle":       Gem,
  "Policy":          Landmark,
  "Historical Data": History,
  "General":         FileText,
};

const CATEGORY_COLORS: Record<string, string> = {
  "Market Analysis": "text-sky-300 bg-sky-400/10 border-sky-400/20",
  "Investment Tips": "text-amber-300 bg-amber-400/10 border-amber-400/20",
  "Currency":        "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  "Lifestyle":       "text-rose-300 bg-rose-400/10 border-rose-400/20",
  "Policy":          "text-violet-300 bg-violet-400/10 border-violet-400/20",
  "Historical Data": "text-orange-300 bg-orange-400/10 border-orange-400/20",
  "General":         "text-white/50 bg-white/5 border-white/10",
};

const blogIconHover =
  "group-hover/blog:scale-[1.06] group-hover/blog:[filter:drop-shadow(0_0_12px_rgba(255,215,0,0.65))_drop-shadow(0_0_24px_rgba(212,175,55,0.35))]";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function BlogPosts() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch(`${API}/api/public/blog`)
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <ScarabGlyph size={30} className="shrink-0 text-[#D4AF37]/90 [filter:drop-shadow(0_0_14px_rgba(212,175,55,0.32))]" />
          <div>
            <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold tracking-[0.05em] text-white">Blog & Insights</h2>
            <p className="text-white/50 mt-2 font-sans">In-depth articles and market insights</p>
          </div>
        </div>
        <Link
          to="/blog"
          className="luxury-btn-outline-glow group/va hidden md:flex items-center gap-2 rounded-lg px-2 py-1 font-sans text-sm font-semibold text-[#D4AF37] transition-all duration-[420ms] ease-out hover:text-[#FFD700]"
        >
          View All <LuxuryIcon icon={ArrowRight} size={18} className="group-hover/va:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="luxury-card animate-pulse h-64 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => {
            const Icon = CATEGORY_ICONS[post.category] ?? FileText;
            const catColor = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS["General"];
            return (
              <Link
                key={post.id}
                to={`/blog/${post.id}`}
                className="group/blog luxury-card flex flex-col overflow-hidden p-0 border-[#D4AF37]/18 hover:border-[#D4AF37]/40 transition-all"
              >
                <div className="relative h-36 border-b border-[#D4AF37]/12 bg-gradient-to-br from-white/[0.06] via-black/50 to-black/70 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                  {post.imageUrl ? (
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover/blog:scale-105 transition-transform duration-500" />
                  ) : (
                    <>
                      <div className="pointer-events-none absolute inset-0 opacity-[0.35]"
                        style={{ background: "radial-gradient(ellipse 80% 70% at 50% 40%, rgba(212, 175, 55, 0.12), transparent 65%)" }} />
                      <div className="relative flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-black/40 shadow-[0_0_28px_rgba(212,175,55,0.12)] transition-transform duration-300 group-hover/blog:scale-105 group-hover/blog:border-[#D4AF37]/40 group-hover/blog:shadow-[0_0_36px_rgba(255,215,0,0.18)]">
                        <LuxuryIcon icon={Icon} size={40} interactive={false} className={blogIconHover} />
                      </div>
                    </>
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className={`text-xs font-semibold font-sans px-2.5 py-1 rounded-lg border w-fit mb-3 ${catColor}`}>
                    {post.category}
                  </span>
                  <h3 className="font-heading text-lg font-semibold tracking-wide text-white mb-2 group-hover/blog:text-[#FFD700] transition-colors leading-snug flex-1">
                    {post.title}
                  </h3>
                  <p className="text-white/50 text-sm mb-4 leading-relaxed font-sans line-clamp-3">{post.summary}</p>
                  <div className="flex items-center justify-between text-xs text-white/45 pt-3 border-t border-[#D4AF37]/12 font-sans">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><LuxuryIcon icon={User} size={12} interactive={false} />{post.author || "Asaar Masr Team"}</span>
                      <span className="flex items-center gap-1"><LuxuryIcon icon={Calendar} size={12} interactive={false} />{formatDate(post.createdAt)}</span>
                    </div>
                    <span className="text-[#D4AF37] font-medium flex items-center gap-1">
                      <LuxuryIcon icon={Clock} size={12} interactive={false} />{post.readTime || "5 min"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Mobile View All */}
      <div className="mt-8 flex justify-center md:hidden">
        <Link to="/blog" className="flex items-center gap-2 text-sm font-semibold text-[#D4AF37] hover:text-[#FFD700] transition-colors">
          View All Articles <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
