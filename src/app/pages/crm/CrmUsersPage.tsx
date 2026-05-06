import { useState } from "react";
import { Plus, Trash2, ShieldCheck, Truck, X, Eye, EyeOff } from "lucide-react";
import { useCrm, type CrmRole } from "../../context/crm-context";
import { cn } from "../../components/ui/utils";

const EMPTY_FORM = {
  name: "",
  email: "",
  password: "",
  role: "shipper" as CrmRole,
};

export function CrmUsersPage() {
  const { crmUsers, addCrmUser, deleteCrmUser, crmUser: currentUser } = useCrm();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const set = <K extends keyof typeof EMPTY_FORM>(key: K, value: (typeof EMPTY_FORM)[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const validate = () => {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Invalid email";
    else if (crmUsers.some((u) => u.email.toLowerCase() === form.email.toLowerCase()))
      e.email = "Email already exists";
    if (!form.password.trim()) e.password = "Required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await addCrmUser(form);
      setForm(EMPTY_FORM);
      setErrors({});
      setShowAdd(false);
    } catch { /* error handled by context */ }
  };

  const inputClass = (err?: string) =>
    cn(
      "w-full rounded-xl border bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all focus:bg-white/[0.06]",
      err
        ? "border-red-500/40 focus:border-red-500/60"
        : "border-[#D4AF37]/15 focus:border-[#D4AF37]/40"
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white font-heading text-2xl font-semibold">CRM Users</h1>
          <p className="text-white/40 text-sm mt-1">Manage who has access to this CRM panel.</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] px-4 py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_4px_16px_rgba(212,175,55,0.3)] hover:shadow-[0_8px_24px_rgba(212,175,55,0.4)] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add User
        </button>
      </div>

      {/* Role legend */}
      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-xl border border-[#D4AF37]/15 bg-white/[0.03] px-4 py-2.5">
          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          <div>
            <p className="text-white/80 text-xs font-medium">Admin</p>
            <p className="text-white/35 text-xs">Full access — manage stores, orders, users</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-blue-500/15 bg-white/[0.03] px-4 py-2.5">
          <Truck className="w-4 h-4 text-blue-400" />
          <div>
            <p className="text-white/80 text-xs font-medium">Shipper</p>
            <p className="text-white/35 text-xs">View orders only — can cancel pending/processing/shipped</p>
          </div>
        </div>
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Name", "Email", "Role", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {crmUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37]/30 to-[#FFD700]/10 flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-white/80">{user.name}</span>
                    {user.id === currentUser?.id && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]/70 border border-[#D4AF37]/15">
                        You
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-white/50 text-xs">{user.email}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
                      user.role === "admin"
                        ? "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20"
                        : "text-blue-400 bg-blue-400/10 border-blue-400/20"
                    )}
                  >
                    {user.role === "admin" ? (
                      <ShieldCheck className="w-3 h-3" />
                    ) : (
                      <Truck className="w-3 h-3" />
                    )}
                    {user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {user.id !== currentUser?.id ? (
                    <button
                      onClick={() => setConfirmDelete(user.id)}
                      className="p-1.5 rounded-lg border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 transition-all"
                      aria-label="Delete user"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <span className="text-white/20 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add user modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-[#D4AF37]/20 bg-[#0d0d0d] shadow-[0_24px_80px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
              <h2 className="text-white font-semibold">Add CRM User</h2>
              <button onClick={() => setShowAdd(false)} className="text-white/40 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAdd} className="p-6 space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inputClass(errors.name)}
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="user@asaarmasr.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputClass(errors.email)}
                />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={(e) => set("password", e.target.value)}
                    className={`${inputClass(errors.password)} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Role */}
              <div>
                <label className="block text-xs text-white/50 mb-1.5">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["admin", "shipper"] as CrmRole[]).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => set("role", role)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition-all",
                        form.role === role
                          ? role === "admin"
                            ? "border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37]"
                            : "border-blue-400/40 bg-blue-400/10 text-blue-400"
                          : "border-white/10 text-white/40 hover:border-white/20"
                      )}
                    >
                      {role === "admin" ? (
                        <ShieldCheck className="w-4 h-4" />
                      ) : (
                        <Truck className="w-4 h-4" />
                      )}
                      <span className="capitalize">{role}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdd(false)}
                  className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] py-2.5 text-sm font-semibold text-[#0a0a0a] shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setConfirmDelete(null)} />
          <div className="relative w-full max-w-sm rounded-2xl border border-red-500/20 bg-[#0d0d0d] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.7)]">
            <h3 className="text-white font-semibold mb-2">Remove User?</h3>
            <p className="text-white/50 text-sm mb-5">
              This user will lose access to the CRM immediately.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={async () => { await deleteCrmUser(confirmDelete); setConfirmDelete(null); }}
                className="flex-1 rounded-xl bg-red-500/80 hover:bg-red-500 py-2.5 text-sm font-semibold text-white transition-all"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
