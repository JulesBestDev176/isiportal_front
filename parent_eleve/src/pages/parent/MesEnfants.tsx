import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, User, BookOpen, GraduationCap, Award, Calendar, 
  MessageSquare, FileText, Eye, Download, Bell, Clock, 
  TrendingUp, Target, Star, ChevronRight, Filter, Search,
  AlertCircle, CheckCircle, Phone, Mail, MapPin
} from "lucide-react";

// Types
interface Child {
  id: number;
  nom: string;
  prenom: string;
  classe: string;
  niveau: string;
  moyenneGenerale: number;
  professeurPrincipal: string;
  photo?: string;
  progression: number;
  dateNaissance: string;
  absences: {
    justifiees: number;
    injustifiees: number;
    retards: number;
  };
}

interface Note {
  id: string;
  matiere: string;
  type: string;
  note: number;
  max: number;
  coefficient: number;
  date: string;
  appreciation?: string;
  enfantId: number;
}

interface Bulletin {
  id: string;
  periode: string;
  moyenneGenerale: number;
  rang: number;
  totalEleves: number;
  datePublication: string;
  disponible: boolean;
  enfantId: number;
  appreciation: string;
}

interface RendezVous {
  id: string;
  date: string;
  heure: string;
  professeur: string;
  matiere: string;
  motif: string;
  statut: "programme" | "confirme" | "annule";
  enfantId: number;
}

interface Message {
  id: string;
  expediteur: string;
  sujet: string;
  contenu: string;
  date: string;
  lu: boolean;
  enfantId: number;
  type: "general" | "absence" | "comportement" | "pedagogique";
}

// Données mockées
const enfantsMock: Child[] = [
  {
    id: 1,
    nom: "Durand",
    prenom: "Paul",
    classe: "6ème A",
    niveau: "6ème",
    moyenneGenerale: 14.5,
    professeurPrincipal: "Mme Dubois",
    progression: 80,
    dateNaissance: "2012-05-15",
    absences: {
      justifiees: 2,
      injustifiees: 0,
      retards: 1
    }
  },
  {
    id: 2,
    nom: "Durand", 
    prenom: "Julie",
    classe: "3ème B",
    niveau: "3ème",
    moyenneGenerale: 16.2,
    professeurPrincipal: "M. Lefebvre",
    progression: 92,
    dateNaissance: "2009-09-22",
    absences: {
      justifiees: 1,
      injustifiees: 0,
      retards: 0
    }
  }
];

const notesMock: Note[] = [
  {
    id: "n1",
    matiere: "Mathématiques",
    type: "Contrôle",
    note: 16,
    max: 20,
    coefficient: 2,
    date: "2025-07-20",
    appreciation: "Très bon travail",
    enfantId: 1
  },
  {
    id: "n2",
    matiere: "Français",
    type: "Devoir",
    note: 14,
    max: 20,
    coefficient: 1,
    date: "2025-07-18",
    appreciation: "Peut mieux faire",
    enfantId: 1
  },
  {
    id: "n3",
    matiere: "Sciences",
    type: "TP",
    note: 18,
    max: 20,
    coefficient: 1,
    date: "2025-07-19",
    appreciation: "Excellent",
    enfantId: 2
  },
  {
    id: "n4",
    matiere: "Histoire-Géo",
    type: "Interrogation",
    note: 15,
    max: 20,
    coefficient: 1,
    date: "2025-07-17",
    appreciation: "Bon niveau",
    enfantId: 2
  }
];

const bulletinsMock: Bulletin[] = [
  {
    id: "b1",
    periode: "1er Trimestre 2024-2025",
    moyenneGenerale: 14.5,
    rang: 8,
    totalEleves: 28,
    datePublication: "2024-12-20",
    disponible: true,
    enfantId: 1,
    appreciation: "Élève sérieux qui progresse bien. Continuez vos efforts."
  },
  {
    id: "b2",
    periode: "1er Trimestre 2024-2025",
    moyenneGenerale: 16.2,
    rang: 3,
    totalEleves: 25,
    datePublication: "2024-12-20",
    disponible: true,
    enfantId: 2,
    appreciation: "Excellent trimestre. Félicitations pour ce très bon niveau."
  },
  {
    id: "b3",
    periode: "2ème Trimestre 2024-2025",
    moyenneGenerale: 0,
    rang: 0,
    totalEleves: 28,
    datePublication: "",
    disponible: false,
    enfantId: 1,
    appreciation: ""
  }
];

const rendezVousMock: RendezVous[] = [
  {
    id: "rv1",
    date: "2025-07-28",
    heure: "14:30",
    professeur: "Mme Dubois",
    matiere: "Français",
    motif: "Point sur les difficultés en expression écrite",
    statut: "programme",
    enfantId: 1
  },
  {
    id: "rv2",
    date: "2025-07-30",
    heure: "16:00",
    professeur: "M. Lefebvre",
    matiere: "Général",
    motif: "Réunion parents-professeurs",
    statut: "confirme",
    enfantId: 2
  }
];

const messagesMock: Message[] = [
  {
    id: "m1",
    expediteur: "Mme Dubois",
    sujet: "Absence de Paul",
    contenu: "Paul était absent ce matin. Merci de justifier cette absence.",
    date: "2025-07-22T09:15:00",
    lu: false,
    enfantId: 1,
    type: "absence"
  },
  {
    id: "m2",
    expediteur: "M. Lefebvre",
    sujet: "Félicitations pour Julie",
    contenu: "Je tenais à vous féliciter pour les excellents résultats de Julie ce trimestre.",
    date: "2025-07-20T15:30:00",
    lu: true,
    enfantId: 2,
    type: "pedagogique"
  }
];

// Composants
const EnfantCard: React.FC<{ enfant: Child; onSelect: (enfant: Child) => void; isSelected: boolean }> = ({ 
  enfant, 
  onSelect, 
  isSelected 
}) => {
  const getMoyenneColor = (moyenne: number) => {
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600";
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  const calculateAge = (dateNaissance: string) => {
    const today = new Date();
    const birthDate = new Date(dateNaissance);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={() => onSelect(enfant)}
      className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all ${
        isSelected ? 'border-primary-500 shadow-lg' : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          {enfant.photo ? (
            <img src={enfant.photo} alt={enfant.prenom} className="w-full h-full rounded-full object-cover" />
          ) : (
            <User className="w-6 h-6 text-primary-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-neutral-900 truncate">{enfant.prenom} {enfant.nom}</h3>
          <p className="text-sm text-neutral-600 truncate">{enfant.classe}</p>
          <p className="text-xs text-neutral-500 truncate">{calculateAge(enfant.dateNaissance)} ans</p>
        </div>
        {isSelected && (
          <CheckCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="text-center p-2 bg-green-50 rounded">
          <p className="text-xs text-neutral-600">Moyenne</p>
          <p className={`text-lg font-bold ${getMoyenneColor(enfant.moyenneGenerale)}`}>
            {enfant.moyenneGenerale}
          </p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded">
          <p className="text-xs text-neutral-600">Progression</p>
          <p className="text-lg font-bold text-blue-600">{enfant.progression}%</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-green-600">
          <CheckCircle className="w-3 h-3" />
          <span>Abs: {enfant.absences.justifiees + enfant.absences.injustifiees}</span>
        </div>
        <ChevronRight className="w-3 h-3 text-neutral-400" />
      </div>
    </motion.div>
  );
};

const NoteCard: React.FC<{ note: Note }> = ({ note }) => {
  const getNoteColor = (note: number, max: number) => {
    const percentage = (note / max) * 100;
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (percentage >= 40) return "text-orange-600 bg-orange-50 border-orange-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-neutral-900">{note.matiere}</h4>
          <p className="text-sm text-neutral-600">{note.type}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-lg font-bold border ${getNoteColor(note.note, note.max)}`}>
          {note.note}/{note.max}
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Date :</span>
          <span className="font-medium">{new Date(note.date).toLocaleDateString('fr-FR')}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-600">Coefficient :</span>
          <span className="font-medium">{note.coefficient}</span>
        </div>
        {note.appreciation && (
          <div className="p-2 bg-neutral-50 rounded text-sm text-neutral-700">
            <span className="font-medium">Appréciation : </span>
            {note.appreciation}
          </div>
        )}
      </div>
    </div>
  );
};

const BulletinCard: React.FC<{ bulletin: Bulletin }> = ({ bulletin }) => {
  const getMoyenneColor = (moyenne: number) => {
    if (moyenne >= 16) return "text-green-600";
    if (moyenne >= 12) return "text-blue-600";
    if (moyenne >= 10) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-bold text-neutral-900">{bulletin.periode}</h4>
          {bulletin.datePublication && (
            <p className="text-sm text-neutral-600">Publié le {new Date(bulletin.datePublication).toLocaleDateString('fr-FR')}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
          bulletin.disponible 
            ? 'bg-green-100 text-green-800' 
            : 'bg-orange-100 text-orange-800'
        }`}>
          {bulletin.disponible ? 'Disponible' : 'En cours'}
        </span>
      </div>

      {bulletin.disponible && (
        <>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600">Moyenne générale</p>
              <p className={`text-2xl font-bold ${getMoyenneColor(bulletin.moyenneGenerale)}`}>
                {bulletin.moyenneGenerale}/20
              </p>
            </div>
            <div className="text-center p-3 bg-neutral-50 rounded-lg">
              <p className="text-sm text-neutral-600">Classement</p>
              <p className="text-2xl font-bold text-primary-600">
                {bulletin.rang}e
              </p>
              <p className="text-xs text-neutral-500">sur {bulletin.totalEleves}</p>
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg mb-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Appréciation : </span>
              {bulletin.appreciation}
            </p>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-2 bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
              <Eye className="w-4 h-4" />
              Consulter
            </button>
            <button className="flex items-center justify-center gap-2 bg-neutral-100 text-neutral-700 py-2 px-4 rounded-lg hover:bg-neutral-200 transition-colors">
              <Download className="w-4 h-4" />
              PDF
            </button>
          </div>
        </>
      )}

      {!bulletin.disponible && (
        <div className="text-center py-6">
          <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-2" />
          <p className="text-neutral-500">Bulletin en cours de préparation</p>
        </div>
      )}
    </div>
  );
};

const RendezVousCard: React.FC<{ rdv: RendezVous }> = ({ rdv }) => {
  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "confirme": return "bg-green-100 text-green-800";
      case "programme": return "bg-blue-100 text-blue-800";
      case "annule": return "bg-red-100 text-red-800";
      default: return "bg-neutral-100 text-neutral-800";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "confirme": return "Confirmé";
      case "programme": return "Programmé";
      case "annule": return "Annulé";
      default: return statut;
    }
  };

  return (
    <div className="bg-white border border-neutral-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-neutral-900">{rdv.professeur}</h4>
          <p className="text-sm text-neutral-600">{rdv.matiere}</p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatutColor(rdv.statut)}`}>
          {getStatutLabel(rdv.statut)}
        </span>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-neutral-500" />
          <span>{new Date(rdv.date).toLocaleDateString('fr-FR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="w-4 h-4 text-neutral-500" />
          <span>{rdv.heure}</span>
        </div>
      </div>

      <div className="p-3 bg-neutral-50 rounded text-sm">
        <span className="font-medium">Motif : </span>
        {rdv.motif}
      </div>

      {rdv.statut === "programme" && (
        <div className="flex gap-2 mt-3">
          <button className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors">
            Confirmer
          </button>
          <button className="bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors">
            Annuler
          </button>
        </div>
      )}
    </div>
  );
};

const MessageCard: React.FC<{ message: Message }> = ({ message }) => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "absence": return "bg-orange-100 text-orange-800";
      case "comportement": return "bg-red-100 text-red-800";
      case "pedagogique": return "bg-green-100 text-green-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "absence": return "Absence";
      case "comportement": return "Comportement";
      case "pedagogique": return "Pédagogique";
      default: return "Général";
    }
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const msgDate = new Date(date);
    const diffHours = Math.floor((now.getTime() - msgDate.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      return msgDate.toLocaleDateString('fr-FR');
    }
  };

  return (
    <div className={`bg-white border rounded-lg p-4 ${!message.lu ? 'border-primary-200 bg-primary-50/30' : 'border-neutral-200'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-neutral-900">{message.sujet}</h4>
            {!message.lu && <div className="w-2 h-2 bg-primary-600 rounded-full"></div>}
          </div>
          <p className="text-sm text-neutral-600">De : {message.expediteur}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(message.type)}`}>
            {getTypeLabel(message.type)}
          </span>
          <span className="text-xs text-neutral-500">{formatDate(message.date)}</span>
        </div>
      </div>

      <p className="text-sm text-neutral-700 mb-3 line-clamp-2">{message.contenu}</p>

      <div className="flex gap-2">
        <button className="flex-1 bg-primary-600 text-white py-2 px-3 rounded text-sm hover:bg-primary-700 transition-colors">
          Lire
        </button>
        <button className="bg-neutral-100 text-neutral-700 py-2 px-3 rounded text-sm hover:bg-neutral-200 transition-colors">
          Répondre
        </button>
      </div>
    </div>
  );
};

// Composant principal
const MesEnfants: React.FC = () => {
  const [enfantSelectionne, setEnfantSelectionne] = useState<Child | null>(enfantsMock[0]);
  const [ongletActif, setOngletActif] = useState<"apercu" | "notes" | "bulletins">("apercu");
  const [rechercheTexte, setRechercheTexte] = useState("");

  if (!enfantSelectionne) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-neutral-900">Mes enfants</h1>
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500">Aucun enfant lié à ce compte.</p>
        </div>
      </div>
    );
  }

  const notesEnfant = notesMock.filter(note => note.enfantId === enfantSelectionne.id);
  const bulletinsEnfant = bulletinsMock.filter(bulletin => bulletin.enfantId === enfantSelectionne.id);
  const rdvEnfant = rendezVousMock.filter(rdv => rdv.enfantId === enfantSelectionne.id);
  const messagesEnfant = messagesMock.filter(msg => msg.enfantId === enfantSelectionne.id);

  const notesFiltrees = notesEnfant.filter(note => 
    note.matiere.toLowerCase().includes(rechercheTexte.toLowerCase()) ||
    note.type.toLowerCase().includes(rechercheTexte.toLowerCase())
  );

  const tabs = [
    { id: 'apercu', label: 'Aperçu', icon: <User className="w-4 h-4" /> },
    { id: 'notes', label: 'Notes', icon: <Award className="w-4 h-4" />, count: notesEnfant.length },
    { id: 'bulletins', label: 'Bulletins', icon: <FileText className="w-4 h-4" />, count: bulletinsEnfant.filter(b => b.disponible).length }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* En-tête */}
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Mes enfants</h1>
          <p className="text-neutral-600">Suivez la scolarité et les résultats de vos enfants</p>
        </div>

        {/* Sélection d'enfant */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {enfantsMock.map(enfant => (
            <EnfantCard
              key={enfant.id}
              enfant={enfant}
              onSelect={setEnfantSelectionne}
              isSelected={enfantSelectionne.id === enfant.id}
            />
          ))}
        </div>

        {/* Navigation par onglets */}
        <div className="bg-white rounded-lg border border-neutral-200">
          <div className="flex border-b border-neutral-200 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setOngletActif(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  ongletActif === tab.id
                    ? "border-primary-500 text-primary-600"
                    : "border-transparent text-neutral-500 hover:text-neutral-700"
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.charAt(0)}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="bg-primary-100 text-primary-600 text-xs rounded-full px-2 py-0.5 min-w-[18px] text-center">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {ongletActif === "apercu" && (
                <motion.div
                  key="apercu"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informations générales */}
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-900">Informations générales</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <p className="text-sm text-neutral-600">Classe</p>
                          <p className="text-lg font-medium text-neutral-900">{enfantSelectionne.classe}</p>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <p className="text-sm text-neutral-600">Professeur principal</p>
                          <p className="text-lg font-medium text-neutral-900">{enfantSelectionne.professeurPrincipal}</p>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <p className="text-sm text-neutral-600">Absences justifiées</p>
                          <p className="text-lg font-medium text-green-600">{enfantSelectionne.absences.justifiees}</p>
                        </div>
                        <div className="bg-neutral-50 p-4 rounded-lg">
                          <p className="text-sm text-neutral-600">Retards</p>
                          <p className="text-lg font-medium text-orange-600">{enfantSelectionne.absences.retards}</p>
                        </div>
                      </div>
                    </div>

                    {/* Statistiques */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-neutral-900">Résumé</h3>
                      <div className="space-y-3">
                        <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-center">
                          <p className="text-sm text-green-600">Moyenne générale</p>
                          <p className="text-2xl font-bold text-green-700">{enfantSelectionne.moyenneGenerale}/20</p>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg text-center">
                          <p className="text-sm text-blue-600">Notes ce mois</p>
                          <p className="text-2xl font-bold text-blue-700">{notesEnfant.length}</p>
                        </div>
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg text-center">
                          <p className="text-sm text-purple-600">Messages non lus</p>
                          <p className="text-2xl font-bold text-purple-700">{messagesEnfant.filter(m => !m.lu).length}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Activités récentes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-neutral-900">Activités récentes</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Dernières notes */}
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h4 className="font-medium text-neutral-900 mb-3">Dernières notes</h4>
                        <div className="space-y-2">
                          {notesEnfant.slice(0, 3).map(note => (
                            <div key={note.id} className="flex items-center justify-between text-sm">
                              <span className="text-neutral-600">{note.matiere}</span>
                              <span className="font-medium">{note.note}/{note.max}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Prochains événements */}
                      <div className="bg-neutral-50 p-4 rounded-lg">
                        <h4 className="font-medium text-neutral-900 mb-3">Prochains événements</h4>
                        <div className="space-y-2">
                          {rdvEnfant.slice(0, 2).map(rdv => (
                            <div key={rdv.id} className="text-sm">
                              <p className="font-medium text-neutral-900">{rdv.professeur}</p>
                              <p className="text-neutral-600">{new Date(rdv.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {ongletActif === "notes" && (
                <motion.div
                  key="notes"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Filtres et recherche */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Rechercher une matière..."
                        value={rechercheTexte}
                        onChange={(e) => setRechercheTexte(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50">
                      <Filter className="w-4 h-4" />
                      Filtrer
                    </button>
                  </div>

                  {/* Liste des notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {notesFiltrees.map(note => (
                      <NoteCard key={note.id} note={note} />
                    ))}
                  </div>

                  {notesFiltrees.length === 0 && (
                    <div className="text-center py-12">
                      <Award className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">Aucune note trouvée</p>
                    </div>
                  )}
                </motion.div>
              )}

              {ongletActif === "bulletins" && (
                <motion.div
                  key="bulletins"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {bulletinsEnfant.map(bulletin => (
                      <BulletinCard key={bulletin.id} bulletin={bulletin} />
                    ))}
                  </div>

                  {bulletinsEnfant.length === 0 && (
                    <div className="text-center py-12">
                      <FileText className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <p className="text-neutral-500">Aucun bulletin disponible</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default MesEnfants;