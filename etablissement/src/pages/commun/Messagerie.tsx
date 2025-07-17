import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Send, Paperclip, Smile, MoreVertical,
  Phone, Video, Info, Archive, Trash2, Star, Reply,
  Forward, Download, User, Circle, CheckCircle2,
  Users, Filter, Settings, X, Edit3, Clock
} from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useTenant } from "../../contexts/ContexteTenant";
import MainLayout from "../../components/layout/MainLayout";

// Types pour la messagerie
interface Contact {
  id: string;
  nom: string;
  prenom: string;
  role: "adminEcole" | "gestionnaire" | "professeur" | "eleve" | "parent";
  avatar?: string;
  statut: "en_ligne" | "absent" | "occupe" | "invisible";
  derniereConnexion: string;
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
  repondA?: string; // ID du message auquel on répond
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

// Données mockées
const contactsMock: Contact[] = [
  {
    id: "1",
    nom: "Diop",
    prenom: "Fatou",
    role: "professeur",
    statut: "en_ligne",
    derniereConnexion: "Maintenant"
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
    derniereConnexion: "Il y a 2h"
  },
  {
    id: "5",
    nom: "Ndiaye",
    prenom: "Coumba",
    role: "adminEcole",
    statut: "en_ligne",
    derniereConnexion: "Maintenant"
  }
];

const messagesMock: Message[] = [
  {
    id: "1",
    expediteurId: "1",
    destinataireId: "current_user",
    contenu: "Bonjour, pouvez-vous me confirmer l'horaire de la réunion de demain ?",
    dateEnvoi: "2024-07-07T10:30:00",
    lu: false,
    type: "texte"
  },
  {
    id: "2",
    expediteurId: "current_user",
    destinataireId: "1",
    contenu: "Bonjour Mme Diop, la réunion est prévue à 14h en salle de conférence.",
    dateEnvoi: "2024-07-07T10:35:00",
    lu: true,
    type: "texte"
  },
  {
    id: "3",
    expediteurId: "1",
    destinataireId: "current_user",
    contenu: "Parfait, merci pour la confirmation. À demain !",
    dateEnvoi: "2024-07-07T10:37:00",
    lu: false,
    type: "texte"
  },
  {
    id: "4",
    expediteurId: "2",
    destinataireId: "current_user",
    contenu: "Voici le rapport que vous m'aviez demandé.",
    dateEnvoi: "2024-07-07T09:15:00",
    lu: true,
    type: "fichier",
    fichierUrl: "#",
    fichierNom: "rapport_mensuel.pdf"
  }
];

// Composant pour afficher le statut en ligne
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

// Composant Avatar avec statut
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

// Composant Liste des conversations
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

// Composant Message
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

// Composant Zone de conversation
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

// Composant principal
const Messagerie: React.FC = () => {
  const { utilisateur } = useAuth();
  const { tenant } = useTenant();
  const [searchTerm, setSearchTerm] = useState("");
  const [conversationActive, setConversationActive] = useState<string>();
  const [showMobileConversation, setShowMobileConversation] = useState(false);
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
    },
    {
      id: "3",
      participantId: "3", 
      messagesNonLus: 1,
      epingle: false,
      archive: false,
      derniereMiseAJour: "2024-07-06T16:45:00"
    }
  ]);

  const [messages, setMessages] = useState<Message[]>(messagesMock);

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
    
    // Marquer les messages comme lus
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

    const nouveauMessage: Message = {
      id: Date.now().toString(),
      expediteurId: "current_user", 
      destinataireId: contactActif.id,
      contenu,
      dateEnvoi: new Date().toISOString(),
      lu: false,
      type: "texte"
    };

    setMessages(prev => [...prev, nouveauMessage]);
    
    // Mettre à jour la conversation
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

  if (!utilisateur || !tenant) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-neutral-600">Chargement...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="h-[calc(100vh-120px)] bg-white rounded-lg border border-neutral-200 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar des conversations */}
          <div className={`w-full lg:w-80 border-r border-neutral-200 flex flex-col ${
            showMobileConversation ? 'hidden lg:flex' : 'flex'
          }`}>
            {/* Header sidebar */}
            <div className="p-4 border-b border-neutral-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-neutral-900">Messagerie</h2>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Settings className="w-5 h-5 text-neutral-600" />
                  </button>
                  <button className="p-2 hover:bg-neutral-100 rounded-lg transition-colors">
                    <Plus className="w-5 h-5 text-neutral-600" />
                  </button>
                </div>
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
    </MainLayout>
  );
};

export default Messagerie;