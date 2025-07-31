<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // 1. Structure de base
            AnneeScolaireSeeder::class,

            NiveauxSeeder::class,
            MatieresSeeder::class,
            BatimentsSeeder::class,
            SallesSeeder::class,
            
            // 2. Utilisateurs
            AdminSeeder::class,
            ProfesseursSeeder::class,
            
            // 3. Classes et élèves
            ClassesSeeder::class,
            ElevesSeeder::class,
            
            // 4. Cours et créneaux
            CoursSeeder::class,
            CreneauxSeeder::class,
            
            // 5. Notes (optionnel pour les tests)
            NotesSeeder::class,
        ]);
    }
}