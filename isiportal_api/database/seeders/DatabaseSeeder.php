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
            
            // Seeders spécifiques Sénégal
            ElevesSenegalaisSeeder::class,
            NotesSenegalaisesSeeder::class,
            
            // Seeders de relations
            EleveClasseSeeder::class,
            CoursSeeder::class,
            
            // Seeders de données métier
            NotificationSeeder::class,
            BulletinSeeder::class,
            HistoriqueEleveSeeder::class,
            RegleTransfertSeeder::class,
            AbsenceSeeder::class,
            EmploiDuTempsSeeder::class,
            SectionSeeder::class,
            CreneauSeeder::class,
            AssignationCoursClasseSeeder::class,
            RessourceSeeder::class,
            HistoriqueConnexionSeeder::class,
        ]);

        $this->command->info('Base de données initialisée avec succès pour le contexte sénégalais !');
        $this->command->info('Comptes de test créés :');
        $this->command->info('- Administrateur: admin@isiportal.com / password123');
        $this->command->info('- Parents: mamadou.diallo@email.com, awa.sy@email.com / password123');
        $this->command->info('- Professeurs: aminata.diop@isiportal.com, moussa.ndiaye@isiportal.com / password123');
        $this->command->info('- Élèves: [prénom].[nom][classe_id]@eleve.isiportal.com / eleve123');
    }
}
