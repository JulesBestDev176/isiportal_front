import React, { createContext, useContext, useState, ReactNode } from "react";
import { SystemeCommunication } from "../types/communication";

interface TypeContexteCommunication {
  systeme: SystemeCommunication | null;
  definirSysteme: (systeme: SystemeCommunication) => void;
}

const ContexteCommunication = createContext<TypeContexteCommunication | undefined>(undefined);

export const FournisseurCommunication = ({ children }: { children: ReactNode }) => {
  const [systeme, setSysteme] = useState<SystemeCommunication | null>(null);

  const definirSysteme = (systeme: SystemeCommunication) => setSysteme(systeme);

  return (
    <ContexteCommunication.Provider value={{ systeme, definirSysteme }}>
      {children}
    </ContexteCommunication.Provider>
  );
};

export const useCommunication = () => {
  const contexte = useContext(ContexteCommunication);
  if (!contexte) throw new Error("useCommunication doit être utilisé dans un FournisseurCommunication");
  return contexte;
}; 