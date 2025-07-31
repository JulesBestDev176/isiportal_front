<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\AnneeScolaire;
use Illuminate\Support\Facades\DB;

class ProfesseurTestSeeder extends Seeder
{
    public function run()
    {
        // Créer quelques cours de test
        $anneeActive = AnneeScolaire::where('statut', 'active')->first();
        if (!$anneeActive) {
            $anneeActive = AnneeScolaire::create([
                'nom' => '2024-2025',
                'date_debut' => '2024-09-01',
                'date_fin' => '2025-07-31',
                'statut' => 'active'
            ]);
        }

        $matieres = Matiere::take(5)->get();
        $niveaux = Niveau::take(3)->get();
        $professeur = User::where('role', 'professeur')->first();

        if ($professeur && $matieres->count() > 0 && $niveaux->count() > 0) {
            foreach ($matieres as $matiere) {
                foreach ($niveaux as $niveau) {
                    $cours = Cours::create([
                        'titre' => "Cours de {$matiere->nom} - {$niveau->nom}",
                        'description' => "Cours de {$matiere->nom} pour le niveau {$niveau->nom}",
                        'matiere_id' => $matiere->id,
                        'niveau_id' => $niveau->id,
                        'annee_scolaire_id' => $anneeActive->id,
                        'semestres_ids' => [1, 2],
                        'statut' => 'en_cours',
                        'coefficient' => 2.0,
                        'heures_par_semaine' => 4
                    ]);

                    // Associer le cours au professeur
                    DB::table('cours_professeurs')->insert([
                        'cours_id' => $cours->id,
                        'professeur_id' => $professeur->id,
                        'created_at' => now(),
                        'updated_at' => now()
                    ]);
                }
            }
        }
    }
}