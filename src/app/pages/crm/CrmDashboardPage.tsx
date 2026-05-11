import { ShoppingBag, Store, Users, TrendingUp, Clock, CheckCircle, XCircle, Truck } from "lucide-react";
import { useCrm } from "../../context/crm-context";
import { cn } from "../../components/ui/utils";

const STATUS_COLORS: Record<string, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  processing: <TrendingUp className="w-3 h-3" />,
  shipped: <Truck className="w-3 h-3" />,
  delivered: <CheckCircle className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
};

export function CrmDashboardPage() {
  const { orders, stores, crmUsers, crmUser } = useCrm();

  const totalRevenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalEGP, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const activeStores = stores.filter((s) => s.active).length;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const statCards = [
    {
      label: "Total Orders",
      value: orders.length,
      icon: <ShoppingBag className="w-5 h-5" />,
      color: "from-[#D4AF37]/20 to-[#FFD700]/10",
      border: "border-[#D4AF37]/20",
      iconColor: "text-[#D4AF37]",
    },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: <Clock className="w-5 h-5" />,
      color: "from-yellow-500/20 to-yellow-400/10",
      border: "border-yellow-500/20",
      iconColor: "text-yellow-400",
    },
    {
      label: "Active Stores",
      value: activeStores,
      icon: <Store className="w-5 h-5" />,
      color: "from-blue-500/20 to-blue-400/10",
      border: "border-blue-500/20",
      iconColor: "text-blue-400",
      adminOnly: true,
    },
    {
      label: "Total Revenue",
      value: `EGP ${totalRevenue.toLocaleString()}`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-green-500/20 to-green-400/10",
      border: "border-green-500/20",
      iconColor: "text-green-400",
      adminOnly: true,
    },
  ];

  const visibleStats = statCards.filter((s) => !s.adminOnly || crmUser?.role === "admin");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-white font-heading text-2xl font-semibold">
          Welcome back, <span className="text-[#D4AF37]">{crmUser?.name}</span>
        </h1>
        <p className="text-white/40 text-sm mt-1">Here's what's happening today.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {visibleStats.map((stat) => (
          <div
            key={stat.label}
            className={cn(
              "rounded-2xl border bg-gradient-to-br p-5 backdrop-blur-sm",
              stat.color,
              stat.border
            )}
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-white/50 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
              <span className={cn("p-1.5 rounded-lg bg-white/[0.06]", stat.iconColor)}>{stat.icon}</span>
            </div>
            <p className="text-white text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h2 className="text-white font-semibold text-sm">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.05]">
                {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
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
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-[#D4AF37]/70 font-mono text-xs">#{order.id.slice(-8)}</td>
                  <td className="px-5 py-3.5 text-white/80">{order.customerName}</td>
                  <td className="px-5 py-3.5 text-white/60">{order.product}</td>
                  <td className="px-5 py-3.5 text-white/80 font-medium">
                    EGP {order.totalEGP.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize",
                        STATUS_COLORS[order.status]
                      )}
                    >
                      {STATUS_ICONS[order.status]}
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white/40 text-xs">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Admin-only: store overview */}
      {crmUser?.role === "admin" && (
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.03] backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Store className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="text-white font-semibold text-sm">Stores Overview</h2>
            </div>
            <div className="space-y-2">
              {stores.slice(0, 4).map((store) => (
                <div
                  key={store.id}
                  className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
                >
                  <div>
                    <p className="text-white/80 text-sm">{store.name_en}</p>
                    <p className="text-white/35 text-xs">{store.city_en}</p>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border",
                      store.active
                        ? "text-green-400 bg-green-400/10 border-green-400/20"
                        : "text-red-400 bg-red-400/10 border-red-400/20"
                    )}
                  >
                    {store.active ? "Active" : "Inactive"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.03] backdrop-blur-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-4 h-4 text-[#D4AF37]" />
              <h2 className="text-white font-semibold text-sm">CRM Users</h2>
            </div>
            <div className="space-y-2">
              {crmUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between py-2 border-b border-white/[0.04] last:border-0"
                >
                  <div>
                    <p className="text-white/80 text-sm">{u.name}</p>
                    <p className="text-white/35 text-xs">{u.email}</p>
                  </div>
                  <span
                    className={cn(
                      "text-xs px-2 py-0.5 rounded-full border capitalize",
                      u.role === "admin"
                        ? "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20"
                        : "text-blue-400 bg-blue-400/10 border-blue-400/20"
                    )}
                  >
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
