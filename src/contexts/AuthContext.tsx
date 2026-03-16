import React, { createContext, useContext, useState, useCallback } from "react";
import { companies, Company } from "@/lib/mock-data";

interface AuthContextType {
  isAuthenticated: boolean;
  currentCompany: Company | null;
  login: (companyId: string, email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentCompany, setCurrentCompany] = useState<Company | null>(() => {
    const saved = localStorage.getItem("acc_company");
    return saved ? JSON.parse(saved) : null;
  });

  const isAuthenticated = !!currentCompany;

  const login = useCallback((companyId: string, email: string, password: string) => {
    const company = companies.find((c) => c.id === companyId);
    if (company && company.adminEmail === email && company.password === password) {
      setCurrentCompany(company);
      localStorage.setItem("acc_company", JSON.stringify(company));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setCurrentCompany(null);
    localStorage.removeItem("acc_company");
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentCompany, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
