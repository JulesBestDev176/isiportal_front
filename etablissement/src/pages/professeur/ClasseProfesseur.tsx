import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Edit, Trash2, Users, BookOpen, 
  GraduationCap, Calendar, Save, X, Eye, ChevronDown,
  UserCheck, Clock, MapPin, AlertCircle, CheckCircle, School,
  FileText, Award, TrendingUp, Star, PenTool, Calculator,
  User, ChevronRight, BarChart3, Target, AlertTriangle,
  Download, Upload, RefreshCw
} from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../components/layout/MainLayout";
import { Classe, Professeur } from "../../models";
import { MATIERES_COURANTES } from "../../models/matiere.model";
import { adminService } from "../../services/adminService";
import { eleveService } from "../../services/eleveService";
import { ProfMatiere, Etudiant, Note } from '../../models/eleve.model';

// Fonction helper pour obtenir le nom de la matière à partir de l'ID
const getMatiereNom = (matiereId: number): string => {
  const matiere = MATIERES_COURANTES.find(m => m.code === `MATH${matiereId}`);
  return matiere ? matiere.nom : `Matière ${matiereId}`;
};

// Suppression des interfaces locales - maintenant importées depuis les modèles

// TODO: Remplacer par des appels aux services appropriés

const matieresProfesseur: number[] = [1, 7]; // Mathématiques et Physique-Chimie

const ClasseProfesseur: React.FC = () => {
  const { utilisateur } = useAuth();
  const navigate = useNavigate();
  
  // États
  const [classes, setClasses] = useState<Classe[]>([]);
  const [etudiants, setEtudiants] = useState<Etudiant[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [classeSelectionnee, setClasseSelectionnee] = useState<Classe | null>(null);
  const [etudiantSelectionne, setEtudiantSelectionne] = useState<Etudiant | null>(null);
  const [showModalNotes, setShowModalNotes] = useState(false);
  const [showModalAjoutNote, setShowModalAjoutNote] = useState(false);
  const [noteAModifier, setNoteAModifier] = useState<Note | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Charger les données au montage
  useEffect(() => {
    if (utilisateur) {
      loadClasses();
      loadEtudiants();
      loadNotes();
    }
  }, [utilisateur]);

  const loadClasses = async () => {
    try {
      const response = await adminService.getClasses();
      if (response.success && response.data) {
        setClasses(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des classes:', error);
    }
  };

  const loadEtudiants = async () => {
    try {
      const response = await eleveService.getEleves();
      if (response.success && response.data) {
        setEtudiants(response.data as any[]); // TODO: Créer un service spécifique pour les étudiants
      }
    } catch (error) {
      console.error('Erreur lors du chargement des étudiants:', error);
    }
  };

  const loadNotes = async () => {
    try {
      // TODO: Implémenter l'appel au service pour charger les notes
      setNotes([]);
    } catch (error) {
      console.error('Erreur lors du chargement des notes:', error);
    }
  };

  // Vérification de l'authentification
  useEffect(() => {
    if (!utilisateur || utilisateur.role !== "professeur") {
      navigate("/connexion");
    }
  }, [utilisateur, navigate]);

  if (!utilisateur) {
    return <div>Chargement...</div>;
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Classes</h1>
          <p className="text-gray-600 mt-2">
            Gérez vos classes et suivez les performances de vos élèves
          </p>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Liste des classes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Classes assignées</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {classes.map(classe => (
                    <motion.div
                      key={classe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all cursor-pointer"
                      onClick={() => setClasseSelectionnee(classe)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{classe.nom}</h3>
                          <p className="text-sm text-gray-600">{classe.anneesScolaires[0]?.effectif || 0} élèves</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                            {classe.statut}
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Panneau latéral */}
          <div className="space-y-6">
            {/* Statistiques rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Classes</span>
                  <span className="font-semibold">{classes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Élèves total</span>
                  <span className="font-semibold">{etudiants.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Notes saisies</span>
                  <span className="font-semibold">{notes.length}</span>
                </div>
              </div>
            </div>

            {/* Matières enseignées */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes matières</h3>
              <div className="space-y-2">
                {matieresProfesseur.map(matiereId => (
                  <div key={matiereId} className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span className="text-gray-700">{getMatiereNom(matiereId)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Détails de la classe sélectionnée */}
        <AnimatePresence>
          {classeSelectionnee && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Classe {classeSelectionnee.nom}
                  </h2>
                  <button
                    onClick={() => setClasseSelectionnee(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {etudiants
                    .filter(e => e.classeId === classeSelectionnee.id)
                    .map(etudiant => (
                      <div
                        key={etudiant.id}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {etudiant.prenom} {etudiant.nom}
                            </h4>
                            <p className="text-sm text-gray-600">N° {etudiant.numeroMatricule}</p>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEtudiantSelectionne(etudiant);
                              setShowModalNotes(true);
                            }}
                            className="flex-1 py-2 px-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            Voir notes
                          </button>
                          <button
                            onClick={() => {
                              setEtudiantSelectionne(etudiant);
                              setShowModalAjoutNote(true);
                            }}
                            className="flex-1 py-2 px-3 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Noter
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification de succès */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-4 right-4 bg-green-600 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 z-50"
            >
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  );
};

export default ClasseProfesseur;