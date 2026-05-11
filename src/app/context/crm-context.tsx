import { createContext, useContext, useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CrmRole = "admin" | "shipper";

export interface CrmUser {
  id: string;
  name: string;
  email: string;
  role: CrmRole;
}

export interface NewCrmUser {
  name: string;
  email: string;
  password: string;
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
  trackingNumber: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPhone: string;
  shippingNotes: string;
  createdAt: string;
}

export type GoldKarat = "24K" | "22K" | "21K" | "18K" | "14K";

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  readTime: string;
  imageUrl: string;
  trend: "up" | "neutral" | "down";
  published: boolean;
  createdAt: string;
}

export interface NewBlogPost {
  title: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  image_url: string;
  trend: "up" | "neutral" | "down";
  published: boolean;
}

export interface Product {
  id: string;
  name_en: string;
  name_ar: string;
  karat: GoldKarat;
  description_en: string;
  description_ar: string;
  imageUrl: string;
  active: boolean;
  createdAt: string;
}

// ─── API helper ───────────────────────────────────────────────────────────────

const API = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:3001";
const TOKEN_KEY = "crm_token";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> | undefined) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CrmContextType {
  loading: boolean;
  crmUser: CrmUser | null;
  crmLogin: (email: string, password: string) => Promise<boolean>;
  crmLogout: () => void;

  stores: Store[];
  addStore: (store: Omit<Store, "id" | "createdAt">) => Promise<void>;
  updateStore: (id: string, updates: Partial<Store>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;

  orders: Order[];
  updateOrderStatus: (id: string, status: OrderStatus, trackingNumber?: string) => Promise<void>;

  products: Product[];
  addProduct: (product: Omit<Product, "id" | "createdAt">) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;

  crmUsers: CrmUser[];
  addCrmUser: (user: NewCrmUser) => Promise<void>;
  deleteCrmUser: (id: string) => Promise<void>;

  blogPosts: BlogPost[];
  addBlogPost: (post: NewBlogPost) => Promise<void>;
  updateBlogPost: (id: string, updates: Partial<NewBlogPost>) => Promise<void>;
  deleteBlogPost: (id: string) => Promise<void>;
}

const CrmContext = createContext<CrmContextType>({
  loading: true,
  crmUser: null,
  crmLogin: async () => false,
  crmLogout: () => {},
  stores: [],
  addStore: async () => {},
  updateStore: async () => {},
  deleteStore: async () => {},
  orders: [],
  updateOrderStatus: async (_id, _status, _tracking?) => {},
  products: [],
  addProduct: async () => {},
  updateProduct: async () => {},
  deleteProduct: async () => {},
  crmUsers: [],
  addCrmUser: async () => {},
  deleteCrmUser: async () => {},
  blogPosts: [],
  addBlogPost: async () => {},
  updateBlogPost: async () => {},
  deleteBlogPost: async () => {},
});

export function CrmProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [crmUser, setCrmUser] = useState<CrmUser | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [crmUsers, setCrmUsers] = useState<CrmUser[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem(TOKEN_KEY);
    if (!savedToken) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { user } = await apiFetch<{ user: CrmUser }>("/api/auth/me", {}, savedToken);
        setToken(savedToken);
        setCrmUser(user);

        const [storesData, ordersData, productsData] = await Promise.all([
          apiFetch<Store[]>("/api/stores", {}, savedToken),
          apiFetch<Order[]>("/api/orders", {}, savedToken),
          apiFetch<Product[]>("/api/products", {}, savedToken),
        ]);
        setStores(storesData);
        setOrders(ordersData);
        setProducts(productsData);

        if (user.role === "admin") {
          const [usersData, blogData] = await Promise.all([
            apiFetch<CrmUser[]>("/api/users", {}, savedToken),
            apiFetch<BlogPost[]>("/api/blog", {}, savedToken),
          ]);
          setCrmUsers(usersData);
          setBlogPosts(blogData);
        }
      } catch {
        sessionStorage.removeItem(TOKEN_KEY);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Poll orders every 30 s while logged in
  useEffect(() => {
    if (!token) return;
    const id = setInterval(async () => {
      try {
        const fresh = await apiFetch<Order[]>("/api/orders", {}, token);
        setOrders(fresh);
      } catch {}
    }, 30_000);
    return () => clearInterval(id);
  }, [token]);

  // Auth
  const crmLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { token: newToken, user } = await apiFetch<{ token: string; user: CrmUser }>(
        "/api/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) }
      );
      setToken(newToken);
      setCrmUser(user);
      sessionStorage.setItem(TOKEN_KEY, newToken);

      const [storesData, ordersData, productsData] = await Promise.all([
        apiFetch<Store[]>("/api/stores", {}, newToken),
        apiFetch<Order[]>("/api/orders", {}, newToken),
        apiFetch<Product[]>("/api/products", {}, newToken),
      ]);
      setStores(storesData);
      setOrders(ordersData);
      setProducts(productsData);

      if (user.role === "admin") {
        const [usersData, blogData] = await Promise.all([
          apiFetch<CrmUser[]>("/api/users", {}, newToken),
          apiFetch<BlogPost[]>("/api/blog", {}, newToken),
        ]);
        setCrmUsers(usersData);
        setBlogPosts(blogData);
      }

      return true;
    } catch {
      return false;
    }
  };

  const crmLogout = () => {
    setCrmUser(null);
    setToken(null);
    setStores([]);
    setOrders([]);
    setProducts([]);
    setCrmUsers([]);
    setBlogPosts([]);
    sessionStorage.removeItem(TOKEN_KEY);
  };

  // Stores
  const addStore = async (store: Omit<Store, "id" | "createdAt">) => {
    const created = await apiFetch<Store>("/api/stores", {
      method: "POST",
      body: JSON.stringify(store),
    }, token);
    setStores((prev) => [...prev, created]);
  };

  const updateStore = async (id: string, updates: Partial<Store>) => {
    const updated = await apiFetch<Store>(`/api/stores/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }, token);
    setStores((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const deleteStore = async (id: string) => {
    await apiFetch<void>(`/api/stores/${id}`, { method: "DELETE" }, token);
    setStores((prev) => prev.filter((s) => s.id !== id));
  };

  // Orders
  const updateOrderStatus = async (id: string, status: OrderStatus, trackingNumber?: string) => {
    const body: Record<string, unknown> = { status };
    if (trackingNumber !== undefined) body.trackingNumber = trackingNumber;
    const updated = await apiFetch<Order>(`/api/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }, token);
    setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
  };

  // Products
  const addProduct = async (product: Omit<Product, "id" | "createdAt">) => {
    const created = await apiFetch<Product>("/api/products", {
      method: "POST",
      body: JSON.stringify(product),
    }, token);
    setProducts((prev) => [...prev, created]);
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const updated = await apiFetch<Product>(`/api/products/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }, token);
    setProducts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const deleteProduct = async (id: string) => {
    await apiFetch<void>(`/api/products/${id}`, { method: "DELETE" }, token);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // CRM Users
  const addCrmUser = async (user: NewCrmUser) => {
    const created = await apiFetch<CrmUser>("/api/users", {
      method: "POST",
      body: JSON.stringify(user),
    }, token);
    setCrmUsers((prev) => [...prev, created]);
  };

  const deleteCrmUser = async (id: string) => {
    await apiFetch<void>(`/api/users/${id}`, { method: "DELETE" }, token);
    setCrmUsers((prev) => prev.filter((u) => u.id !== id));
  };

  // Blog posts
  const addBlogPost = async (post: NewBlogPost) => {
    const created = await apiFetch<BlogPost>("/api/blog", {
      method: "POST",
      body: JSON.stringify(post),
    }, token);
    setBlogPosts((prev) => [created, ...prev]);
  };

  const updateBlogPost = async (id: string, updates: Partial<NewBlogPost>) => {
    const updated = await apiFetch<BlogPost>(`/api/blog/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    }, token);
    setBlogPosts((prev) => prev.map((p) => (p.id === id ? updated : p)));
  };

  const deleteBlogPost = async (id: string) => {
    await apiFetch<void>(`/api/blog/${id}`, { method: "DELETE" }, token);
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <CrmContext.Provider
      value={{
        loading,
        crmUser,
        crmLogin,
        crmLogout,
        stores,
        addStore,
        updateStore,
        deleteStore,
        orders,
        updateOrderStatus,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        crmUsers,
        addCrmUser,
        deleteCrmUser,
        blogPosts,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
      }}
    >
      {children}
    </CrmContext.Provider>
  );
}

export const useCrm = () => useContext(CrmContext);
