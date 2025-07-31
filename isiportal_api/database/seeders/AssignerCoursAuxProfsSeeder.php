<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Cours;
use Illuminate\Support\Facades\DB;

class AssignerCoursAuxProfsSeeder extends Seeder
{
    public function run()
    {
        // Récupérer tous les professeurs
        $professeurs = User::where('role', 'professeur')->get();
        
        if ($professeurs->isEmpty()) {
            $this->command->info('Aucun professeur trouvé dans la base de données.');
            return;
        }
        
        $this->command->info("Professeurs trouvés : {$professeurs->count()}");
        foreach ($professeurs as $prof) {
            $this->command->info("- {$prof->prenom} {$prof->nom} (ID: {$prof->id})");
        }
        
        // Récupérer tous les cours
        $cours = Cours::all();
        
        if ($cours->isEmpty()) {
            $this->command->info('Aucun cours trouvé dans la base de données.');
            return;
        }
        
        $this->command->info("Cours trouvés : {$cours->count()}");
        
        // Vider les assignations existantes
        DB::table('cours_professeurs')->truncate();
        
        // Assigner chaque cours à un professeur aléatoire
        foreach ($cours as $coursItem) {
            $professeurAleatoire = $professeurs->random();
            
            DB::table('cours_professeurs')->insert([
                'cours_id' => $coursItem->id,
                'professeur_id' => $professeurAleatoire->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            $this->command->info("Cours '{$coursItem->titre}' assigné à {$professeurAleatoire->prenom} {$professeurAleatoire->nom}");
        }
        
        $this->command->info("Assignation terminée : {$cours->count()} cours assignés à {$professeurs->count()} professeurs.");
    }
}