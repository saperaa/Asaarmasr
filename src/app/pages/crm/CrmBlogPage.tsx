import { useState } from "react";
import { Plus, Pencil, Trash2, FileText, TrendingUp, Minus, TrendingDown, ToggleLeft, ToggleRight, X } from "lucide-react";
import { useCrm, type BlogPost, type NewBlogPost } from "../../context/crm-context";
import { cn } from "../../components/ui/utils";

const CATEGORIES = ["Market Analysis", "Investment Tips", "Currency", "Lifestyle", "Policy", "Historical Data", "General"];

const TREND_OPTIONS: { value: NewBlogPost["trend"]; label: string; icon: React.ReactNode; color: string }[] = [
  { value: "up",      label: "Trending Up",  icon: <TrendingUp className="w-3.5 h-3.5" />,  color: "text-green-400 border-green-400/30 bg-green-400/10" },
  { value: "neutral", label: "Neutral",       icon: <Minus className="w-3.5 h-3.5" />,        color: "text-white/50 border-white/15 bg-white/5" },
  { value: "down",    label: "Trending Down", icon: <TrendingDown className="w-3.5 h-3.5" />, color: "text-red-400 border-red-400/30 bg-red-400/10" },
];

const EMPTY_FORM: NewBlogPost = {
  title: "", summary: "", content: "", category: "Market Analysis",
  author: "", read_time: "5 min", image_url: "", trend: "neutral", published: true,
};

function BlogFormModal({
  initial, onSave, onClose, title,
}: {
  initial: NewBlogPost;
  onSave: (data: NewBlogPost) => Promise<void>;
  onClose: () => void;
  title: string;
}) {
  const [form, setForm] = useState<NewBlogPost>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof NewBlogPost, string>>>({});
  const [saving, setSaving] = useState(false);

  const set = <K extends keyof NewBlogPost>(key: K, value: NewBlogPost[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Partial<Record<keyof NewBlogPost, string>> = {};
    if (!form.title.trim())   e.title   = "Required";
    if (!form.summary.trim()) e.summary = "Required";
    if (!form.content.trim()) e.content = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try { await onSave(form); } finally { setSaving(false); }
  };

  const inputClass = (err?: string) => cn(
    "w-full rounded-xl border bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all focus:bg-white/[0.06]",
    err ? "border-red-500/40 focus:border-red-500/60" : "border-[#D4AF37]/15 focus:border-[#D4AF37]/40"
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl border border-[#D4AF37]/20 bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-white font-semibold">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Title *</label>
            <input type="text" placeholder="Article title..." value={form.title}
              onChange={(e) => set("title", e.target.value)} className={inputClass(errors.title)} />
            {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
          </div>

          {/* Category + Author + Read time */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)}
                className={cn(inputClass(), "appearance-none cursor-pointer")}>
                {CATEGORIES.map((c) => <option key={c} value={c} className="bg-[#0d0d0d]">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Author</label>
              <input type="text" placeholder="Your name" value={form.author}
                onChange={(e) => set("author", e.target.value)} className={inputClass()} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">Read Time</label>
              <input type="text" placeholder="5 min" value={form.read_time}
                onChange={(e) => set("read_time", e.target.value)} className={inputClass()} />
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Summary * <span className="text-white/25">(shown in cards)</span></label>
            <textarea rows={2} placeholder="Brief description shown in the blog card..."
              value={form.summary} onChange={(e) => set("summary", e.target.value)}
              className={cn(inputClass(errors.summary), "resize-none")} />
            {errors.summary && <p className="text-red-400 text-xs mt-1">{errors.summary}</p>}
          </div>

          {/* Content */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Full Article Content * <span className="text-white/25">(use blank lines to separate paragraphs)</span></label>
            <textarea rows={10} placeholder="Write the full article here...&#10;&#10;Start a new paragraph by leaving a blank line between sections."
              value={form.content} onChange={(e) => set("content", e.target.value)}
              className={cn(inputClass(errors.content), "resize-y font-mono text-xs leading-relaxed")} />
            {errors.content && <p className="text-red-400 text-xs mt-1">{errors.content}</p>}
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Cover Image URL <span className="text-white/25">(optional)</span></label>
            <input type="text" placeholder="https://..." value={form.image_url}
              onChange={(e) => set("image_url", e.target.value)} className={inputClass()} />
          </div>

          {/* Trend */}
          <div>
            <label className="block text-xs text-white/50 mb-2">Market Trend</label>
            <div className="flex gap-2">
              {TREND_OPTIONS.map((opt) => (
                <button key={opt.value} type="button" onClick={() => set("trend", opt.value)}
                  className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all",
                    form.trend === opt.value ? opt.color : "border-white/10 text-white/30 hover:border-white/20")}>
                  {opt.icon} {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Published */}
          <div className="flex items-center justify-between py-1">
            <span className="text-sm text-white/60">Published <span className="text-white/25 text-xs">(visible on website)</span></span>
            <button type="button" onClick={() => set("published", !form.published)}
              className={cn("transition-colors", form.published ? "text-green-400" : "text-white/30")}>
              {form.published ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white transition-all">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all disabled:opacity-60">
              {saving ? "Saving..." : "Save Article"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TrendBadge({ trend }: { trend: BlogPost["trend"] }) {
  const opt = TREND_OPTIONS.find((o) => o.value === trend)!;
  return (
    <span className={cn("flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium", opt.color)}>
      {opt.icon} {opt.label}
    </span>
  );
}

export function CrmBlogPage() {
  const { blogPosts, addBlogPost, updateBlogPost, deleteBlogPost } = useCrm();
  const [showAdd, setShowAdd] = useState(false);
  const [editPost, setEditPost] = useState<BlogPost | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleAdd = async (data: NewBlogPost) => { await addBlogPost(data); setShowAdd(false); };
  const handleEdit = async (data: NewBlogPost) => {
    if (!editPost) return;
    await updateBlogPost(editPost.id, data);
    setEditPost(null);
  };
  const handleDelete = async (id: string) => { await deleteBlogPost(id); setConfirmDelete(null); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-heading text-2xl font-semibold">Blog & News</h1>
          <p className="text-white/40 text-sm mt-1">Manage articles shown in the Blog & Insights and News sections.</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] transition-all">
          <Plus className="w-4 h-4" /> New Article
        </button>
      </div>

      <div className="space-y-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.03] backdrop-blur-sm p-5 hover:border-[#D4AF37]/25 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="text-xs px-2 py-0.5 rounded-full border border-[#D4AF37]/20 text-[#D4AF37]/70 bg-[#D4AF37]/5">{post.category}</span>
                  <TrendBadge trend={post.trend} />
                  <span className={cn("text-xs px-2 py-0.5 rounded-full border",
                    post.published ? "text-green-400 bg-green-400/10 border-green-400/20" : "text-white/40 bg-white/5 border-white/10")}>
                    {post.published ? "Published" : "Draft"}
                  </span>
                </div>
                <h3 className="text-white font-medium text-sm leading-snug mb-1">{post.title}</h3>
                <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{post.summary}</p>
                <p className="text-white/25 text-xs mt-1">{post.author || "Asaar Masr Team"} · {post.readTime || "5 min"} read</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button onClick={() => void updateBlogPost(post.id, { published: !post.published })}
                  className={cn("p-1.5 rounded-lg border transition-all",
                    post.published ? "border-green-400/20 text-green-400 hover:bg-green-400/10" : "border-white/10 text-white/30 hover:border-white/20")}
                  aria-label="Toggle published">
                  {post.published ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                </button>
                <button onClick={() => setEditPost(post)}
                  className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-[#D4AF37] hover:border-[#D4AF37]/20 transition-all" aria-label="Edit">
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setConfirmDelete(post.id)}
                  className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 transition-all" aria-label="Delete">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {blogPosts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-[#D4AF37]/15 p-12 text-center">
            <FileText className="w-10 h-10 text-white/15 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No articles yet. Write your first post.</p>
          </div>
        )}
      </div>

      {showAdd && <BlogFormModal title="New Article" initial={EMPTY_FORM} onSave={handleAdd} onClose={() => setShowAdd(false)} />}
      {editPost && (
        <BlogFormModal title="Edit Article"
          initial={{ title: editPost.title, summary: editPost.summary, content: editPost.content, category: editPost.category, author: editPost.author, read_time: editPost.readTime, image_url: editPost.imageUrl, trend: editPost.trend, published: editPost.published }}
          onSave={handleEdit} onClose={() => setEditPost(null)} />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0d0d0d] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
            <h3 className="text-white font-semibold mb-2">Delete Article?</h3>
            <p className="text-white/50 text-sm mb-5">This will permanently remove the article from the website.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmDelete(null)} className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white transition-all">Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} className="flex-1 rounded-xl bg-red-500/80 hover:bg-red-500 py-2.5 text-sm font-semibold text-white transition-all">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
