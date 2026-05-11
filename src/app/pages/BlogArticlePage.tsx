import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { Calendar, User, Clock, ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { LuxuryAmbientBackdrop } from "../components/luxury-ambient-backdrop";
import { LuxuryIcon } from "../components/luxury-icon";

const API = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:3001";

interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
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

function TrendBadge({ trend }: { trend: BlogPost["trend"] }) {
  if (trend === "up")   return <span className="flex items-center gap-1 text-xs text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full"><TrendingUp className="w-3 h-3" /> Trending Up</span>;
  if (trend === "down") return <span className="flex items-center gap-1 text-xs text-red-400 bg-red-400/10 border border-red-400/20 px-2 py-0.5 rounded-full"><TrendingDown className="w-3 h-3" /> Trending Down</span>;
  return <span className="flex items-center gap-1 text-xs text-white/40 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full"><Minus className="w-3 h-3" /> Neutral</span>;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

export function BlogArticlePage() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`${API}/api/public/blog/${id}`)
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="relative min-h-screen luxury-page-gradient font-sans text-white">
      <LuxuryAmbientBackdrop />
      <Header />

      <main className="relative z-[1] max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-[#D4AF37] transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> All Articles
        </Link>

        {loading && (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-white/10 rounded w-3/4" />
            <div className="h-4 bg-white/5 rounded w-1/2" />
            <div className="h-64 bg-white/5 rounded-2xl" />
          </div>
        )}

        {notFound && (
          <div className="text-center py-24">
            <p className="text-white/40 text-lg mb-4">Article not found.</p>
            <Link to="/blog" className="text-[#D4AF37] hover:underline text-sm">← Back to Blog</Link>
          </div>
        )}

        {post && (
          <article>
            {/* Cover image */}
            {post.imageUrl && (
              <div className="w-full h-64 rounded-2xl overflow-hidden mb-8 border border-[#D4AF37]/15">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Category + Trend */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${CATEGORY_COLORS[post.category] ?? CATEGORY_COLORS["General"]}`}>
                {post.category}
              </span>
              <TrendBadge trend={post.trend} />
            </div>

            {/* Title */}
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-white leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-white/45 pb-6 border-b border-[#D4AF37]/15 mb-8 font-sans flex-wrap">
              <span className="flex items-center gap-1.5"><LuxuryIcon icon={User} size={13} interactive={false} />{post.author || "Asaar Masr Team"}</span>
              <span className="flex items-center gap-1.5"><LuxuryIcon icon={Calendar} size={13} interactive={false} />{formatDate(post.createdAt)}</span>
              <span className="flex items-center gap-1.5 text-[#D4AF37]/70"><LuxuryIcon icon={Clock} size={13} interactive={false} />{post.readTime || "5 min"} read</span>
            </div>

            {/* Summary */}
            <p className="text-white/70 text-lg leading-relaxed mb-8 font-sans italic border-l-2 border-[#D4AF37]/40 pl-5">
              {post.summary}
            </p>

            {/* Full content — split by double newline into paragraphs */}
            <div className="space-y-5 font-sans text-white/65 leading-loose text-base">
              {(post.content || "").split(/\n\n+/).map((para, i) => {
                const trimmed = para.trim();
                if (!trimmed) return null;
                // Lines starting with a digit + period/dot → treat as a section heading
                if (/^\d+\./.test(trimmed)) {
                  const [heading, ...rest] = trimmed.split("\n");
                  return (
                    <div key={i}>
                      <p className="text-[#D4AF37] font-semibold text-base mb-1">{heading}</p>
                      {rest.length > 0 && <p>{rest.join(" ")}</p>}
                    </div>
                  );
                }
                // Lines that are short and followed by content → sub-heading
                const lines = trimmed.split("\n");
                if (lines.length > 1 && lines[0].length < 60 && !lines[0].endsWith(".")) {
                  return (
                    <div key={i}>
                      <p className="text-white/90 font-semibold mb-1">{lines[0]}</p>
                      <p>{lines.slice(1).join(" ")}</p>
                    </div>
                  );
                }
                return <p key={i}>{trimmed.replace(/\n/g, " ")}</p>;
              })}
            </div>

            {/* Footer nav */}
            <div className="mt-12 pt-8 border-t border-[#D4AF37]/15">
              <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[#D4AF37] hover:text-[#FFD700] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to all articles
              </Link>
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
