import React, { createContext, useContext, useState, ReactNode } from "react";

// Utilisateur authentifié
export interface UtilisateurAuth {
  id: string;
  email: string;
  role: string;
  idTenant: string;
  prenom: string;
  nom: string;
  section?: string;
}

// Type du contexte d'authentification
interface TypeContexteAuth {
  utilisateur: UtilisateurAuth | null;
  connexion: (utilisateur: UtilisateurAuth) => void;
  deconnexion: () => void;
}

const ContexteAuth = createContext<TypeContexteAuth | undefined>(undefined);

export const FournisseurAuth = ({ children }: { children: ReactNode }) => {
  const [utilisateur, setUtilisateur] = useState<UtilisateurAuth | null>(() => {
    const stored = localStorage.getItem("utilisateur");
    return stored ? JSON.parse(stored) : null;
  });

  const connexion = (utilisateur: UtilisateurAuth) => {
    setUtilisateur(utilisateur);
    localStorage.setItem("utilisateur", JSON.stringify(utilisateur));
  };
  const deconnexion = () => {
    setUtilisateur(null);
    localStorage.removeItem("utilisateur");
  };

  return (
    <ContexteAuth.Provider value={{ utilisateur, connexion, deconnexion }}>
      {children}
    </ContexteAuth.Provider>
  );
};

export const useAuth = () => {
  const contexte = useContext(ContexteAuth);
  if (!contexte) throw new Error("useAuth doit être utilisé dans un FournisseurAuth");
  return contexte;
}; 