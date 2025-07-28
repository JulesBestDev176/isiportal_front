<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bulletin;
use App\Models\User;
use App\Models\AnneeScolaire;

class BulletinSeeder extends Seeder
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

        $eleves = User::where('role', 'eleve')->get();

        if ($eleves->isEmpty()) {
            $this->command->error('Aucun élève trouvé pour créer les bulletins');
            return;
        }

        foreach ($eleves as $eleve) {
            // Créer un bulletin pour le premier semestre
            Bulletin::create([
                'eleve_id' => $eleve->id,
                'annee_scolaire' => $anneeActive->nom,
                'semestre' => 1,
                'moyenne' => rand(1000, 2000) / 100, // Moyenne entre 10 et 20
                'matieres' => [
                    [
                        'matiere_id' => 1,
                        'nom' => 'Mathématiques',
                        'moyenne' => rand(1000, 2000) / 100,
                        'coefficient' => 4,
                        'appreciation' => 'Bon travail, continuez ainsi.'
                    ],
                    [
                        'matiere_id' => 2,
                        'nom' => 'Français',
                        'moyenne' => rand(1000, 2000) / 100,
                        'coefficient' => 4,
                        'appreciation' => 'Satisfaisant, quelques efforts à fournir.'
                    ],
                    [
                        'matiere_id' => 3,
                        'nom' => 'Histoire-Géographie',
                        'moyenne' => rand(1000, 2000) / 100,
                        'coefficient' => 3,
                        'appreciation' => 'Bon niveau, participation active.'
                    ],
                    [
                        'matiere_id' => 4,
                        'nom' => 'Anglais',
                        'moyenne' => rand(1000, 2000) / 100,
                        'coefficient' => 3,
                        'appreciation' => 'Très bien, excellent travail.'
                    ],
                ],
                'appreciation' => 'Élève sérieux et travailleur. Bonne année scolaire en cours.',
            ]);

            // Créer un bulletin pour le deuxième semestre
            Bulletin::create([
                'eleve_id' => $eleve->id,
                'annee_scolaire' => $anneeActive->nom,
                'semestre' => 2,
                'moyenne' => rand(1000, 2000) / 100, // Moyenne entre 10 et 20
                'matieres' => [
                    [
                        'matiere_id' => 1,
                        'nom' => 'Mathématiques',
                        'moyenne' => rand(1000, 2000) / 100,
                        'coefficient' => 4,
                        'appreciation' => 'Progrès notables, excellent travail.'
                    ],
                    [
                        'matiere_id' => 2,
                        'nom' => 'Français',
                        'moyenne' => rand(1000, 2000) / 100,
                        'coefficient' => 4,
                        'appreciation' => 'Bon niveau, participation active.'
                    ],
                    [
                        'matiere_id' => 3,
                        'nom' => 'Histoire-Géographie',
                        'moyenne' => rand(1000, 2000) / 100,
                        'coefficient' => 3,
                        'appreciation' => 'Satisfaisant, quelques efforts à fournir.'
                    ],
                    [
                        'matiere_id' => 4,
                        'nom' => 'Anglais',
                        'moyenne' => rand(1000, 2000) / 100,
                        'coefficient' => 3,
                        'appreciation' => 'Très bien, excellent travail.'
                    ],
                ],
                'appreciation' => 'Élève sérieux et travailleur. Bonne année scolaire en cours.',
            ]);
        }

        $this->command->info('Bulletins créés avec succès !');
    }
} 