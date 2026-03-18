import React, { createContext, useContext, useState, useCallback } from "react";
import { authApi } from "@/lib/api";
import { auth, googleProvider } from "@/lib/firebase";
import { signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

interface Company {
  id: string;
  name: string;
  adminEmail: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  currentCompany: Company | null;
  login: (companyId: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  updateCompanyName: (name: string) => void;
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

  const login = useCallback(async (companyId: string, email: string, password: string) => {
    try {
      const response = await authApi.login({ company_id: companyId, email: email as any, password });
      const { access_token, company } = response.data;
      setCurrentCompany(company);
      localStorage.setItem("acc_token", access_token);
      localStorage.setItem("acc_company", JSON.stringify(company));
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Force refresh=true to always get a fresh, non-expired token
      const idToken = await result.user.getIdToken(true);
      const response = await authApi.firebaseLogin(idToken);
      const { access_token, company } = response.data;
      setCurrentCompany(company);
      localStorage.setItem("acc_token", access_token);
      localStorage.setItem("acc_company", JSON.stringify(company));
      return true;
    } catch (error) {
      console.error("Google login failed:", error);
      return false;
    }
  }, []);

  const logout = useCallback(async () => {
    await firebaseSignOut(auth);
    setCurrentCompany(null);
    localStorage.removeItem("acc_token");
    localStorage.removeItem("acc_company");
  }, []);

  // Update company name in both context state & localStorage instantly
  const updateCompanyName = useCallback((name: string) => {
    setCurrentCompany((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, name };
      localStorage.setItem("acc_company", JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, currentCompany, login, loginWithGoogle, logout, updateCompanyName }}>
      {children}
    </AuthContext.Provider>
  );
};
