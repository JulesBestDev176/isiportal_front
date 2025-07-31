<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;
use App\Models\User;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\AnneeScolaire;
use Carbon\Carbon;

class NoteTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Récupérer tous les élèves
        $eleves = User::where('role', 'eleve')->get();
        
        // Récupérer les cours disponibles
        $cours = Cours::with('matiere')->get();
        
        // Récupérer les années scolaires
        $annees = AnneeScolaire::all();
        
        $semestres = [1, 2];
        $types = ['devoir1', 'devoir2', 'examen'];
        $appreciations = [
            'Très bien', 'Bien', 'Assez bien', 'Passable', 'Insuffisant',
            'Excellent travail', 'Bon travail', 'Peut mieux faire', 'Efforts à fournir', 'Satisfaisant'
        ];

        $this->command->info("Création de notes pour {$eleves->count()} élèves...");

        foreach ($eleves as $eleve) {
            foreach ($annees as $annee) {
                foreach ($semestres as $semestre) {
                    foreach ($cours as $coursItem) {
                        foreach ($types as $type) {
                            $note = rand(8, 20);
                            $coefficient = $coursItem->coefficient ?? 1.0;
                            
                            Note::create([
                                'eleve_id' => $eleve->id,
                                'cours_id' => $coursItem->id,
                                'matiere_id' => $coursItem->matiere_id,
                                'annee_scolaire_id' => $annee->id,
                                'semestre' => $semestre,
                                'type_evaluation' => $type,
                                'note' => $note,
                                'coefficient' => $coefficient,
                                'appreciation' => $appreciations[array_rand($appreciations)],
                                'date_evaluation' => Carbon::now()->subDays(rand(1, 90)),
                                'commentaire' => rand(1, 100) <= 30 ? 'Commentaire du professeur' : null,
                            ]);
                        }
                    }
                }
            }
        }

        $this->command->info('Notes créées pour tous les élèves avec tous les cours disponibles.');
    }
}