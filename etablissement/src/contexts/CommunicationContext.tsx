import React, { createContext, useContext, useState, ReactNode } from "react";
import { SystemeCommunication } from "../types/communication";

interface CommunicationContextType {
  system: SystemeCommunication | null;
  setSystem: (system: SystemeCommunication) => void;
}

const CommunicationContext = createContext<CommunicationContextType | undefined>(undefined);

export const CommunicationProvider = ({ children }: { children: ReactNode }) => {
  const [system, setSystem] = useState<SystemeCommunication | null>(null);

  return (
    <CommunicationContext.Provider value={{ system, setSystem }}>
      {children}
    </CommunicationContext.Provider>
  );
};

export const useCommunication = () => {
  const context = useContext(CommunicationContext);
  if (!context) throw new Error("useCommunication must be used within a CommunicationProvider");
  return context;
}; 