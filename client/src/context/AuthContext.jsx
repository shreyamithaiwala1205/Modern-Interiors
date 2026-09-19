import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  isTokenExpired,
  getTokenTimeRemaining,
} from "../utils/tokenHelper";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const expiryTimerRef = useRef(null);
  const isLoggingOutRef = useRef(false);

  // Clear existing expiration timer
  const clearExpiryTimer = useCallback(() => {
    if (expiryTimerRef.current) {
      clearTimeout(expiryTimerRef.current);
      expiryTimerRef.current = null;
    }
  }, []);

  // Logout with optional reason and toast notification
  const logout = useCallback(
    (options = { notify: false, reason: "" }) => {
      clearExpiryTimer();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);

      if (options.notify && !isLoggingOutRef.current) {
        isLoggingOutRef.current = true;
        toast.error(
          options.reason || "Your session has expired. Please log in again."
        );
        setTimeout(() => {
          isLoggingOutRef.current = false;
        }, 2000);
      }
    },
    [clearExpiryTimer]
  );

  // Schedule auto-logout when token expires
  const scheduleExpiryTimer = useCallback(
    (token) => {
      clearExpiryTimer();
      const timeRemaining = getTokenTimeRemaining(token);

      if (timeRemaining <= 0) {
        logout({
          notify: true,
          reason: "Your session has expired. Please log in again.",
        });
        return;
      }

      // Max setTimeout in browsers is ~24.8 days (2147483647 ms)
      const timeoutDuration = Math.min(timeRemaining, 2147483647);
      expiryTimerRef.current = setTimeout(() => {
        logout({
          notify: true,
          reason: "Your session has expired. Please log in again.",
        });
      }, timeoutDuration);
    },
    [clearExpiryTimer, logout]
  );

  // Validate token against backend /api/auth/profile
  const validateAuth = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      clearExpiryTimer();
      setUser(null);
      setLoading(false);
      return false;
    }

    // Step 1: Check client-side JWT expiration
    if (isTokenExpired(token)) {
      logout({
        notify: false,
        reason: "Your session has expired. Please log in again.",
      });
      setLoading(false);
      return false;
    }

    // Step 2: Validate token with backend
    try {
      const response = await axios.get("http://localhost:5000/api/auth/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data?.success && response.data?.user) {
        const freshUser = response.data.user;
        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
        scheduleExpiryTimer(token);
        setLoading(false);
        return true;
      } else {
        logout({ notify: false });
        setLoading(false);
        return false;
      }
    } catch (error) {
      // Backend returned 401/404/etc. -> token is invalid or user no longer exists
      logout({ notify: false });
      setLoading(false);
      return false;
    }
  }, [clearExpiryTimer, logout, scheduleExpiryTimer]);

  // Login handler
  const login = useCallback(
    (userData, token) => {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);
      scheduleExpiryTimer(token);
    },
    [scheduleExpiryTimer]
  );

  // Initial mount verification
  useEffect(() => {
    validateAuth();
  }, [validateAuth]);

  // Global Axios Response Interceptor for handling 401 Unauthorized across all requests
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const status = error.response?.status;
        const requestUrl = error.config?.url || "";

        // Don't trigger session expiry logout for login/register/forgot-password attempts
        const isAuthAttempt =
          requestUrl.includes("/api/auth/login") ||
          requestUrl.includes("/api/auth/register") ||
          requestUrl.includes("/api/auth/forgot-password") ||
          requestUrl.includes("/api/auth/verify-otp") ||
          requestUrl.includes("/api/auth/reset-password");

        if (status === 401 && !isAuthAttempt) {
          const token = localStorage.getItem("token");
          if (token) {
            logout({
              notify: true,
              reason: "Session expired or invalid. Please log in again.",
            });
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [logout]);

  // Sync session across browser tabs & on window focus / visibility change
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === "visible") {
        const token = localStorage.getItem("token");
        if (token && isTokenExpired(token)) {
          logout({
            notify: true,
            reason: "Your session has expired. Please log in again.",
          });
        }
      }
    };

    const handleStorageChange = (e) => {
      if (e.key === "token") {
        if (!e.newValue) {
          // Token removed in another tab
          logout({ notify: false });
        } else {
          // Token added or updated in another tab
          validateAuth();
        }
      }
    };

    window.addEventListener("visibilitychange", handleVisibilityOrFocus);
    window.addEventListener("focus", handleVisibilityOrFocus);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityOrFocus);
      window.removeEventListener("focus", handleVisibilityOrFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [logout, validateAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        validateAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);