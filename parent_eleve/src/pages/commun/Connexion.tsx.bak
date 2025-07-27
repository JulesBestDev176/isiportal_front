import React, { useState } from "react";
import { useAuth } from "../../contexts/ContexteAuth";
import { useNavigate } from "react-router-dom";
import { useTenant } from "../../contexts/ContexteTenant";

const fichiers = [
  "/data/adminEcole.json",
  "/data/professeurs.json",
  "/data/gestionnaires.json",
  "/data/eleves.json",
  "/data/parents.json"
];

const Connexion: React.FC = () => {
  const { connexion } = useAuth();
  const { definirTenant } = useTenant();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    if (!email || !motDePasse) {
      setErreur("Veuillez saisir un email et un mot de passe.");
      return;
    }
    try {
      // Charge tous les utilisateurs
      const datas = await Promise.all(fichiers.map(f => fetch(f).then(res => res.json())));
      const tous = datas.flat();
      const user = tous.find((u: any) => u.email === email && u.motDePasse === motDePasse);
      if (user) {
        connexion({
          id: user.id,
          email: user.email,
          role: user.role,
          idTenant: user.idTenant,
          prenom: user.prenom,
          nom: user.nom
        });
        // Charger la config tenant
        const etablissements = await fetch("/data/etablissements.json").then(res => res.json());
        const etab = etablissements.find((e: any) => e.id === user.idTenant);
        if (etab) {
          // Adapter à ConfigurationTenant minimal pour le dashboard
          definirTenant({
            idEcole: etab.id,
            sousDomaine: etab.sousDomaine,
            nom: etab.nom,
            branding: {
              logo: etab.logo,
              couleurs: etab.couleurs,
              favicon: ""
            },
            fonctionnalites: {},
            limites: { utilisateurs: 0, stockage: 0 },
            emailContact: etab.emailContact
          });
        }
        // Redirection selon le rôle
        let chemin = "/dashboard";
        // Exemple d'extension possible :
        // if (user.role === "parent") chemin = "/dashboard-parent";
        // if (user.role === "professeur") chemin = "/dashboard-prof";
        navigate(chemin);
      } else {
        setErreur("Email ou mot de passe incorrect.");
      }
    } catch (err) {
      setErreur("Erreur lors de la connexion. Veuillez réessayer.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-300">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary-700">Connexion à l'espace établissement</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              id="motDePasse"
              type="password"
              className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
              value={motDePasse}
              onChange={e => setMotDePasse(e.target.value)}
              required
            />
          </div>
          {erreur && <div className="text-red-600 text-sm">{erreur}</div>}
          <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded font-semibold hover:bg-primary-700 transition">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Connexion; 