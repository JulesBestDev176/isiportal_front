import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit2, Shield, Users, BookOpen, AlertCircle, Edit, Key, Lock, EyeOff, Eye, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/ContexteAuth';
import MainLayout from '../../components/layout/MainLayout';

// Interface pour les données du profil
interface ProfilData {
  nom: string;
  prenom: string;
  email: string;
  telephone?: string;
  adresse?: string;
  dateNaissance?: string;
  // Champs spécifiques par rôle
  matieres?: string[];
  departement?: string;
  responsabilites?: string[];
  privileges?: string[];
}

// Interface pour le changement de mot de passe
interface MotDePasseData {
  motDePasseActuel: string;
  nouveauMotDePasse: string;
  confirmerMotDePasse: string;
}

const Profil: React.FC = () => {
  const { utilisateur } = useAuth();
  const [activeTab, setActiveTab] = useState<"informations" | "motdepasse">("informations");
  const [modeEdition, setModeEdition] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState({
    actuel: false,
    nouveau: false,
    confirmer: false
  });

  // Données du profil
  const [profilData, setProfilData] = useState<ProfilData>({
    nom: utilisateur?.nom || "",
    prenom: utilisateur?.prenom || "",
    email: utilisateur?.email || "",
    telephone: "",
    adresse: "",
    dateNaissance: "",
    matieres: [],
    departement: "",
    responsabilites: [],
    privileges: []
  });

  // Données du mot de passe
  const [motDePasseData, setMotDePasseData] = useState<MotDePasseData>({
    motDePasseActuel: "",
    nouveauMotDePasse: "",
    confirmerMotDePasse: ""
  });

  // Charger les données du profil au montage
  useEffect(() => {
    chargerProfilUtilisateur();
  }, [utilisateur]);

  const chargerProfilUtilisateur = async () => {
    if (!utilisateur) return;
    
    setLoading(true);
    try {
      // Simulation d'un appel API - À remplacer par une vraie API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Données simulées selon le rôle
      const donneesSimulees = {
        nom: utilisateur.nom,
        prenom: utilisateur.prenom,
        email: utilisateur.email,
        telephone: "+33 6 12 34 56 78",
        adresse: "123 Rue de l'École, 75001 Paris",
        ...(utilisateur.role === "professeur" && {
          matieres: ["Mathématiques", "Physique"],
          dateNaissance: "1985-03-15"
        }),
        ...(utilisateur.role === "gestionnaire" && {
          departement: "Vie scolaire",
          responsabilites: ["Gestion des absences", "Organisation des événements"],
          dateNaissance: "1980-07-22"
        }),
        ...(utilisateur.role === "administrateur" && {
          privileges: ["Gestion complète", "Administration système"],
          dateNaissance: "1975-11-08"
        })
      };
      
      setProfilData(donneesSimulees);
    } catch (error) {
      setMessage("Erreur lors du chargement du profil");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const chargerProfil = async () => {
    if (!utilisateur) return;
    
    setLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const donneesSimulees = {
        nom: utilisateur.nom || "Nom",
        prenom: utilisateur.prenom || "Prénom", 
        email: utilisateur.email || "email@exemple.com",
        telephone: "+221 77 123 45 67",
        adresse: "Dakar, Sénégal",
        ...(utilisateur.role === "professeur" && {
          specialite: "Mathématiques et Sciences",
          matieres: ["Mathématiques", "Physique"],
          dateNaissance: "1985-03-15"
        }),
        ...(utilisateur.role === "gestionnaire" && {
          departement: "Vie scolaire",
          responsabilites: ["Gestion des absences", "Organisation des événements"],
          dateNaissance: "1980-07-22"
        }),
        ...(utilisateur.role === "administrateur" && {
          privileges: ["Gestion complète", "Administration système"],
          dateNaissance: "1975-11-08"
        })
      };
      
      setProfilData(donneesSimulees);
    } catch (error) {
      setMessage("Erreur lors du chargement du profil");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const sauvegarderProfil = async () => {
    setLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage("Profil mis à jour avec succès");
      setMessageType("success");
      setModeEdition(false);
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erreur lors de la sauvegarde");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const changerMotDePasse = async () => {
    if (motDePasseData.nouveauMotDePasse !== motDePasseData.confirmerMotDePasse) {
      setMessage("Les mots de passe ne correspondent pas");
      setMessageType("error");
      return;
    }

    if (motDePasseData.nouveauMotDePasse.length < 6) {
      setMessage("Le mot de passe doit contenir au moins 6 caractères");
      setMessageType("error");
      return;
    }

    setLoading(true);
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage("Mot de passe modifié avec succès");
      setMessageType("success");
      setMotDePasseData({
        motDePasseActuel: "",
        nouveauMotDePasse: "",
        confirmerMotDePasse: ""
      });
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Erreur lors du changement de mot de passe");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = () => {
    switch (utilisateur?.role) {
      case "administrateur":
        return <Shield className="w-6 h-6" />;
      case "gestionnaire":
        return <Users className="w-6 h-6" />;
      case "professeur":
        return <BookOpen className="w-6 h-6" />;
      default:
        return <User className="w-6 h-6" />;
    }
  };

  const getRoleLabel = () => {
    switch (utilisateur?.role) {
      case "administrateur":
        return "Administrateur d'École";
      case "gestionnaire":
        return "Gestionnaire";
      case "professeur":
        return "Professeur";
      default:
        return utilisateur?.role || "Utilisateur";
    }
  };

  if (!utilisateur) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-neutral-600">Utilisateur non connecté</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold text-neutral-900"
            >
              Mon Profil
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-neutral-600 mt-1"
            >
              Gérez vos informations personnelles et votre sécurité
            </motion.p>
          </div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-neutral-200"
          >
            {getRoleIcon()}
            <span className="font-medium text-neutral-900">{getRoleLabel()}</span>
          </motion.div>
        </div>

        {/* Message de feedback */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg border flex items-center gap-3 ${
              messageType === "success" 
                ? "bg-green-50 border-green-200 text-green-800" 
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {messageType === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message}</span>
          </motion.div>
        )}

        {/* Onglets */}
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab("informations")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "informations"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Informations personnelles
                </div>
              </button>
              <button
                onClick={() => setActiveTab("motdepasse")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "motdepasse"
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Mot de passe
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "informations" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Bouton d'édition */}
                <div className="flex justify-end">
                  <button
                    onClick={() => setModeEdition(!modeEdition)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    {modeEdition ? "Annuler" : "Modifier"}
                  </button>
                </div>

                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Prénom
                    </label>
                    <input
                      type="text"
                      value={profilData.prenom}
                      onChange={(e) => setProfilData({...profilData, prenom: e.target.value})}
                      disabled={!modeEdition}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <User className="w-4 h-4 inline mr-1" />
                      Nom
                    </label>
                    <input
                      type="text"
                      value={profilData.nom}
                      onChange={(e) => setProfilData({...profilData, nom: e.target.value})}
                      disabled={!modeEdition}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={profilData.email}
                      onChange={(e) => setProfilData({...profilData, email: e.target.value})}
                      disabled={!modeEdition}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Phone className="w-4 h-4 inline mr-1" />
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={profilData.telephone || ""}
                      onChange={(e) => setProfilData({...profilData, telephone: e.target.value})}
                      disabled={!modeEdition}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Adresse
                    </label>
                    <input
                      type="text"
                      value={profilData.adresse || ""}
                      onChange={(e) => setProfilData({...profilData, adresse: e.target.value})}
                      disabled={!modeEdition}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      value={profilData.dateNaissance || ""}
                      onChange={(e) => setProfilData({...profilData, dateNaissance: e.target.value})}
                      disabled={!modeEdition}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                    />
                  </div>
                </div>

                {/* Informations spécifiques par rôle */}
                {utilisateur.role === "professeur" && (
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5" />
                      Informations professionnelles
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Matières enseignées
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profilData.matieres?.map((matiere, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                          >
                            {matiere}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {utilisateur.role === "gestionnaire" && (
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Informations de gestion
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Département
                        </label>
                        <input
                          type="text"
                          value={profilData.departement || ""}
                          onChange={(e) => setProfilData({...profilData, departement: e.target.value})}
                          disabled={!modeEdition}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-2">
                          Responsabilités
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {profilData.responsabilites?.map((resp, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                            >
                              {resp}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {utilisateur.role === "administrateur" && (
                  <div className="border-t border-neutral-200 pt-6">
                    <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privilèges administrateur
                    </h3>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">
                        Privilèges
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {profilData.privileges?.map((privilege, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                          >
                            {privilege}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Bouton de sauvegarde */}
                {modeEdition && (
                  <div className="flex justify-end pt-6 border-t border-neutral-200">
                    <button
                      onClick={sauvegarderProfil}
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {loading ? "Sauvegarde..." : "Sauvegarder"}
                    </button>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "motdepasse" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-md"
              >
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Lock className="w-4 h-4 inline mr-1" />
                    Mot de passe actuel
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.actuel ? "text" : "password"}
                      value={motDePasseData.motDePasseActuel}
                      onChange={(e) => setMotDePasseData({...motDePasseData, motDePasseActuel: e.target.value})}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Entrez votre mot de passe actuel"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, actuel: !showPassword.actuel})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showPassword.actuel ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Key className="w-4 h-4 inline mr-1" />
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.nouveau ? "text" : "password"}
                      value={motDePasseData.nouveauMotDePasse}
                      onChange={(e) => setMotDePasseData({...motDePasseData, nouveauMotDePasse: e.target.value})}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Entrez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, nouveau: !showPassword.nouveau})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showPassword.nouveau ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    <Key className="w-4 h-4 inline mr-1" />
                    Confirmer le nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword.confirmer ? "text" : "password"}
                      value={motDePasseData.confirmerMotDePasse}
                      onChange={(e) => setMotDePasseData({...motDePasseData, confirmerMotDePasse: e.target.value})}
                      className="w-full px-4 py-3 pr-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Confirmez votre nouveau mot de passe"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword({...showPassword, confirmer: !showPassword.confirmer})}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-neutral-700"
                    >
                      {showPassword.confirmer ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Conseils pour un mot de passe sécurisé :</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Au moins 8 caractères</li>
                    <li>• Mélange de lettres majuscules et minuscules</li>
                    <li>• Au moins un chiffre</li>
                    <li>• Au moins un caractère spécial</li>
                  </ul>
                </div>

                <button
                  onClick={changerMotDePasse}
                  disabled={loading || !motDePasseData.motDePasseActuel || !motDePasseData.nouveauMotDePasse || !motDePasseData.confirmerMotDePasse}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Key className="w-4 h-4" />
                  )}
                  {loading ? "Modification..." : "Changer le mot de passe"}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profil;

                