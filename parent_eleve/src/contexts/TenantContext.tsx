import React, { createContext, useContext, useState, ReactNode } from "react";
import { ConfigurationTenant } from "../types/tenant";

interface TenantContextType {
  tenant: ConfigurationTenant | null;
  setTenant: (tenant: ConfigurationTenant) => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const [tenant, setTenant] = useState<ConfigurationTenant | null>(null);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (!context) throw new Error("useTenant must be used within a TenantProvider");
  return context;
}; 