import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchUserData = async (retryCount = 0) => {
      if (token) {
        try {
          setIsLoading(true);
          setFetchError(null);
          const decoded = jwtDecode(token);
          const now = Math.floor(Date.now() / 1000);
          if (decoded.exp < now) {
            console.log("Token expired");
            logout();
            return;
          }
          const response = await fetch("https://mr-pa-2-0.onrender.com/api/auth/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const data = await response.json();
          setUser(data.user);
          console.log("Fetched user data:", data.user);
        } catch (err) {
          console.error("Error fetching user data:", err.message);
          setFetchError("Failed to fetch user data. Please try logging in again.");
          if (retryCount < 1) {
            console.log("Retrying fetchUserData...");
            fetchUserData(retryCount + 1);
          }
        } finally {
          setIsLoading(false);
        }
      } else {
        setUser(null);
      }
    };
    fetchUserData();
  }, [token]);

  const login = (newToken, userData, callback) => {
    try {
      const decoded = jwtDecode(newToken);
      setToken(newToken);
      setUser({ ...decoded, ...userData });
      localStorage.setItem("token", newToken);
      console.log("Logged in with token:", newToken);
      console.log("User data:", { ...decoded, ...userData });
      if (callback) callback();
    } catch (err) {
      console.error("Login error:", err);
      setFetchError("Invalid token. Please try logging in again.");
    }
  };

  const logout = () => {
    setToken("");
    setUser(null);
    setFetchError(null);
    localStorage.removeItem("token");
    console.log("Logged out");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, fetchError }}>
      {children}
    </AuthContext.Provider>
  );
}