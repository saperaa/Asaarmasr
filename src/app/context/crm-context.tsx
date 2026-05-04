import { createContext, useContext, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CrmRole = "admin" | "shipper";

export interface CrmUser {
  id: string;
  name: string;
  email: string;
  password: string; // plain-text for demo; hash in production
  role: CrmRole;
}

export interface Store {
  id: string;
  name_en: string;
  name_ar: string;
  address_en: string;
  address_ar: string;
  phone: string;
  city_en: string;
  city_ar: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  product: string;
  quantity: number;
  totalEGP: number;
  status: OrderStatus;
  storeId: string;
  createdAt: string;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_USERS: CrmUser[] = [
  { id: "u1", name: "Admin User", email: "admin@asaarmasr.com", password: "admin123", role: "admin" },
  { id: "u2", name: "Shipper One", email: "shipper@asaarmasr.com", password: "ship123", role: "shipper" },
];

const SEED_STORES: Store[] = [
  {
    id: "s1",
    name_en: "Cairo Gold Center",
    name_ar: "مركز القاهرة للذهب",
    address_en: "12 Tahrir Square, Downtown Cairo",
    address_ar: "١٢ ميدان التحرير، وسط القاهرة",
    phone: "+20 2 2345 6789",
    city_en: "Cairo",
    city_ar: "القاهرة",
    imageUrl: "",
    active: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "s2",
    name_en: "Alexandria Luxury Jewels",
    name_ar: "مجوهرات الإسكندرية الفاخرة",
    address_en: "5 Corniche Road, Alexandria",
    address_ar: "٥ طريق الكورنيش، الإسكندرية",
    phone: "+20 3 4567 8901",
    city_en: "Alexandria",
    city_ar: "الإسكندرية",
    imageUrl: "",
    active: true,
    createdAt: new Date().toISOString(),
  },
];

const SEED_ORDERS: Order[] = [
  {
    id: "o1",
    customerName: "Ahmed Hassan",
    customerEmail: "ahmed@example.com",
    product: "Gold Bars 24K",
    quantity: 2,
    totalEGP: 8570,
    status: "pending",
    storeId: "s1",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "o2",
    customerName: "Sara Mohamed",
    customerEmail: "sara@example.com",
    product: "Gold Coins 21K",
    quantity: 5,
    totalEGP: 18745,
    status: "processing",
    storeId: "s2",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: "o3",
    customerName: "Khaled Nour",
    customerEmail: "khaled@example.com",
    product: "Gold Jewelry 18K",
    quantity: 1,
    totalEGP: 3214,
    status: "shipped",
    storeId: "s1",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
  },
  {
    id: "o4",
    customerName: "Nadia Farouk",
    customerEmail: "nadia@example.com",
    product: "Gold Bars 24K",
    quantity: 3,
    totalEGP: 12855,
    status: "delivered",
    storeId: "s2",
    createdAt: new Date(Date.now() - 345600000).toISOString(),
  },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────

const LS_STORES = "crm_stores";
const LS_ORDERS = "crm_orders";
const LS_SESSION = "crm_session";

function loadStores(): Store[] {
  try {
    const raw = localStorage.getItem(LS_STORES);
    return raw ? JSON.parse(raw) : SEED_STORES;
  } catch {
    return SEED_STORES;
  }
}

function loadOrders(): Order[] {
  try {
    const raw = localStorage.getItem(LS_ORDERS);
    return raw ? JSON.parse(raw) : SEED_ORDERS;
  } catch {
    return SEED_ORDERS;
  }
}

function loadSession(): CrmUser | null {
  try {
    const raw = sessionStorage.getItem(LS_SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CrmContextType {
  // Auth
  crmUser: CrmUser | null;
  crmLogin: (email: string, password: string) => boolean;
  crmLogout: () => void;

  // Stores
  stores: Store[];
  addStore: (store: Omit<Store, "id" | "createdAt">) => void;
  updateStore: (id: string, updates: Partial<Store>) => void;
  deleteStore: (id: string) => void;

  // Orders
  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus) => void;

  // Users (admin only)
  crmUsers: CrmUser[];
  addCrmUser: (user: Omit<CrmUser, "id">) => void;
  deleteCrmUser: (id: string) => void;
}

const CrmContext = createContext<CrmContextType>({
  crmUser: null,
  crmLogin: () => false,
  crmLogout: () => {},
  stores: [],
  addStore: () => {},
  updateStore: () => {},
  deleteStore: () => {},
  orders: [],
  updateOrderStatus: () => {},
  crmUsers: [],
  addCrmUser: () => {},
  deleteCrmUser: () => {},
});

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [crmUser, setCrmUser] = useState<CrmUser | null>(loadSession);
  const [stores, setStores] = useState<Store[]>(loadStores);
  const [orders, setOrders] = useState<Order[]>(loadOrders);
  const [crmUsers, setCrmUsers] = useState<CrmUser[]>(SEED_USERS);

  // Persist stores & orders
  useEffect(() => {
    localStorage.setItem(LS_STORES, JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
  }, [orders]);

  // Auth
  const crmLogin = (email: string, password: string): boolean => {
    const found = crmUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!found) return false;
    setCrmUser(found);
    try {
      sessionStorage.setItem(LS_SESSION, JSON.stringify(found));
    } catch {}
    return true;
  };

  const crmLogout = () => {
    setCrmUser(null);
    try {
      sessionStorage.removeItem(LS_SESSION);
    } catch {}
  };

  // Stores
  const addStore = (store: Omit<Store, "id" | "createdAt">) => {
    const newStore: Store = {
      ...store,
      id: `s${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setStores((prev) => [...prev, newStore]);
  };

  const updateStore = (id: string, updates: Partial<Store>) => {
    setStores((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStore = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  // Orders
  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  // CRM Users
  const addCrmUser = (user: Omit<CrmUser, "id">) => {
    setCrmUsers((prev) => [...prev, { ...user, id: `u${Date.now()}` }]);
  };

  const deleteCrmUser = (id: string) => {
    setCrmUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <CrmContext.Provider
      value={{
        crmUser,
        crmLogin,
        crmLogout,
        stores,
        addStore,
        updateStore,
        deleteStore,
        orders,
        updateOrderStatus,
        crmUsers,
        addCrmUser,
        deleteCrmUser,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export const useCrm = () => useContext(CrmContext);
