import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Utilisateur } from '../models/utilisateur.model';
import { authService } from '../services/authService';

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
        if (authService.isAuthenticated()) {
          // D'abord, essayer de récupérer l'utilisateur depuis le token local
          const utilisateurLocal = authService.getCurrentUser();
          console.log('Données utilisateur récupérées:', utilisateurLocal);
          if (utilisateurLocal) {
            const utilisateurFormate = {
              id: utilisateurLocal.id,
              nom: utilisateurLocal.nom,
              prenom: utilisateurLocal.prenom,
              email: utilisateurLocal.email,
              role: utilisateurLocal.role as any,
              dateCreation: new Date().toISOString(),
              actif: true,
              doitChangerMotDePasse: utilisateurLocal.doitChangerMotDePasse || false
            };
            console.log('Utilisateur formaté pour le contexte:', utilisateurFormate);
            setUtilisateur(utilisateurFormate);
            setDoitChangerMotDePasse(utilisateurLocal.doitChangerMotDePasse || false);
          }
          
          // Pour Sanctum, on utilise uniquement les données locales
        }
      } catch (error) {
        console.error('Erreur lors de la vérification d\'authentification:', error);
        // Ne déconnecter que si on n'a vraiment aucun token valide
        if (!authService.getToken()) {
          authService.logout();
          setUtilisateur(null);
        }
      } finally {
        setChargement(false);
      }
    };

    verifierAuth();
  }, []);

  const connexion = async (email: string, motDePasse: string) => {
    try {
      const response = await authService.login({ email, password: motDePasse });
      if (response.success && response.data) {
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
        setDoitChangerMotDePasse(nouvelUtilisateur.doitChangerMotDePasse || false);
      }
    } catch (error) {
      throw error;
    }
  };

  const deconnexion = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours nettoyer l'état utilisateur
      setUtilisateur(null);
      setDoitChangerMotDePasse(false);
      // Rediriger vers la page de connexion
      window.location.href = '/connexion';
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