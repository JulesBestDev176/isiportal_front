<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Cours;
use App\Models\AnneeScolaire;
use App\Models\User;
use App\Models\Matiere;
use App\Models\Niveau;

class CoursSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $anneeActive = AnneeScolaire::where('statut', 'active')->first();
        
        if (!$anneeActive) {
            $this->command->error('Aucune année scolaire active trouvée');
            return;
        }

        $professeurs = User::where('role', 'professeur')->get();
        $matieres = Matiere::all();
        $niveaux = Niveau::all();

        if ($professeurs->isEmpty() || $matieres->isEmpty() || $niveaux->isEmpty()) {
            $this->command->error('Données manquantes pour créer les cours');
            return;
        }

        $cours = [
            [
                'titre' => 'Mathématiques 6ème',
                'description' => 'Cours de mathématiques pour la classe de 6ème',
                'matiere_id' => 1, // Mathématiques
                'niveau_id' => 1, // 6ème
                'annee_scolaire_id' => $anneeActive->id,
                'semestres_ids' => [1, 2],
                'heures_par_semaine' => 4,
                'coefficient' => 4,
                'statut' => 'en_cours',
            ],
            [
                'titre' => 'Français 6ème',
                'description' => 'Cours de français pour la classe de 6ème',
                'matiere_id' => 2, // Français
                'niveau_id' => 1, // 6ème
                'annee_scolaire_id' => $anneeActive->id,
                'semestres_ids' => [1, 2],
                'heures_par_semaine' => 4,
                'coefficient' => 4,
                'statut' => 'en_cours',
            ],
            [
                'titre' => 'Histoire-Géographie 6ème',
                'description' => 'Cours d\'histoire-géographie pour la classe de 6ème',
                'matiere_id' => 3, // Histoire-Géographie
                'niveau_id' => 1, // 6ème
                'annee_scolaire_id' => $anneeActive->id,
                'semestres_ids' => [1, 2],
                'heures_par_semaine' => 3,
                'coefficient' => 3,
                'statut' => 'en_cours',
            ],
            [
                'titre' => 'Anglais 6ème',
                'description' => 'Cours d\'anglais pour la classe de 6ème',
                'matiere_id' => 4, // Anglais
                'niveau_id' => 1, // 6ème
                'annee_scolaire_id' => $anneeActive->id,
                'semestres_ids' => [1, 2],
                'heures_par_semaine' => 3,
                'coefficient' => 3,
                'statut' => 'en_cours',
            ],
            [
                'titre' => 'Mathématiques 5ème',
                'description' => 'Cours de mathématiques pour la classe de 5ème',
                'matiere_id' => 1, // Mathématiques
                'niveau_id' => 2, // 5ème
                'annee_scolaire_id' => $anneeActive->id,
                'semestres_ids' => [1, 2],
                'heures_par_semaine' => 4,
                'coefficient' => 4,
                'statut' => 'en_cours',
            ],
            [
                'titre' => 'Français 5ème',
                'description' => 'Cours de français pour la classe de 5ème',
                'matiere_id' => 2, // Français
                'niveau_id' => 2, // 5ème
                'annee_scolaire_id' => $anneeActive->id,
                'semestres_ids' => [1, 2],
                'heures_par_semaine' => 4,
                'coefficient' => 4,
                'statut' => 'en_cours',
            ],
            [
                'titre' => 'Physique-Chimie 4ème',
                'description' => 'Cours de physique-chimie pour la classe de 4ème',
                'matiere_id' => 7, // Physique-Chimie
                'niveau_id' => 3, // 4ème
                'annee_scolaire_id' => $anneeActive->id,
                'semestres_ids' => [1, 2],
                'heures_par_semaine' => 3,
                'coefficient' => 3,
                'statut' => 'en_cours',
            ],
            [
                'titre' => 'Mathématiques Terminale',
                'description' => 'Cours de mathématiques pour la classe de Terminale',
                'matiere_id' => 1, // Mathématiques
                'niveau_id' => 7, // Terminale
                'annee_scolaire_id' => $anneeActive->id,
                'semestres_ids' => [1, 2],
                'heures_par_semaine' => 6,
                'coefficient' => 6,
                'statut' => 'en_cours',
            ],
        ];

        foreach ($cours as $coursData) {
            Cours::create($coursData);
        }

        $this->command->info('Cours créés avec succès !');
    }
} 