import React, { createContext, useContext, useState, ReactNode } from "react";

interface AuthUser {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Utilisateurs de test (élève et parent)
const testUsers = [
  {
    id: 'eleve1',
    email: 'eleve@test.com',
    password: 'eleve123',
    role: 'eleve',
    tenantId: 'ecole1'
  },
  {
    id: 'parent1',
    email: 'parent@test.com',
    password: 'parent123',
    role: 'parent',
    tenantId: 'ecole1'
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = async (email: string, password: string) => {
    const found = testUsers.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({
        id: found.id,
        email: found.email,
        role: found.role,
        tenantId: found.tenantId
      });
      return true;
    }
    return false;
  };
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};