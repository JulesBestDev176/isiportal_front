import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus, Send, Paperclip, X, Clock, Bell,
  AlertCircle, Calendar, FileText,
  Target, CheckCircle2, GraduationCap, Briefcase,
  Heart, User, Filter, Trash2, Info, Users, BookOpen
} from "lucide-react";

import { useAuth } from "../../contexts/ContexteAuth";
import { Contact, Notification } from "../../models/communication.model";

// Interface locale pour les données de contact étendues (statut en ligne, etc.)
interface ContactEtendu extends Contact {
  statut: "en_ligne" | "absent" | "occupe" | "invisible";
  derniereConnexion?: string;
  dernierMessage?: string;
  heureMessage?: string;
}

// Données mockées
const contactsMock: ContactEtendu[] = [
  {
    id: 1,
    nom: "Diop",
    prenom: "Aminata",
    role: "professeur",
    email: "aminata.diop@groupeisi.com",
    statut: "en_ligne",
    derniereConnexion: "2024-01-15T14:30:00Z",
    dernierMessage: "Merci pour les documents",
    heureMessage: "14:30",
    classe: "6ème A",
    matiere: "Mathématiques"
  },
  {
    id: 2, 
    nom: "Ndiaye",
    prenom: "Moussa",
    role: "gestionnaire",
    email: "moussa.ndiaye@groupeisi.com",
    statut: "absent",
    derniereConnexion: "2024-01-15T12:15:00Z",
    dernierMessage: "La réunion est confirmée",
    heureMessage: "12:15",
    sectionId: 1
  },
  {
    id: 3,
    nom: "Fall",
    prenom: "Fatou",
    role: "administrateur",
    email: "fatou.fall@groupeisi.com",
    statut: "occupe",
    derniereConnexion: "2024-01-15T09:45:00Z",
    dernierMessage: "Rapport envoyé",
    heureMessage: "09:45"
  }
];

const notificationsMock: Notification[] = [
  {
    id: 1,
    titre: "Réunion pédagogique",
    contenu: "Réunion prévue demain à 14h en salle de conférence pour discuter des nouveaux programmes.",
    type: "evenement",
    expediteurId: 3,
    expediteurRole: "administrateur",
    destinataireType: "role",
    destinataires: [],
    destinataireRoles: ["gestionnaire"],
    dateCreation: "2024-01-15T10:30:00Z",
    dateEnvoi: "2024-01-15T10:30:00Z",
    active: true,
    nbDestinataires: 1,
    nbLues: 0,
    priorite: "normale"
  },
  {
    id: 2,
    titre: "Mise à jour système",
    contenu: "Le système sera mis à jour ce soir entre 20h et 22h. Merci de sauvegarder vos travaux.",
    type: "info",
    expediteurId: 3,
    expediteurRole: "administrateur",
    destinataireType: "role",
    destinataires: [],
    destinataireRoles: ["professeur", "gestionnaire"],
    dateCreation: "2024-01-14T16:45:00Z",
    dateEnvoi: "2024-01-14T16:45:00Z",
    active: true,
    nbDestinataires: 2,
    nbLues: 0,
    priorite: "normale"
  }
];

// Composant pour créer une notification
const CreerNotification: React.FC<{
  onCreer: (notification: Omit<Notification, "id" | "dateCreation">) => void;
  onAnnuler: () => void;
  roleUtilisateur?: string;
}> = ({ onCreer, onAnnuler, roleUtilisateur }) => {
  const { utilisateur } = useAuth();
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [type, setType] = useState<Notification["type"]>("info");
  const [destinataireRoles, setDestinataireRoles] = useState<("administrateur" | "gestionnaire" | "professeur" | "eleve" | "parent")[]>([]);
  const [programmee, setProgrammee] = useState(false);
  const [dateEnvoi, setDateEnvoi] = useState("");
  const [pieceJointe, setPieceJointe] = useState<File | null>(null);

  const typesNotification = [
    { value: "info", label: "Information", icon: Info, couleur: "blue" },
    { value: "urgent", label: "Urgent", icon: AlertCircle, couleur: "red" },
    { value: "evenement", label: "Événement", icon: Calendar, couleur: "purple" }
  ];

  const groupesDestinataires = [
    { value: "gestionnaire", label: "Gestionnaires", icon: Users, couleur: "blue" },
    { value: "professeur", label: "Professeurs", icon: BookOpen, couleur: "green" },
    { value: "administrateur", label: "Administrateurs", icon: User, couleur: "purple" }
  ].filter(groupe => {
    const roleUser = utilisateur?.role;
    
    // Logique de filtrage selon le rôle
    if (roleUser === "administrateur") return true; // Admin peut contacter tout le monde
    if (roleUser === "gestionnaire") return groupe.value === "professeur";
    if (roleUser === "professeur") return groupe.value === "gestionnaire";
    
    return false;
  });

  const toggleDestinataire = (groupe: string) => {
    setDestinataireRoles(prev => 
      prev.includes(groupe as any)
        ? prev.filter(d => d !== groupe)
        : [...prev, groupe as any]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titre.trim() || !contenu.trim() || destinataireRoles.length === 0) return;

    onCreer({
      titre: titre.trim(),
      contenu: contenu.trim(),
      type,
      expediteurId: utilisateur?.id || 1,
      expediteurRole: utilisateur?.role as "administrateur" | "gestionnaire" | "professeur",
      destinataireType: "role",
      destinataires: [],
      destinataireRoles,
      dateEnvoi: programmee ? dateEnvoi : new Date().toISOString(),
      active: true,
      nbDestinataires: destinataireRoles.length,
      nbLues: 0,
      priorite: type === "urgent" ? "haute" : "normale"
    });

    // Reset form
    setTitre("");
    setContenu("");
    setType("info");
    setDestinataireRoles([]);
    setProgrammee(false);
    setDateEnvoi("");
    setPieceJointe(null);
  };

  const getBadgeColor = (role: string) => {
    switch (role) {
      case "administrateur": return "bg-purple-100 text-purple-800";
      case "gestionnaire": return "bg-blue-100 text-blue-800";
      case "professeur": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-neutral-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-neutral-900">Nouvelle notification</h3>
        <button 
          onClick={onAnnuler}
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-neutral-600" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Titre de la notification
          </label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Entrez le titre..."
            required
          />
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Type de notification
          </label>
          <div className="grid grid-cols-3 gap-3">
            {typesNotification.map((typeNotif) => (
              <button
                key={typeNotif.value}
                type="button"
                onClick={() => setType(typeNotif.value as Notification["type"])}
                className={`p-3 border rounded-lg text-center transition-colors ${
                  type === typeNotif.value
                    ? `border-${typeNotif.couleur}-500 bg-${typeNotif.couleur}-50 text-${typeNotif.couleur}-700`
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <typeNotif.icon className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">{typeNotif.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Destinataires */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Destinataires
          </label>
          <div className="space-y-2">
            {groupesDestinataires.map((groupe) => (
              <button
                key={groupe.value}
                type="button"
                onClick={() => toggleDestinataire(groupe.value)}
                className={`w-full p-3 border rounded-lg text-left transition-colors flex items-center gap-3 ${
                  destinataireRoles.includes(groupe.value as any)
                    ? `border-${groupe.couleur}-500 bg-${groupe.couleur}-50`
                    : "border-neutral-300 hover:border-neutral-400"
                }`}
              >
                <groupe.icon className="w-5 h-5" />
                <span className="font-medium">{groupe.label}</span>
                {destinataireRoles.includes(groupe.value as any) && (
                  <CheckCircle2 className="w-5 h-5 ml-auto text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Contenu de la notification
          </label>
          <textarea
            value={contenu}
            onChange={(e) => setContenu(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Rédigez votre message..."
            required
          />
        </div>

        {/* Programmation */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={programmee}
              onChange={(e) => setProgrammee(e.target.checked)}
              className="rounded border-neutral-300"
            />
            Programmer l'envoi
          </label>
          {programmee && (
            <div className="mt-2">
              <input
                type="datetime-local"
                value={dateEnvoi}
                onChange={(e) => setDateEnvoi(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required={programmee}
              />
            </div>
          )}
        </div>

        {/* Pièce jointe */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Pièce jointe (optionnel)
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              onChange={(e) => setPieceJointe(e.target.files?.[0] || null)}
              className="hidden"
              id="piece-jointe"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            <label
              htmlFor="piece-jointe"
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50"
            >
              <Paperclip className="w-4 h-4" />
              Choisir un fichier
            </label>
            {pieceJointe && (
              <span className="text-sm text-neutral-600">{pieceJointe.name}</span>
            )}
          </div>
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
          <button
            type="button"
            onClick={onAnnuler}
            className="px-6 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!titre.trim() || !contenu.trim() || destinataireRoles.length === 0}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            {programmee ? "Programmer" : "Envoyer"}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant pour afficher une notification
const CarteNotification: React.FC<{
  notification: Notification;
  onSupprimer: (id: number) => void;
}> = ({ notification, onSupprimer }) => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "evenement": return <Calendar className="w-5 h-5 text-purple-600" />;
      case "rappel": return <Clock className="w-5 h-5 text-orange-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "urgent": return "bg-red-50 border-red-200";
      case "evenement": return "bg-purple-50 border-purple-200";
      case "rappel": return "bg-orange-50 border-orange-200";
      default: return "bg-blue-50 border-blue-200";
    }
  };

  const getBadgeColor = (dest: string) => {
    const colors = {
      professeur: "bg-blue-100 text-blue-700",
      gestionnaire: "bg-green-100 text-green-700"
    };
    return colors[dest as keyof typeof colors] || "bg-neutral-100 text-neutral-700";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-lg border-2 ${getTypeColor(notification.type)}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {getTypeIcon(notification.type)}
          <div>
            <h3 className="font-semibold text-neutral-900">{notification.titre}</h3>
            <p className="text-sm text-neutral-600">
              {notification.dateEnvoi && new Date(notification.dateEnvoi) > new Date()
                ? `Programmée pour le ${formatDate(notification.dateEnvoi)}`
                : `Envoyée le ${formatDate(notification.dateCreation)}`
              }
            </p>
          </div>
        </div>
        <button
          onClick={() => onSupprimer(notification.id)}
          className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <p className="text-neutral-700 mb-4">{notification.contenu}</p>

      {/* Destinataires */}
      <div className="flex flex-wrap gap-1">
        {notification.destinataireRoles?.map((dest, index) => (
          <span
            key={index}
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              dest === "gestionnaire" ? "bg-blue-100 text-blue-700" :
              dest === "professeur" ? "bg-green-100 text-green-700" :
              dest === "administrateur" ? "bg-purple-100 text-purple-700" :
              "bg-gray-100 text-gray-700"
            }`}
          >
            {dest === "gestionnaire" ? "Gestionnaire" : 
             dest === "professeur" ? "Professeur" : 
             dest === "administrateur" ? "Administrateur" : dest}
          </span>
        ))}
      </div>

      {/* Statut et fichiers */}
      <div className="flex items-center justify-between text-sm text-neutral-600 mt-4">
        <div className="flex items-center gap-4">
          {notification.pieceJointe && (
            <span className="flex items-center gap-1">
              <Paperclip className="w-3 h-3" />
              {notification.pieceJointe.nom}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {notification.dateEnvoi && new Date(notification.dateEnvoi) > new Date() && (
            <span className="flex items-center gap-1 text-orange-600">
              <Clock className="w-3 h-3" />
              Programmée
            </span>
          )}
          {notification.active && (
            <span className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="w-3 h-3" />
              Envoyée
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Composant principal
const Messagerie: React.FC = () => {
  const { utilisateur } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(notificationsMock);
  const [afficherFormulaire, setAfficherFormulaire] = useState(false);
  const [filtreType, setFiltreType] = useState<string>("tous");

  const creerNotification = (nouvelleNotification: Omit<Notification, "id" | "dateCreation">) => {
    const notification: Notification = {
      ...nouvelleNotification,
      id: Date.now(),
      dateCreation: new Date().toISOString()
    };

    setNotifications(prev => [notification, ...prev]);
    setAfficherFormulaire(false);
  };

  const supprimerNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const notificationsFiltrees = notifications.filter(notification => {
    if (filtreType === "tous") return true;
    return notification.type === filtreType;
  });

  const typesFiltre = [
    { value: "tous", label: "Toutes", count: notifications.length },
    { value: "info", label: "Informations", count: notifications.filter(n => n.type === "info").length },
    { value: "urgent", label: "Urgentes", count: notifications.filter(n => n.type === "urgent").length },
    { value: "evenement", label: "Événements", count: notifications.filter(n => n.type === "evenement").length },
    { value: "rappel", label: "Rappels", count: notifications.filter(n => n.type === "rappel").length }
  ];

  return (
    <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Messagerie</h1>
            <p className="text-neutral-600 mt-1">
              Gérez vos notifications et communications
            </p>
          </div>
          <button
            onClick={() => setAfficherFormulaire(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nouvelle notification
          </button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2">
          {typesFiltre.map((type) => (
            <button
              key={type.value}
              onClick={() => setFiltreType(type.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtreType === type.value
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {type.label} ({type.count})
            </button>
          ))}
        </div>

        {/* Formulaire de création */}
        {afficherFormulaire && (
          <CreerNotification
            onCreer={creerNotification}
            onAnnuler={() => setAfficherFormulaire(false)}
            roleUtilisateur={utilisateur?.role}
          />
        )}

        {/* Liste des notifications */}
        <div className="space-y-4">
          {notificationsFiltrees.length > 0 ? (
            notificationsFiltrees.map((notification) => (
              <CarteNotification
                key={notification.id}
                notification={notification}
                onSupprimer={supprimerNotification}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">
                Aucune notification
              </h3>
              <p className="text-neutral-600 mb-4">
                {filtreType === "tous" 
                  ? "Vous n'avez pas encore créé de notifications."
                  : `Aucune notification de type "${typesFiltre.find(t => t.value === filtreType)?.label}".`
                }
              </p>
              <button
                onClick={() => setAfficherFormulaire(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Créer une notification
              </button>
            </div>
          )}
        </div>
      </div>
  );
};

export default Messagerie;