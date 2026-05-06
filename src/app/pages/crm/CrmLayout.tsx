import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router";
import {
  LayoutDashboard,
  Store,
  ShoppingBag,
  Users,
  Package,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useCrm } from "../../context/crm-context";
import { cn } from "../../components/ui/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/crm/dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
  { label: "Orders",    href: "/crm/orders",    icon: <ShoppingBag className="w-4 h-4" /> },
  { label: "Products",  href: "/crm/products",  icon: <Package className="w-4 h-4" />, adminOnly: true },
  { label: "Stores",    href: "/crm/stores",    icon: <Store className="w-4 h-4" />, adminOnly: true },
  { label: "Users",     href: "/crm/users",     icon: <Users className="w-4 h-4" />, adminOnly: true },
];

export function CrmLayout({ children }: { children: React.ReactNode }) {
  const { crmUser, crmLogout } = useCrm();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    crmLogout();
    navigate("/crm");
  };

  const visibleNav = navItems.filter((item) => !item.adminOnly || crmUser?.role === "admin");

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-[#D4AF37]/10">
        <Link to="/crm/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37]/30 to-[#FFD700]/10 border border-[#D4AF37]/30 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Asaar Masr</p>
            <p className="text-[#D4AF37]/60 text-[10px] mt-0.5">CRM Panel</p>
          </div>
        </Link>
      </div>

      {/* User badge */}
      <div className="px-4 py-3 mx-3 mt-4 rounded-xl bg-white/[0.04] border border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37]/40 to-[#FFD700]/20 flex items-center justify-center text-[#D4AF37] font-bold text-xs">
            {crmUser?.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{crmUser?.name}</p>
            <div className="flex items-center gap-1 mt-0.5">
              {crmUser?.role === "admin" ? (
                <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
              ) : (
                <Truck className="w-3 h-3 text-blue-400" />
              )}
              <span className="text-[10px] text-white/40 capitalize">{crmUser?.role}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleNav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-[#D4AF37]/20 to-[#FFD700]/10 text-[#D4AF37] border border-[#D4AF37]/20 shadow-[0_0_12px_rgba(212,175,55,0.1)]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              )}
            >
              <span className={active ? "text-[#D4AF37]" : "text-white/40"}>{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {active && <ChevronRight className="w-3 h-3 ml-auto text-[#D4AF37]/60" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pb-5 space-y-2">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/[0.04] transition-all"
        >
          <Store className="w-4 h-4" />
          <span>View Website</span>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen luxury-page-gradient flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 border-r border-[#D4AF37]/10 bg-[#050505]/80 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 bg-[#0a0a0a] border-r border-[#D4AF37]/10 flex flex-col z-10">
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center gap-4 px-4 sm:px-6 h-14 border-b border-[#D4AF37]/10 bg-[#050505]/80 backdrop-blur-xl">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="text-white/70 text-sm font-medium">
              {navItems.find((n) => n.href === pathname)?.label ?? "CRM"}
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/30">
            <span className="hidden sm:inline">{crmUser?.email}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37]/80 border border-[#D4AF37]/20 capitalize">
              {crmUser?.role}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
