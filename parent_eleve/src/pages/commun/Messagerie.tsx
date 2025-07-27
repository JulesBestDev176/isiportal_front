import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Send, Paperclip, Smile, MoreVertical,
  Phone, Video, Info, Archive, Trash2, Star, Reply,
  Forward, Download, User, Circle, CheckCircle2,
  Users, Filter, Settings, X, Edit3, Clock, Bell,
  MessageSquare, AlertCircle, Calendar, FileText,
  Target, UserCheck, GraduationCap, Briefcase,
  Heart, Image, Volume2, Zap
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

// Types pour la messagerie
interface Contact {
  id: string;
  nom: string;
  prenom: string;
  role: "adminEcole" | "gestionnaire" | "professeur" | "eleve" | "parent";
  avatar?: string;
  statut: "en_ligne" | "absent" | "occupe" | "invisible";
  derniereConnexion: string;
  classe?: string;
  matiere?: string;
}

interface Message {
  id: string;
  expediteurId: string;
  destinataireId: string;
  contenu: string;
  dateEnvoi: string;
  lu: boolean;
  type: "texte" | "fichier" | "image";
  fichierUrl?: string;
  fichierNom?: string;
  repondA?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  dernierMessage?: Message;
  messagesNonLus: number;
  epingle: boolean;
  archive: boolean;
  derniereMiseAJour: string;
}

interface Notification {
  id: string;
  titre: string;
  contenu: string;
  type: "info" | "urgent" | "evenement" | "rappel";
  destinataires: ("professeur" | "gestionnaire" | "eleve" | "parent")[];
  dateCreation: string;
  dateEnvoi?: string;
  programmee: boolean;
  active: boolean;
  nbDestinataires: number;
  nbLues: number;
  pieceJointe?: {
    nom: string;
    url: string;
    type: string;
  };
}

// Données mockées étendues
const contactsMock: Contact[] = [
  {
    id: "1",
    nom: "Diop",
    prenom: "Fatou",
    role: "professeur",
    statut: "en_ligne",
    derniereConnexion: "Maintenant",
    matiere: "Mathématiques",
    classe: "6ème A"
  },
  {
    id: "2", 
    nom: "Ba",
    prenom: "Moussa",
    role: "gestionnaire",
    statut: "absent",
    derniereConnexion: "Il y a 5 min"
  },
  {
    id: "3",
    nom: "Fall",
    prenom: "Aminata",
    role: "parent",
    statut: "en_ligne",
    derniereConnexion: "Maintenant"
  },
  {
    id: "4",
    nom: "Sow",
    prenom: "Ibrahima",
    role: "eleve",
    statut: "occupe",
    derniereConnexion: "Il y a 2h",
    classe: "6ème A"
  },
  {
    id: "5",
    nom: "Ndiaye",
    prenom: "Coumba",
    role: "adminEcole",
    statut: "en_ligne",
    derniereConnexion: "Maintenant"
  },
  {
    id: "6",
    nom: "Sarr",
    prenom: "Ousmane",
    role: "professeur",
    statut: "en_ligne",
    derniereConnexion: "Maintenant",
    matiere: "Français",
    classe: "5ème B"
  }
];

const notificationsMock: Notification[] = [
  {
    id: "1",
    titre: "Réunion pédagogique",
    contenu: "Réunion pédagogique prévue demain à 14h en salle de conférence. Merci d'apporter vos rapports de classes.",
    type: "evenement",
    destinataires: ["professeur"],
    dateCreation: "2024-07-07T08:00:00",
    dateEnvoi: "2024-07-07T08:00:00",
    programmee: false,
    active: true,
    nbDestinataires: 8,
    nbLues: 6
  },
  {
    id: "2",
    titre: "Nouvelle procédure d'inscription",
    contenu: "Une nouvelle procédure d'inscription sera mise en place à partir du mois prochain. Veuillez consulter le document ci-joint pour plus de détails.",
    type: "info",
    destinataires: ["gestionnaire", "parent"],
    dateCreation: "2024-07-06T15:30:00",
    dateEnvoi: "2024-07-07T09:00:00",
    programmee: true,
    active: true,
    nbDestinataires: 45,
    nbLues: 23,
    pieceJointe: {
      nom: "procedure_inscription.pdf",
      url: "#",
      type: "pdf"
    }
  },
  {
    id: "3",
    titre: "Rappel: Examens de fin de trimestre",
    contenu: "Les examens de fin de trimestre commencent lundi prochain. Merci de réviser selon le planning distribué.",
    type: "rappel",
    destinataires: ["eleve"],
    dateCreation: "2024-07-05T10:00:00",
    programmee: false,
    active: true,
    nbDestinataires: 120,
    nbLues: 95
  }
];

// Composants utilitaires (réutilisés du code original)
const StatutEnLigne: React.FC<{ statut: Contact["statut"]; taille?: "sm" | "md" }> = ({ 
  statut, 
  taille = "sm" 
}) => {
  const couleurs = {
    en_ligne: "bg-green-500",
    absent: "bg-gray-400",
    occupe: "bg-red-500",
    invisible: "bg-gray-300"
  };

  const tailles = {
    sm: "w-2 h-2",
    md: "w-3 h-3"
  };

  return (
    <div className={`${tailles[taille]} ${couleurs[statut]} rounded-full border border-white`} />
  );
};

const AvatarAvecStatut: React.FC<{ 
  contact: Contact; 
  taille?: "sm" | "md" | "lg";
  afficherStatut?: boolean;
}> = ({ contact, taille = "md", afficherStatut = true }) => {
  const tailles = {
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };

  const initiaux = `${contact.prenom.charAt(0)}${contact.nom.charAt(0)}`;

  return (
    <div className="relative">
      <div className={`${tailles[taille]} bg-primary-600 rounded-full flex items-center justify-center text-white font-medium`}>
        {contact.avatar ? (
          <img src={contact.avatar} alt={`${contact.prenom} ${contact.nom}`} className="w-full h-full rounded-full object-cover" />
        ) : (
          <span className={taille === "sm" ? "text-xs" : "text-sm"}>{initiaux}</span>
        )}
      </div>
      {afficherStatut && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <StatutEnLigne statut={contact.statut} taille={taille === "lg" ? "md" : "sm"} />
        </div>
      )}
    </div>
  );
};

// Composant pour créer une notification
const CreerNotification: React.FC<{
  onCreer: (notification: Omit<Notification, "id" | "dateCreation" | "nbLues">) => void;
  onAnnuler: () => void;
  roleUtilisateur?: string;
}> = ({ onCreer, onAnnuler, roleUtilisateur }) => {
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [type, setType] = useState<Notification["type"]>("info");
  const [destinataires, setDestinataires] = useState<Notification["destinataires"]>([]);
  const [programmee, setProgrammee] = useState(false);
  const [dateEnvoi, setDateEnvoi] = useState("");
  const [pieceJointe, setPieceJointe] = useState<File | null>(null);

  const typesNotification = [
    { value: "info", label: "Information", icon: Info, couleur: "blue" },
    { value: "urgent", label: "Urgent", icon: AlertCircle, couleur: "red" },
    { value: "evenement", label: "Événement", icon: Calendar, couleur: "purple" },
    { value: "rappel", label: "Rappel", icon: Clock, couleur: "orange" }
  ];

  const groupesDestinataires = [
    { value: "professeur", label: "Professeurs", icon: GraduationCap, couleur: "blue" },
    { value: "gestionnaire", label: "Gestionnaires", icon: Briefcase, couleur: "green" },
    { value: "eleve", label: "Élèves", icon: User, couleur: "orange" },
    { value: "parent", label: "Parents", icon: Heart, couleur: "purple" }
  ]
  .filter(groupe => {
    if (roleUtilisateur === "adminEcole") return groupe.value === "gestionnaire";
    if (roleUtilisateur === "professeur") return groupe.value === "eleve";
    return true;
  });

  const toggleDestinataire = (groupe: string) => {
    setDestinataires(prev => 
      prev.includes(groupe as any)
        ? prev.filter(d => d !== groupe)
        : [...prev, groupe as any]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!titre.trim() || !contenu.trim() || destinataires.length === 0) return;

    // Calcul approximatif du nombre de destinataires
    const nbDestinataires = destinataires.reduce((total, groupe) => {
      const count = contactsMock.filter(c => c.role === groupe).length;
      return total + Math.max(count * 15, 10); // Simulation d'une base plus large
    }, 0);

    onCreer({
      titre: titre.trim(),
      contenu: contenu.trim(),
      type,
      destinataires,
      dateEnvoi: programmee ? dateEnvoi : undefined,
      programmee,
      active: true,
      nbDestinataires,
      pieceJointe: pieceJointe ? {
        nom: pieceJointe.name,
        url: "#",
        type: pieceJointe.type
      } : undefined
    });

    // Reset form
    setTitre("");
    setContenu("");
    setType("info");
    setDestinataires([]);
    setProgrammee(false);
    setDateEnvoi("");
    setPieceJointe(null);
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
            placeholder="Ex: Réunion pédagogique, Nouvelle procédure..."
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            required
          />
        </div>

        {/* Type de notification */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Type de notification
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {typesNotification.map((typeOption) => {
              const IconComponent = typeOption.icon;
              const isSelected = type === typeOption.value;
              
              return (
                <button
                  key={typeOption.value}
                  type="button"
                  onClick={() => setType(typeOption.value as any)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `border-${typeOption.couleur}-500 bg-${typeOption.couleur}-50`
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mx-auto mb-2 ${
                    isSelected ? `text-${typeOption.couleur}-600` : 'text-neutral-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isSelected ? `text-${typeOption.couleur}-700` : 'text-neutral-600'
                  }`}>
                    {typeOption.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Destinataires */}
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Destinataires
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {groupesDestinataires.map((groupe) => {
              const IconComponent = groupe.icon;
              const isSelected = destinataires.includes(groupe.value as any);
              
              return (
                <button
                  key={groupe.value}
                  type="button"
                  onClick={() => toggleDestinataire(groupe.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    isSelected
                      ? `border-${groupe.couleur}-500 bg-${groupe.couleur}-50`
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <IconComponent className={`w-5 h-5 mx-auto mb-2 ${
                    isSelected ? `text-${groupe.couleur}-600` : 'text-neutral-500'
                  }`} />
                  <span className={`text-sm font-medium ${
                    isSelected ? `text-${groupe.couleur}-700` : 'text-neutral-600'
                  }`}>
                    {groupe.label}
                  </span>
                </button>
              );
            })}
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
            placeholder="Rédigez le contenu de votre notification..."
            rows={4}
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            required
          />
        </div>

        {/* Options avancées */}
        <div className="space-y-4">
          {/* Programmation */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="programmee"
              checked={programmee}
              onChange={(e) => setProgrammee(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="programmee" className="text-sm font-medium text-neutral-700">
              Programmer l'envoi
            </label>
          </div>

          {programmee && (
            <div className="ml-6">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Date et heure d'envoi
              </label>
              <input
                type="datetime-local"
                value={dateEnvoi}
                onChange={(e) => setDateEnvoi(e.target.value)}
                className="px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                min={new Date().toISOString().slice(0, 16)}
                required={programmee}
              />
            </div>
          )}

          {/* Pièce jointe */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Pièce jointe (optionnel)
            </label>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                <Paperclip className="w-4 h-4 text-neutral-500" />
                <span className="text-sm text-neutral-600">Choisir un fichier</span>
                <input
                  type="file"
                  onChange={(e) => setPieceJointe(e.target.files?.[0] || null)}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </label>
              {pieceJointe && (
                <span className="text-sm text-neutral-600">
                  {pieceJointe.name}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-6 border-t border-neutral-200">
          <button
            type="button"
            onClick={onAnnuler}
            className="px-6 py-3 text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={!titre.trim() || !contenu.trim() || destinataires.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
            {programmee ? 'Programmer' : 'Envoyer'} la notification
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant liste des notifications
const ListeNotifications: React.FC<{
  notifications: Notification[];
  onNouvelle: () => void;
  onSupprimer: (id: string) => void;
}> = ({ notifications, onNouvelle, onSupprimer }) => {
  const [filtreType, setFiltreType] = useState<string>("tous");

  const notificationsFiltrees = notifications.filter(notif => 
    filtreType === "tous" || notif.type === filtreType
  );

  const formatageDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "urgent": return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "evenement": return <Calendar className="w-5 h-5 text-purple-500" />;
      case "rappel": return <Clock className="w-5 h-5 text-orange-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getDestinatairesBadges = (destinataires: Notification["destinataires"]) => {
    const couleurs = {
      professeur: "bg-blue-100 text-blue-700",
      gestionnaire: "bg-green-100 text-green-700",
      eleve: "bg-orange-100 text-orange-700",
      parent: "bg-purple-100 text-purple-700"
    };

    return destinataires.map(dest => (
      <span key={dest} className={`px-2 py-1 text-xs rounded-full ${couleurs[dest]}`}>
        {dest === "professeur" ? "Prof" : 
         dest === "gestionnaire" ? "Gest" :
         dest === "eleve" ? "Élève" : "Parent"}
      </span>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900">Notifications</h2>
          <p className="text-neutral-600 mt-1">
            Gérez et envoyez des notifications aux différents groupes
          </p>
        </div>
        
        <button
          onClick={onNouvelle}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvelle notification
        </button>
      </div>

      {/* Filtres */}
      <div className="flex items-center gap-3 overflow-x-auto">
        <Filter className="w-4 h-4 text-neutral-500 flex-shrink-0" />
        {[
          { value: "tous", label: "Toutes" },
          { value: "info", label: "Info" },
          { value: "urgent", label: "Urgent" },
          { value: "evenement", label: "Événements" },
          { value: "rappel", label: "Rappels" }
        ].map(filtre => (
          <button
            key={filtre.value}
            onClick={() => setFiltreType(filtre.value)}
            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filtreType === filtre.value
                ? 'bg-primary-100 text-primary-700'
                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            {filtre.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="space-y-4">
        {notificationsFiltrees.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-neutral-900 mb-1">
                      {notification.titre}
                    </h3>
                    <p className="text-neutral-600 mb-3 line-clamp-2">
                      {notification.contenu}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {notification.programmee && !notification.dateEnvoi && (
                      <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-2 py-1 rounded-full text-xs">
                        <Clock className="w-3 h-3" />
                        Programmée
                      </div>
                    )}
                    
                    <button
                      onClick={() => onSupprimer(notification.id)}
                      className="p-1 hover:bg-neutral-100 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-neutral-500" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getDestinatairesBadges(notification.destinataires)}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-neutral-500">
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      {notification.nbDestinataires} destinataires
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {notification.nbLues} lues
                    </div>
                    <span>{formatageDate(notification.dateEnvoi || notification.dateCreation)}</span>
                  </div>
                </div>

                {notification.pieceJointe && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-neutral-50 rounded">
                    <FileText className="w-4 h-4 text-neutral-500" />
                    <span className="text-sm text-neutral-600">
                      {notification.pieceJointe.nom}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {notificationsFiltrees.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-neutral-600 mb-2">
              Aucune notification
            </h3>
            <p className="text-neutral-500">
              {filtreType === "tous" 
                ? "Créez votre première notification pour communiquer avec les utilisateurs."
                : `Aucune notification de type "${filtreType}" trouvée.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Composant principal
const Messagerie: React.FC = () => {
  const { user } = useAuth();
  const [ongletActif, setOngletActif] = useState<"conversations" | "notifications">("conversations");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversationActive, setConversationActive] = useState<string>();
  const [showMobileConversation, setShowMobileConversation] = useState(false);
  const [showNouvelleNotification, setShowNouvelleNotification] = useState(false);
  
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      participantId: "1",
      messagesNonLus: 2,
      epingle: false,
      archive: false,
      derniereMiseAJour: "2024-07-07T10:37:00"
    },
    {
      id: "2", 
      participantId: "2",
      messagesNonLus: 0,
      epingle: true,
      archive: false,
      derniereMiseAJour: "2024-07-07T09:15:00"
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>(notificationsMock);

  const handleCreerNotification = (nouvelleNotification: Omit<Notification, "id" | "dateCreation" | "nbLues">) => {
    const notification: Notification = {
      ...nouvelleNotification,
      id: Date.now().toString(),
      dateCreation: new Date().toISOString(),
      nbLues: 0
    };

    setNotifications(prev => [notification, ...prev]);
    setShowNouvelleNotification(false);
  };

  const handleSupprimerNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="h-screen bg-neutral-50">
      {/* Navigation principale */}
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-xl font-bold text-neutral-900">Communication</h1>
              <nav className="flex space-x-1">
                <button
                  onClick={() => {
                    setOngletActif("conversations");
                    setShowNouvelleNotification(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    ongletActif === "conversations"
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  Conversations
                </button>
                <button
                  onClick={() => {
                    setOngletActif("notifications");
                    setShowMobileConversation(false);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    ongletActif === "notifications"
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                  Notifications
                  {notifications.filter(n => n.active).length > 0 && (
                    <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {notifications.filter(n => n.active).length}
                    </span>
                  )}
                </button>
              </nav>
            </div>
            <div className="flex items-center gap-3">
              {/* <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Settings className="w-5 h-5 text-neutral-600" />
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1">
        {ongletActif === "conversations" ? (
          <ConversationsView
            conversations={conversations}
            setConversations={setConversations}
            conversationActive={conversationActive}
            setConversationActive={setConversationActive}
            showMobileConversation={showMobileConversation}
            setShowMobileConversation={setShowMobileConversation}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        ) : (
          <div className="h-full p-6">
            {showNouvelleNotification ? (
              <CreerNotification
                onCreer={handleCreerNotification}
                onAnnuler={() => setShowNouvelleNotification(false)}
                roleUtilisateur={user?.role}
              />
            ) : (
              <ListeNotifications
                notifications={notifications}
                onNouvelle={() => setShowNouvelleNotification(true)}
                onSupprimer={handleSupprimerNotification}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Composant pour la vue conversations (extrait du code original)
const ConversationsView: React.FC<{
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  conversationActive?: string;
  setConversationActive: React.Dispatch<React.SetStateAction<string | undefined>>;
  showMobileConversation: boolean;
  setShowMobileConversation: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}> = ({
  conversations,
  setConversations,
  conversationActive,
  setConversationActive,
  showMobileConversation,
  setShowMobileConversation,
  searchTerm,
  setSearchTerm
}) => {
  const [messages, setMessages] = useState([
    {
      id: "1",
      expediteurId: "1",
      destinataireId: "current_user",
      contenu: "Bonjour, pouvez-vous me confirmer l'horaire de la réunion de demain ?",
      dateEnvoi: "2024-07-07T10:30:00",
      lu: false,
      type: "texte" as const
    },
    {
      id: "2",
      expediteurId: "current_user",
      destinataireId: "1",
      contenu: "Bonjour Mme Diop, la réunion est prévue à 14h en salle de conférence.",
      dateEnvoi: "2024-07-07T10:35:00",
      lu: true,
      type: "texte" as const
    }
  ]);

  const conversationActiveObj = conversations.find(c => c.id === conversationActive);
  const contactActif = conversationActiveObj ? 
    contactsMock.find(c => c.id === conversationActiveObj.participantId) : undefined;

  const messagesConversation = messages.filter(m => 
    (m.expediteurId === contactActif?.id && m.destinataireId === "current_user") ||
    (m.expediteurId === "current_user" && m.destinataireId === contactActif?.id)
  );

  const handleSelectConversation = (conversationId: string) => {
    setConversationActive(conversationId);
    setShowMobileConversation(true);
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, messagesNonLus: 0 }
          : conv
      )
    );
  };

  const handleEnvoyerMessage = (contenu: string) => {
    if (!contactActif) return;

    const nouveauMessage = {
      id: Date.now().toString(),
      expediteurId: "current_user", 
      destinataireId: contactActif.id,
      contenu,
      dateEnvoi: new Date().toISOString(),
      lu: false,
      type: "texte" as const
    };

    setMessages(prev => [...prev, nouveauMessage]);
    
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationActive
          ? { ...conv, dernierMessage: nouveauMessage, derniereMiseAJour: nouveauMessage.dateEnvoi }
          : conv
      )
    );
  };

  const handleFermerConversation = () => {
    setShowMobileConversation(false);
    setConversationActive(undefined);
  };

  return (
    <div className="h-full bg-white">
      <div className="flex h-full">
        {/* Sidebar des conversations */}
        <div className={`w-full lg:w-80 border-r border-neutral-200 flex flex-col ${
          showMobileConversation ? 'hidden lg:flex' : 'flex'
        }`}>
          {/* Header sidebar */}
          <div className="p-4 border-b border-neutral-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">Conversations</h2>
              <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                <Plus className="w-5 h-5 text-neutral-600" />
              </button>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher une conversation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Liste des conversations */}
          <div className="flex-1 overflow-y-auto p-4">
            <ListeConversations
              conversations={conversations}
              contacts={contactsMock}
              conversationActive={conversationActive}
              onSelectConversation={handleSelectConversation}
              searchTerm={searchTerm}
            />
          </div>
        </div>

        {/* Zone de conversation */}
        <div className={`flex-1 ${
          showMobileConversation ? 'flex' : 'hidden lg:flex'
        }`}>
          <ZoneConversation
            contact={contactActif}
            messages={messagesConversation}
            onEnvoyerMessage={handleEnvoyerMessage}
            onFermerConversation={handleFermerConversation}
          />
        </div>
      </div>
    </div>
  );
};

// Composants originaux réutilisés
const ListeConversations: React.FC<{
  conversations: Conversation[];
  contacts: Contact[];
  conversationActive?: string;
  onSelectConversation: (conversationId: string) => void;
  searchTerm: string;
}> = ({ conversations, contacts, conversationActive, onSelectConversation, searchTerm }) => {
  
  const conversationsFiltrees = conversations.filter(conv => {
    const contact = contacts.find(c => c.id === conv.participantId);
    if (!contact) return false;
    
    const nomComplet = `${contact.prenom} ${contact.nom}`.toLowerCase();
    return nomComplet.includes(searchTerm.toLowerCase());
  });

  const formatageHeure = (date: string) => {
    const maintenant = new Date();
    const dateMessage = new Date(date);
    const diffJours = Math.floor((maintenant.getTime() - dateMessage.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffJours === 0) {
      return dateMessage.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffJours === 1) {
      return "Hier";
    } else if (diffJours < 7) {
      return dateMessage.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return dateMessage.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    }
  };

  return (
    <div className="space-y-1">
      {conversationsFiltrees.map((conversation) => {
        const contact = contacts.find(c => c.id === conversation.participantId);
        if (!contact) return null;

        const estActive = conversationActive === conversation.id;

        return (
          <motion.div
            key={conversation.id}
            whileHover={{ backgroundColor: "rgb(249 250 251)" }}
            onClick={() => onSelectConversation(conversation.id)}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              estActive ? 'bg-primary-50 border border-primary-200' : 'hover:bg-neutral-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <AvatarAvecStatut contact={contact} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className={`font-medium truncate ${estActive ? 'text-primary-700' : 'text-neutral-900'}`}>
                    {contact.prenom} {contact.nom}
                  </h4>
                  <div className="flex items-center gap-2">
                    {conversation.messagesNonLus > 0 && (
                      <span className="bg-primary-600 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                        {conversation.messagesNonLus > 99 ? "99+" : conversation.messagesNonLus}
                      </span>
                    )}
                    <span className="text-xs text-neutral-500">
                      {formatageHeure(conversation.derniereMiseAJour)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    contact.role === "professeur" ? "bg-blue-100 text-blue-700" :
                    contact.role === "gestionnaire" ? "bg-green-100 text-green-700" :
                    contact.role === "parent" ? "bg-purple-100 text-purple-700" :
                    contact.role === "eleve" ? "bg-orange-100 text-orange-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {contact.role === "adminEcole" ? "Admin" : contact.role}
                  </span>
                </div>

                {conversation.dernierMessage && (
                  <p className="text-sm text-neutral-600 truncate mt-1">
                    {conversation.dernierMessage.type === "fichier" 
                      ? `📎 ${conversation.dernierMessage.fichierNom}`
                      : conversation.dernierMessage.contenu
                    }
                  </p>
                )}
              </div>

              {conversation.epingle && (
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              )}
            </div>
          </motion.div>
        );
      })}

      {conversationsFiltrees.length === 0 && (
        <div className="text-center py-8 text-neutral-500">
          <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>Aucune conversation trouvée</p>
        </div>
      )}
    </div>
  );
};

const ComposantMessage: React.FC<{
  message: Message;
  expediteur: Contact;
  estMonMessage: boolean;
  afficherAvatar: boolean;
}> = ({ message, expediteur, estMonMessage, afficherAvatar }) => {
  
  const formatageHeure = (date: string) => {
    return new Date(date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${estMonMessage ? 'flex-row-reverse' : 'flex-row'} group`}
    >
      {afficherAvatar && !estMonMessage && (
        <AvatarAvecStatut contact={expediteur} taille="sm" afficherStatut={false} />
      )}
      
      <div className={`max-w-[70%] ${estMonMessage ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`p-3 rounded-lg ${
          estMonMessage 
            ? 'bg-primary-600 text-white' 
            : 'bg-neutral-100 text-neutral-900'
        }`}>
          {message.type === "fichier" ? (
            <div className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              <span className="text-sm font-medium">{message.fichierNom}</span>
              <Download className="w-4 h-4 cursor-pointer hover:opacity-70" />
            </div>
          ) : (
            <p className="text-sm">{message.contenu}</p>
          )}
        </div>
        
        <div className={`flex items-center gap-2 mt-1 text-xs text-neutral-500 ${
          estMonMessage ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <span>{formatageHeure(message.dateEnvoi)}</span>
          {estMonMessage && (
            <div className="flex items-center">
              {message.lu ? (
                <CheckCircle2 className="w-3 h-3 text-blue-500" />
              ) : (
                <Circle className="w-3 h-3" />
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ZoneConversation: React.FC<{
  contact?: Contact;
  messages: Message[];
  onEnvoyerMessage: (contenu: string) => void;
  onFermerConversation: () => void;
}> = ({ contact, messages, onEnvoyerMessage, onFermerConversation }) => {
  const [messageEnCours, setMessageEnCours] = useState("");
  const [estEnTrainDeTaper, setEstEnTrainDeTaper] = useState(false);
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleEnvoyer = () => {
    if (messageEnCours.trim()) {
      onEnvoyerMessage(messageEnCours.trim());
      setMessageEnCours("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnvoyer();
    }
  };

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Users className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-neutral-600 mb-2">
            Sélectionnez une conversation
          </h3>
          <p className="text-neutral-500">
            Choisissez un contact pour commencer à discuter
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Header de conversation */}
      <div className="bg-white border-b border-neutral-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AvatarAvecStatut contact={contact} taille="lg" />
            <div>
              <h3 className="font-semibold text-neutral-900">
                {contact.prenom} {contact.nom}
              </h3>
              <p className="text-sm text-neutral-500">
                {contact.statut === "en_ligne" ? "En ligne" : contact.derniereConnexion}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Phone className="w-5 h-5 text-neutral-600" />
            </button>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Video className="w-5 h-5 text-neutral-600" />
            </button>
            <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
              <Info className="w-5 h-5 text-neutral-600" />
            </button>
            <button 
              onClick={onFermerConversation}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors lg:hidden"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Zone des messages */}
      <div 
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50"
      >
        {messages.map((message, index) => {
          const expediteur = contactsMock.find(c => c.id === message.expediteurId);
          const estMonMessage = message.expediteurId === "current_user";
          const messagePrecedent = messages[index - 1];
          const afficherAvatar = !messagePrecedent || messagePrecedent.expediteurId !== message.expediteurId;

          return expediteur ? (
            <ComposantMessage
              key={message.id}
              message={message}
              expediteur={expediteur}
              estMonMessage={estMonMessage}
              afficherAvatar={afficherAvatar}
            />
          ) : null;
        })}

        {estEnTrainDeTaper && (
          <div className="flex gap-3">
            <AvatarAvecStatut contact={contact} taille="sm" afficherStatut={false} />
            <div className="bg-neutral-100 p-3 rounded-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zone de saisie */}
      <div className="bg-white border-t border-neutral-200 p-4">
        <div className="flex items-end gap-3">
          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-neutral-600" />
          </button>
          
          <div className="flex-1 relative">
            <textarea
              value={messageEnCours}
              onChange={(e) => setMessageEnCours(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Tapez votre message..."
              rows={1}
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              style={{ minHeight: "44px", maxHeight: "120px" }}
            />
          </div>

          <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-neutral-600" />
          </button>
          
          <button
            onClick={handleEnvoyer}
            disabled={!messageEnCours.trim()}
            className="p-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messagerie;