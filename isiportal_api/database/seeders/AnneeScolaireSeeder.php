<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AnneeScolaire;

class AnneeScolaireSeeder extends Seeder
{
    public function run()
    {
        $annees = [
            [
                'nom' => '2023-2024',
                'date_debut' => '2023-10-01',
                'date_fin' => '2024-07-31',
                'statut' => 'terminee',
                'description' => 'Année scolaire 2023-2024'
            ],
            [
                'nom' => '2024-2025',
                'date_debut' => '2024-10-01',
                'date_fin' => '2025-07-31',
                'statut' => 'active',
                'description' => 'Année scolaire courante 2024-2025'
            ],
            [
                'nom' => '2025-2026',
                'date_debut' => '2025-10-01',
                'date_fin' => '2026-07-31',
                'statut' => 'planifiee',
                'description' => 'Année scolaire à venir 2025-2026'
            ]
        ];

        foreach ($annees as $annee) {
            AnneeScolaire::create($annee);
        }

        $this->command->info('Années scolaires créées avec succès!');
    }
}