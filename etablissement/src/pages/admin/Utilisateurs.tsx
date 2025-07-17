//exemples

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit3, Trash2, Users, User, 
  School, Mail, Phone, MapPin, Calendar,
  UserCheck, AlertCircle, CheckCircle, UserPlus, List
} from "lucide-react";
import { Utilisateur, RoleUtilisateur } from "../../models/Utilisateur";
import { useAuth } from "../../contexts/ContexteAuth";
import { useTenant } from "../../contexts/ContexteTenant";
import MainLayout from "../../components/layout/MainLayout";

// Types étendus pour les gestionnaires
interface Gestionnaire extends Utilisateur {
  section?: "primaire" | "elementaire" | "college" | "lycee" | "administration" | "vie_scolaire";
  typeResponsabilite?: "responsable" | "secretaire";
  responsableId?: string; // ID du responsable si c'est un secrétaire
  secretaireId?: string; // ID du secrétaire si c'est un responsable
}

// Types pour le formulaire
interface FormData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  role: RoleUtilisateur;
  section: string; // Utiliser string pour le formulaire
  typeResponsabilite: "responsable" | "secretaire";
  responsableId: string;
}

// Sections disponibles
const sections = [
  { value: "primaire", label: "Primaire", description: "Classes de CP, CE1, CE2" },
  { value: "elementaire", label: "Élémentaire", description: "Classes de CM1, CM2" },
  { value: "college", label: "Collège", description: "Classes de 6ème à 3ème" },
  { value: "lycee", label: "Lycée", description: "Classes de 2nde à Terminale" },
  { value: "administration", label: "Administration", description: "Services administratifs" },
  { value: "vie_scolaire", label: "Vie Scolaire", description: "Surveillance et discipline" }
];

const fichiers = [
  "/data/adminEcole.json",
  "/data/professeurs.json",
  "/data/eleves.json",
  "/data/parents.json",
  "/data/gestionnaires.json"
];

const roles: RoleUtilisateur[] = ["adminEcole", "gestionnaire", "professeur", "eleve", "parent"];

// Types pour les onglets
type TabType = "liste" | "ajout";

// Composant Formulaire d'ajout
const FormulaireAjout: React.FC<{
  onSubmit: (utilisateur: Partial<Gestionnaire>) => void;
  gestionnaires: Gestionnaire[];
}> = ({ onSubmit, gestionnaires }) => {
  const [formData, setFormData] = useState<FormData>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    adresse: "",
    role: "gestionnaire",
    section: "",
    typeResponsabilite: "responsable",
    responsableId: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Validation du formulaire
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) newErrors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) newErrors.email = "L'email est requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email invalide";
    
    if (formData.role === "gestionnaire") {
      if (!formData.section) newErrors.section = "La section est requise";
      if (formData.typeResponsabilite === "secretaire" && !formData.responsableId) {
        newErrors.responsableId = "Le responsable est requis pour un secrétaire";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestionnaires responsables disponibles pour être associés à un secrétaire
  const responsablesDisponibles = gestionnaires.filter(g => 
    g.role === "gestionnaire" && 
    g.typeResponsabilite === "responsable" &&
    g.section === formData.section &&
    !g.secretaireId // N'a pas déjà de secrétaire
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const nouvelUtilisateur: Partial<Gestionnaire> = {
        ...formData,
        section: formData.section as Gestionnaire["section"], // Conversion ici
        id: `user_${Date.now()}`,
        actif: true,
        dateCreation: new Date().toISOString().split('T')[0],
        idTenant: "current_tenant"
      };

      onSubmit(nouvelUtilisateur);
      
      // Reset form
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        telephone: "",
        adresse: "",
        role: "gestionnaire",
        section: "",
        typeResponsabilite: "responsable",
        responsableId: ""
      });
      setErrors({});
    } catch (error) {
      console.error("Erreur lors de la création:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations personnelles */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <User className="w-5 h-5" />
            Informations personnelles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nom *
              </label>
              <input
                type="text"
                value={formData.nom}
                onChange={(e) => setFormData({...formData, nom: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.nom ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Nom de famille"
              />
              {errors.nom && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.nom}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Prénom *
              </label>
              <input
                type="text"
                value={formData.prenom}
                onChange={(e) => setFormData({...formData, prenom: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.prenom ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="Prénom"
              />
              {errors.prenom && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.prenom}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.email ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="exemple@ecole.sn"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Phone className="w-4 h-4 inline mr-1" />
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.telephone}
                onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="+221 XX XXX XX XX"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Adresse
              </label>
              <input
                type="text"
                value={formData.adresse}
                onChange={(e) => setFormData({...formData, adresse: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                placeholder="Adresse complète"
              />
            </div>
          </div>
        </div>

        {/* Rôle et responsabilités */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <School className="w-5 h-5" />
            Rôle et responsabilités
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Section *
              </label>
              <select
                value={formData.section}
                onChange={(e) => setFormData({
                  ...formData, 
                  section: e.target.value,
                  responsableId: "" // Reset responsable when section changes
                })}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.section ? 'border-red-500' : 'border-neutral-300'
                }`}
              >
                <option value="">Sélectionner une section</option>
                {sections.map(section => (
                  <option key={section.value} value={section.value}>
                    {section.label}
                  </option>
                ))}
              </select>
              {errors.section && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.section}
                </p>
              )}
              {formData.section && (
                <p className="text-neutral-500 text-sm mt-2">
                  {sections.find(s => s.value === formData.section)?.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Type de responsabilité *
              </label>
              <select
                value={formData.typeResponsabilite}
                onChange={(e) => setFormData({
                  ...formData, 
                  typeResponsabilite: e.target.value as "responsable" | "secretaire",
                  responsableId: "" // Reset responsable when type changes
                })}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
              >
                <option value="responsable">Responsable de section</option>
                <option value="secretaire">Secrétaire</option>
              </select>
              <p className="text-neutral-500 text-sm mt-2">
                {formData.typeResponsabilite === "responsable" 
                  ? "Dirige et supervise la section" 
                  : "Assiste le responsable de section"
                }
              </p>
            </div>

            {/* Sélection du responsable pour les secrétaires */}
            {formData.typeResponsabilite === "secretaire" && formData.section && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Responsable à assister *
                </label>
                <select
                  value={formData.responsableId}
                  onChange={(e) => setFormData({...formData, responsableId: e.target.value})}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                    errors.responsableId ? 'border-red-500' : 'border-neutral-300'
                  }`}
                >
                  <option value="">Sélectionner un responsable</option>
                  {responsablesDisponibles.map(responsable => (
                    <option key={responsable.id} value={responsable.id}>
                      {responsable.prenom} {responsable.nom}
                    </option>
                  ))}
                </select>
                {errors.responsableId && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.responsableId}
                  </p>
                )}
                {responsablesDisponibles.length === 0 && formData.section && (
                  <p className="text-orange-500 text-sm mt-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Aucun responsable disponible pour cette section
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-primaire text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Création en cours...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Créer l'utilisateur
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant Liste des utilisateurs
const ListeUtilisateurs: React.FC<{
  liste: Gestionnaire[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterRole: string;
  setFilterRole: (role: string) => void;
  filterSection: string;
  setFilterSection: (section: string) => void;
}> = ({ liste, searchTerm, setSearchTerm, filterRole, setFilterRole, filterSection, setFilterSection }) => {
  
  // Obtenir le badge de section
  const getSectionBadge = (section?: string) => {
    if (!section) return null;
    
    const sectionInfo = sections.find(s => s.value === section);
    if (!sectionInfo) return null;

    const colors = {
      primaire: "bg-blue-100 text-blue-800",
      elementaire: "bg-green-100 text-green-800",
      college: "bg-purple-100 text-purple-800",
      lycee: "bg-orange-100 text-orange-800",
      administration: "bg-gray-100 text-gray-800",
      vie_scolaire: "bg-red-100 text-red-800"
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[section as keyof typeof colors]}`}>
        {sectionInfo.label}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Filtres */}
      <div className="bg-white rounded-lg border border-neutral-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher par nom, prénom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Filtre par rôle */}
          <div className="min-w-48">
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="tous">Tous les rôles</option>
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Filtre par section */}
          <div className="min-w-48">
            <select
              value={filterSection}
              onChange={(e) => setFilterSection(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="toutes">Toutes les sections</option>
              {sections.map(section => (
                <option key={section.value} value={section.value}>
                  {section.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Section
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {liste.map((u, index) => (
                <motion.tr
                  key={u.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="hover:bg-neutral-50"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">
                          {u.prenom} {u.nom}
                        </p>
                        <p className="text-sm text-neutral-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-medium text-neutral-900">{u.role}</span>
                      {u.typeResponsabilite && (
                        <span className={`text-xs px-2 py-1 rounded-full w-fit ${
                          u.typeResponsabilite === "responsable" 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-green-100 text-green-800"
                        }`}>
                          {u.typeResponsabilite === "responsable" ? "Responsable" : "Secrétaire"}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getSectionBadge(u.section)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm space-y-1">
                      {u.telephone && (
                        <p className="flex items-center gap-1 text-neutral-600">
                          <Phone className="w-3 h-3" />
                          {u.telephone}
                        </p>
                      )}
                      {u.adresse && (
                        <p className="flex items-center gap-1 text-neutral-500">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-32">{u.adresse}</span>
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        u.actif ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <span className={`text-sm font-medium ${
                        u.actif ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {u.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 mt-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {u.dateCreation}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {liste.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-neutral-500">
              Essayez de modifier vos critères de recherche.
            </p>
          </div>
        )}
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total utilisateurs",
            value: liste.length,
            icon: <Users className="w-5 h-5" />,
            color: "bg-blue-500"
          },
          {
            title: "Gestionnaires",
            value: liste.filter(u => u.role === "gestionnaire").length,
            icon: <UserCheck className="w-5 h-5" />,
            color: "bg-green-500"
          },
          {
            title: "Professeurs",
            value: liste.filter(u => u.role === "professeur").length,
            icon: <School className="w-5 h-5" />,
            color: "bg-purple-500"
          },
          {
            title: "Utilisateurs actifs",
            value: liste.filter(u => u.actif).length,
            icon: <CheckCircle className="w-5 h-5" />,
            color: "bg-orange-500"
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white rounded-lg border border-neutral-200 p-6"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-sm text-neutral-600">{stat.title}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant principal
const Utilisateurs: React.FC = () => {
  const { utilisateur, connexion } = useAuth();
  const { tenant } = useTenant();
  const [liste, setListe] = useState<Gestionnaire[]>([]);
  const [filteredListe, setFilteredListe] = useState<Gestionnaire[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("tous");
  const [filterSection, setFilterSection] = useState<string>("toutes");
  const [activeTab, setActiveTab] = useState<TabType>("liste");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const responses = await Promise.all(
          fichiers.map(f => fetch(f).then(res => res.json()))
        );
        const allUsers = responses.flat();
        setListe(allUsers);
        setFilteredListe(allUsers);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

  // Détermine les droits selon le rôle
  const isAdmin = utilisateur?.role === "adminEcole";

  // Onglets dynamiques selon le rôle
  const tabs = [
    {
      id: "liste" as TabType,
      label: "Liste des utilisateurs",
      icon: <List className="w-4 h-4" />,
      count: liste.length
    },
    ...(isAdmin ? [{
      id: "ajout" as TabType,
      label: "Ajouter un utilisateur",
      icon: <UserPlus className="w-4 h-4" />
    }] : [])
  ];

  // Filtrage supplémentaire selon le rôle connecté
  useEffect(() => {
    let filtered = liste;
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterRole !== "tous") {
      filtered = filtered.filter(u => u.role === filterRole);
    }
    if (filterSection !== "toutes") {
      filtered = filtered.filter(u => u.section === filterSection);
    }
    // Si non admin, filtre selon le rôle/section de l'utilisateur connecté
    if (!isAdmin && utilisateur) {
      filtered = filtered.filter(u => {
        if (utilisateur.role === "gestionnaire") {
          return u.section === utilisateur.section;
        }
        if (utilisateur.role === "professeur") {
          return u.role === "professeur" || u.role === "eleve";
        }
        if (utilisateur.role === "parent") {
          return u.role === "eleve";
        }
        if (utilisateur.role === "eleve") {
          return u.id === utilisateur.id;
        }
        return true;
      });
    }
    setFilteredListe(filtered);
  }, [liste, searchTerm, filterRole, filterSection, utilisateur, isAdmin]);

  // Fonction d'ajout d'utilisateur (simulation front)
  const ajouterUtilisateur = (nouvelUtilisateur: Partial<Gestionnaire>) => {
    setListe(prev => [...prev, nouvelUtilisateur as Gestionnaire]);
    setActiveTab("liste"); // Retour à la liste après ajout
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Chargement des utilisateurs...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Gestion des utilisateurs</h1>
            <p className="text-neutral-600 mt-1">
              Établissement: {tenant?.nom}
            </p>
          </div>
        </div>
        {/* Navigation par onglets (uniquement admin) */}
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="border-b border-neutral-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-2 py-0.5 px-2.5 rounded-full text-xs font-medium ${
                      activeTab === tab.id 
                        ? 'bg-primary-100 text-primary-800' 
                        : 'bg-neutral-100 text-neutral-800'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
          {/* Contenu des onglets */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "liste" && (
                <ListeUtilisateurs
                  key="liste"
                  liste={filteredListe}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterRole={filterRole}
                  setFilterRole={setFilterRole}
                  filterSection={filterSection}
                  setFilterSection={setFilterSection}
                />
              )}
              {isAdmin && activeTab === "ajout" && (
                <FormulaireAjout
                  key="ajout"
                  onSubmit={ajouterUtilisateur}
                  gestionnaires={liste.filter(u => u.role === "gestionnaire") as Gestionnaire[]}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
        {/* Informations sur les sections - uniquement visible dans l'onglet liste */}
        {activeTab === "liste" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-neutral-200 p-6"
          >
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              Répartition par sections
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section) => {
                const gestionnaires = liste.filter(u => 
                  u.role === "gestionnaire" && u.section === section.value
                );
                const responsables = gestionnaires.filter(g => g.typeResponsabilite === "responsable");
                const secretaires = gestionnaires.filter(g => g.typeResponsabilite === "secretaire");
                return (
                  <motion.div
                    key={section.value}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border border-neutral-200 rounded-lg hover:shadow-sm transition-shadow"
                  >
                    <h4 className="font-medium text-neutral-900 mb-2">{section.label}</h4>
                    <p className="text-sm text-neutral-600 mb-3">{section.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Responsables:</span>
                        <span className="font-medium">{responsables.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-neutral-600">Secrétaires:</span>
                        <span className="font-medium">{secretaires.length}</span>
                      </div>
                      <div className="flex justify-between border-t border-neutral-200 pt-2">
                        <span className="text-neutral-900 font-medium">Total:</span>
                        <span className="font-bold">{gestionnaires.length}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
        {/* Message de succès après ajout */}
        {activeTab === "liste" && searchTerm === "" && filterRole === "tous" && filterSection === "toutes" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm text-green-800">
                Système de gestion des utilisateurs avec hiérarchie gestionnaires/secrétaires opérationnel.
              </p>
            </div>
            <p className="text-xs text-green-600 mt-1">
              Ajoutez, filtrez et gérez les utilisateurs selon les droits de votre rôle.
            </p>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
};

export default Utilisateurs;