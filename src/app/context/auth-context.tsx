import { createContext, useContext, useState } from "react";

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => false,
  register: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string): boolean => {
    if (!email.trim() || !password.trim()) return false;
    setUser({ name: email.split("@")[0], email });
    return true;
  };

  const register = (name: string, email: string, password: string): boolean => {
    if (!name.trim() || !email.trim() || !password.trim()) return false;
    setUser({ name, email });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: user !== null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
