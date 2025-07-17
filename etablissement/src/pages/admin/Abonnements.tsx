import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Check, Star, Zap, Shield, Users, Database, 
  ArrowRight, Plus, Minus, CreditCard, Calendar, 
  BookOpen, Crown, CheckCircle, AlertCircle, RefreshCw, Lock, FileText, Download, MessageSquare, Headphones, Clock
} from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useTenant } from "../../contexts/ContexteTenant";
import MainLayout from "../../components/layout/MainLayout";

// Types pour les abonnements
interface PlanAbonnement {
  id: string;
  nom: string;
  prix: number;
  prixAnnuel: number;
  reduction: number;
  description: string;
  populaire?: boolean;
  entreprise?: boolean;
  utilisateurs: number | "illimite";
  stockage: string;
  fonctionnalites: string[];
  support: string;
  couleur: string;
  icone: React.ReactNode;
}

interface AbonnementActuel {
  planId: string;
  dateDebut: string;
  dateFin: string;
  statut: "actif" | "expire" | "suspendu" | "annule";
  prochainPaiement: string;
  montant: number;
  methodePaiement: "paypal" | "carte";
  autoRenouvellement: boolean;
}

interface FactureAbonnement {
  id: string;
  date: string;
  montant: number;
  statut: "payee" | "en_attente" | "echue";
  plan: string;
  methodePaiement: string;
  numeroFacture: string;
}

// Données des plans d'abonnement
const plansAbonnement: PlanAbonnement[] = [
  {
    id: "starter",
    nom: "Starter",
    prix: 29,
    prixAnnuel: 290,
    reduction: 17,
    description: "Parfait pour les petites écoles",
    utilisateurs: 50,
    stockage: "5 Go",
    support: "Email (48h)",
    couleur: "border-gray-200",
    icone: <BookOpen className="w-6 h-6" />,
    fonctionnalites: [
      "Gestion des élèves et classes",
      "Système de notes",
      "Communication parents-professeurs",
      "Calendrier scolaire",
      "Rapports de base",
      "Support par email"
    ]
  },
  {
    id: "basic",
    nom: "Basique",
    prix: 49,
    prixAnnuel: 490,
    reduction: 17,
    description: "Pour les écoles en croissance",
    utilisateurs: 100,
    stockage: "10 Go",
    support: "Email (24h)",
    couleur: "border-blue-200",
    icone: <Users className="w-6 h-6" />,
    fonctionnalites: [
      "Toutes les fonctionnalités Starter",
      "Gestion des devoirs",
      "Système de présences",
      "Messagerie interne",
      "Bibliothèque de ressources",
      "Analytics de base",
      "Export des données"
    ]
  },
  {
    id: "pro",
    nom: "Professionnel",
    prix: 99,
    prixAnnuel: 990,
    reduction: 17,
    description: "Solution complète pour établissements",
    populaire: true,
    utilisateurs: 500,
    stockage: "100 Go",
    support: "Téléphone + Email (12h)",
    couleur: "border-blue-500",
    icone: <Zap className="w-6 h-6" />,
    fonctionnalites: [
      "Toutes les fonctionnalités Basique",
      "Gestion multi-établissements",
      "API personnalisée",
      "Intégrations avancées",
      "Analytics avancées",
      "Sauvegarde automatique",
      "Formation personnalisée",
      "Branding personnalisé"
    ]
  },
  {
    id: "premium",
    nom: "Premium",
    prix: 199,
    prixAnnuel: 1990,
    reduction: 17,
    description: "Pour les grandes institutions",
    entreprise: true,
    utilisateurs: "illimite" as const,
    stockage: "1 To",
    support: "Support prioritaire 24/7",
    couleur: "border-purple-500",
    icone: <Crown className="w-6 h-6" />,
    fonctionnalites: [
      "Toutes les fonctionnalités Pro",
      "Utilisateurs illimités",
      "Stockage illimité",
      "Serveur dédié",
      "Support dédié 24/7",
      "Conformité RGPD avancée",
      "Audit de sécurité",
      "Intégration SSO",
      "SLA garanti 99.9%"
    ]
  }
];

// Composant Carte de Plan
const CartePlan: React.FC<{
  plan: PlanAbonnement;
  abonnementActuel?: AbonnementActuel;
  modeAnnuel: boolean;
  onChoisirPlan: (planId: string) => void;
  delay: number;
}> = ({ plan, abonnementActuel, modeAnnuel, onChoisirPlan, delay }) => {
  const estPlanActuel = abonnementActuel?.planId === plan.id;
  const prixAffiche = modeAnnuel ? plan.prixAnnuel : plan.prix;
  const prixUnitaire = modeAnnuel ? plan.prixAnnuel / 12 : plan.prix;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`relative bg-white rounded-xl border-2 p-6 transition-all duration-300 hover:shadow-lg ${
        plan.populaire 
          ? 'border-blue-500 shadow-lg scale-105' 
          : plan.couleur
      } ${estPlanActuel ? 'ring-2 ring-green-500' : ''}`}
    >
      {plan.populaire && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Star className="w-3 h-3" />
            Plus populaire
          </span>
        </div>
      )}

      {plan.entreprise && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Crown className="w-3 h-3" />
            Entreprise
          </span>
        </div>
      )}

      {estPlanActuel && (
        <div className="absolute -top-3 right-4">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Actuel
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
          plan.populaire ? 'bg-blue-100 text-blue-600' :
          plan.entreprise ? 'bg-purple-100 text-purple-600' :
          'bg-gray-100 text-gray-600'
        }`}>
          {plan.icone}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.nom}</h3>
        <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
        
        <div className="mb-4">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl font-bold text-gray-900">
              {prixUnitaire.toFixed(0)}€
            </span>
            <span className="text-gray-500">/mois</span>
          </div>
          
          {modeAnnuel && plan.reduction > 0 && (
            <div className="mt-2">
              <span className="text-green-600 text-sm font-medium">
                Économisez {plan.reduction}% en payant annuellement
              </span>
              <div className="text-xs text-gray-500 mt-1">
                {prixAffiche}€ facturé annuellement
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Utilisateurs</span>
          <span className="font-medium text-gray-900">
            {plan.utilisateurs === "illimite" ? "Illimité" : plan.utilisateurs}
          </span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Stockage</span>
          <span className="font-medium text-gray-900">{plan.stockage}</span>
        </div>
        
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <span className="text-sm text-gray-600">Support</span>
          <span className="font-medium text-gray-900">{plan.support}</span>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <h4 className="font-medium text-gray-900">Fonctionnalités incluses :</h4>
        <ul className="space-y-2">
          {plan.fonctionnalites.slice(0, 5).map((fonctionnalite, index) => (
            <li key={index} className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
              <span className="text-gray-600">{fonctionnalite}</span>
            </li>
          ))}
          {plan.fonctionnalites.length > 5 && (
            <li className="text-sm text-gray-500">
              +{plan.fonctionnalites.length - 5} autres fonctionnalités
            </li>
          )}
        </ul>
      </div>

      <button
        onClick={() => onChoisirPlan(plan.id)}
        disabled={estPlanActuel}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
          estPlanActuel
            ? 'bg-green-100 text-green-800 cursor-not-allowed'
            : plan.populaire
            ? 'bg-blue-600 text-white hover:bg-blue-700'
            : plan.entreprise
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {estPlanActuel ? 'Plan actuel' : 'Choisir ce plan'}
      </button>
    </motion.div>
  );
};

// Composant PayPal de paiement
const ComposantPayPal: React.FC<{
  montant: number;
  planNom: string;
  onSuccess: () => void;
  onCancel: () => void;
}> = ({ montant, planNom, onSuccess, onCancel }) => {
  const [processing, setProcessing] = useState(false);

  const simulerPaiementPayPal = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (Math.random() > 0.1) {
        onSuccess();
      } else {
        alert("Erreur de paiement simulée");
      }
    }, 3000);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Finaliser votre abonnement
        </h3>
        <p className="text-gray-600">
          Plan {planNom} • {montant}€
        </p>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-900">Total à payer</span>
          <span className="text-xl font-bold text-gray-900">{montant}€</span>
        </div>

        <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-orange-900">Mode démonstration</h4>
              <p className="text-sm text-orange-700 mt-1">
                Ceci est une simulation de paiement PayPal. Aucun vrai paiement ne sera effectué.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <button
          onClick={simulerPaiementPayPal}
          disabled={processing}
          className="w-full bg-[#0070ba] text-white py-3 px-4 rounded-lg font-medium hover:bg-[#005ea6] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Traitement PayPal...
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Payer avec PayPal
            </>
          )}
        </button>

        <button
          onClick={onCancel}
          disabled={processing}
          className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Annuler
        </button>
      </div>

      <div className="mt-6 text-center">
        <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>Sécurisé</span>
          </div>
          <div className="flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Chiffré SSL</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Abonnement actuel
const ComposantAbonnementActuel: React.FC<{
  abonnement: AbonnementActuel;
  plan: PlanAbonnement;
}> = ({ abonnement, plan }) => {
  const joursRestants = Math.ceil(
    (new Date(abonnement.dateFin).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Votre abonnement</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          abonnement.statut === "actif" ? "bg-green-100 text-green-800" :
          abonnement.statut === "expire" ? "bg-red-100 text-red-800" :
          "bg-orange-100 text-orange-800"
        }`}>
          {abonnement.statut === "actif" ? "Actif" :
           abonnement.statut === "expire" ? "Expiré" : "Suspendu"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Plan actuel</h4>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                {plan.icone}
              </div>
              <div>
                <p className="font-medium text-gray-900">{plan.nom}</p>
                <p className="text-sm text-gray-500">{abonnement.montant}€/mois</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Période</h4>
            <div className="text-sm text-gray-600">
              <p>Début: {new Date(abonnement.dateDebut).toLocaleDateString()}</p>
              <p>Fin: {new Date(abonnement.dateFin).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Prochain paiement</h4>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {new Date(abonnement.prochainPaiement).toLocaleDateString()}
              </span>
              <span className="text-gray-400">•</span>
              <span className="font-medium text-gray-900">{abonnement.montant}€</span>
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 mb-2">Méthode de paiement</h4>
            <div className="flex items-center gap-2 text-sm">
              <CreditCard className="w-4 h-4 text-gray-500" />
              <span className="text-gray-600">
                {abonnement.methodePaiement === "paypal" ? "PayPal" : "Carte bancaire"}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <div className={`p-3 rounded-lg ${
              joursRestants > 30 ? "bg-green-50 border border-green-200" :
              joursRestants > 7 ? "bg-orange-50 border border-orange-200" :
              "bg-red-50 border border-red-200"
            }`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-4 h-4 ${
                  joursRestants > 30 ? "text-green-600" :
                  joursRestants > 7 ? "text-orange-600" : "text-red-600"
                }`} />
                <span className={`text-sm font-medium ${
                  joursRestants > 30 ? "text-green-900" :
                  joursRestants > 7 ? "text-orange-900" : "text-red-900"
                }`}>
                  {joursRestants} jours restants
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Composant Historique des factures
const HistoriqueFactures: React.FC<{
  factures: FactureAbonnement[];
}> = ({ factures }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Historique des factures</h3>
        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
          Tout télécharger
        </button>
      </div>

      <div className="space-y-3">
        {factures.map((facture, index) => (
          <motion.div
            key={facture.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                facture.statut === "payee" ? "bg-green-100 text-green-600" :
                facture.statut === "en_attente" ? "bg-orange-100 text-orange-600" :
                "bg-red-100 text-red-600"
              }`}>
                <FileText className="w-5 h-5" />
              </div>
              
              <div>
                <p className="font-medium text-gray-900">
                  Facture #{facture.numeroFacture}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{new Date(facture.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{facture.plan}</span>
                  <span>•</span>
                  <span>{facture.methodePaiement}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{facture.montant}€</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  facture.statut === "payee" ? "bg-green-100 text-green-700" :
                  facture.statut === "en_attente" ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700"
                }`}>
                  {facture.statut === "payee" ? "Payée" :
                   facture.statut === "en_attente" ? "En attente" : "Échue"}
                </span>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Composant principal
const Abonnements: React.FC = () => {
  const [modeAnnuel, setModeAnnuel] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PlanAbonnement | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Données mockées
  const [abonnementActuel] = useState<AbonnementActuel>({
    planId: "basic",
    dateDebut: "2024-01-15",
    dateFin: "2025-01-15",
    statut: "actif",
    prochainPaiement: "2024-08-15",
    montant: 49,
    methodePaiement: "paypal",
    autoRenouvellement: true
  });

  const [factures] = useState<FactureAbonnement[]>([
    {
      id: "1",
      date: "2024-07-15",
      montant: 49,
      statut: "payee",
      plan: "Plan Basique",
      methodePaiement: "PayPal",
      numeroFacture: "INV-2024-07-001"
    },
    {
      id: "2", 
      date: "2024-06-15",
      montant: 49,
      statut: "payee",
      plan: "Plan Basique",
      methodePaiement: "PayPal", 
      numeroFacture: "INV-2024-06-001"
    },
    {
      id: "3",
      date: "2024-05-15",
      montant: 49,
      statut: "payee",
      plan: "Plan Basique",
      methodePaiement: "PayPal",
      numeroFacture: "INV-2024-05-001"
    }
  ]);

  const planActuel = plansAbonnement.find(p => p.id === abonnementActuel.planId);

  const handleChoisirPlan = (planId: string) => {
    const plan = plansAbonnement.find(p => p.id === planId);
    if (plan && plan.id !== abonnementActuel.planId) {
      setSelectedPlan(plan);
      setShowPayment(true);
    }
  };

  const handlePaymentSuccess = () => {
    setShowPayment(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setSelectedPlan(null);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* En-tête */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Choisissez votre abonnement
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Des plans adaptés à tous les établissements scolaires
            </p>
            
            {/* Toggle annuel/mensuel */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className={`text-sm font-medium ${!modeAnnuel ? 'text-gray-900' : 'text-gray-500'}`}>
                Mensuel
              </span>
              <button
                onClick={() => setModeAnnuel(!modeAnnuel)}
                className={`relative w-14 h-7 rounded-full transition-colors ${
                  modeAnnuel ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <div className={`absolute w-5 h-5 bg-white rounded-full top-1 transition-transform ${
                  modeAnnuel ? 'translate-x-8' : 'translate-x-1'
                }`} />
              </button>
              <span className={`text-sm font-medium ${modeAnnuel ? 'text-gray-900' : 'text-gray-500'}`}>
                Annuel
              </span>
              {modeAnnuel && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                  Économisez 17%
                </span>
              )}
            </div>
          </div>

          {/* Abonnement actuel */}
          {planActuel && (
            <ComposantAbonnementActuel 
              abonnement={abonnementActuel} 
              plan={planActuel} 
            />
          )}

          {/* Plans d'abonnement */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {plansAbonnement.map((plan, index) => (
              <CartePlan
                key={plan.id}
                plan={plan}
                abonnementActuel={abonnementActuel}
                modeAnnuel={modeAnnuel}
                onChoisirPlan={handleChoisirPlan}
                delay={index * 0.1}
              />
            ))}
          </div>

          {/* Historique des factures */}
          <HistoriqueFactures factures={factures} />

          {/* Modal de paiement PayPal */}
          <AnimatePresence>
            {showPayment && selectedPlan && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="w-full max-w-md"
                >
                  <ComposantPayPal
                    montant={modeAnnuel ? selectedPlan.prixAnnuel : selectedPlan.prix}
                    planNom={selectedPlan.nom}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                  />
                </motion.div>
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
                <span>Abonnement mis à jour avec succès !</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section FAQ */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Questions fréquentes</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Puis-je changer de plan à tout moment ?</h4>
                  <p className="text-sm text-gray-600">
                    Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. 
                    Les changements prennent effet immédiatement.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Que se passe-t-il si j'annule mon abonnement ?</h4>
                  <p className="text-sm text-gray-600">
                    Vous conservez l'accès jusqu'à la fin de votre période de facturation. 
                    Vos données sont sauvegardées pendant 30 jours.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Quels modes de paiement acceptez-vous ?</h4>
                  <p className="text-sm text-gray-600">
                    Nous acceptons PayPal et les principales cartes bancaires 
                    (Visa, Mastercard, American Express).
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Y a-t-il un engagement minimum ?</h4>
                  <p className="text-sm text-gray-600">
                    Aucun engagement minimum. Vous pouvez annuler votre abonnement 
                    à tout moment sans frais supplémentaires.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section contact */}
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="text-gray-600 mb-4">
              Notre équipe est là pour vous aider à trouver le plan parfait pour votre établissement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Démarrer un chat
              </button>
              <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2">
                <Headphones className="w-4 h-4" />
                Planifier un appel
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Abonnements;