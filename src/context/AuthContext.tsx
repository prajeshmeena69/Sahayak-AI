import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { getCurrentUser, logout as cognitoLogout, isAuthenticated } from "@/services/cognitoService";

interface AuthState {
  user: string | null;
  loading: boolean;
  authenticated: boolean;
}

interface AuthContextValue extends AuthState {
  refreshUser: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true, authenticated: false });

  const refreshUser = () => {
    const user = getCurrentUser();
    setState({ user, loading: false, authenticated: !!user });
  };

  const logout = () => {
    cognitoLogout();
    setState({ user: null, loading: false, authenticated: false });
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      setState({ user: null, loading: false, authenticated: false });
    } else {
      refreshUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
