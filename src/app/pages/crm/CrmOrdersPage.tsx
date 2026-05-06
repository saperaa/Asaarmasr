import { useState } from "react";
import { Search, Clock, TrendingUp, Truck, CheckCircle, XCircle, Filter } from "lucide-react";
import { useCrm, type OrderStatus } from "../../context/crm-context";
import { cn } from "../../components/ui/utils";

const ALL_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  shipped: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled: "text-red-400 bg-red-400/10 border-red-400/20",
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending: <Clock className="w-3 h-3" />,
  processing: <TrendingUp className="w-3 h-3" />,
  shipped: <Truck className="w-3 h-3" />,
  delivered: <CheckCircle className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
};

// Statuses a shipper can transition to (cancel or leave = keep current)
const SHIPPER_ALLOWED_TRANSITIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  pending: ["cancelled"],
  processing: ["cancelled"],
  shipped: ["cancelled"],
};

// Statuses an admin can transition to
const ADMIN_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered", "cancelled"],
  delivered: [],
  cancelled: [],
};

export function CrmOrdersPage() {
  const { orders, updateOrderStatus, stores, crmUser } = useCrm();
  const isAdmin = crmUser?.role === "admin";

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStoreName = (storeId: string) =>
    stores.find((s) => s.id === storeId)?.name_en ?? storeId;

  const getTransitions = (status: OrderStatus): OrderStatus[] => {
    if (isAdmin) return ADMIN_TRANSITIONS[status] ?? [];
    return SHIPPER_ALLOWED_TRANSITIONS[status] ?? [];
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-white font-heading text-2xl font-semibold">Orders</h1>
        <p className="text-white/40 text-sm mt-1">
          {isAdmin
            ? "Manage and update all orders."
            : "View orders. You can cancel orders that haven't been delivered yet."}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, product, or order ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-[#D4AF37]/15 bg-white/[0.04] pl-10 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-[#D4AF37]/40 focus:bg-white/[0.06] transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as OrderStatus | "all")}
            className="appearance-none rounded-xl border border-[#D4AF37]/15 bg-[#0a0a0a] pl-9 pr-8 py-2.5 text-sm text-white/70 outline-none focus:border-[#D4AF37]/40 transition-all cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-[#D4AF37]/15 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                {["Order ID", "Customer", "Product", "Qty", "Amount", "Store", "Status", "Date", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-medium text-white/30 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {sorted.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-10 text-center text-white/30 text-sm">
                    No orders found.
                  </td>
                </tr>
              ) : (
                sorted.map((order) => {
                  const transitions = getTransitions(order.status);
                  return (
                    <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5 text-[#D4AF37]/70 font-mono text-xs whitespace-nowrap">
                        #{order.id}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-white/80 whitespace-nowrap">{order.customerName}</p>
                        <p className="text-white/35 text-xs">{order.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3.5 text-white/60 whitespace-nowrap">{order.product}</td>
                      <td className="px-4 py-3.5 text-white/60 text-center">{order.quantity}</td>
                      <td className="px-4 py-3.5 text-white/80 font-medium whitespace-nowrap">
                        EGP {order.totalEGP.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 text-white/50 text-xs whitespace-nowrap">
                        {getStoreName(order.storeId)}
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize whitespace-nowrap",
                            STATUS_COLORS[order.status]
                          )}
                        >
                          {STATUS_ICONS[order.status]}
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-white/40 text-xs whitespace-nowrap">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3.5">
                        {transitions.length > 0 ? (
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {transitions.map((t) => (
                              <button
                                key={t}
                                onClick={async () => { try { await updateOrderStatus(order.id, t); } catch {} }}
                                className={cn(
                                  "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all hover:opacity-80 capitalize whitespace-nowrap",
                                  t === "cancelled"
                                    ? "text-red-400 bg-red-400/10 border-red-400/20 hover:bg-red-400/20"
                                    : "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20 hover:bg-[#D4AF37]/20"
                                )}
                              >
                                {t === "cancelled" ? "Cancel" : `→ ${t}`}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className="text-white/20 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-white/[0.04] text-xs text-white/30">
          {sorted.length} order{sorted.length !== 1 ? "s" : ""} shown
        </div>
      </div>
    </div>
  );
}
