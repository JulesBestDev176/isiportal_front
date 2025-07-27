import React, { createContext, useContext, useState, ReactNode } from "react";
import { ConfigurationTenant } from "../types/tenant";

interface TypeContexteTenant {
  tenant: ConfigurationTenant | null;
  definirTenant: (tenant: ConfigurationTenant) => void;
}

const ContexteTenant = createContext<TypeContexteTenant | undefined>(undefined);

// Configuration tenant par défaut
const defaultTenant: ConfigurationTenant = {
  nom: "École Primaire Test",
  idEcole: "ecole1",
  sousDomaine: "ecole-test",
  branding: {
    logo: "/logo-ecole.png",
    couleurs: {
      primaire: "#3B82F6",
      secondaire: "#1E40AF",
      fond: "#F8FAFC",
      texte: "#1F2937"
    },
    favicon: "/favicon.ico"
  },
  fonctionnalites: {
    messagerie: true,
    bulletins: true,
    cours: true,
    notes: true
  },
  limites: {
    utilisateurs: 1000,
    stockage: 5000
  },
  emailContact: "contact@ecole-test.fr"
};

export const FournisseurTenant = ({ children }: { children: ReactNode }) => {
  const [tenant, setTenant] = useState<ConfigurationTenant | null>(() => {
    const stored = localStorage.getItem("tenant");
    return stored ? JSON.parse(stored) : defaultTenant;
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