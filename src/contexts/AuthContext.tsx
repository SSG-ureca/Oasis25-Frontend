import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../services/api";
import type { AuthStatusResponse, User } from "../types/auth";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (status: AuthStatusResponse) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const REFRESH_BUFFER_MS = 60_000;

interface MyProfileResponse {
  email: string;
  nickname: string;
  profileImage: string | null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRefreshTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    clearRefreshTimeout();
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore
    }
    setUser(null);
    setIsAuthenticated(false);
  }, [clearRefreshTimeout]);

  const scheduleRefresh = useCallback(
    (expiresIn: number) => {
      clearRefreshTimeout();
      const delay = Math.max(expiresIn * 1000 - REFRESH_BUFFER_MS, 0);
      timeoutRef.current = setTimeout(async () => {
        try {
          const response = await api.post<AuthStatusResponse>("/api/auth/reissue");
          const { expiresIn: newExpiresIn } = response.data;
          setUser(response.data.user);
          setIsAuthenticated(true);
          scheduleRefresh(newExpiresIn);
        } catch {
          await handleLogout();
        }
      }, delay);
    },
    [clearRefreshTimeout, handleLogout]
  );

  const handleLogin = useCallback(
    (status: AuthStatusResponse) => {
      setUser(status.user);
      setIsAuthenticated(true);
      scheduleRefresh(status.expiresIn);
    },
    [scheduleRefresh]
  );

  useEffect(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenType");

    api
      .get<MyProfileResponse>("/api/users/me", { __noRedirect: true } as any)
      .then((response) => {
        const { email, nickname, profileImage } = response.data;
        setUser({ email, nickname, profileImageUrl: profileImage });
        setIsAuthenticated(true);
      })
      .catch(() => {
        setIsAuthenticated(false);
      })
      .finally(() => {
        setIsLoading(false);
      });

    return clearRefreshTimeout;
  }, [clearRefreshTimeout]);

  const value: AuthContextValue = {
    isAuthenticated,
    isLoading,
    user,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
