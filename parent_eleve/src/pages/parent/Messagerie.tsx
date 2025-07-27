import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare, Send, Reply, Forward, Archive, Trash2,
  Search, Filter, Star, Paperclip, User, Calendar,
  Clock, AlertCircle, CheckCircle, Eye, X, Plus,
  Download, FileText, Image, Phone, Mail
} from "lucide-react";

// Types
interface Message {
  id: string;
  sujet: string;
  contenu: string;
  expediteur: string;
  destinataire: string;
  roleExpediteur: "parent" | "professeur" | "gestionnaire" | "direction";
  matiere?: string;
  enfantConcerne?: string;
  dateEnvoi: string;
  lu: boolean;
  epingle: boolean;
  archive: boolean;
  type: "message" | "reponse" | "transfert";
  conversationId: string;
  pieceJointe?: {
    nom: string;
    url: string;
    type: string;
    taille: string;
  };
  priorite: "normale" | "haute" | "urgent";
}

interface Contact {
  id: string;
  nom: string;
  role: "professeur" | "gestionnaire" | "direction";
  matiere?: string;
  email: string;
  telephone?: string;
  disponible: boolean;
}

// Données mockées
const messagesMock: Message[] = [
  {
    id: "1",
    sujet: "Résultats de Paul en mathématiques",
    contenu: "Bonjour, je souhaitais vous faire part des progrès remarquables de Paul en mathématiques ce trimestre. Sa moyenne est passée de 12 à 15,5. Félicitations !",
    expediteur: "M. Dubois",
    destinataire: "M. et Mme Durand",
    roleExpediteur: "professeur",
    matiere: "Mathématiques",
    enfantConcerne: "Paul Durand",
    dateEnvoi: "2025-07-22T14:30:00",
    lu: false,
    epingle: true,
    archive: false,
    type: "message",
    conversationId: "conv_1",
    priorite: "normale"
  },
  {
    id: "2",
    sujet: "Re: Absence de Julie",
    contenu: "Merci pour la justification. L'absence de Julie est bien enregistrée. Elle pourra rattraper le contrôle de sciences mercredi prochain.",
    expediteur: "Mme Leroy",
    destinataire: "M. et Mme Durand",
    roleExpediteur: "professeur",
    matiere: "Sciences",
    enfantConcerne: "Julie Durand",
    dateEnvoi: "2025-07-21T16:45:00",
    lu: true,
    epingle: false,
    archive: false,
    type: "reponse",
    conversationId: "conv_2",
    priorite: "normale"
  },
  {
    id: "3",
    sujet: "Rendez-vous parents-professeurs",
    contenu: "Les créneaux pour les rendez-vous parents-professeurs sont maintenant disponibles. Merci de vous inscrire avant le 30 juillet.",
    expediteur: "Secrétariat",
    destinataire: "Tous les parents",
    roleExpediteur: "gestionnaire",
    dateEnvoi: "2025-07-20T09:00:00",
    lu: true,
    epingle: false,
    archive: false,
    type: "message",
    conversationId: "conv_3",
    pieceJointe: {
      nom: "planning_rdv.pdf",
      url: "#",
      type: "pdf",
      taille: "156 KB"
    },
    priorite: "haute"
  },
  {
    id: "4",
    sujet: "Comportement de Paul",
    contenu: "J'aimerais vous rencontrer pour discuter du comportement de Paul en classe. Pourriez-vous me proposer quelques créneaux cette semaine ?",
    expediteur: "Mme Martin",
    destinataire: "M. et Mme Durand",
    roleExpediteur: "professeur",
    matiere: "Français",
    enfantConcerne: "Paul Durand",
    dateEnvoi: "2025-07-19T11:20:00",
    lu: false,
    epingle: true,
    archive: false,
    type: "message",
    conversationId: "conv_4",
    priorite: "urgent"
  },
  {
    id: "5",
    sujet: "Félicitations pour Julie",
    contenu: "Je tenais à vous féliciter pour l'excellent travail de Julie. Elle a obtenu 18/20 au dernier devoir de littérature. Continuez ainsi !",
    expediteur: "M. Rousseau",
    destinataire: "M. et Mme Durand",
    roleExpediteur: "professeur",
    matiere: "Français",
    enfantConcerne: "Julie Durand",
    dateEnvoi: "2025-07-18T15:10:00",
    lu: true,
    epingle: false,
    archive: false,
    type: "message",
    conversationId: "conv_5",
    priorite: "normale"
  }
];

const contactsMock: Contact[] = [
  {
    id: "1",
    nom: "M. Dubois",
    role: "professeur",
    matiere: "Mathématiques",
    email: "j.dubois@college.fr",
    telephone: "01 23 45 67 89",
    disponible: true
  },
  {
    id: "2",
    nom: "Mme Leroy",
    role: "professeur",
    matiere: "Sciences",
    email: "s.leroy@college.fr",
    disponible: true
  },
  {
    id: "3",
    nom: "Mme Martin",
    role: "professeur",
    matiere: "Français",
    email: "c.martin@college.fr",
    disponible: false
  },
  {
    id: "4",
    nom: "Secrétariat",
    role: "gestionnaire",
    email: "secretariat@college.fr",
    telephone: "01 23 45 67 80",
    disponible: true
  }
];

// Composant Message Item
const MessageItem: React.FC<{
  message: Message;
  onToggleLu: (id: string) => void;
  onToggleEpingle: (id: string) => void;
  onArchiver: (id: string) => void;
  onSupprimer: (id: string) => void;
  onOuvrir: (message: Message) => void;
}> = ({ message, onToggleLu, onToggleEpingle, onArchiver, onSupprimer, onOuvrir }) => {
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "professeur": return <User className="w-4 h-4 text-blue-500" />;
      case "gestionnaire": return <User className="w-4 h-4 text-green-500" />;
      case "direction": return <User className="w-4 h-4 text-purple-500" />;
      default: return <User className="w-4 h-4 text-neutral-500" />;
    }
  };

  const getPrioriteColor = (priorite: string) => {
    switch (priorite) {
      case "urgent": return "border-l-red-500";
      case "haute": return "border-l-orange-500";
      default: return "border-l-blue-500";
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffTime = now.getTime() - msgDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));

    if (diffHours < 24) {
      return msgDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return "Hier";
    } else if (diffDays < 7) {
      return msgDate.toLocaleDateString('fr-FR', { weekday: 'short' });
    } else {
      return msgDate.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border-l-4 ${getPrioriteColor(message.priorite)} border-r border-t border-b border-neutral-200 hover:shadow-md transition-all duration-200 cursor-pointer ${
        !message.lu ? 'bg-primary-50/30' : ''
      }`}
      onClick={() => onOuvrir(message)}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            {getRoleIcon(message.roleExpediteur)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className={`font-semibold text-neutral-900 truncate ${!message.lu ? 'text-primary-900' : ''}`}>
                    {message.sujet}
                  </h3>
                  {!message.lu && (
                    <span className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0"></span>
                  )}
                  {message.epingle && (
                    <Star className="w-4 h-4 text-yellow-500 fill-current flex-shrink-0" />
                  )}
                  {message.pieceJointe && (
                    <Paperclip className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                  )}
                </div>
                
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="text-sm font-medium text-neutral-900">{message.expediteur}</span>
                  {message.matiere && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                      {message.matiere}
                    </span>
                  )}
                  {message.enfantConcerne && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                      {message.enfantConcerne}
                    </span>
                  )}
                  {message.priorite === "urgent" && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded-full">
                      Urgent
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                <span className="text-sm text-neutral-500">{formatDate(message.dateEnvoi)}</span>
                
                <button
                  onClick={() => onToggleLu(message.id)}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors ml-2"
                  title={message.lu ? "Marquer comme non lu" : "Marquer comme lu"}
                >
                  {message.lu ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
                
                <button
                  onClick={() => onToggleEpingle(message.id)}
                  className="p-1 hover:bg-neutral-100 rounded transition-colors"
                  title={message.epingle ? "Désépingler" : "Épingler"}
                >
                  <Star className={`w-4 h-4 ${message.epingle ? 'text-yellow-500 fill-current' : 'text-neutral-500'}`} />
                </button>
              </div>
            </div>

            <p className="text-neutral-700 text-sm line-clamp-2 mb-2">
              {message.contenu}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant Modal de lecture/réponse
const ModalMessage: React.FC<{
  message: Message;
  onClose: () => void;
  onRepondre: (messageId: string, contenu: string) => void;
}> = ({ message, onClose, onRepondre }) => {
  const [reponse, setReponse] = useState("");
  const [modeReponse, setModeReponse] = useState(false);

  const handleEnvoyerReponse = () => {
    if (reponse.trim()) {
      onRepondre(message.id, reponse);
      setReponse("");
      setModeReponse(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">{message.sujet}</h2>
              <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                <span>De: <span className="font-medium">{message.expediteur}</span></span>
                <span>À: <span className="font-medium">{message.destinataire}</span></span>
                <span>{new Date(message.dateEnvoi).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="prose max-w-none mb-6">
            <p className="text-neutral-700 leading-relaxed whitespace-pre-wrap">{message.contenu}</p>
          </div>

          {message.pieceJointe && (
            <div className="mb-6">
              <h4 className="font-medium text-neutral-900 mb-3">Pièce jointe</h4>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                <FileText className="w-8 h-8 text-neutral-500" />
                <div className="flex-1">
                  <p className="font-medium text-neutral-900">{message.pieceJointe.nom}</p>
                  <p className="text-sm text-neutral-600">{message.pieceJointe.taille}</p>
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Télécharger
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setModeReponse(!modeReponse)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Reply className="w-4 h-4" />
              Répondre
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
              <Forward className="w-4 h-4" />
              Transférer
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
              <Archive className="w-4 h-4" />
              Archiver
            </button>
          </div>

          {modeReponse && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-6 border-t border-neutral-200 pt-6"
            >
              <h4 className="font-medium text-neutral-900 mb-3">Votre réponse</h4>
              <textarea
                value={reponse}
                onChange={(e) => setReponse(e.target.value)}
                placeholder="Tapez votre réponse ici..."
                className="w-full h-32 p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              />
              <div className="flex justify-end gap-3 mt-3">
                <button
                  onClick={() => setModeReponse(false)}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleEnvoyerReponse}
                  disabled={!reponse.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                  Envoyer
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

// Composant Modal nouveau message
const ModalNouveauMessage: React.FC<{
  contacts: Contact[];
  onClose: () => void;
  onEnvoyer: (destinataire: string, sujet: string, contenu: string, enfant?: string) => void;
}> = ({ contacts, onClose, onEnvoyer }) => {
  const [destinataire, setDestinataire] = useState("");
  const [sujet, setSujet] = useState("");
  const [contenu, setContenu] = useState("");
  const [enfantConcerne, setEnfantConcerne] = useState("");

  const handleEnvoyer = () => {
    if (destinataire && sujet.trim() && contenu.trim()) {
      onEnvoyer(destinataire, sujet, contenu, enfantConcerne);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-neutral-900">Nouveau message</h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-neutral-600" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Destinataire *
            </label>
            <select
              value={destinataire}
              onChange={(e) => setDestinataire(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sélectionner un destinataire</option>
              {contacts.map(contact => (
                <option key={contact.id} value={contact.nom}>
                  {contact.nom} {contact.matiere ? `- ${contact.matiere}` : `- ${contact.role}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Enfant concerné
            </label>
            <select
              value={enfantConcerne}
              onChange={(e) => setEnfantConcerne(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Sélectionner un enfant (optionnel)</option>
              <option value="Paul Durand">Paul Durand</option>
              <option value="Julie Durand">Julie Durand</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Sujet *
            </label>
            <input
              type="text"
              value={sujet}
              onChange={(e) => setSujet(e.target.value)}
              placeholder="Objet de votre message"
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Message *
            </label>
            <textarea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              placeholder="Tapez votre message ici..."
              rows={8}
              className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleEnvoyer}
              disabled={!destinataire || !sujet.trim() || !contenu.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              Envoyer
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Composant principal
const Messagerie: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>(messagesMock);
  const [messageSelectionne, setMessageSelectionne] = useState<Message | null>(null);
  const [showNouveauMessage, setShowNouveauMessage] = useState(false);
  const [filtreType, setFiltreType] = useState<string>("tous");
  const [filtreLu, setFiltreLu] = useState<string>("tous");
  const [rechercheTexte, setRechercheTexte] = useState("");

  // Filtrage des messages
  const messagesFiltres = messages.filter(message => {
    if (message.archive) return false;
    
    const matchTexte = message.sujet.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      message.contenu.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
                      message.expediteur.toLowerCase().includes(rechercheTexte.toLowerCase());
    const matchLu = filtreLu === "tous" || 
                    (filtreLu === "lu" && message.lu) ||
                    (filtreLu === "non_lu" && !message.lu);
    
    return matchTexte && matchLu;
  });

  // Tri des messages: épinglés en premier, puis par date
  const messagesTries = messagesFiltres.sort((a, b) => {
    if (a.epingle && !b.epingle) return -1;
    if (!a.epingle && b.epingle) return 1;
    return new Date(b.dateEnvoi).getTime() - new Date(a.dateEnvoi).getTime();
  });

  const handleToggleLu = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, lu: !msg.lu } : msg
      )
    );
  };

  const handleToggleEpingle = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, epingle: !msg.epingle } : msg
      )
    );
  };

  const handleArchiver = (id: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, archive: true } : msg
      )
    );
  };

  const handleSupprimer = (id: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  };

  const handleOuvrirMessage = (message: Message) => {
    setMessageSelectionne(message);
    // Marquer comme lu si pas encore lu
    if (!message.lu) {
      handleToggleLu(message.id);
    }
  };

  const handleRepondre = (messageId: string, contenu: string) => {
    const messageOriginal = messages.find(m => m.id === messageId);
    if (messageOriginal) {
      const nouvelleReponse: Message = {
        id: `reponse_${Date.now()}`,
        sujet: `Re: ${messageOriginal.sujet}`,
        contenu: contenu,
        expediteur: "M. et Mme Durand",
        destinataire: messageOriginal.expediteur,
        roleExpediteur: "parent",
        enfantConcerne: messageOriginal.enfantConcerne,
        dateEnvoi: new Date().toISOString(),
        lu: true,
        epingle: false,
        archive: false,
        type: "reponse",
        conversationId: messageOriginal.conversationId,
        priorite: "normale"
      };
      setMessages(prev => [nouvelleReponse, ...prev]);
    }
  };

  const handleEnvoyerNouveauMessage = (destinataire: string, sujet: string, contenu: string, enfant?: string) => {
    const nouveauMessage: Message = {
      id: `msg_${Date.now()}`,
      sujet: sujet,
      contenu: contenu,
      expediteur: "M. et Mme Durand",
      destinataire: destinataire,
      roleExpediteur: "parent",
      enfantConcerne: enfant,
      dateEnvoi: new Date().toISOString(),
      lu: true,
      epingle: false,
      archive: false,
      type: "message",
      conversationId: `conv_${Date.now()}`,
      priorite: "normale"
    };
    setMessages(prev => [nouveauMessage, ...prev]);
    setShowNouveauMessage(false);
  };

  const marquerToutesCommeLues = () => {
    setMessages(prev => 
      prev.map(msg => ({ ...msg, lu: true }))
    );
  };

  const nombreNonLus = messages.filter(m => !m.lu && !m.archive).length;

  return (
    <div className="min-h-screen bg-neutral-50 p-4 lg:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-6">
        {/* En-tête */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Messagerie</h1>
            <p className="text-neutral-600 mt-1">
              Communication avec les professeurs et l'administration
              {nombreNonLus > 0 && (
                <span className="ml-2 px-2 py-1 bg-primary-600 text-white text-xs rounded-full">
                  {nombreNonLus} non {nombreNonLus > 1 ? 'lus' : 'lu'}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex gap-3">
            {nombreNonLus > 0 && (
              <button
                onClick={marquerToutesCommeLues}
                className="flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Tout marquer comme lu
              </button>
            )}
            <button
              onClick={() => setShowNouveauMessage(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Nouveau message
            </button>
          </div>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white rounded-lg border border-neutral-200 p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Rechercher dans les messages..."
                  value={rechercheTexte}
                  onChange={(e) => setRechercheTexte(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <select
                value={filtreLu}
                onChange={(e) => setFiltreLu(e.target.value)}
                className="px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="tous">Tous les messages</option>
                <option value="non_lu">Non lus</option>
                <option value="lu">Lus</option>
              </select>

              {(rechercheTexte || filtreLu !== "tous") && (
                <button
                  onClick={() => {
                    setRechercheTexte("");
                    setFiltreLu("tous");
                  }}
                  className="px-3 py-2 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  Réinitialiser
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Liste des messages */}
        <div className="space-y-3">
          {messagesTries.length > 0 ? (
            messagesTries.map((message) => (
              <MessageItem
                key={message.id}
                message={message}
                onToggleLu={handleToggleLu}
                onToggleEpingle={handleToggleEpingle}
                onArchiver={handleArchiver}
                onSupprimer={handleSupprimer}
                onOuvrir={handleOuvrirMessage}
              />
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-lg border border-neutral-200">
              <MessageSquare className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-neutral-600 mb-2">
                {rechercheTexte || filtreLu !== "tous" 
                  ? "Aucun message trouvé"
                  : "Aucun message"
                }
              </h3>
              <p className="text-neutral-500 mb-4">
                {rechercheTexte || filtreLu !== "tous"
                  ? "Essayez de modifier vos critères de recherche."
                  : "Vous recevrez ici les messages de l'équipe éducative."
                }
              </p>
              {!rechercheTexte && filtreLu === "tous" && (
                <button
                  onClick={() => setShowNouveauMessage(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Envoyer votre premier message
                </button>
              )}
            </div>
          )}
        </div>

        {/* Contacts rapides */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Contacts rapides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactsMock.slice(0, 4).map(contact => (
              <div key={contact.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${contact.disponible ? 'bg-green-500' : 'bg-neutral-300'}`}></div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 truncate">{contact.nom}</p>
                  <p className="text-sm text-neutral-600 truncate">
                    {contact.matiere || contact.role}
                  </p>
                </div>
                <div className="flex gap-1">
                  {contact.email && (
                    <button 
                      title="Envoyer un email"
                      className="p-1 hover:bg-neutral-200 rounded transition-colors"
                    >
                      <Mail className="w-4 h-4 text-neutral-500" />
                    </button>
                  )}
                  {contact.telephone && (
                    <button 
                      title="Appeler"
                      className="p-1 hover:bg-neutral-200 rounded transition-colors"
                    >
                      <Phone className="w-4 h-4 text-neutral-500" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal de lecture/réponse */}
        <AnimatePresence>
          {messageSelectionne && (
            <ModalMessage
              message={messageSelectionne}
              onClose={() => setMessageSelectionne(null)}
              onRepondre={handleRepondre}
            />
          )}
        </AnimatePresence>

        {/* Modal nouveau message */}
        <AnimatePresence>
          {showNouveauMessage && (
            <ModalNouveauMessage
              contacts={contactsMock}
              onClose={() => setShowNouveauMessage(false)}
              onEnvoyer={handleEnvoyerNouveauMessage}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Messagerie;