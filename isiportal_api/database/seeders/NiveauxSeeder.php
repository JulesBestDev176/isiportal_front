<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Niveau;

class NiveauxSeeder extends Seeder
{
    public function run()
    {
        $niveaux = [
            // Licence
            [
                'nom' => 'L1',
                'description' => 'Première année de Licence',
                'ordre' => 1,
                'cycle' => 'licence'
            ],
            [
                'nom' => 'L2',
                'description' => 'Deuxième année de Licence',
                'ordre' => 2,
                'cycle' => 'licence'
            ],
            [
                'nom' => 'L3',
                'description' => 'Troisième année de Licence',
                'ordre' => 3,
                'cycle' => 'licence'
            ],
            
            // Master
            [
                'nom' => 'M1',
                'description' => 'Première année de Master',
                'ordre' => 4,
                'cycle' => 'master'
            ],
            [
                'nom' => 'M2',
                'description' => 'Deuxième année de Master',
                'ordre' => 5,
                'cycle' => 'master'
            ]
        ];

        foreach ($niveaux as $niveau) {
            Niveau::create($niveau);
        }

        $this->command->info('Niveaux créés avec succès!');
    }
}