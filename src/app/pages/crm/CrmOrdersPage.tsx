import { useState, useEffect } from "react";
import {
  Search, Clock, TrendingUp, Truck, CheckCircle, XCircle,
  Filter, Package, Hash, MapPin, Phone, ChevronDown, ChevronUp, MessageSquare, Wifi,
} from "lucide-react";
import { useCrm, type OrderStatus, type Order } from "../../context/crm-context";
import { cn } from "../../components/ui/utils";

const ALL_STATUSES: OrderStatus[] = ["pending", "processing", "shipped", "delivered", "cancelled"];

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending:    "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  processing: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  shipped:    "text-purple-400 bg-purple-400/10 border-purple-400/20",
  delivered:  "text-green-400 bg-green-400/10 border-green-400/20",
  cancelled:  "text-red-400 bg-red-400/10 border-red-400/20",
};

const STATUS_ICONS: Record<OrderStatus, React.ReactNode> = {
  pending:    <Clock className="w-3 h-3" />,
  processing: <TrendingUp className="w-3 h-3" />,
  shipped:    <Truck className="w-3 h-3" />,
  delivered:  <CheckCircle className="w-3 h-3" />,
  cancelled:  <XCircle className="w-3 h-3" />,
};

const ADMIN_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:    ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped:    ["delivered", "cancelled"],
  delivered:  [],
  cancelled:  [],
};

const SHIPPER_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:    ["cancelled"],
  processing: ["shipped", "cancelled"],
  shipped:    ["delivered", "cancelled"],
  delivered:  [],
  cancelled:  [],
};

function OrderRow({
  order,
  isAdmin,
  getStoreName,
  onUpdateStatus,
}: {
  order: Order;
  isAdmin: boolean;
  getStoreName: (id: string) => string;
  onUpdateStatus: (id: string, status: OrderStatus, tracking?: string) => Promise<void>;
}) {
  const transitions = isAdmin ? ADMIN_TRANSITIONS[order.status] : SHIPPER_TRANSITIONS[order.status];
  const [pending, setPending] = useState<OrderStatus | null>(null);
  const [trackingInput, setTrackingInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const hasShipping = !!(order.shippingAddress || order.shippingCity || order.shippingPhone);

  const handleTransitionClick = (target: OrderStatus) => {
    if (target === "shipped") {
      setPending("shipped");
      setTrackingInput(order.trackingNumber || "");
    } else {
      handleConfirm(target);
    }
  };

  const handleConfirm = async (target: OrderStatus, tracking?: string) => {
    setSaving(true);
    try {
      await onUpdateStatus(order.id, target, tracking);
    } catch {}
    setSaving(false);
    setPending(null);
    setTrackingInput("");
  };

  return (
    <>
      <tr className="hover:bg-white/[0.02] transition-colors">
        <td className="px-4 py-3.5 text-[#D4AF37]/70 font-mono text-xs whitespace-nowrap">
          #{order.id.slice(-8)}
        </td>
        <td className="px-4 py-3.5">
          <p className="text-white/80 whitespace-nowrap">{order.customerName}</p>
          <p className="text-white/35 text-xs">{order.customerEmail}</p>
          {hasShipping && (
            <button
              type="button"
              onClick={() => setShowShipping((v) => !v)}
              className="flex items-center gap-1 mt-1 text-[10px] text-[#D4AF37]/60 hover:text-[#D4AF37] transition-colors"
            >
              <MapPin className="w-2.5 h-2.5" />
              {showShipping ? "Hide address" : "Show address"}
              {showShipping ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
            </button>
          )}
        </td>
        <td className="px-4 py-3.5 text-white/60 whitespace-nowrap max-w-[140px] truncate">{order.product}</td>
        <td className="px-4 py-3.5 text-white/60 text-center">{order.quantity}g</td>
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
          {order.trackingNumber && (
            <div className="flex items-center gap-1 mt-1">
              <Hash className="w-2.5 h-2.5 text-purple-400/60" />
              <span className="text-[10px] text-purple-400/80 font-mono">{order.trackingNumber}</span>
            </div>
          )}
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
                  onClick={() => handleTransitionClick(t)}
                  disabled={saving || pending !== null}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all hover:opacity-80 capitalize whitespace-nowrap disabled:opacity-40",
                    t === "cancelled"
                      ? "text-red-400 bg-red-400/10 border-red-400/20 hover:bg-red-400/20"
                      : "text-[#D4AF37] bg-[#D4AF37]/10 border-[#D4AF37]/20 hover:bg-[#D4AF37]/20"
                  )}
                >
                  {t === "cancelled" ? "Cancel" : t === "shipped" ? "→ Ship" : `→ ${t}`}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-white/20 text-xs">—</span>
          )}
        </td>
      </tr>

      {/* Expandable shipping address row */}
      {showShipping && hasShipping && (
        <tr className="bg-[#D4AF37]/[0.03] border-t border-[#D4AF37]/10">
          <td colSpan={9} className="px-6 py-3">
            <div className="flex flex-wrap gap-6">
              {order.shippingPhone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]/60 flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Phone</p>
                    <p className="text-sm text-white/80 font-medium">{order.shippingPhone}</p>
                  </div>
                </div>
              )}
              {(order.shippingAddress || order.shippingCity) && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Delivery Address</p>
                    <p className="text-sm text-white/80">{order.shippingAddress}</p>
                    {order.shippingCity && (
                      <p className="text-xs text-white/50">{order.shippingCity}</p>
                    )}
                  </div>
                </div>
              )}
              {order.shippingNotes && (
                <div className="flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]/60 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-wider">Notes</p>
                    <p className="text-sm text-white/60 italic">{order.shippingNotes}</p>
                  </div>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}

      {/* Inline tracking number row when marking as shipped */}
      {pending === "shipped" && (
        <tr className="bg-purple-500/[0.04] border-t border-purple-500/10">
          <td colSpan={9} className="px-4 py-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-400" />
                <span className="text-xs text-purple-300 font-medium">
                  Enter tracking number for <span className="text-white">{order.customerName}</span>'s order:
                </span>
              </div>
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="e.g. EG123456789EG (optional)"
                className="flex-1 min-w-[200px] rounded-lg border border-purple-500/30 bg-white/[0.04] px-3 py-1.5 text-sm text-white placeholder-white/25 outline-none focus:border-purple-500/60 font-mono"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleConfirm("shipped", trackingInput.trim() || undefined)}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-medium hover:bg-purple-500/30 transition-all disabled:opacity-50"
                >
                  {saving ? "Saving…" : "Confirm Shipped"}
                </button>
                <button
                  onClick={() => { setPending(null); setTrackingInput(""); }}
                  className="px-3 py-1.5 rounded-lg border border-white/10 text-white/40 text-xs hover:border-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function CrmOrdersPage() {
  const { orders, updateOrderStatus, stores, crmUser } = useCrm();
  const isAdmin = crmUser?.role === "admin";

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [lastSeen, setLastSeen] = useState(orders.length);
  const [sinceUpdate, setSinceUpdate] = useState(0);

  // Track time since last poll and highlight new orders
  useEffect(() => {
    setSinceUpdate(0);
    setLastSeen(orders.length);
    const tick = setInterval(() => setSinceUpdate((s) => s + 1), 1000);
    return () => clearInterval(tick);
  }, [orders]);

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase()) ||
      (o.trackingNumber && o.trackingNumber.toLowerCase().includes(search.toLowerCase()));
    const matchStatus = filterStatus === "all" || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const getStoreName = (storeId: string) =>
    stores.find((s) => s.id === storeId)?.name_en ?? storeId;

  // Stats
  const stats = ALL_STATUSES.map((s) => ({
    status: s,
    count: orders.filter((o) => o.status === s).length,
  }));

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-white font-heading text-2xl font-semibold">Orders</h1>
          <p className="text-white/40 text-sm mt-1">
            {isAdmin
              ? "Manage and update all orders. Admins can advance any status."
              : "You can mark orders as shipped (with tracking) or delivered, and cancel if needed."}
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-green-500/20 bg-green-500/[0.06]">
          <Wifi className="w-3 h-3 text-green-400 animate-pulse" />
          <span className="text-xs text-green-400/80">
            Live · updates every 30s
          </span>
          <span className="text-xs text-white/25">
            ({sinceUpdate}s ago)
          </span>
        </div>
      </div>

      {/* Status summary chips */}
      <div className="flex gap-2 flex-wrap">
        {stats.map(({ status, count }) => (
          <button
            key={status}
            onClick={() => setFilterStatus(filterStatus === status ? "all" : status)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              filterStatus === status
                ? STATUS_COLORS[status]
                : "border-white/10 text-white/40 hover:border-white/20"
            )}
          >
            {STATUS_ICONS[status]}
            <span className="capitalize">{status}</span>
            <span className="font-bold">{count}</span>
          </button>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, product, tracking number…"
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
                {["Order ID", "Customer", "Product", "Qty", "Amount", "Store", "Status / Tracking", "Date", "Actions"].map(
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
                  <td colSpan={9} className="px-4 py-12 text-center">
                    <Package className="w-8 h-8 text-white/15 mx-auto mb-2" />
                    <p className="text-white/30 text-sm">No orders found.</p>
                  </td>
                </tr>
              ) : (
                sorted.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    isAdmin={isAdmin}
                    getStoreName={getStoreName}
                    onUpdateStatus={updateOrderStatus}
                  />
                ))
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
