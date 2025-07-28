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
            [
                'nom' => '6ème',
                'code' => '6EME',
                'description' => 'Sixième année du collège',
                'cycle' => 'college',
                'ordre' => 1,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            ],
            [
                'nom' => '5ème',
                'code' => '5EME',
                'description' => 'Cinquième année du collège',
                'cycle' => 'college',
                'ordre' => 2,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            ],
            [
                'nom' => '4ème',
                'code' => '4EME',
                'description' => 'Quatrième année du collège',
                'cycle' => 'college',
                'ordre' => 3,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            ],
            [
                'nom' => '3ème',
                'code' => '3EME',
                'description' => 'Troisième année du collège',
                'cycle' => 'college',
                'ordre' => 4,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
            ],
            [
                'nom' => '2nde',
                'code' => '2NDE',
                'description' => 'Seconde année du lycée',
                'cycle' => 'lycee',
                'ordre' => 5,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            ],
            [
                'nom' => '1ère',
                'code' => '1ERE',
                'description' => 'Première année du lycée',
                'cycle' => 'lycee',
                'ordre' => 6,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            ],
            [
                'nom' => 'Terminale',
                'code' => 'TERM',
                'description' => 'Terminale année du lycée',
                'cycle' => 'lycee',
                'ordre' => 7,
                'statut' => 'active',
                'matieres_ids' => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
            ],
        ];

        foreach ($niveaux as $niveau) {
            Niveau::create($niveau);
        }
    }
} 