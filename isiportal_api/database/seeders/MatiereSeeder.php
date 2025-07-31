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
                'description' => 'Mathématiques - Algèbre, Géométrie, Analyse',
                'coefficient' => 4.00,
                'heures_par_semaine' => 5,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                'nom' => 'Français',
                'code' => 'FRAN',
                'description' => 'Français - Littérature, Expression écrite et orale',
                'coefficient' => 4.00,
                'heures_par_semaine' => 5,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                'nom' => 'Histoire-Géographie',
                'code' => 'HIST',
                'description' => 'Histoire-Géographie du Sénégal et du monde',
                'coefficient' => 3.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                'nom' => 'Anglais',
                'code' => 'ANGL',
                'description' => 'Anglais - Langue vivante 1',
                'coefficient' => 3.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                'nom' => 'Arabe',
                'code' => 'ARAB',
                'description' => 'Arabe - Langue et civilisation',
                'coefficient' => 2.00,
                'heures_par_semaine' => 3,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                'nom' => 'Espagnol',
                'code' => 'ESP',
                'description' => 'Espagnol - Langue vivante 2',
                'coefficient' => 2.00,
                'heures_par_semaine' => 3,
                'statut' => 'active',
                'niveaux_ids' => [3, 4, 5, 6, 7, 8, 9]
            ],
            [
                'nom' => 'Physique-Chimie',
                'code' => 'PC',
                'description' => 'Sciences Physiques et Chimie',
                'coefficient' => 4.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [3, 4, 5, 7, 9]
            ],
            [
                'nom' => 'Sciences de la Vie et de la Terre',
                'code' => 'SVT',
                'description' => 'Biologie et Sciences de la Terre',
                'coefficient' => 3.00,
                'heures_par_semaine' => 3,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 7, 9]
            ],
            [
                'nom' => 'Éducation Physique et Sportive',
                'code' => 'EPS',
                'description' => 'Sport et Éducation Physique',
                'coefficient' => 1.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                'nom' => 'Arts Plastiques',
                'code' => 'ARTS',
                'description' => 'Dessin et Arts visuels',
                'coefficient' => 1.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4]
            ],
            [
                'nom' => 'Éducation Musicale',
                'code' => 'MUS',
                'description' => 'Musique et Chant',
                'coefficient' => 1.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4]
            ],
            [
                'nom' => 'Technologie',
                'code' => 'TECH',
                'description' => 'Technologie et Informatique',
                'coefficient' => 2.00,
                'heures_par_semaine' => 2,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5]
            ],
            [
                'nom' => 'Philosophie',
                'code' => 'PHIL',
                'description' => 'Philosophie et Logique',
                'coefficient' => 4.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [8, 9]
            ],
            [
                'nom' => 'Instruction Civique et Morale',
                'code' => 'ICM',
                'description' => 'Éducation civique et valeurs morales',
                'coefficient' => 1.00,
                'heures_par_semaine' => 1,
                'statut' => 'active',
                'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9]
            ],
            [
                'nom' => 'Sciences Économiques et Sociales',
                'code' => 'SES',
                'description' => 'Économie et Sciences Sociales',
                'coefficient' => 3.00,
                'heures_par_semaine' => 4,
                'statut' => 'active',
                'niveaux_ids' => [5, 6, 8]
            ],
        ];

        foreach ($matieres as $matiere) {
            Matiere::create($matiere);
        }
    }
} 