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
            // Seeders de base
            BatimentSeeder::class,
            SalleSeeder::class,
            NiveauSeeder::class,
            MatiereSeeder::class,
            AnneeScolaireSeeder::class,
            ClasseSeeder::class,
            UserSeeder::class,
            UserMatiereSeeder::class,
            EleveClasseSeeder::class,
            CoursSeeder::class,
            
            // Seeders de relations
            
            // Seeders de données métier
            NotificationSeeder::class,
            BulletinSeeder::class,
            HistoriqueEleveSeeder::class,
            RegleTransfertSeeder::class,
            NoteSeeder::class,
            AbsenceSeeder::class,
            EmploiDuTempsSeeder::class,
            SectionSeeder::class,
            CreneauSeeder::class,
            AssignationCoursClasseSeeder::class,
            RessourceSeeder::class,
            HistoriqueConnexionSeeder::class,
        ]);

        $this->command->info('Base de données initialisée avec succès !');
        $this->command->info('Comptes de test créés :');
        $this->command->info('- Administrateur: admin@isiportal.com / password123');
        $this->command->info('- Gestionnaire: gestionnaire@isiportal.com / password123');
        $this->command->info('- Professeur: professeur@isiportal.com / password123');
    }
}
