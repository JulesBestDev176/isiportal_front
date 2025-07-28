<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\AnneeScolaire;

class AnneeScolaireSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $anneesScolaires = [
            [
                'nom' => '2023-2024',
                'date_debut' => '2023-09-01',
                'date_fin' => '2024-07-31',
                'statut' => 'terminee'
            ],
            [
                'nom' => '2024-2025',
                'date_debut' => '2024-09-01',
                'date_fin' => '2025-07-31',
                'statut' => 'active'
            ],
            [
                'nom' => '2025-2026',
                'date_debut' => '2025-09-01',
                'date_fin' => '2026-07-31',
                'statut' => 'inactive'
            ],
            [
                'nom' => '2026-2027',
                'date_debut' => '2026-09-01',
                'date_fin' => '2027-07-31',
                'statut' => 'inactive'
            ],
            [
                'nom' => '2027-2028',
                'date_debut' => '2027-09-01',
                'date_fin' => '2028-07-31',
                'statut' => 'inactive'
            ],
            [
                'nom' => '2028-2029',
                'date_debut' => '2028-09-01',
                'date_fin' => '2029-07-31',
                'statut' => 'inactive'
            ],
            [
                'nom' => '2029-2030',
                'date_debut' => '2029-09-01',
                'date_fin' => '2030-07-31',
                'statut' => 'inactive'
            ],
            [
                'nom' => '2030-2031',
                'date_debut' => '2030-09-01',
                'date_fin' => '2031-07-31',
                'statut' => 'inactive'
            ],
            [
                'nom' => '2031-2032',
                'date_debut' => '2031-09-01',
                'date_fin' => '2032-07-31',
                'statut' => 'inactive'
            ],
            [
                'nom' => '2032-2033',
                'date_debut' => '2032-09-01',
                'date_fin' => '2033-07-31',
                'statut' => 'inactive'
            ],
        ];

        foreach ($anneesScolaires as $anneeScolaire) {
            AnneeScolaire::create($anneeScolaire);
        }
    }
} 