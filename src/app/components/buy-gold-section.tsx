import { useState, useEffect } from "react";
import { Eye, EyeOff, ShoppingCart, CheckCircle, LogOut, Loader2 } from "lucide-react";
import { useAuth } from "../context/auth-context";
import { useGoldApi } from "../hooks/use-gold-api";
import { useLang } from "../context/language-context";
import { LuxuryRippleButton } from "./luxury-ripple-button";
import { EgyptianHeadingAccent } from "./egyptian-glyphs";
import { ScrollReveal } from "./scroll-reveal";

const API = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:3001";

type GoldKarat = "24K" | "22K" | "21K" | "18K" | "14K";

interface ApiProduct {
  id: string;
  name_en: string;
  name_ar: string;
  karat: GoldKarat;
  description_en: string;
  description_ar: string;
  imageUrl: string;
  active: boolean;
}

const KARAT_PRICE_KEY: Record<GoldKarat, string> = {
  "24K": "gram_24k",
  "22K": "gram_21k",
  "21K": "gram_21k",
  "18K": "gram_18k",
  "14K": "gram_18k",
};

export function BuyGoldSection() {
  const { user, isLoggedIn, loading: authLoading, login, register, logout } = useAuth();
  const { data: goldData } = useGoldApi();
  const { t, lang } = useLang();

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [purchased, setPurchased] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stores, setStores] = useState<{ id: string; name_en: string }[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    fetch(`${API}/api/public/stores`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setStores)
      .catch(() => {});
    fetch(`${API}/api/public/products`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setProducts)
      .catch(() => {});
  }, []);

  const getProductPrice = (karat: GoldKarat): number => {
    if (goldData) {
      const key = KARAT_PRICE_KEY[karat] as keyof typeof goldData.prices;
      const priceData = goldData.prices[key as keyof typeof goldData.prices] as { buy: number } | undefined;
      return Math.round((priceData as { buy: number } | undefined)?.buy ?? 0);
    }
    const fallback: Record<GoldKarat, number> = { "24K": 4285, "22K": 4000, "21K": 3749, "18K": 3214, "14K": 2500 };
    return fallback[karat] ?? 0;
  };

  const selected = products.find((p) => p.id === selectedId);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setError(t("Please fill in all fields.", "يرجى ملء جميع الحقول."));
      return;
    }
    const ok = await login(loginEmail.trim(), loginPassword);
    if (!ok) setError(t("Invalid email or password.", "البريد الإلكتروني أو كلمة المرور غير صحيحة."));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setError(t("Please fill in all fields.", "يرجى ملء جميع الحقول."));
      return;
    }
    if (regPassword.length < 6) {
      setError(t("Password must be at least 6 characters.", "كلمة المرور يجب أن تكون 6 أحرف على الأقل."));
      return;
    }
    const ok = await register(regName.trim(), regEmail.trim(), regPassword);
    if (!ok) setError(t("Registration failed. Email may already exist.", "فشل التسجيل. البريد الإلكتروني قد يكون مستخدماً بالفعل."));
  };

  const handleBuyNow = async () => {
    if (!selected || !user) return;
    const storeId = stores[0]?.id;
    if (!storeId) return;

    setSubmitting(true);
    try {
      const price = getProductPrice(selected.karat);
      const res = await fetch(`${API}/api/public/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: user.name,
          customerEmail: user.email,
          product: `${selected.name_en} (${selected.karat})`,
          quantity: 1,
          totalEGP: price,
          storeId,
        }),
      });
      if (res.ok) {
        setPurchased(true);
        setTimeout(() => setPurchased(false), 3000);
      }
    } catch {
      // still show success for demo
      setPurchased(true);
      setTimeout(() => setPurchased(false), 3000);
    } finally {
      setSubmitting(false);
    }
  };

  const switchTab = (tab: "login" | "register") => {
    setAuthTab(tab);
    setError("");
  };

  const inputClass =
    "w-full rounded-xl border border-[#D4AF37]/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#D4AF37]/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)]";

  return (
    <section id="purchase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <ScrollReveal>
        <div className="flex items-start gap-3 md:gap-4 mb-8">
          <EgyptianHeadingAccent symbol="scarab" size={20} className="mt-1 opacity-80 hidden md:block" />
          <div>
            <h2 className="luxury-section-heading font-heading text-3xl md:text-4xl font-semibold text-white mb-1 leading-tight md:leading-snug">
              {t("Buy Gold", "اشتر الذهب")}
            </h2>
            <p className="text-white/45 text-sm font-sans">
              {t("Select a package below, then sign in to complete your purchase.", "اختر الباقة أدناه، ثم سجّل دخولك لإتمام عملية الشراء.")}
            </p>
          </div>
        </div>

        {/* Package selection cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
          {products.map((pkg) => {
            const price = getProductPrice(pkg.karat);
            return (
              <button
                key={pkg.id}
                type="button"
                onClick={() => setSelectedId(pkg.id === selectedId ? null : pkg.id)}
                className={`luxury-card p-6 text-left w-full transition-all duration-300 rounded-2xl ${
                  selectedId === pkg.id
                    ? "border-[#D4AF37]/60 shadow-[0_0_36px_rgba(212,175,55,0.22)] bg-[#D4AF37]/[0.04]"
                    : "hover:border-[#D4AF37]/35 hover:bg-white/[0.025]"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-heading text-base font-medium text-white/80">
                    {lang === "ar" ? pkg.name_ar : pkg.name_en}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border border-[#D4AF37]/30 text-[#D4AF37]">
                    {pkg.karat}
                  </span>
                </div>
                <div className="font-heading text-2xl font-semibold bg-gradient-to-r from-[#D4AF37] to-[#FFD700] bg-clip-text text-transparent mb-3">
                  {price.toLocaleString()}
                  <span className="text-sm font-sans text-white/35 ms-1.5">EGP/g</span>
                </div>
                <p className="text-xs text-white/45 leading-relaxed">
                  {lang === "ar" ? pkg.description_ar : pkg.description_en}
                </p>
                {selectedId === pkg.id && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-[#D4AF37] font-medium">
                    <CheckCircle size={13} />
                    <span>{t("Selected", "محدد")}</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Auth / Purchase panel */}
        <div className="luxury-card rounded-2xl border border-[#D4AF37]/20 bg-white/[0.02] relative overflow-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

          {authLoading ? (
            <div className="p-12 flex items-center justify-center">
              <Loader2 className="w-6 h-6 text-[#D4AF37] animate-spin" />
            </div>
          ) : isLoggedIn ? (
            /* ── Logged in: show Buy Now ── */
            <div className="p-8 md:p-10 flex flex-col items-center gap-6 text-center">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1">{t("Signed in as", "مسجل الدخول بـ")}</p>
                <p className="font-heading text-lg text-[#D4AF37]">{user?.name}</p>
              </div>

              {selected ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.05] px-6 py-4 text-center">
                    <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{t("Selected package", "الباقة المختارة")}</p>
                    <p className="font-heading text-xl text-white">
                      {lang === "ar" ? selected.name_ar : selected.name_en}
                    </p>
                    <p className="text-[#D4AF37] font-heading text-lg">
                      {getProductPrice(selected.karat).toLocaleString()} EGP/g · {selected.karat}
                    </p>
                  </div>

                  <LuxuryRippleButton
                    type="button"
                    onClick={handleBuyNow}
                    disabled={submitting}
                    className={`rounded-2xl px-14 py-4 font-sans font-semibold text-base transition-all duration-300 ${
                      purchased
                        ? "border border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                        : submitting
                        ? "bg-[#D4AF37]/50 text-[#0a0a0a]/50 cursor-wait"
                        : "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#0a0a0a] shadow-[0_8px_32px_rgba(212,175,55,0.38)] hover:shadow-[0_12px_44px_rgba(212,175,55,0.52)]"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2.5">
                      {submitting ? (
                        <><Loader2 className="w-[18px] h-[18px] animate-spin" /> {t("Processing...", "جارٍ المعالجة...")}</>
                      ) : purchased ? (
                        <><CheckCircle size={18} /> {t("Purchase Submitted!", "تم الإرسال!")}</>
                      ) : (
                        <><ShoppingCart size={18} /> {t("Buy Now", "اشتر الآن")}</>
                      )}
                    </span>
                  </LuxuryRippleButton>
                </div>
              ) : (
                <p className="text-white/40 text-sm italic">
                  {t("← Select a gold package above to continue", "← اختر باقة ذهبية أعلاه للمتابعة")}
                </p>
              )}

              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 text-xs text-white/25 hover:text-red-400 transition-colors"
              >
                <LogOut size={13} strokeWidth={1.5} />
                {t("Sign out", "تسجيل الخروج")}
              </button>
            </div>
          ) : (
            /* ── Not logged in: show auth form ── */
            <div className="p-8 md:p-10">
              <div
                className="max-w-md mx-auto"
                dir={lang === "ar" ? "rtl" : "ltr"}
              >
                <div className="text-center mb-6">
                  <h3 className="font-heading text-xl font-semibold text-white mb-1">
                    {t("Sign in to Purchase", "سجّل دخولك للشراء")}
                  </h3>
                  <p className="text-sm text-white/40">
                    {t(
                      "Log in or create an account to buy gold",
                      "سجّل دخولك أو أنشئ حسابًا لشراء الذهب"
                    )}
                  </p>
                </div>

                {/* Tab switcher */}
                <div className="flex rounded-xl border border-[#D4AF37]/15 bg-white/[0.03] p-1 mb-5">
                  <button
                    type="button"
                    onClick={() => switchTab("login")}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                      authTab === "login"
                        ? "bg-[#D4AF37]/20 text-[#FFD700] shadow-[0_0_12px_rgba(212,175,55,0.1)]"
                        : "text-white/50 hover:text-white/75"
                    }`}
                  >
                    {t("Sign In", "تسجيل الدخول")}
                  </button>
                  <button
                    type="button"
                    onClick={() => switchTab("register")}
                    className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                      authTab === "register"
                        ? "bg-[#D4AF37]/20 text-[#FFD700] shadow-[0_0_12px_rgba(212,175,55,0.1)]"
                        : "text-white/50 hover:text-white/75"
                    }`}
                  >
                    {t("Register", "إنشاء حساب")}
                  </button>
                </div>

                {error && (
                  <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                    {error}
                  </div>
                )}

                {authTab === "login" ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                        {t("Email", "البريد الإلكتروني")}
                      </label>
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={inputClass}
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                        {t("Password", "كلمة المرور")}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`${inputClass} pe-12`}
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <LuxuryRippleButton
                      type="submit"
                      className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-3 font-sans font-semibold text-[#0a0a0a] shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)] transition-shadow"
                    >
                      {t("Sign In", "تسجيل الدخول")}
                    </LuxuryRippleButton>
                    <p className="text-center text-xs text-white/30">
                      {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
                      <button
                        type="button"
                        onClick={() => switchTab("register")}
                        className="text-[#D4AF37]/80 hover:text-[#FFD700] transition-colors"
                      >
                        {t("Register", "سجّل الآن")}
                      </button>
                    </p>
                  </form>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                        {t("Full Name", "الاسم الكامل")}
                      </label>
                      <input
                        type="text"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder={t("Your name", "اسمك")}
                        className={inputClass}
                        autoComplete="name"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                        {t("Email", "البريد الإلكتروني")}
                      </label>
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={inputClass}
                        autoComplete="email"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-white/50">
                        {t("Password", "كلمة المرور")}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className={`${inputClass} pe-12`}
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <LuxuryRippleButton
                      type="submit"
                      className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-3 font-sans font-semibold text-[#0a0a0a] shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)] transition-shadow"
                    >
                      {t("Create Account", "إنشاء حساب")}
                    </LuxuryRippleButton>
                    <p className="text-center text-xs text-white/30">
                      {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
                      <button
                        type="button"
                        onClick={() => switchTab("login")}
                        className="text-[#D4AF37]/80 hover:text-[#FFD700] transition-colors"
                      >
                        {t("Sign In", "تسجيل الدخول")}
                      </button>
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>
    </section>
  );
}