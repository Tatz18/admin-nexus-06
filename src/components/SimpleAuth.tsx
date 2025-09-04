import { createContext, useContext, useState, useEffect } from "react";

interface SimpleAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signOut: () => void;
}

const SimpleAuthContext = createContext<SimpleAuthContextType | undefined>(undefined);

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext);
  if (!context) {
    throw new Error("useSimpleAuth must be used within a SimpleAuthProvider");
  }
  return context;
};

export const SimpleAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Admin credentials
  const ADMIN_EMAIL = "phoenixrealesthatic@gmail.com";
  const ADMIN_PASSWORD = "Phoenix@2025";

  useEffect(() => {
    // Check if user was previously authenticated (stored in localStorage)
    const authStatus = localStorage.getItem("phoenix-admin-auth");
    console.log("SimpleAuth: Checking auth status:", authStatus);
    if (authStatus === "true") {
      setIsAuthenticated(true);
      console.log("SimpleAuth: User authenticated");
    }

    // Listen for localStorage changes (for when login happens in another tab or component)
    const handleStorageChange = () => {
      const authStatus = localStorage.getItem("phoenix-admin-auth");
      console.log("SimpleAuth: Storage change detected, auth status:", authStatus);
      setIsAuthenticated(authStatus === "true");
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for focus events to recheck auth status
    const handleFocus = () => {
      const authStatus = localStorage.getItem("phoenix-admin-auth");
      console.log("SimpleAuth: Window focus, checking auth:", authStatus);
      setIsAuthenticated(authStatus === "true");
    };
    
    window.addEventListener("focus", handleFocus);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem("phoenix-admin-auth", "true");
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("phoenix-admin-auth");
    setIsAuthenticated(false);
  };

  const signOut = () => {
    logout();
  };

  return (
    <SimpleAuthContext.Provider value={{ isAuthenticated, login, logout, signOut }}>
      {children}
    </SimpleAuthContext.Provider>
  );
};