<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Note;
use App\Models\User;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\AnneeScolaire;

class NotesSenegalaisesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $eleves = User::where('role', 'eleve')->with('classe.niveau')->get();
        $anneeScolaire = AnneeScolaire::first();
        
        if (!$anneeScolaire) {
            $this->command->error('Aucune année scolaire trouvée.');
            return;
        }

        if ($eleves->isEmpty()) {
            $this->command->error('Aucun élève trouvé.');
            return;
        }

        $typesEvaluation = [
            'devoir1' => ['coefficient' => 1.0, 'nom' => 'Devoir 1'],
            'devoir2' => ['coefficient' => 1.0, 'nom' => 'Devoir 2'],
            'composition1' => ['coefficient' => 2.0, 'nom' => 'Composition 1er semestre'],
            'composition2' => ['coefficient' => 2.0, 'nom' => 'Composition 2ème semestre'],
            'interrogation' => ['coefficient' => 0.5, 'nom' => 'Interrogation'],
            'tp' => ['coefficient' => 1.0, 'nom' => 'Travaux Pratiques'],
        ];

        $appreciations = [
            [16, 20] => ['Excellent travail', 'Très bien', 'Félicitations', 'Remarquable'],
            [14, 16] => ['Bien', 'Bon travail', 'Satisfaisant', 'Continue ainsi'],
            [12, 14] => ['Assez bien', 'Peut mieux faire', 'Effort à poursuivre'],
            [10, 12] => ['Passable', 'Travail insuffisant', 'Doit faire plus d\'efforts'],
            [0, 10] => ['Insuffisant', 'Travail très faible', 'Beaucoup d\'efforts nécessaires']
        ];

        foreach ($eleves as $eleve) {
            if (!$eleve->classe || !$eleve->classe->niveau) {
                continue;
            }

            // Récupérer les matières du niveau de l'élève
            $matieres = Matiere::whereJsonContains('niveaux_ids', $eleve->classe->niveau_id)->get();
            
            foreach ($matieres as $matiere) {
                // Créer un cours pour cette matière si il n'existe pas
                $cours = Cours::firstOrCreate([
                    'matiere_id' => $matiere->id,
                    'niveau_id' => $eleve->classe->niveau_id,
                    'annee_scolaire_id' => $anneeScolaire->id,
                ], [
                    'nom' => $matiere->nom . ' - ' . $eleve->classe->niveau->nom,
                    'description' => 'Cours de ' . $matiere->nom,
                    'statut' => 'active',
                ]);

                // Générer des notes pour chaque type d'évaluation
                foreach ($typesEvaluation as $type => $config) {
                    // Probabilité de génération de note (pas toutes les évaluations pour tous les élèves)
                    if (rand(1, 100) > 85) continue;

                    // Générer une note réaliste basée sur un profil d'élève
                    $profilEleve = $this->determinerProfilEleve($eleve->id);
                    $note = $this->genererNoteRealiste($profilEleve, $matiere->code);
                    
                    // Trouver l'appréciation appropriée
                    $appreciation = $this->getAppreciation($note, $appreciations);
                    
                    // Dates d'évaluation réalistes
                    $dateEvaluation = $this->genererDateEvaluation($type, $anneeScolaire);

                    Note::create([
                        'eleve_id' => $eleve->id,
                        'cours_id' => $cours->id,
                        'matiere_id' => $matiere->id,
                        'annee_scolaire_id' => $anneeScolaire->id,
                        'semestre' => $this->determinerSemestre($dateEvaluation),
                        'type_evaluation' => $type,
                        'note' => $note,
                        'coefficient' => $config['coefficient'],
                        'appreciation' => $appreciation,
                        'date_evaluation' => $dateEvaluation,
                        'statut' => 'validee',
                    ]);
                }
            }
        }

        $this->command->info('Notes sénégalaises créées avec succès !');
        $this->command->info('Total notes créées: ' . Note::count());
    }

    private function determinerProfilEleve($eleveId): string
    {
        // Créer des profils d'élèves basés sur l'ID pour la cohérence
        $profiles = ['excellent', 'bon', 'moyen', 'faible'];
        return $profiles[$eleveId % 4];
    }

    private function genererNoteRealiste($profil, $matiereCode): float
    {
        $baseRanges = [
            'excellent' => [15, 20],
            'bon' => [12, 17],
            'moyen' => [8, 14],
            'faible' => [4, 12]
        ];

        // Ajustements par matière
        $adjustments = [
            'MATH' => ['excellent' => 1, 'bon' => 0, 'moyen' => -1, 'faible' => -2],
            'FRAN' => ['excellent' => 0, 'bon' => 1, 'moyen' => 0, 'faible' => -1],
            'ANGL' => ['excellent' => -1, 'bon' => 0, 'moyen' => 1, 'faible' => 0],
            'PC' => ['excellent' => 2, 'bon' => 0, 'moyen' => -2, 'faible' => -3],
            'SVT' => ['excellent' => 1, 'bon' => 1, 'moyen' => 0, 'faible' => -1],
        ];

        [$min, $max] = $baseRanges[$profil];
        $adjustment = $adjustments[$matiereCode][$profil] ?? 0;
        
        $min = max(0, $min + $adjustment);
        $max = min(20, $max + $adjustment);
        
        return round(rand($min * 10, $max * 10) / 10, 1);
    }

    private function getAppreciation($note, $appreciations): string
    {
        foreach ($appreciations as $range => $messages) {
            if ($note >= $range[0] && $note < $range[1]) {
                return $messages[array_rand($messages)];
            }
        }
        return 'Travail à améliorer';
    }

    private function genererDateEvaluation($type, $anneeScolaire): \Carbon\Carbon
    {
        $debut = \Carbon\Carbon::parse($anneeScolaire->date_debut);
        $fin = \Carbon\Carbon::parse($anneeScolaire->date_fin);
        
        return match($type) {
            'devoir1', 'interrogation' => $debut->copy()->addDays(rand(30, 90)),
            'composition1' => $debut->copy()->addDays(rand(90, 120)),
            'devoir2' => $debut->copy()->addDays(rand(150, 200)),
            'composition2' => $debut->copy()->addDays(rand(220, 260)),
            'tp' => $debut->copy()->addDays(rand(60, 180)),
            default => $debut->copy()->addDays(rand(30, 200))
        };
    }

    private function determinerSemestre($date): int
    {
        $mois = $date->month;
        return $mois <= 2 || $mois >= 10 ? 1 : 2;
    }
}