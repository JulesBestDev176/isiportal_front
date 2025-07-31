<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Bulletin;
use App\Models\User;
use App\Models\AnneeScolaire;
use App\Models\Matiere;
use Illuminate\Support\Facades\DB;

class BulletinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Vider la table des bulletins
        DB::table('bulletins')->truncate();

        // Récupérer les années scolaires
        $annee2023 = AnneeScolaire::where('nom', '2023-2024')->first();
        $annee2024 = AnneeScolaire::where('nom', '2024-2025')->first();
        
        if (!$annee2023 || !$annee2024) {
            $this->command->error('Années scolaires 2023-2024 et 2024-2025 non trouvées');
            return;
        }

        // Récupérer le premier élève
        $eleve = User::where('role', 'eleve')->first();

        if (!$eleve) {
            $this->command->error('Aucun élève trouvé pour créer les bulletins');
            return;
        }

        // Récupérer quelques matières principales
        $matieres = Matiere::whereIn('nom', ['Mathématiques', 'Français', 'Histoire-Géographie', 'Anglais'])->get();
        
        if ($matieres->isEmpty()) {
            $this->command->error('Aucune matière trouvée');
            return;
        }

        $this->command->info("Création de 3 bulletins pour l'élève {$eleve->prenom} {$eleve->nom}...");

        // Créer les 3 bulletins spécifiques
        $bulletins = [
            [
                'eleve_id' => $eleve->id,
                'annee_scolaire_id' => $annee2023->id,
                'semestre' => 1,
                'moyenne' => 14.5,
                'matieres' => $this->genererMatieresAvecIds($matieres, 14.5),
                'appreciation' => 'Bonne année scolaire. Élève travailleur avec quelques progrès à faire.',
            ],
            [
                'eleve_id' => $eleve->id,
                'annee_scolaire_id' => $annee2023->id,
                'semestre' => 2,
                'moyenne' => 15.2,
                'matieres' => $this->genererMatieresAvecIds($matieres, 15.2),
                'appreciation' => 'Excellente progression au second semestre. Continue dans cette voie.',
            ],
            [
                'eleve_id' => $eleve->id,
                'annee_scolaire_id' => $annee2024->id,
                'semestre' => 1,
                'moyenne' => 13.8,
                'matieres' => $this->genererMatieresAvecIds($matieres, 13.8),
                'appreciation' => 'Début d\'année prometteur. Quelques efforts supplémentaires nécessaires.',
            ]
        ];

        foreach ($bulletins as $bulletinData) {
            Bulletin::create($bulletinData);
        }

        $this->command->info("✅ 3 bulletins créés avec succès pour l'élève {$eleve->prenom} {$eleve->nom} !");
        $this->command->info("   - 2023-2024 S1: 14.5/20");
        $this->command->info("   - 2023-2024 S2: 15.2/20");
        $this->command->info("   - 2024-2025 S1: 13.8/20");
    }

    /**
     * Générer les matières avec leurs IDs
     */
    private function genererMatieresAvecIds($matieres, float $moyenneGenerale): array
    {
        $matieresResultat = [];

        foreach ($matieres as $matiere) {
            // Générer une moyenne pour cette matière basée sur la moyenne générale
            $variation = rand(-150, 150) / 100; // Variation de -1.5 à +1.5
            $moyenneMatiere = max(8, min(20, $moyenneGenerale + $variation));
            
            $matieresResultat[] = [
                'id' => $matiere->id,
                'nom' => $matiere->nom,
                'moyenne' => round($moyenneMatiere, 2),
                'coefficient' => $matiere->coefficient,
                'appreciation' => $this->genererAppreciationMatiere($moyenneMatiere, $matiere->nom)
            ];
        }

        return $matieresResultat;
    }

    /**
     * Générer une appréciation pour une matière
     */
    private function genererAppreciationMatiere(float $moyenne, string $matiere): string
    {
        $appreciations = [
            'Mathématiques' => [
                'excellent' => 'Excellent niveau en mathématiques. Logique et rigueur remarquables.',
                'bon' => 'Bon niveau en mathématiques. Continue dans cette voie.',
                'moyen' => 'Niveau correct en mathématiques. Quelques efforts supplémentaires nécessaires.',
                'faible' => 'Des difficultés en mathématiques. Un travail régulier est nécessaire.'
            ],
            'Français' => [
                'excellent' => 'Excellent niveau en français. Expression écrite et orale de qualité.',
                'bon' => 'Bon niveau en français. Continue dans cette voie.',
                'moyen' => 'Niveau correct en français. Quelques efforts supplémentaires nécessaires.',
                'faible' => 'Des difficultés en français. Un travail régulier est nécessaire.'
            ],
            'Histoire-Géographie' => [
                'excellent' => 'Excellent niveau en histoire-géographie. Culture générale remarquable.',
                'bon' => 'Bon niveau en histoire-géographie. Continue dans cette voie.',
                'moyen' => 'Niveau correct en histoire-géographie. Quelques efforts supplémentaires nécessaires.',
                'faible' => 'Des difficultés en histoire-géographie. Un travail régulier est nécessaire.'
            ],
            'Anglais' => [
                'excellent' => 'Excellent niveau en anglais. Compétences linguistiques remarquables.',
                'bon' => 'Bon niveau en anglais. Continue dans cette voie.',
                'moyen' => 'Niveau correct en anglais. Quelques efforts supplémentaires nécessaires.',
                'faible' => 'Des difficultés en anglais. Un travail régulier est nécessaire.'
            ]
        ];

        $matiereAppreciations = $appreciations[$matiere] ?? $appreciations['Français'];
        
        if ($moyenne >= 16) {
            return $matiereAppreciations['excellent'];
        } elseif ($moyenne >= 14) {
            return $matiereAppreciations['bon'];
        } elseif ($moyenne >= 12) {
            return $matiereAppreciations['moyen'];
        } else {
            return $matiereAppreciations['faible'];
        }
    }
} 