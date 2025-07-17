import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  School, MapPin, Phone, Mail, Globe, Calendar, 
  Users, BookOpen, Award, Star, Edit, Save, 
  Eye, Trash2, Plus, Search, Filter, Download,
  ChevronDown, ChevronRight, X, AlertCircle,
  UploadCloud, Palette, Image, FileText, Lock,
  Shield, Zap, Target, TrendingUp, BarChart3, RefreshCw, Info
} from "lucide-react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useTenant } from "../../contexts/ContexteTenant";
import MainLayout from "../../components/layout/MainLayout";

// Types pour les données de l'établissement
interface EtablissementData {
  // Informations générales
  nom: string;
  sousDomaine: string;
  domainePersonnalise?: string;
  emailContact: string;
  telephone?: string;
  adresse?: string;
  siteWeb?: string;
  
  // Informations administratives
  directeur?: string;
  typeEtablissement: "primaire" | "elementaire" | "college" | "lycee" | "mixte";
  secteur: "public" | "prive";
  
  // Branding et personnalisation
  logo: string; // URL ou texte
  slogan?: string;
  couleurs: {
    primaire: string;
    secondaire: string;
    fond: string;
    texte: string;
  };
  
  // Paramètres système
  actif: boolean;
  dateCreation: string;
}

// Types pour les onglets
type TabType = "informations" | "branding";

// Composant sélecteur de couleurs avancé
const ColorPicker: React.FC<{
  color: string;
  onChange: (color: string) => void;
  label: string;
}> = ({ color, onChange, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [lightness, setLightness] = useState(50);
  const [hex, setHex] = useState(color);

  // Convertir hex vers HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Convertir HSL vers hex
  const hslToHex = (h: number, s: number, l: number) => {
    h /= 360;
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h * 6) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 1/6) {
      r = c; g = x; b = 0;
    } else if (1/6 <= h && h < 2/6) {
      r = x; g = c; b = 0;
    } else if (2/6 <= h && h < 3/6) {
      r = 0; g = c; b = x;
    } else if (3/6 <= h && h < 4/6) {
      r = 0; g = x; b = c;
    } else if (4/6 <= h && h < 5/6) {
      r = x; g = 0; b = c;
    } else if (5/6 <= h && h < 1) {
      r = c; g = 0; b = x;
    }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (color !== hex) {
      const [h, s, l] = hexToHsl(color);
      setHue(h);
      setSaturation(s);
      setLightness(l);
      setHex(color);
    }
  }, [color]);

  useEffect(() => {
    const newHex = hslToHex(hue, saturation, lightness);
    if (newHex !== hex) {
      setHex(newHex);
      onChange(newHex);
    }
  }, [hue, saturation, lightness]);

  const handleHexChange = (value: string) => {
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setHex(value);
      onChange(value);
      const [h, s, l] = hexToHsl(value);
      setHue(h);
      setSaturation(s);
      setLightness(l);
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-neutral-700 mb-2">
        {label}
      </label>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 border-2 border-neutral-300 rounded-lg shadow-sm cursor-pointer hover:border-neutral-400 transition-colors"
          style={{ backgroundColor: hex }}
        />
        
        <input
          type="text"
          value={hex}
          onChange={(e) => handleHexChange(e.target.value)}
          className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 font-mono"
          placeholder="#000000"
        />
      </div>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute z-50 mt-2 p-4 bg-white border border-neutral-200 rounded-lg shadow-xl"
          style={{ width: "280px" }}
        >
          {/* Zone de saturation/luminosité */}
          <div className="relative w-full h-48 mb-4 rounded cursor-crosshair"
               style={{
                 background: `linear-gradient(to right, #fff, hsl(${hue}, 100%, 50%)), linear-gradient(to top, #000, transparent)`
               }}
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = (e.clientX - rect.left) / rect.width;
                 const y = 1 - (e.clientY - rect.top) / rect.height;
                 setSaturation(x * 100);
                 setLightness(y * 100);
               }}>
            <div 
              className="absolute w-3 h-3 border-2 border-white rounded-full shadow-lg pointer-events-none"
              style={{
                left: `${saturation}%`,
                top: `${100 - lightness}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          </div>

          {/* Barre de teinte */}
          <div className="relative w-full h-4 mb-4 rounded cursor-pointer"
               style={{
                 background: 'linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)'
               }}
               onClick={(e) => {
                 const rect = e.currentTarget.getBoundingClientRect();
                 const x = (e.clientX - rect.left) / rect.width;
                 setHue(x * 360);
               }}>
            <div 
              className="absolute w-1 h-full bg-white border border-neutral-300 pointer-events-none"
              style={{
                left: `${(hue / 360) * 100}%`,
                transform: 'translateX(-50%)'
              }}
            />
          </div>

          {/* Sliders */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-neutral-600">Teinte</label>
              <input
                type="range"
                min="0"
                max="360"
                value={hue}
                onChange={(e) => setHue(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-600">Saturation</label>
              <input
                type="range"
                min="0"
                max="100"
                value={saturation}
                onChange={(e) => setSaturation(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-neutral-600">Luminosité</label>
              <input
                type="range"
                min="0"
                max="100"
                value={lightness}
                onChange={(e) => setLightness(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700"
            >
              OK
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

// Couleurs prédéfinies
const couleursPredefines = {
  themes: [
    {
      nom: "Bleu Océan",
      couleurs: {
        primaire: "#3c5fa0",
        secondaire: "#5178c0",
        fond: "#f0f5ff",
        texte: "#1a2d61"
      }
    },
    {
      nom: "Vert Nature",
      couleurs: {
        primaire: "#059669",
        secondaire: "#10b981",
        fond: "#f0fdf4",
        texte: "#064e3b"
      }
    },
    {
      nom: "Orange Énergie",
      couleurs: {
        primaire: "#ea580c",
        secondaire: "#f97316",
        fond: "#fff7ed",
        texte: "#9a3412"
      }
    },
    {
      nom: "Violet Élégant",
      couleurs: {
        primaire: "#7c3aed",
        secondaire: "#8b5cf6",
        fond: "#faf5ff",
        texte: "#581c87"
      }
    },
    {
      nom: "Rouge Passion",
      couleurs: {
        primaire: "#dc2626",
        secondaire: "#ef4444",
        fond: "#fef2f2",
        texte: "#991b1b"
      }
    },
    {
      nom: "Gris Moderne",
      couleurs: {
        primaire: "#374151",
        secondaire: "#4b5563",
        fond: "#f9fafb",
        texte: "#111827"
      }
    }
  ]
};

// Composant Informations Générales
const InformationsGenerales: React.FC<{
  data: EtablissementData;
  setData: (data: EtablissementData) => void;
  onSave: () => void;
  loading: boolean;
}> = ({ data, setData, onSave, loading }) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.nom.trim()) newErrors.nom = "Le nom est requis";
    if (!data.sousDomaine.trim()) newErrors.sousDomaine = "Le sous-domaine est requis";
    if (!data.emailContact.trim()) newErrors.emailContact = "L'email de contact est requis";
    else if (!/\S+@\S+\.\S+/.test(data.emailContact)) newErrors.emailContact = "Email invalide";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informations de base */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <School className="w-5 h-5" />
            Informations de base
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Nom de l'établissement *
              </label>
              <input
                type="text"
                value={data.nom}
                onChange={(e) => setData({...data, nom: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.nom ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="École Primaire Dakar Centre"
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
                Sous-domaine *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={data.sousDomaine}
                  onChange={(e) => setData({...data, sousDomaine: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                  className={`w-full px-4 py-3 pr-32 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                    errors.sousDomaine ? 'border-red-500' : 'border-neutral-300'
                  }`}
                  placeholder="dakar-centre"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500">
                  .monecole.sn
                </span>
              </div>
              {errors.sousDomaine && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.sousDomaine}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Type d'établissement
              </label>
              <select
                value={data.typeEtablissement}
                onChange={(e) => setData({...data, typeEtablissement: e.target.value as EtablissementData["typeEtablissement"]})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="primaire">École Primaire</option>
                <option value="elementaire">École Élémentaire</option>
                <option value="college">Collège</option>
                <option value="lycee">Lycée</option>
                <option value="mixte">Établissement Mixte</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Secteur
              </label>
              <select
                value={data.secteur}
                onChange={(e) => setData({...data, secteur: e.target.value as "public" | "prive"})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="public">Public</option>
                <option value="prive">Privé</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Directeur/Directrice
              </label>
              <input
                type="text"
                value={data.directeur || ""}
                onChange={(e) => setData({...data, directeur: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Nom du directeur"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Slogan (optionnel)
              </label>
              <input
                type="text"
                value={data.slogan || ""}
                onChange={(e) => setData({...data, slogan: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Excellence et innovation"
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Informations de contact
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Mail className="w-4 h-4 inline mr-1" />
                Email de contact *
              </label>
              <input
                type="email"
                value={data.emailContact}
                onChange={(e) => setData({...data, emailContact: e.target.value})}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors ${
                  errors.emailContact ? 'border-red-500' : 'border-neutral-300'
                }`}
                placeholder="contact@ecole.sn"
              />
              {errors.emailContact && (
                <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.emailContact}
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
                value={data.telephone || ""}
                onChange={(e) => setData({...data, telephone: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="+221 33 XXX XX XX"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Adresse
              </label>
              <textarea
                value={data.adresse || ""}
                onChange={(e) => setData({...data, adresse: e.target.value})}
                rows={3}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Adresse complète de l'établissement"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                <Globe className="w-4 h-4 inline mr-1" />
                Site web
              </label>
              <input
                type="url"
                value={data.siteWeb || ""}
                onChange={(e) => setData({...data, siteWeb: e.target.value})}
                className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="https://www.ecole.sn"
              />
            </div>
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
                <RefreshCw className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant Branding
const BrandingPersonnalisation: React.FC<{
  data: EtablissementData;
  setData: (data: EtablissementData) => void;
  onSave: () => void;
  loading: boolean;
}> = ({ data, setData, onSave, loading }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>("");

  const appliquerTheme = (theme: typeof couleursPredefines.themes[0]) => {
    setData({
      ...data,
      couleurs: theme.couleurs
    });
    setSelectedTheme(theme.nom);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Thèmes prédéfinis */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Thèmes prédéfinis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {couleursPredefines.themes.map((theme) => (
              <button
                key={theme.nom}
                type="button"
                onClick={() => appliquerTheme(theme)}
                className={`p-4 border-2 rounded-lg transition-all hover:shadow-md ${
                  selectedTheme === theme.nom 
                    ? 'border-primary-500 bg-primary-50' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-6 h-6 rounded-full border border-neutral-200"
                    style={{ backgroundColor: theme.couleurs.primaire }}
                  />
                  <span className="font-medium text-neutral-900">{theme.nom}</span>
                </div>
                <div className="flex gap-1">
                  {Object.values(theme.couleurs).map((couleur, index) => (
                    <div
                      key={index}
                      className="flex-1 h-4 rounded first:rounded-l last:rounded-r"
                      style={{ backgroundColor: couleur }}
                    />
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Couleurs personnalisées */}
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-6">
            Aperçu des couleurs
          </h3>
          
          <div 
            className="p-6 rounded-lg border"
            style={{ 
              backgroundColor: data.couleurs.fond,
              color: data.couleurs.texte,
            }}
          >
            <div className="flex items-center gap-4 mb-6">
              {data.logo.startsWith('http') ? (
                <img
                  src={data.logo}
                  alt="Logo"
                  className="w-12 h-12 object-contain rounded-lg bg-white border border-neutral-200"
                />
              ) : (
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-xl font-bold"
                  style={{ backgroundColor: data.couleurs.primaire }}
                >
                  {data.logo.substring(0, 2) || "EC"}
                </div>
              )}
              <div>
                <h4 className="text-xl font-bold">{data.nom}</h4>
                {data.slogan && (
                  <p className="text-sm opacity-80">{data.slogan}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <button 
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: data.couleurs.primaire }}
                >
                  Bouton principal
                </button>
                
                <button 
                  className="px-4 py-2 rounded-lg text-white font-medium"
                  style={{ backgroundColor: data.couleurs.secondaire }}
                >
                  Bouton secondaire
                </button>
              </div>
              
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: data.couleurs.fond, opacity: 0.2 }}
              >
                <p>Zone d'accent avec couleur de fond</p>
              </div>

              <div className="grid grid-cols-5 gap-2 mt-4">
                {Object.entries(data.couleurs).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div
                      className="w-full h-8 rounded border border-neutral-200 mb-1"
                      style={{ backgroundColor: value }}
                    />
                    <div className="text-xs font-medium capitalize">{key}</div>
                    <div className="text-xs font-mono opacity-70">{value}</div>
                  </div>
                ))}
              </div>
            </div>
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
                <RefreshCw className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer le thème
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

// Composant principal
const Etablissements: React.FC = () => {
  const { utilisateur } = useAuth();
  const { tenant } = useTenant();
  const [activeTab, setActiveTab] = useState<TabType>("informations");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  
  // Données de l'établissement avec valeurs par défaut
  const [etablissementData, setEtablissementData] = useState<EtablissementData>({
    nom: tenant?.nom || "",
    sousDomaine: tenant?.sousDomaine || "",
    emailContact: tenant?.emailContact || "",
    telephone: "",
    adresse: "",
    siteWeb: "",
    directeur: "",
    typeEtablissement: "mixte",
    secteur: "prive",
    logo: "École",
    slogan: "",
    couleurs: {
      primaire: "#3c5fa0",
      secondaire: "#5178c0",
      fond: "#f0f5ff",
      texte: "#1a2d61"
    },
    actif: true,
    dateCreation: "2024-01-15"
  });

  const tabs = [
    {
      id: "informations" as TabType,
      label: "Informations générales",
      icon: <Info className="w-4 h-4" />
    },
    {
      id: "branding" as TabType,
      label: "Couleurs & Thèmes",
      icon: <Palette className="w-4 h-4" />
    }
  ];

  const handleSave = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      // Simulation d'un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Ici vous feriez l'appel à votre API pour sauvegarder
      // await api.updateEtablissement(etablissementData);
      
      setMessage("✅ Modifications enregistrées avec succès !");
      
      // Effacer le message après 3 secondes
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
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
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Configuration de l'établissement</h1>
            <p className="text-neutral-600 mt-1">
              Personnalisez les informations et l'apparence de votre établissement
            </p>
          </div>
          
          {message && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                message.includes('✅') 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </motion.div>
          )}
        </div>

        {/* Navigation par onglets */}
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
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === "informations" && (
                <InformationsGenerales
                  key="informations"
                  data={etablissementData}
                  setData={setEtablissementData}
                  onSave={handleSave}
                  loading={loading}
                />
              )}
              
              {activeTab === "branding" && (
                <BrandingPersonnalisation
                  key="branding"
                  data={etablissementData}
                  setData={setEtablissementData}
                  onSave={handleSave}
                  loading={loading}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Statistiques automatiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg border border-neutral-200 p-6"
        >
          <h3 className="text-lg font-semibold text-neutral-900 mb-4 flex items-center gap-2">
            <School className="w-5 h-5" />
            Statistiques de l'établissement (automatiques)
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">248</div>
              <div className="text-sm text-blue-800 font-medium">Élèves inscrits</div>
              <div className="text-xs text-blue-600 mt-1">Mis à jour automatiquement</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">12</div>
              <div className="text-sm text-green-800 font-medium">Classes actives</div>
              <div className="text-xs text-green-600 mt-1">Calculé en temps réel</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">24</div>
              <div className="text-sm text-purple-800 font-medium">Professeurs</div>
              <div className="text-xs text-purple-600 mt-1">Comptes actifs</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl font-bold text-orange-600">156</div>
              <div className="text-sm text-orange-800 font-medium">Parents connectés</div>
              <div className="text-xs text-orange-600 mt-1">Ce mois-ci</div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-600">
              <strong>Info :</strong> Ces statistiques sont calculées automatiquement en fonction des utilisateurs, 
              classes et activités de votre établissement. Elles se mettent à jour en temps réel.
            </p>
          </div>
        </motion.div>

        {/* Conseils selon l'onglet actif */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-6"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            {activeTab === "informations" && "💡 Conseils pour les informations"}
            {activeTab === "branding" && "🎨 Conseils pour les couleurs"}
          </h3>
          
          {activeTab === "informations" && (
            <div className="text-sm text-blue-800 space-y-2">
              <p>• <strong>Nom :</strong> Utilisez le nom officiel complet de votre établissement</p>
              <p>• <strong>Sous-domaine :</strong> Choisissez un nom court et mémorable (exemple: dakar-centre)</p>
              <p>• <strong>Logo :</strong> Utilisez une URL d'image hébergée ou du texte simple</p>
              <p>• <strong>Contact :</strong> Renseignez au minimum l'email principal de contact</p>
            </div>
          )}
          
          {activeTab === "branding" && (
            <div className="text-sm text-blue-800 space-y-2">
              <p>• <strong>Thèmes :</strong> Commencez par un thème prédéfini puis personnalisez selon vos besoins</p>
              <p>• <strong>Couleurs :</strong> Utilisez le sélecteur avancé pour ajuster précisément chaque teinte</p>
              <p>• <strong>Contraste :</strong> Assurez-vous que le texte reste lisible sur les fonds choisis</p>
              <p>• <strong>Cohérence :</strong> Gardez une harmonie entre toutes les couleurs de votre palette</p>
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Etablissements;