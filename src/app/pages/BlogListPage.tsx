import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Calendar, User, Clock, TrendingUp, ArrowLeft, TrendingDown, Minus } from "lucide-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { LuxuryAmbientBackdrop } from "../components/luxury-ambient-backdrop";
import { ScarabGlyph } from "../components/egyptian-glyphs";
import { LuxuryIcon } from "../components/luxury-icon";

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

const CATEGORY_COLORS: Record<string, string> = {
  "Market Analysis": "text-sky-300 bg-sky-400/10 border-sky-400/20",
  "Investment Tips": "text-amber-300 bg-amber-400/10 border-amber-400/20",
  "Currency":        "text-emerald-300 bg-emerald-400/10 border-emerald-400/20",
  "Lifestyle":       "text-rose-300 bg-rose-400/10 border-rose-400/20",
  "Policy":          "text-violet-300 bg-violet-400/10 border-violet-400/20",
  "Historical Data": "text-orange-300 bg-orange-400/10 border-orange-400/20",
  "General":         "text-white/50 bg-white/5 border-white/10",
};

function TrendIcon({ trend }: { trend: BlogPost["trend"] }) {
  if (trend === "up")   return <LuxuryIcon icon={TrendingUp}   size={16} interactive={false} />;
  if (trend === "down") return <LuxuryIcon icon={TrendingDown} size={16} interactive={false} />;
  return <LuxuryIcon icon={Minus} size={16} interactive={false} />;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function BlogListPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/public/blog`)
      .then((r) => r.json())
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="relative min-h-screen luxury-page-gradient font-sans text-white">
      <LuxuryAmbientBackdrop />
      <Header />

      <main className="relative z-[1] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Heading */}
        <div className="flex items-center gap-4 mb-12">
          <ScarabGlyph size={28} className="shrink-0 text-[#D4AF37]/90 [filter:drop-shadow(0_0_14px_rgba(212,175,55,0.32))]" />
          <div>
            <h1 className="luxury-section-heading font-heading text-4xl md:text-5xl font-semibold text-white">Blog & Insights</h1>
            <p className="text-white/50 mt-2 font-sans">In-depth articles and market insights</p>
          </div>
        </div>

        {/* Back link */}
        <Link to="/#blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#D4AF37] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="luxury-card animate-pulse h-64 rounded-2xl" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-white/30">No articles published yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => {
              const catColor = CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS["General"];
              return (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="group/blog luxury-card flex flex-col overflow-hidden p-0 border-[#D4AF37]/18 hover:border-[#D4AF37]/40 transition-all"
                >
                  {/* Cover */}
                  <div className="relative h-36 border-b border-[#D4AF37]/12 bg-gradient-to-br from-white/[0.06] via-black/50 to-black/70 flex items-center justify-center overflow-hidden">
                    {post.imageUrl ? (
                      <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover/blog:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border border-[#D4AF37]/25 bg-black/40 shadow-[0_0_28px_rgba(212,175,55,0.12)] group-hover/blog:scale-105 group-hover/blog:border-[#D4AF37]/40 transition-all duration-300">
                        <TrendIcon trend={post.trend} />
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <span className={`text-xs font-semibold font-sans px-2.5 py-1 rounded-lg border w-fit mb-3 ${catColor}`}>
                      {post.category}
                    </span>
                    <h3 className="font-heading text-base font-semibold tracking-wide text-white mb-2 group-hover/blog:text-[#FFD700] transition-colors leading-snug flex-1">
                      {post.title}
                    </h3>
                    <p className="text-white/50 text-sm mb-4 leading-relaxed font-sans line-clamp-2">{post.summary}</p>
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
      </main>

      <Footer />
    </div>
  );
}
