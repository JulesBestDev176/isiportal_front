<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class CreneauxSeeder extends Seeder
{
    public function run()
    {
        // Les créneaux seront créés lors de la création des cours via l'interface
        // Ce seeder est préparé pour une implémentation future si nécessaire
        
        $this->command->info('Seeder créneaux préparé (créneaux créés via interface cours)');
    }
}