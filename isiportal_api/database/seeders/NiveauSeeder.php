<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Niveau;

class NiveauSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $niveaux = [
            // Collège
            [
                'nom' => '6ème',
                'code' => '6EME',
                'description' => 'Sixième - Première année du collège',
                'cycle' => 'college',
                'ordre' => 1,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 14]
            ],
            [
                'nom' => '5ème',
                'code' => '5EME',
                'description' => 'Cinquième - Deuxième année du collège',
                'cycle' => 'college',
                'ordre' => 2,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 14]
            ],
            [
                'nom' => '4ème',
                'code' => '4EME',
                'description' => 'Quatrième - Troisième année du collège',
                'cycle' => 'college',
                'ordre' => 3,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14]
            ],
            [
                'nom' => '3ème',
                'code' => '3EME',
                'description' => 'Troisième - Dernière année du collège (BFEM)',
                'cycle' => 'college',
                'ordre' => 4,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14]
            ],
            // Lycée
            [
                'nom' => '2nde',
                'code' => '2NDE',
                'description' => 'Seconde - Première année du lycée',
                'cycle' => 'lycee',
                'ordre' => 5,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 8, 9, 12, 13, 14, 15]
            ],
            [
                'nom' => '1ère L',
                'code' => '1L',
                'description' => 'Première Littéraire',
                'cycle' => 'lycee',
                'ordre' => 6,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 8, 9, 13, 14, 15]
            ],
            [
                'nom' => '1ère S',
                'code' => '1S',
                'description' => 'Première Scientifique',
                'cycle' => 'lycee',
                'ordre' => 6,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 7, 8, 9, 13, 14, 15]
            ],
            [
                'nom' => 'Terminale L',
                'code' => 'TL',
                'description' => 'Terminale Littéraire (Baccalauréat L)',
                'cycle' => 'lycee',
                'ordre' => 7,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 8, 9, 13, 14, 15]
            ],
            [
                'nom' => 'Terminale S',
                'code' => 'TS',
                'description' => 'Terminale Scientifique (Baccalauréat S)',
                'cycle' => 'lycee',
                'ordre' => 7,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 7, 8, 9, 13, 14, 15]
            ],
        ];

        foreach ($niveaux as $niveau) {
            Niveau::create($niveau);
        }
    }
} 