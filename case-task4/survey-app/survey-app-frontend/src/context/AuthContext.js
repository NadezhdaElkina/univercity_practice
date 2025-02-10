import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleAuthChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("authChange", handleAuthChange);
    return () => {
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const login = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    window.dispatchEvent(new Event("authChange"));
  };

  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("authChange"));
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
