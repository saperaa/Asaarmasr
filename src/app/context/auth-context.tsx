import { createContext, useContext, useState, useEffect } from "react";

interface CustomerUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: CustomerUser | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

const API = (import.meta.env.VITE_API_URL as string | undefined) || "http://localhost:3001";
const CUSTOMER_TOKEN_KEY = "customer_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(CUSTOMER_TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`${API}/api/customer/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem(CUSTOMER_TOKEN_KEY);
        }
      })
      .catch(() => {
        localStorage.removeItem(CUSTOMER_TOKEN_KEY);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/api/customer/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API}/api/customer/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) return false;
      const data = await res.json();
      localStorage.setItem(CUSTOMER_TOKEN_KEY, data.token);
      setUser(data.user);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CUSTOMER_TOKEN_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);