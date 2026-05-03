import { useEffect, useState } from "react";
import { Eye, EyeOff, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Dialog, DialogPortal, DialogOverlay } from "./ui/dialog";
import { useAuth } from "../context/auth-context";
import { useLang } from "../context/language-context";
import { LuxuryRippleButton } from "./luxury-ripple-button";

export function AuthModal() {
  const { isAuthModalOpen, authModalTab, closeAuthModal, login, register } = useAuth();
  const { t, lang } = useLang();

  const [tab, setTab] = useState<"login" | "register">(authModalTab);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  useEffect(() => {
    if (isAuthModalOpen) {
      setTab(authModalTab);
      setError("");
      setShowPassword(false);
      setLoginEmail("");
      setLoginPassword("");
      setRegName("");
      setRegEmail("");
      setRegPassword("");
    }
  }, [isAuthModalOpen, authModalTab]);

  const switchTab = (newTab: "login" | "register") => {
    setTab(newTab);
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = login(loginEmail, loginPassword);
    if (!ok) setError(t("Please fill in all fields.", "يرجى ملء جميع الحقول."));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const ok = register(regName, regEmail, regPassword);
    if (!ok) setError(t("Please fill in all fields.", "يرجى ملء جميع الحقول."));
  };

  const inputClass =
    "w-full rounded-xl border border-[#D4AF37]/15 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#D4AF37]/45 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.08)]";

  return (
    <Dialog open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <DialogPortal>
        <DialogOverlay className="bg-black/70 backdrop-blur-sm" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%]
            rounded-2xl border border-[#D4AF37]/25 bg-[#0a0a0a] p-8
            shadow-[0_24px_80px_rgba(0,0,0,0.85),0_0_0_1px_rgba(212,175,55,0.06)]
            data-[state=open]:animate-in data-[state=closed]:animate-out
            data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0
            data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95
            duration-200 max-h-[90vh] overflow-y-auto"
          dir={lang === "ar" ? "rtl" : "ltr"}
        >
          {/* Gold top accent line */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute right-4 top-4 rounded-lg p-1.5 text-white/40 transition-colors hover:bg-white/[0.06] hover:text-white/80"
            aria-label="Close"
          >
            <X size={18} />
          </button>

          {/* Heading */}
          <div className="mb-6 text-center">
            <h2 className="font-heading text-2xl font-semibold text-white">
              {tab === "login"
                ? t("Welcome Back", "مرحباً بعودتك")
                : t("Create Account", "إنشاء حساب")}
            </h2>
            <p className="mt-1 font-sans text-sm text-white/45">
              {tab === "login"
                ? t("Sign in to your account to continue", "سجّل دخولك للمتابعة")
                : t("Join Asaar Masr today", "انضم إلى أسعار مصر اليوم")}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mb-6 flex rounded-xl border border-[#D4AF37]/15 bg-white/[0.03] p-1">
            <button
              type="button"
              onClick={() => switchTab("login")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                tab === "login"
                  ? "bg-[#D4AF37]/20 text-[#FFD700] shadow-[0_0_12px_rgba(212,175,55,0.12)]"
                  : "text-white/50 hover:text-white/75"
              }`}
            >
              {t("Sign In", "تسجيل الدخول")}
            </button>
            <button
              type="button"
              onClick={() => switchTab("register")}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-all duration-200 ${
                tab === "register"
                  ? "bg-[#D4AF37]/20 text-[#FFD700] shadow-[0_0_12px_rgba(212,175,55,0.12)]"
                  : "text-white/50 hover:text-white/75"
              }`}
            >
              {t("Register", "إنشاء حساب")}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Login form */}
          {tab === "login" && (
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-white/65"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <LuxuryRippleButton
                type="submit"
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-3 font-sans font-semibold text-[#0a0a0a] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-shadow hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)]"
              >
                {t("Sign In", "تسجيل الدخول")}
              </LuxuryRippleButton>
              <p className="text-center text-xs text-white/30">
                {t("Don't have an account?", "ليس لديك حساب؟")}{" "}
                <button
                  type="button"
                  onClick={() => switchTab("register")}
                  className="text-[#D4AF37]/80 transition-colors hover:text-[#FFD700]"
                >
                  {t("Register", "سجّل الآن")}
                </button>
              </p>
            </form>
          )}

          {/* Register form */}
          {tab === "register" && (
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 transition-colors hover:text-white/65"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <LuxuryRippleButton
                type="submit"
                className="mt-2 w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-3 font-sans font-semibold text-[#0a0a0a] shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-shadow hover:shadow-[0_6px_28px_rgba(212,175,55,0.45)]"
              >
                {t("Create Account", "إنشاء حساب")}
              </LuxuryRippleButton>
              <p className="text-center text-xs text-white/30">
                {t("Already have an account?", "لديك حساب بالفعل؟")}{" "}
                <button
                  type="button"
                  onClick={() => switchTab("login")}
                  className="text-[#D4AF37]/80 transition-colors hover:text-[#FFD700]"
                >
                  {t("Sign In", "تسجيل الدخول")}
                </button>
              </p>
            </form>
          )}
        </DialogPrimitive.Content>
      </DialogPortal>
    </Dialog>
  );
}
