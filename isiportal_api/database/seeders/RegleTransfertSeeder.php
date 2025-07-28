<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\RegleTransfert;

class RegleTransfertSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $regles = [
            [
                'niveau_source' => '6ème',
                'niveau_destination' => '5ème',
                'moyenne_minimale' => 8.0,
                'conditions_speciales' => [
                    'francais_min' => 8.0,
                    'mathematiques_min' => 8.0,
                    'absences_max' => 20,
                ],
                'actif' => true,
            ],
            [
                'niveau_source' => '5ème',
                'niveau_destination' => '4ème',
                'moyenne_minimale' => 8.0,
                'conditions_speciales' => [
                    'francais_min' => 8.0,
                    'mathematiques_min' => 8.0,
                    'absences_max' => 20,
                ],
                'actif' => true,
            ],
            [
                'niveau_source' => '4ème',
                'niveau_destination' => '3ème',
                'moyenne_minimale' => 8.0,
                'conditions_speciales' => [
                    'francais_min' => 8.0,
                    'mathematiques_min' => 8.0,
                    'absences_max' => 20,
                ],
                'actif' => true,
            ],
            [
                'niveau_source' => '3ème',
                'niveau_destination' => '2nde',
                'moyenne_minimale' => 10.0,
                'conditions_speciales' => [
                    'francais_min' => 10.0,
                    'mathematiques_min' => 10.0,
                    'absences_max' => 15,
                ],
                'actif' => true,
            ],
            [
                'niveau_source' => '2nde',
                'niveau_destination' => '1ère',
                'moyenne_minimale' => 10.0,
                'conditions_speciales' => [
                    'francais_min' => 10.0,
                    'mathematiques_min' => 10.0,
                    'absences_max' => 15,
                ],
                'actif' => true,
            ],
            [
                'niveau_source' => '1ère',
                'niveau_destination' => 'Terminale',
                'moyenne_minimale' => 10.0,
                'conditions_speciales' => [
                    'francais_min' => 10.0,
                    'mathematiques_min' => 10.0,
                    'absences_max' => 15,
                ],
                'actif' => true,
            ],
        ];

        foreach ($regles as $regle) {
            RegleTransfert::create($regle);
        }

        $this->command->info('Règles de transfert créées avec succès !');
    }
} 