<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Batiment;

class BatimentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $batiments = [
            [
                'nom' => 'Bâtiment A - Administration',
                'description' => 'Bâtiment principal abritant l\'administration et les bureaux',
                'adresse' => '1 Rue de l\'École, 75001 Paris',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment B - Collège',
                'description' => 'Bâtiment dédié aux classes du collège (6ème à 3ème)',
                'adresse' => '2 Rue de l\'École, 75001 Paris',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment C - Lycée',
                'description' => 'Bâtiment dédié aux classes du lycée (2nde à Terminale)',
                'adresse' => '3 Rue de l\'École, 75001 Paris',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment D - Sciences',
                'description' => 'Bâtiment des laboratoires et salles de sciences',
                'adresse' => '4 Rue de l\'École, 75001 Paris',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment E - Arts et Sports',
                'description' => 'Bâtiment des salles d\'arts, musique et sports',
                'adresse' => '5 Rue de l\'École, 75001 Paris',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment F - Informatique',
                'description' => 'Bâtiment des salles informatiques et multimédia',
                'adresse' => '6 Rue de l\'École, 75001 Paris',
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment G - Maintenance',
                'description' => 'Bâtiment technique et maintenance',
                'adresse' => '7 Rue de l\'École, 75001 Paris',
                'statut' => 'maintenance'
            ],
        ];

        foreach ($batiments as $batiment) {
            Batiment::create($batiment);
        }
    }
} 