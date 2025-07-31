<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Batiment;

class BatimentsSeeder extends Seeder
{
    public function run()
    {
        $batiments = [
            [
                'nom' => 'Bâtiment A - Administration',
                'code' => 'BAT-A',
                'description' => 'Bâtiment principal abritant l\'administration et les bureaux',
                'adresse' => 'Campus ISI Portal, Dakar',
                'nombre_etages' => 3,
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment B - Informatique',
                'code' => 'BAT-B',
                'description' => 'Bâtiment dédié aux cours d\'informatique et laboratoires',
                'adresse' => 'Campus ISI Portal, Dakar',
                'nombre_etages' => 4,
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment C - Sciences',
                'code' => 'BAT-C',
                'description' => 'Bâtiment pour les cours de mathématiques et sciences',
                'adresse' => 'Campus ISI Portal, Dakar',
                'nombre_etages' => 3,
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bâtiment D - Amphithéâtres',
                'code' => 'BAT-D',
                'description' => 'Grands amphithéâtres pour les cours magistraux',
                'adresse' => 'Campus ISI Portal, Dakar',
                'nombre_etages' => 2,
                'statut' => 'actif'
            ],
            [
                'nom' => 'Bibliothèque Centrale',
                'code' => 'BIBLIO',
                'description' => 'Bibliothèque et centre de documentation',
                'adresse' => 'Campus ISI Portal, Dakar',
                'nombre_etages' => 2,
                'statut' => 'actif'
            ]
        ];

        foreach ($batiments as $batiment) {
            Batiment::create($batiment);
        }

        $this->command->info('Bâtiments créés avec succès!');
    }
}