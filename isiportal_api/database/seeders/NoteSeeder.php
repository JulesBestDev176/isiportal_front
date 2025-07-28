<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;
use App\Models\User;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\AnneeScolaire;

class NoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eleves = User::where('role', 'eleve')->get();
        $cours = Cours::all();
        $matieres = Matiere::all();
        $anneeScolaire = AnneeScolaire::where('statut', 'active')->first();

        if (!$anneeScolaire) {
            $anneeScolaire = AnneeScolaire::first();
        }

        $typesEvaluation = ['devoir1', 'devoir2', 'composition', 'examen'];
        $appreciations = [
            'Très bien',
            'Bien',
            'Assez bien',
            'Passable',
            'Insuffisant',
            'Excellent travail',
            'Bon travail',
            'Peut mieux faire',
            'Efforts à fournir',
            'Satisfaisant'
        ];

        foreach ($eleves as $eleve) {
            // Générer des notes pour chaque cours de l'élève
            foreach ($cours as $coursItem) {
                foreach ($typesEvaluation as $type) {
                    // 70% de chance d'avoir une note
                    if (rand(1, 100) <= 70) {
                        $note = rand(8, 20); // Note entre 8 et 20
                        $coefficient = $type === 'examen' ? 2.0 : 1.0;
                        
                        Note::create([
                            'eleve_id' => $eleve->id,
                            'cours_id' => $coursItem->id,
                            'matiere_id' => $coursItem->matiere_id,
                            'annee_scolaire_id' => $anneeScolaire->id,
                            'semestre' => rand(1, 2),
                            'type_evaluation' => $type,
                            'note' => $note,
                            'coefficient' => $coefficient,
                            'appreciation' => $appreciations[array_rand($appreciations)],
                            'date_evaluation' => now()->subDays(rand(1, 90)),
                            'commentaire' => rand(1, 100) <= 30 ? 'Commentaire du professeur' : null,
                        ]);
                    }
                }
            }
        }

        $this->command->info('Notes créées avec succès !');
    }
} 