import { useState } from "react";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import { useCrm } from "../../context/crm-context";

export function CrmLoginPage() {
  const { crmLogin } = useCrm();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    const ok = await crmLogin(email.trim(), password);
    setLoading(false);
    if (ok) {
      navigate("/crm/dashboard");
    } else {
      setError("Invalid email or password.");
    }
  };

  const inputBase =
    "w-full rounded-xl border border-[#D4AF37]/20 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#D4AF37]/50 focus:bg-white/[0.07] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.1)]";

  return (
    <div className="min-h-screen luxury-page-gradient flex items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(212,175,55,0.08) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#FFD700]/10 border border-[#D4AF37]/30 mb-4 shadow-[0_0_32px_rgba(212,175,55,0.2)]">
            <ShieldCheck className="w-8 h-8 text-[#D4AF37]" />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-white mb-1">
            Asaar Masr <span className="text-[#D4AF37]">CRM</span>
          </h1>
          <p className="text-white/40 text-sm">Sign in to access the control panel</p>
        </div>

        {/* Card */}
        <div className="luxury-card rounded-2xl border border-[#D4AF37]/20 bg-white/[0.035] backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type="email"
                  autoComplete="email"
                  placeholder="admin@asaarmasr.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputBase} pl-10`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-white/60 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputBase} pl-10 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full luxury-btn-gold rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-3 font-semibold text-[#0a0a0a] text-sm shadow-[0_8px_24px_rgba(212,175,55,0.3)] hover:shadow-[0_12px_32px_rgba(212,175,55,0.45)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <p className="text-xs text-white/30 text-center mb-2">Demo credentials</p>
            <div className="grid grid-cols-2 gap-2 text-xs text-white/40">
              <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.06]">
                <p className="text-[#D4AF37]/70 font-medium mb-0.5">Admin</p>
                <p>admin@asaarmasr.com</p>
                <p>admin123</p>
              </div>
              <div className="bg-white/[0.03] rounded-lg p-2.5 border border-white/[0.06]">
                <p className="text-[#D4AF37]/70 font-medium mb-0.5">Shipper</p>
                <p>shipper@asaarmasr.com</p>
                <p>ship123</p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          © {new Date().getFullYear()} Asaar Masr — Internal CRM
        </p>
      </div>
    </div>
  );
}
