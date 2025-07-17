import React, { createContext, useContext, useState, ReactNode } from "react";
import { ConfigurationTenant } from "../types/tenant";

interface TypeContexteTenant {
  tenant: ConfigurationTenant | null;
  definirTenant: (tenant: ConfigurationTenant) => void;
}

const ContexteTenant = createContext<TypeContexteTenant | undefined>(undefined);

export const FournisseurTenant = ({ children }: { children: ReactNode }) => {
  const [tenant, setTenant] = useState<ConfigurationTenant | null>(() => {
    const stored = localStorage.getItem("tenant");
    return stored ? JSON.parse(stored) : null;
  });

  const definirTenant = (tenant: ConfigurationTenant) => {
    setTenant(tenant);
    localStorage.setItem("tenant", JSON.stringify(tenant));
  };

  return (
    <ContexteTenant.Provider value={{ tenant, definirTenant }}>
      {children}
    </ContexteTenant.Provider>
  );
};

export const useTenant = () => {
  const contexte = useContext(ContexteTenant);
  if (!contexte) throw new Error("useTenant doit être utilisé dans un FournisseurTenant");
  return contexte;
}; 