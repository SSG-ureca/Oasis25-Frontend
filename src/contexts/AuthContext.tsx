import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { api } from "../services/api";
import type { AxiosRequestConfig } from "axios";
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
  const hasLoggedIn = useRef(false);

  const clearRefreshTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const handleLogout = useCallback(async () => {
    clearRefreshTimeout();
    hasLoggedIn.current = false;
    try {
      await api.post("/api/auth/logout");
    } catch {
      // ignore
    }
    setUser(null);
    setIsAuthenticated(false);
  }, [clearRefreshTimeout]);

  const scheduleRefresh = useCallback(
    function doScheduleRefresh(expiresIn: number) {
      clearRefreshTimeout();
      const delay = Math.max(expiresIn * 1000 - REFRESH_BUFFER_MS, 0);
      timeoutRef.current = setTimeout(async () => {
        try {
          const response =
            await api.post<AuthStatusResponse>("/api/auth/reissue");
          const { expiresIn: newExpiresIn } = response.data;
          setUser(response.data.user);
          setIsAuthenticated(true);
          doScheduleRefresh(newExpiresIn);
        } catch {
          await handleLogout();
        }
      }, delay);
    },
    [clearRefreshTimeout, handleLogout],
  );

  const handleLogin = useCallback(
    (status: AuthStatusResponse) => {
      hasLoggedIn.current = true;
      setUser(status.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      scheduleRefresh(status.expiresIn);
    },
    [scheduleRefresh],
  );

  useEffect(() => {
    let cancelled = false;
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenType");

    api
      .get<MyProfileResponse>("/api/users/me", {
        __noRedirect: true,
      } as AxiosRequestConfig & { __noRedirect?: boolean })
      .then((response) => {
        if (cancelled || hasLoggedIn.current) return;
        const { email, nickname, profileImage } = response.data;
        setUser({ email, nickname, profileImageUrl: profileImage });
        setIsAuthenticated(true);
      })
      .catch(() => {
        if (cancelled || hasLoggedIn.current) return;
        setIsAuthenticated(false);
      })
      .finally(() => {
        if (cancelled || hasLoggedIn.current) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
      clearRefreshTimeout();
    };
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

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
