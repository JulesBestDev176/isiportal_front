import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Utilisateur } from '../models/utilisateur.model';
import { AuthService } from '../services/authService';

interface ContexteAuthType {
  utilisateur: Utilisateur | null;
  chargement: boolean;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  deconnexion: () => void;
  mettreAJourUtilisateur: (utilisateur: Utilisateur) => void;
  estRoleAutorise: (role: string) => boolean;
  doitChangerMotDePasse: boolean;
}

const ContexteAuth = createContext<ContexteAuthType | undefined>(undefined);

interface FournisseurAuthProps {
  children: ReactNode;
}

export const FournisseurAuth: React.FC<FournisseurAuthProps> = ({ children }) => {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(true);
  const [doitChangerMotDePasse, setDoitChangerMotDePasse] = useState(false);

  useEffect(() => {
    const verifierAuth = async () => {
      try {
        const utilisateurActuel = AuthService.getCurrentUser();
        if (utilisateurActuel && AuthService.isAuthenticated()) {
          setUtilisateur({
            id: parseInt(utilisateurActuel.id),
            nom: utilisateurActuel.nom,
            prenom: utilisateurActuel.prenom,
            email: utilisateurActuel.email,
            role: utilisateurActuel.role as any,
            dateCreation: new Date().toISOString(),
            actif: true,
            doitChangerMotDePasse: false
          });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
      } finally {
        setChargement(false);
      }
    };

    verifierAuth();
  }, []);

  const connexion = async (email: string, motDePasse: string) => {
    try {
      const response = await AuthService.login({ email, password: motDePasse });
      if (response.success) {
        const role = response.data.user.role;
        
        // Vérifier si le rôle est autorisé sur cette plateforme
        if (!estRoleAutorise(role)) {
          throw new Error(`Accès refusé. Les utilisateurs avec le rôle "${role}" doivent utiliser leur plateforme dédiée.`);
        }
        
        const nouvelUtilisateur: Utilisateur = {
          id: response.data.user.id,
          nom: response.data.user.nom,
          prenom: response.data.user.prenom,
          email: response.data.user.email,
          role: role as any,
          dateCreation: new Date().toISOString(),
          actif: true,
          doitChangerMotDePasse: (response.data.user as any).doitChangerMotDePasse || false
        };
        
        setUtilisateur(nouvelUtilisateur);
        setDoitChangerMotDePasse(nouvelUtilisateur.doitChangerMotDePasse);
      }
    } catch (error) {
      throw error;
    }
  };

  const deconnexion = async () => {
    try {
      await AuthService.logout();
      setUtilisateur(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const mettreAJourUtilisateur = (nouvelUtilisateur: Utilisateur) => {
    setUtilisateur(nouvelUtilisateur);
  };

  // Fonction pour vérifier si un rôle est autorisé sur cette plateforme
  const estRoleAutorise = (role: string): boolean => {
    const rolesAutorises = ['administrateur', 'gestionnaire', 'professeur'];
    return rolesAutorises.includes(role);
  };

  // Simulation pour le développement
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && !utilisateur && !chargement) {
      const utilisateurSimule: Utilisateur = {
        id: 1,
        nom: 'Admin',
        prenom: 'Super',
        email: 'admin@ecole.fr',
        role: 'administrateur',
        dateCreation: new Date().toISOString(),
        actif: true,
        doitChangerMotDePasse: false
      };
      setUtilisateur(utilisateurSimule);
    }
  }, [utilisateur, chargement]);

  const valeur: ContexteAuthType = {
    utilisateur,
    chargement,
    connexion,
    deconnexion,
    mettreAJourUtilisateur,
    estRoleAutorise,
    doitChangerMotDePasse,
  };

  return (
    <ContexteAuth.Provider value={valeur}>
      {children}
    </ContexteAuth.Provider>
  );
};

export const useAuth = (): ContexteAuthType => {
  const contexte = useContext(ContexteAuth);
  if (contexte === undefined) {
    throw new Error('useAuth doit être utilisé dans un FournisseurAuth');
  }
  return contexte;
};