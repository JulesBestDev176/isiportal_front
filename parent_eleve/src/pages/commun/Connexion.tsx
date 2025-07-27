import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTenant } from "../../contexts/ContexteTenant";

const utilisateursTest = [
  { label: "Élève", email: "eleve@test.com", motDePasse: "eleve123" },
  { label: "Parent", email: "parent@test.com", motDePasse: "parent123" }
];

const Connexion: React.FC = () => {
  const { login, user } = useAuth();
  const { } = useTenant();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");

  // Log l'utilisateur courant à chaque render
  console.log("User courant dans Connexion:", user);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErreur("");
    console.log("Tentative de connexion avec :", email, motDePasse);
    if (!email || !motDePasse) {
      setErreur("Veuillez saisir un email et un mot de passe.");
      console.log("Champs manquants");
      return;
    }
    try {
      const success = await login(email, motDePasse);
      console.log("Résultat login:", success);
      if (success) {
        console.log("Connexion réussie, redirection vers /dashboard");
        navigate("/dashboard");
      } else {
        setErreur("Email ou mot de passe incorrect.");
        console.log("Identifiants incorrects");
      }
    } catch (err) {
      setErreur("Erreur lors de la connexion. Veuillez réessayer.");
      console.error("Erreur lors de la connexion:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-300">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-primary-700">Connexion à l'espace établissement</h1>
        {/* Utilisateurs de test */}
        <div className="mb-6">
          <div className="text-sm font-semibold mb-2 text-neutral-700">Comptes de test :</div>
          <div className="space-y-2">
            {utilisateursTest.map(u => (
              <div key={u.label} className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded px-3 py-2">
                <div>
                  <span className="font-bold text-primary">{u.label}</span> :
                  <span className="ml-2">{u.email} / {u.motDePasse}</span>
                </div>
                <button
                  type="button"
                  className="ml-4 px-3 py-1 bg-primary text-white rounded hover:bg-primary-700 text-xs"
                  onClick={() => { setEmail(u.email); setMotDePasse(u.motDePasse); }}
                >Remplir</button>
              </div>
            ))}
          </div>
        </div>
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