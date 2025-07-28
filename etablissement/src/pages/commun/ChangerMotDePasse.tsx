import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/ContexteAuth';
import { authService } from '../../services/authService';
import { Eye, EyeOff, Lock, Shield, CheckCircle } from 'lucide-react';

const ChangerMotDePasse: React.FC = () => {
  const [motDePasseActuel, setMotDePasseActuel] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [afficherMotDePasseActuel, setAfficherMotDePasseActuel] = useState(false);
  const [afficherNouveauMotDePasse, setAfficherNouveauMotDePasse] = useState(false);
  const [afficherConfirmation, setAfficherConfirmation] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const { utilisateur } = useAuth();
  const navigate = useNavigate();

  // Validation du mot de passe
  const validerMotDePasse = (motDePasse: string): string[] => {
    const erreurs: string[] = [];
    
    if (motDePasse.length < 8) {
      erreurs.push('Le mot de passe doit contenir au moins 8 caractères');
    }
    
    if (!/[A-Z]/.test(motDePasse)) {
      erreurs.push('Le mot de passe doit contenir au moins une majuscule');
    }
    
    if (!/[a-z]/.test(motDePasse)) {
      erreurs.push('Le mot de passe doit contenir au moins une minuscule');
    }
    
    if (!/\d/.test(motDePasse)) {
      erreurs.push('Le mot de passe doit contenir au moins un chiffre');
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(motDePasse)) {
      erreurs.push('Le mot de passe doit contenir au moins un caractère spécial');
    }
    
    return erreurs;
  };

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);
    setErreur('');

    // Validation du nouveau mot de passe
    const erreursValidation = validerMotDePasse(nouveauMotDePasse);
    if (erreursValidation.length > 0) {
      setErreur(erreursValidation.join('\n'));
      setChargement(false);
      return;
    }

    // Vérification de la confirmation
    if (nouveauMotDePasse !== confirmationMotDePasse) {
      setErreur('Les mots de passe ne correspondent pas');
      setChargement(false);
      return;
    }

    try {
      // Appel au service pour changer le mot de passe
      const response = await authService.changePassword({
        current_password: motDePasseActuel,
        new_password: nouveauMotDePasse,
        new_password_confirmation: confirmationMotDePasse
      });
      
      if (response.success) {
        setSucces(true);
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setErreur(response.message || 'Erreur lors du changement de mot de passe');
      }
    } catch (error: any) {
      setErreur(error.message || 'Erreur lors du changement de mot de passe');
    } finally {
      setChargement(false);
    }
  };

  if (succes) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Mot de passe changé avec succès !
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Vous allez être redirigé vers votre tableau de bord...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Changement de mot de passe obligatoire
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Pour des raisons de sécurité, vous devez changer votre mot de passe avant d'accéder à la plateforme.
          </p>
          {utilisateur && (
            <p className="mt-1 text-sm text-blue-600">
              Connecté en tant que : {utilisateur.prenom} {utilisateur.nom}
            </p>
          )}
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={gererSoumission}>
          {erreur && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {erreur.split('\n').map((line, index) => (
                <div key={index}>{line}</div>
              ))}
            </div>
          )}
          
          {/* Mot de passe actuel */}
          <div>
            <label htmlFor="motDePasseActuel" className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe actuel
            </label>
            <div className="relative">
              <input
                id="motDePasseActuel"
                name="motDePasseActuel"
                type={afficherMotDePasseActuel ? "text" : "password"}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Votre mot de passe actuel"
                value={motDePasseActuel}
                onChange={(e) => setMotDePasseActuel(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setAfficherMotDePasseActuel(!afficherMotDePasseActuel)}
              >
                {afficherMotDePasseActuel ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label htmlFor="nouveauMotDePasse" className="block text-sm font-medium text-gray-700 mb-2">
              Nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="nouveauMotDePasse"
                name="nouveauMotDePasse"
                type={afficherNouveauMotDePasse ? "text" : "password"}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Votre nouveau mot de passe"
                value={nouveauMotDePasse}
                onChange={(e) => setNouveauMotDePasse(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setAfficherNouveauMotDePasse(!afficherNouveauMotDePasse)}
              >
                {afficherNouveauMotDePasse ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Confirmation du nouveau mot de passe */}
          <div>
            <label htmlFor="confirmationMotDePasse" className="block text-sm font-medium text-gray-700 mb-2">
              Confirmer le nouveau mot de passe
            </label>
            <div className="relative">
              <input
                id="confirmationMotDePasse"
                name="confirmationMotDePasse"
                type={afficherConfirmation ? "text" : "password"}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Confirmez votre nouveau mot de passe"
                value={confirmationMotDePasse}
                onChange={(e) => setConfirmationMotDePasse(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setAfficherConfirmation(!afficherConfirmation)}
              >
                {afficherConfirmation ? (
                  <EyeOff className="h-5 w-5 text-gray-400" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {/* Critères de sécurité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              Critères de sécurité requis :
            </h3>
            <ul className="text-xs text-blue-700 space-y-1">
              <li className={nouveauMotDePasse.length >= 8 ? 'text-green-600' : ''}>
                ✓ Au moins 8 caractères
              </li>
              <li className={/[A-Z]/.test(nouveauMotDePasse) ? 'text-green-600' : ''}>
                ✓ Au moins une majuscule
              </li>
              <li className={/[a-z]/.test(nouveauMotDePasse) ? 'text-green-600' : ''}>
                ✓ Au moins une minuscule
              </li>
              <li className={/\d/.test(nouveauMotDePasse) ? 'text-green-600' : ''}>
                ✓ Au moins un chiffre
              </li>
              <li className={/[!@#$%^&*(),.?":{}|<>]/.test(nouveauMotDePasse) ? 'text-green-600' : ''}>
                ✓ Au moins un caractère spécial
              </li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              disabled={chargement}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {chargement ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Changement en cours...
                </div>
              ) : (
                <div className="flex items-center">
                  <Lock className="w-4 h-4 mr-2" />
                  Changer le mot de passe
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangerMotDePasse; 