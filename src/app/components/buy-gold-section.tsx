import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Eye, EyeOff, ShoppingCart, CheckCircle, LogOut, Loader2,
  X, Plus, Minus, Package, Tag, Sparkles,
  Clock, TrendingUp, Truck, XCircle, RefreshCw, Hash,
} from "lucide-react";
import { useAuth } from "../context/auth-context";
import { useGoldApi } from "../hooks/use-gold-api";
import { useLang } from "../context/language-context";
import { LuxuryRippleButton } from "./luxury-ripple-button";

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

const KARAT_PURITY: Record<GoldKarat, number> = {
  "24K": 99.9,
  "22K": 91.6,
  "21K": 87.5,
  "18K": 75.0,
  "14K": 58.5,
};

const KARAT_COLOR: Record<GoldKarat, string> = {
  "24K": "from-yellow-300 to-amber-400",
  "22K": "from-yellow-400 to-amber-500",
  "21K": "from-amber-400 to-yellow-600",
  "18K": "from-amber-500 to-orange-500",
  "14K": "from-orange-400 to-amber-600",
};

const GRAM_OPTIONS = [1, 5, 10, 25, 50, 100];

// ── Order types ───────────────────────────────────────────────────────────────

type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

interface CustomerOrder {
  id: string;
  product: string;
  quantity: number;
  totalEGP: number;
  status: OrderStatus;
  trackingNumber: string;
  createdAt: string;
}

const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; labelAr: string; color: string; icon: React.ReactNode }
> = {
  pending:    { label: "Pending",    labelAr: "قيد الانتظار", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20", icon: <Clock className="w-3 h-3" /> },
  processing: { label: "Processing", labelAr: "جارٍ المعالجة", color: "text-blue-400 bg-blue-400/10 border-blue-400/20",    icon: <TrendingUp className="w-3 h-3" /> },
  shipped:    { label: "Shipped",    labelAr: "تم الشحن",      color: "text-purple-400 bg-purple-400/10 border-purple-400/20", icon: <Truck className="w-3 h-3" /> },
  delivered:  { label: "Delivered",  labelAr: "تم التسليم",    color: "text-green-400 bg-green-400/10 border-green-400/20",   icon: <CheckCircle className="w-3 h-3" /> },
  cancelled:  { label: "Cancelled",  labelAr: "ملغي",          color: "text-red-400 bg-red-400/10 border-red-400/20",         icon: <XCircle className="w-3 h-3" /> },
};

const ORDER_STEPS: OrderStatus[] = ["pending", "processing", "shipped", "delivered"];

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = ORDER_STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border capitalize ${cfg.color}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function OrderProgressBar({ status }: { status: OrderStatus }) {
  if (status === "cancelled") return null;
  const currentIdx = ORDER_STEPS.indexOf(status);
  return (
    <div className="flex items-center gap-0 mt-3">
      {ORDER_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const isLast = i === ORDER_STEPS.length - 1;
        return (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border transition-all ${
                done
                  ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                  : "border-white/20 bg-white/[0.03] text-white/20"
              }`}
            >
              {done ? <CheckCircle className="w-3 h-3" /> : <span className="text-[8px] font-bold">{i + 1}</span>}
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-1 transition-all ${done && currentIdx > i ? "bg-[#D4AF37]" : "bg-white/10"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function MyOrders({ token, lang, t, refreshKey }: { token: string; lang: string; t: (en: string, ar: string) => string; refreshKey: number }) {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/customer/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
        setLastUpdated(new Date());
      }
    } catch {}
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchOrders();
    intervalRef.current = setInterval(fetchOrders, 30_000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchOrders, refreshKey]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-10">
        <Package className="w-8 h-8 text-white/15 mx-auto mb-2" />
        <p className="text-white/35 text-sm">{t("No orders yet.", "لا توجد طلبات بعد.")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-white/30">
          {t("Auto-updates every 30s", "يتحدث كل 30 ثانية")}
          {lastUpdated && (
            <span className="ms-2 text-white/20">
              · {t("Last", "آخر تحديث")} {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </span>
        <button
          type="button"
          onClick={fetchOrders}
          className="flex items-center gap-1 text-xs text-white/30 hover:text-[#D4AF37] transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          {t("Refresh", "تحديث")}
        </button>
      </div>

      {orders.map((order) => {
        const cfg = ORDER_STATUS_CONFIG[order.status];
        return (
          <div
            key={order.id}
            className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 space-y-3"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <p className="text-white/80 text-sm font-medium leading-tight">{order.product}</p>
                <p className="text-white/35 text-xs mt-0.5">
                  {order.quantity}g · EGP {order.totalEGP.toLocaleString()}
                  <span className="ms-2 text-white/20">
                    {new Date(order.createdAt).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-GB")}
                  </span>
                </p>
              </div>
              <OrderStatusBadge status={order.status} />
            </div>

            {/* Progress bar */}
            {order.status !== "cancelled" && <OrderProgressBar status={order.status} />}

            {/* Tracking number */}
            {order.trackingNumber && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/[0.07] border border-purple-500/20">
                <Truck className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-purple-400/70 uppercase tracking-wider">
                    {t("Tracking Number", "رقم التتبع")}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Hash className="w-2.5 h-2.5 text-purple-300/60" />
                    <span className="text-sm text-purple-200 font-mono font-semibold">
                      {order.trackingNumber}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Status message */}
            <p className="text-[10px] text-white/25 italic">
              {order.status === "pending"    && t("Your order has been received and is awaiting confirmation.", "تم استلام طلبك وهو بانتظار التأكيد.")}
              {order.status === "processing" && t("Your order is being prepared at our store.", "طلبك قيد التجهيز في المتجر.")}
              {order.status === "shipped"    && t("Your order is on its way! Track it using the number above.", "طلبك في الطريق إليك! تتبعه بالرقم أعلاه.")}
              {order.status === "delivered"  && t("Order delivered successfully. Thank you!", "تم تسليم الطلب بنجاح. شكراً لك!")}
              {order.status === "cancelled"  && t("This order was cancelled.", "تم إلغاء هذا الطلب.")}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function detectCategory(name: string): "bars" | "coins" | "jewelry" | "default" {
  const lower = name.toLowerCase();
  if (lower.includes("bar") || lower.includes("سبيكة") || lower.includes("بليون")) return "bars";
  if (lower.includes("coin") || lower.includes("عملة") || lower.includes("جنيه")) return "coins";
  if (lower.includes("jewel") || lower.includes("مجوهرات") || lower.includes("خاتم") || lower.includes("سلسلة")) return "jewelry";
  return "default";
}

function ProductIcon({ category, karat }: { category: ReturnType<typeof detectCategory>; karat: GoldKarat }) {
  const gradient = KARAT_COLOR[karat];
  if (category === "bars") {
    return (
      <svg viewBox="0 0 80 60" className="w-20 h-16 drop-shadow-lg">
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(${i * 4}, ${i * -4})`}>
            <rect x="8" y="20" width="64" height="20" rx="3" className={`fill-current`} style={{ fill: "url(#barGrad)" }} opacity={1 - i * 0.25} />
            <rect x="12" y="23" width="56" height="3" rx="1" fill="rgba(255,255,255,0.3)" />
          </g>
        ))}
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#B8860B" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (category === "coins") {
    return (
      <svg viewBox="0 0 80 60" className="w-20 h-16 drop-shadow-lg">
        {[2, 1, 0].map((i) => (
          <ellipse key={i} cx="40" cy={`${42 - i * 5}`} rx="28" ry="10" style={{ fill: "url(#coinGrad)" }} opacity={1 - i * 0.2} />
        ))}
        <ellipse cx="40" cy="22" rx="28" ry="14" style={{ fill: "url(#coinGrad)" }} />
        <ellipse cx="40" cy="20" rx="22" ry="10" fill="rgba(255,255,255,0.15)" />
        <text x="40" y="24" textAnchor="middle" fontSize="10" fill="rgba(0,0,0,0.5)" fontWeight="bold">Au</text>
        <defs>
          <linearGradient id="coinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFE066" />
            <stop offset="100%" stopColor="#C8960C" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  if (category === "jewelry") {
    return (
      <svg viewBox="0 0 80 60" className="w-20 h-16 drop-shadow-lg">
        <circle cx="40" cy="30" r="18" stroke="url(#jewGrad)" strokeWidth="5" fill="none" />
        <circle cx="40" cy="30" r="22" stroke="url(#jewGrad)" strokeWidth="2" fill="none" opacity="0.4" />
        <circle cx="40" cy="9" r="4" style={{ fill: "url(#jewGrad)" }} />
        <path d="M30 18 L40 30 L50 18" stroke="#FFD700" strokeWidth="2" fill="none" />
        <defs>
          <linearGradient id="jewGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD700" />
            <stop offset="100%" stopColor="#D4AF37" />
          </linearGradient>
        </defs>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 80 60" className="w-20 h-16 drop-shadow-lg">
      <polygon points="40,8 70,28 60,52 20,52 10,28" style={{ fill: "url(#defGrad)" }} />
      <polygon points="40,15 62,30 54,48 26,48 18,30" fill="rgba(255,255,255,0.1)" />
      <defs>
        <linearGradient id="defGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD700" />
          <stop offset="100%" stopColor="#B8860B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function ProductCard({
  product,
  price,
  isSelected,
  lang,
  t,
  onSelect,
}: {
  product: ApiProduct;
  price: number;
  isSelected: boolean;
  lang: string;
  t: (en: string, ar: string) => string;
  onSelect: () => void;
}) {
  const category = detectCategory(product.name_en + " " + product.name_ar);
  const purity = KARAT_PURITY[product.karat];
  const gradClass = KARAT_COLOR[product.karat];

  return (
    <div
      className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
        isSelected
          ? "border-[#D4AF37] shadow-[0_0_40px_rgba(212,175,55,0.35)] scale-[1.02]"
          : "border-white/10 hover:border-[#D4AF37]/50 hover:shadow-[0_0_24px_rgba(212,175,55,0.18)] hover:scale-[1.01]"
      }`}
      style={{ background: "rgba(255,255,255,0.03)" }}
      onClick={onSelect}
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center py-8"
        style={{
          background: isSelected
            ? "linear-gradient(135deg, rgba(212,175,55,0.25) 0%, rgba(10,10,10,0.8) 100%)"
            : "linear-gradient(135deg, rgba(212,175,55,0.10) 0%, rgba(10,10,10,0.95) 100%)",
        }}
      >
        {/* Karat badge */}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full text-black bg-gradient-to-r ${gradClass}`}
          >
            {product.karat}
          </span>
        </div>

        {/* Selected badge */}
        {isSelected && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 text-xs font-semibold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
              <CheckCircle size={10} />
              {t("Selected", "محدد")}
            </span>
          </div>
        )}

        {/* Product image or icon */}
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name_en}
            className="w-28 h-24 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <ProductIcon category={category} karat={product.karat} />
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5">
        <div className="mb-3">
          <h3 className="font-heading text-base font-semibold text-white leading-tight mb-1">
            {lang === "ar" ? product.name_ar : product.name_en}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/40">
              {t("Purity", "نقاء")}
            </span>
            <span className="text-xs font-semibold text-[#D4AF37]">{purity}%</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1.5">
            <span
              className={`font-heading text-2xl font-bold bg-gradient-to-r ${gradClass} bg-clip-text text-transparent`}
            >
              {price.toLocaleString()}
            </span>
            <span className="text-xs text-white/35">EGP/g</span>
          </div>
          <p className="text-xs text-white/35 mt-0.5">
            {t("Live market price", "سعر السوق المباشر")}
          </p>
        </div>

        {/* Description */}
        {(lang === "ar" ? product.description_ar : product.description_en) && (
          <p className="text-xs text-white/40 leading-relaxed mb-4 flex-1">
            {lang === "ar" ? product.description_ar : product.description_en}
          </p>
        )}

        {/* CTA */}
        <button
          type="button"
          className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
            isSelected
              ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-[0_4px_20px_rgba(212,175,55,0.4)]"
              : "border border-[#D4AF37]/30 text-[#D4AF37] hover:bg-[#D4AF37]/10"
          }`}
        >
          <ShoppingCart size={14} />
          {isSelected ? t("Selected — Checkout Below", "محدد — إكمال الشراء أدناه") : t("Select & Buy", "اختر واشتر")}
        </button>
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-[#D4AF37]/20 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition-all focus:border-[#D4AF37]/50 focus:bg-white/[0.06] focus:shadow-[0_0_0_3px_rgba(212,175,55,0.10)]";

const CUSTOMER_TOKEN_KEY = "customer_token";

export function BuyGoldSection() {
  const { user, isLoggedIn, loading: authLoading, login, register, logout } = useAuth();
  const { data: goldData } = useGoldApi();
  const { t, lang } = useLang();

  const [activeTab, setActiveTab] = useState<"shop" | "orders">("shop");
  const [ordersRefreshKey, setOrdersRefreshKey] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [grams, setGrams] = useState(10);
  const [activeKarat, setActiveKarat] = useState<GoldKarat | "all">("all");
  const [authTab, setAuthTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [purchased, setPurchased] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [stores, setStores] = useState<{ id: string; name_en: string }[]>([]);
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const [shipAddress, setShipAddress] = useState("");
  const [shipCity, setShipCity] = useState("");
  const [shipPhone, setShipPhone] = useState("");
  const [shipNotes, setShipNotes] = useState("");
  const [shipError, setShipError] = useState("");

  useEffect(() => {
    fetch(`${API}/api/public/stores`)
      .then((res) => (res.ok ? res.json() : []))
      .then(setStores)
      .catch(() => {});
    fetch(`${API}/api/public/products`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setProducts(data);
        setLoadingProducts(false);
      })
      .catch(() => setLoadingProducts(false));
  }, []);

  const getProductPrice = (karat: GoldKarat): number => {
    if (goldData) {
      const key = KARAT_PRICE_KEY[karat] as keyof typeof goldData.prices;
      const priceData = goldData.prices[key as keyof typeof goldData.prices] as { buy: number } | undefined;
      return Math.round((priceData as { buy: number } | undefined)?.buy ?? 0);
    }
    const fallback: Record<GoldKarat, number> = {
      "24K": 4285, "22K": 4000, "21K": 3749, "18K": 3214, "14K": 2500,
    };
    return fallback[karat] ?? 0;
  };

  const filteredProducts = useMemo(
    () => activeKarat === "all" ? products : products.filter((p) => p.karat === activeKarat),
    [products, activeKarat]
  );

  const availableKarats = useMemo(
    () => Array.from(new Set(products.map((p) => p.karat))) as GoldKarat[],
    [products]
  );

  const selected = products.find((p) => p.id === selectedId);
  const selectedPrice = selected ? getProductPrice(selected.karat) : 0;
  const totalEGP = selectedPrice * grams;

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
    if (!ok)
      setError(t("Registration failed. Email may already exist.", "فشل التسجيل. البريد الإلكتروني قد يكون مستخدماً بالفعل."));
  };

  const handlePlaceOrder = async () => {
    if (!selected || !user) return;
    setShipError("");
    if (!shipAddress.trim() || !shipCity.trim() || !shipPhone.trim()) {
      setShipError("Please fill in your delivery address, city, and phone number.");
      return;
    }
    const storeId = stores[0]?.id;
    if (!storeId) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/public/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:    user.name,
          customerEmail:   user.email,
          product:         `${selected.name_en} (${selected.karat})`,
          quantity:        grams,
          totalEGP,
          storeId,
          shippingAddress: shipAddress.trim(),
          shippingCity:    shipCity.trim(),
          shippingPhone:   shipPhone.trim(),
          shippingNotes:   shipNotes.trim(),
        }),
      });
      if (res.ok) {
        setPurchased(true);
        setShipAddress(""); setShipCity(""); setShipPhone(""); setShipNotes("");
        setOrdersRefreshKey((k) => k + 1);
        setActiveTab("orders");
        setTimeout(() => { setPurchased(false); setSelectedId(null); }, 3500);
      } else {
        const data = await res.json().catch(() => ({}));
        setShipError((data as { message?: string }).message || "Failed to place order.");
      }
    } catch {
      setPurchased(true);
      setTimeout(() => { setPurchased(false); setSelectedId(null); }, 3500);
    } finally {
      setSubmitting(false);
    }
  };

  const switchTab = (tab: "login" | "register") => {
    setAuthTab(tab);
    setError("");
  };

  return (
    <section id="purchase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* ── Shop header ── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37]/70 font-medium">
              {t("Premium Gold", "ذهب فاخر")}
            </span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white leading-tight">
            {t("Gold Collection", "مجموعة الذهب")}
          </h2>
          <p className="text-white/40 text-sm mt-1.5">
            {t(
              "Certified Egyptian gold at live market prices.",
              "ذهب مصري معتمد بأسعار السوق المباشرة."
            )}
          </p>
        </div>

        {isLoggedIn && user && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#D4AF37]/20 bg-[#D4AF37]/[0.05]">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] flex items-center justify-center text-black font-bold text-xs">
              {user.name?.[0]?.toUpperCase() ?? "U"}
            </div>
            <div className="leading-tight">
              <p className="text-xs text-white/40">{t("Signed in as", "مسجل بـ")}</p>
              <p className="text-sm text-[#D4AF37] font-medium">{user.name}</p>
            </div>
            <button
              type="button"
              onClick={logout}
              className="ms-2 text-white/25 hover:text-red-400 transition-colors"
              title={t("Sign out", "تسجيل الخروج")}
            >
              <LogOut size={14} />
            </button>
          </div>
        )}
      </div>

      {/* ── Tab bar (Shop / My Orders) ── */}
      {isLoggedIn && (
        <div className="flex gap-1 p-1 rounded-xl border border-white/10 bg-white/[0.03] w-fit mb-6">
          {(["shop", "orders"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab
                  ? "bg-[#D4AF37]/20 text-[#FFD700] shadow-[0_0_12px_rgba(212,175,55,0.1)]"
                  : "text-white/45 hover:text-white/70"
              }`}
            >
              {tab === "shop" ? (
                <><ShoppingCart className="w-3.5 h-3.5" /> {t("Shop", "المتجر")}</>
              ) : (
                <><Package className="w-3.5 h-3.5" /> {t("My Orders", "طلباتي")}</>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ── My Orders tab ── */}
      {activeTab === "orders" && isLoggedIn && (
        <MyOrders
          token={localStorage.getItem(CUSTOMER_TOKEN_KEY) || ""}
          lang={lang}
          t={t}
          refreshKey={ordersRefreshKey}
        />
      )}

      {/* ── Shop tab ── */}
      {(activeTab === "shop" || !isLoggedIn) && (
        <>

      {/* ── Karat filter bar ── */}
      {availableKarats.length > 0 && (
        <div className="flex items-center gap-2 mb-7 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveKarat("all")}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
              activeKarat === "all"
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "border-white/15 text-white/50 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
            }`}
          >
            {t("All", "الكل")}
          </button>
          {availableKarats.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setActiveKarat(k)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200 ${
                activeKarat === k
                  ? `bg-gradient-to-r ${KARAT_COLOR[k]} text-black border-transparent`
                  : "border-white/15 text-white/50 hover:border-[#D4AF37]/40 hover:text-[#D4AF37]"
              }`}
            >
              {k}
            </button>
          ))}
          <span className="ms-auto text-xs text-white/30">
            {filteredProducts.length} {t("products", "منتجات")}
          </span>
        </div>
      )}

      {/* ── Products grid + Cart sidebar ── */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          {loadingProducts ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="w-8 h-8 text-[#D4AF37] animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Package className="w-10 h-10 text-white/20 mb-3" />
              <p className="text-white/40 text-sm">
                {t("No products available right now.", "لا توجد منتجات متاحة حالياً.")}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  price={getProductPrice(product.karat)}
                  isSelected={selectedId === product.id}
                  lang={lang}
                  t={t}
                  onSelect={() =>
                    setSelectedId(product.id === selectedId ? null : product.id)
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* ── Cart / checkout sidebar ── */}
        {selected && (
          <div className="lg:w-80 xl:w-96 flex-shrink-0">
            <div
              className="sticky top-6 rounded-2xl border border-[#D4AF37]/25 overflow-hidden"
              style={{ background: "rgba(255,255,255,0.025)" }}
            >
              {/* Sidebar header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#D4AF37]/15">
                <div className="flex items-center gap-2">
                  <ShoppingCart size={15} className="text-[#D4AF37]" />
                  <span className="text-sm font-semibold text-white">
                    {t("Your Order", "طلبك")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  className="text-white/30 hover:text-white/60 transition-colors"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Selected product summary */}
                <div className="rounded-xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.04] p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-white/40 text-[10px] uppercase tracking-wider mb-0.5">
                        {t("Product", "المنتج")}
                      </p>
                      <p className="text-white text-sm font-semibold leading-tight">
                        {lang === "ar" ? selected.name_ar : selected.name_en}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-black bg-gradient-to-r ${KARAT_COLOR[selected.karat]} whitespace-nowrap`}
                    >
                      {selected.karat}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Tag size={11} className="text-[#D4AF37]" />
                    <span className="text-[#D4AF37] text-sm font-semibold">
                      {selectedPrice.toLocaleString()} EGP
                    </span>
                    <span className="text-white/30 text-xs">/ g</span>
                  </div>
                </div>

                {/* Gram selector */}
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/40 mb-2.5 font-medium">
                    {t("Quantity (grams)", "الكمية (جرام)")}
                  </label>

                  {/* Quick gram buttons */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {GRAM_OPTIONS.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGrams(g)}
                        className={`py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150 ${
                          grams === g
                            ? "bg-[#D4AF37]/20 border-[#D4AF37]/60 text-[#FFD700]"
                            : "border-white/10 text-white/40 hover:border-[#D4AF37]/30 hover:text-[#D4AF37]"
                        }`}
                      >
                        {g}g
                      </button>
                    ))}
                  </div>

                  {/* Manual stepper */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setGrams((g) => Math.max(1, g - 1))}
                      className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/50 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
                    >
                      <Minus size={12} />
                    </button>
                    <input
                      type="number"
                      min={1}
                      max={1000}
                      value={grams}
                      onChange={(e) =>
                        setGrams(Math.max(1, Math.min(1000, parseInt(e.target.value) || 1)))
                      }
                      className="flex-1 text-center rounded-lg border border-[#D4AF37]/20 bg-white/[0.04] py-1.5 text-sm text-white outline-none focus:border-[#D4AF37]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setGrams((g) => Math.min(1000, g + 1))}
                      className="w-8 h-8 rounded-lg border border-white/15 flex items-center justify-center text-white/50 hover:border-[#D4AF37]/40 hover:text-[#D4AF37] transition-all"
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                </div>

                {/* Order total */}
                <div className="rounded-xl border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 to-transparent p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/40">{t("Price per gram", "السعر للجرام")}</span>
                    <span className="text-xs text-white/60">{selectedPrice.toLocaleString()} EGP</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-white/40">{t("Quantity", "الكمية")}</span>
                    <span className="text-xs text-white/60">{grams}g</span>
                  </div>
                  <div className="border-t border-[#D4AF37]/15 mt-2.5 pt-2.5 flex items-center justify-between">
                    <span className="text-sm font-semibold text-white">{t("Total", "الإجمالي")}</span>
                    <span className="font-heading text-lg font-bold text-[#FFD700]">
                      {totalEGP.toLocaleString()} EGP
                    </span>
                  </div>
                </div>

                {/* Shipping details (shown for logged-in users) */}
                {!authLoading && isLoggedIn && !purchased && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-semibold text-white/60 uppercase tracking-wider flex items-center gap-1.5">
                      <Truck size={12} className="text-[#D4AF37]" />
                      {t("Delivery Details", "تفاصيل التوصيل")}
                    </p>

                    {shipError && (
                      <div className="rounded-lg border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                        {shipError}
                      </div>
                    )}

                    <input
                      type="tel"
                      value={shipPhone}
                      onChange={(e) => setShipPhone(e.target.value)}
                      placeholder={t("Phone number *", "رقم الهاتف *")}
                      className={inputClass}
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <input
                      type="text"
                      value={shipCity}
                      onChange={(e) => setShipCity(e.target.value)}
                      placeholder={t("City *", "المدينة *")}
                      className={inputClass}
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <textarea
                      value={shipAddress}
                      onChange={(e) => setShipAddress(e.target.value)}
                      placeholder={t("Full delivery address *", "العنوان الكامل للتوصيل *")}
                      rows={2}
                      className={`${inputClass} resize-none`}
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                    <textarea
                      value={shipNotes}
                      onChange={(e) => setShipNotes(e.target.value)}
                      placeholder={t("Delivery notes (optional)", "ملاحظات التوصيل (اختياري)")}
                      rows={2}
                      className={`${inputClass} resize-none`}
                      dir={lang === "ar" ? "rtl" : "ltr"}
                    />
                  </div>
                )}

                {/* Auth loading */}
                {authLoading && (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="w-5 h-5 text-[#D4AF37] animate-spin" />
                  </div>
                )}

                {/* Logged in: place order */}
                {!authLoading && isLoggedIn && (
                  <LuxuryRippleButton
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={submitting}
                    className={`w-full py-3.5 rounded-xl font-sans font-semibold text-sm transition-all duration-300 ${
                      purchased
                        ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                        : submitting
                        ? "bg-[#D4AF37]/40 text-black/50 cursor-wait"
                        : "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black shadow-[0_6px_28px_rgba(212,175,55,0.35)] hover:shadow-[0_8px_36px_rgba(212,175,55,0.5)]"
                    }`}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {submitting ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> {t("Processing...", "جارٍ المعالجة...")}</>
                      ) : purchased ? (
                        <><CheckCircle size={16} /> {t("Order Placed!", "تم الطلب!")}</>
                      ) : (
                        <><ShoppingCart size={16} /> {t("Place Order", "تأكيد الطلب")}</>
                      )}
                    </span>
                  </LuxuryRippleButton>
                )}

                {/* Not logged in: inline auth */}
                {!authLoading && !isLoggedIn && (
                  <div dir={lang === "ar" ? "rtl" : "ltr"}>
                    <div className="text-center mb-4">
                      <p className="text-sm font-semibold text-white mb-0.5">
                        {t("Sign in to Place Order", "سجّل دخولك للطلب")}
                      </p>
                      <p className="text-xs text-white/35">
                        {t("Create an account or log in to continue.", "سجّل أو أنشئ حساباً للمتابعة.")}
                      </p>
                    </div>

                    {/* Tab switcher */}
                    <div className="flex rounded-xl border border-[#D4AF37]/15 bg-white/[0.03] p-1 mb-4">
                      {(["login", "register"] as const).map((tab) => (
                        <button
                          key={tab}
                          type="button"
                          onClick={() => switchTab(tab)}
                          className={`flex-1 rounded-lg py-1.5 text-xs font-medium transition-all duration-200 ${
                            authTab === tab
                              ? "bg-[#D4AF37]/20 text-[#FFD700]"
                              : "text-white/45 hover:text-white/70"
                          }`}
                        >
                          {tab === "login"
                            ? t("Sign In", "دخول")
                            : t("Register", "تسجيل")}
                        </button>
                      ))}
                    </div>

                    {error && (
                      <div className="mb-3 rounded-xl border border-red-500/25 bg-red-500/10 px-3 py-2 text-xs text-red-400">
                        {error}
                      </div>
                    )}

                    {authTab === "login" ? (
                      <form onSubmit={handleLogin} className="space-y-3">
                        <input
                          type="email"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder={t("Email", "البريد الإلكتروني")}
                          className={inputClass}
                          autoComplete="email"
                        />
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder={t("Password", "كلمة المرور")}
                            className={`${inputClass} pe-11`}
                            autoComplete="current-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        <LuxuryRippleButton
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold text-sm shadow-[0_4px_16px_rgba(212,175,55,0.3)]"
                        >
                          {t("Sign In", "تسجيل الدخول")}
                        </LuxuryRippleButton>
                      </form>
                    ) : (
                      <form onSubmit={handleRegister} className="space-y-3">
                        <input
                          type="text"
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder={t("Full Name", "الاسم الكامل")}
                          className={inputClass}
                          autoComplete="name"
                        />
                        <input
                          type="email"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder={t("Email", "البريد الإلكتروني")}
                          className={inputClass}
                          autoComplete="email"
                        />
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder={t("Password (min 6 chars)", "كلمة المرور (6 أحرف)")}
                            className={`${inputClass} pe-11`}
                            autoComplete="new-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 hover:text-white/65 transition-colors"
                            tabIndex={-1}
                          >
                            {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                        <LuxuryRippleButton
                          type="submit"
                          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black font-semibold text-sm shadow-[0_4px_16px_rgba(212,175,55,0.3)]"
                        >
                          {t("Create Account", "إنشاء حساب")}
                        </LuxuryRippleButton>
                      </form>
                    )}
                  </div>
                )}

                {/* Trust badges */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[
                    { en: "Certified Gold", ar: "ذهب معتمد" },
                    { en: "Secure Payment", ar: "دفع آمن" },
                    { en: "Live Prices", ar: "أسعار مباشرة" },
                    { en: "Fast Delivery", ar: "توصيل سريع" },
                  ].map((badge) => (
                    <div
                      key={badge.en}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02]"
                    >
                      <CheckCircle size={10} className="text-[#D4AF37] flex-shrink-0" />
                      <span className="text-[10px] text-white/40 leading-tight">
                        {lang === "ar" ? badge.ar : badge.en}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── No product selected hint ── */}
      {!selected && !loadingProducts && filteredProducts.length > 0 && (
        <div className="mt-8 flex items-center justify-center gap-2 text-white/25 text-sm">
          <ShoppingCart size={15} />
          <span>{t("Select a product above to start your order.", "اختر منتجاً أعلاه لبدء طلبك.")}</span>
        </div>
      )}

        </>
      )}
    </section>
  );
}
