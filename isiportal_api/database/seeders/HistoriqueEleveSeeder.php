<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HistoriqueEleve;
use App\Models\User;
use App\Models\Classe;
use App\Models\AnneeScolaire;

class HistoriqueEleveSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eleves = User::where('role', 'eleve')->get();
        $classes = Classe::all();
        $anneesScolaires = AnneeScolaire::all();

        if ($eleves->isEmpty() || $classes->isEmpty() || $anneesScolaires->isEmpty()) {
            $this->command->error('Données manquantes pour créer l\'historique des élèves');
            return;
        }

        foreach ($eleves as $eleve) {
            // Créer un historique pour l'année scolaire précédente
            $anneePrecedente = $anneesScolaires->where('statut', 'terminee')->first();
            if ($anneePrecedente) {
                $classeAleatoire = $classes->random();
                
                HistoriqueEleve::create([
                    'eleve_id' => $eleve->id,
                    'classe_id' => $classeAleatoire->id,
                    'classe_nom' => $classeAleatoire->nom,
                    'annee_scolaire' => $anneePrecedente->nom,
                    'niveau_nom' => $classeAleatoire->niveau->nom,
                    'moyenne_annuelle' => rand(1000, 2000) / 100, // Moyenne entre 10 et 20
                    'statut' => $this->getStatutAleatoire(),
                    'date_inscription' => now()->subYear(),
                    'date_sortie' => now()->subMonths(6),
                    'remarques' => 'Historique de l\'année précédente.',
                ]);
            }

            // Créer un historique pour l'année scolaire actuelle
            $anneeActive = $anneesScolaires->where('statut', 'active')->first();
            if ($anneeActive && $eleve->classe_id) {
                $classeActuelle = $classes->find($eleve->classe_id);
                
                HistoriqueEleve::create([
                    'eleve_id' => $eleve->id,
                    'classe_id' => $eleve->classe_id,
                    'classe_nom' => $classeActuelle->nom,
                    'annee_scolaire' => $anneeActive->nom,
                    'niveau_nom' => $classeActuelle->niveau->nom,
                    'moyenne_annuelle' => rand(1000, 2000) / 100, // Moyenne entre 10 et 20
                    'statut' => 'reussi', // Pour l'année en cours, on utilise 'reussi' par défaut
                    'date_inscription' => now()->subMonths(6),
                    'remarques' => 'Inscription en cours pour l\'année actuelle.',
                ]);
            }
        }

        $this->command->info('Historique des élèves créé avec succès !');
    }

    private function getStatutAleatoire(): string
    {
        $statuts = ['reussi', 'redouble', 'transfert', 'abandon'];
        return $statuts[array_rand($statuts)];
    }
} 