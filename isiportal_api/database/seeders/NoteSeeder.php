<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;
use App\Models\Cours;
use App\Models\AnneeScolaire;
use Carbon\Carbon;

class NoteSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eleveId = 215;
        $coursIds = [1, 2, 3];
        $anneeIds = [1, 2];
        $semestres = [1, 2];
        $types = ['devoir1', 'devoir2', 'examen'];
        $appreciations = [
            'Très bien', 'Bien', 'Assez bien', 'Passable', 'Insuffisant',
            'Excellent travail', 'Bon travail', 'Peut mieux faire', 'Efforts à fournir', 'Satisfaisant'
        ];

        foreach ($anneeIds as $anneeId) {
            foreach ($semestres as $semestre) {
                foreach ($coursIds as $coursId) {
                    $cours = Cours::find($coursId);
                    if (!$cours) continue;
                    foreach ($types as $type) {
                        $note = rand(8, 20);
                        $coefficient = $cours->coefficient ?? 1.0;
                        Note::create([
                            'eleve_id' => $eleveId,
                            'cours_id' => $coursId,
                            'matiere_id' => $cours->matiere_id,
                            'annee_scolaire_id' => $anneeId,
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

        $this->command->info('Notes créées pour l\'élève 215, cours 1,2,3, années 1 et 2, tous semestres/types.');
    }
} 