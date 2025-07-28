<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;

class MatiereSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $matieres = [
            [
                'nom' => 'Mathématiques',
                'code' => 'MATH',
                'description' => 'Mathématiques',
                'coefficient' => 4.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Français',
                'code' => 'FRAN',
                'description' => 'Français',
                'coefficient' => 4.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Histoire-Géographie',
                'code' => 'HIST',
                'description' => 'Histoire-Géographie',
                'coefficient' => 3.00,
                'heures_par_semaine' => 3,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Anglais',
                'code' => 'ANGL',
                'description' => 'Anglais',
                'coefficient' => 2.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Espagnol',
                'code' => 'ESP',
                'description' => 'Espagnol',
                'coefficient' => 2.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Allemand',
                'code' => 'ALLE',
                'description' => 'Allemand',
                'coefficient' => 2.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Physique-Chimie',
                'code' => 'PHYS',
                'description' => 'Physique-Chimie',
                'coefficient' => 3.00,
                'heures_par_semaine' => 3,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Sciences de la Vie et de la Terre',
                'code' => 'SVT',
                'description' => 'Sciences de la Vie et de la Terre',
                'coefficient' => 2.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Éducation Physique et Sportive',
                'code' => 'EPS',
                'description' => 'Éducation Physique et Sportive',
                'coefficient' => 1.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7]
            ],
            [
                'nom' => 'Arts Plastiques',
                'code' => 'ARTS',
                'description' => 'Arts Plastiques',
                'coefficient' => 1.00,
                'heures_par_semaine' => 1,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4]
            ],
            [
                'nom' => 'Éducation Musicale',
                'code' => 'MUS',
                'description' => 'Éducation Musicale',
                'coefficient' => 1.00,
                'heures_par_semaine' => 1,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4]
            ],
            [
                'nom' => 'Technologie',
                'code' => 'TECH',
                'description' => 'Technologie',
                'coefficient' => 1.00,
                'heures_par_semaine' => 1,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4]
            ],
            [
                'nom' => 'Philosophie',
                'code' => 'PHIL',
                'description' => 'Philosophie',
                'coefficient' => 4.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [6, 7]
            ],
        ];

        foreach ($matieres as $matiere) {
            Matiere::create($matiere);
        }
    }
} 