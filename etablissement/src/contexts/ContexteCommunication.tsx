import React, { createContext, useContext, useState, ReactNode } from "react";
import { Notification } from "../models/communication.model";

interface TypeContexteCommunication {
  systeme: Notification | null;
  definirSysteme: (systeme: Notification) => void;
}

const ContexteCommunication = createContext<TypeContexteCommunication | undefined>(undefined);

export const FournisseurCommunication = ({ children }: { children: ReactNode }) => {
  const [systeme, setSysteme] = useState<Notification | null>(null);

  const definirSysteme = (systeme: Notification) => setSysteme(systeme);

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