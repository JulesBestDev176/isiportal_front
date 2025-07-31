<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Classe;
use App\Models\User;
use App\Models\Note;
use App\Models\Cours;
use App\Models\Matiere;
use App\Models\AnneeScolaire;
use Illuminate\Support\Facades\Hash;

class ClassesElevesSeeder extends Seeder
{
    public function run()
    {
        // Désactiver les contraintes de clés étrangères
        \DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        
        // Supprimer les données existantes
        Note::truncate();
        User::where('role', 'eleve')->delete();
        \DB::table('cours_classes')->truncate();
        Classe::truncate();
        Cours::truncate();
        
        // Réactiver les contraintes
        \DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        // Créer les classes par défaut
        $classes = [
            ['nom' => '6ème A', 'niveau_id' => 1, 'effectif_max' => 35],
            ['nom' => '6ème B', 'niveau_id' => 1, 'effectif_max' => 35],
            ['nom' => '5ème A', 'niveau_id' => 2, 'effectif_max' => 35],
            ['nom' => '5ème B', 'niveau_id' => 2, 'effectif_max' => 35],
            ['nom' => '4ème A', 'niveau_id' => 3, 'effectif_max' => 35],
            ['nom' => '4ème B', 'niveau_id' => 3, 'effectif_max' => 35],
            ['nom' => '3ème A', 'niveau_id' => 4, 'effectif_max' => 35],
            ['nom' => '3ème B', 'niveau_id' => 4, 'effectif_max' => 35],
            ['nom' => '2nde A', 'niveau_id' => 5, 'effectif_max' => 40],
            ['nom' => '2nde B', 'niveau_id' => 5, 'effectif_max' => 40],
            ['nom' => '1ère A', 'niveau_id' => 6, 'effectif_max' => 40],
            ['nom' => '1ère B', 'niveau_id' => 6, 'effectif_max' => 40],
            ['nom' => 'Terminale A', 'niveau_id' => 7, 'effectif_max' => 40],
            ['nom' => 'Terminale B', 'niveau_id' => 7, 'effectif_max' => 40],
        ];

        $classesCreees = [];
        foreach ($classes as $classeData) {
            $classe = Classe::create([
                'nom' => $classeData['nom'],
                'niveau_id' => $classeData['niveau_id'],
                'annee_scolaire_id' => 2, // 2024-2025
                'effectif_max' => $classeData['effectif_max'],
                'effectif_actuel' => 0,
                'statut' => 'active'
            ]);
            $classesCreees[] = $classe;
        }

        // Créer des élèves avec différentes moyennes
        $eleves = [
            // 6ème A - Élèves avec bonnes moyennes (passent en 5ème)
            ['nom' => 'Diallo', 'prenom' => 'Aminata', 'classe_id' => 1, 'moyenne' => 14],
            ['nom' => 'Sarr', 'prenom' => 'Moussa', 'classe_id' => 1, 'moyenne' => 12],
            ['nom' => 'Fall', 'prenom' => 'Fatou', 'classe_id' => 1, 'moyenne' => 16],
            
            // 6ème A - Élèves redoublants (moyenne < 10)
            ['nom' => 'Ndiaye', 'prenom' => 'Omar', 'classe_id' => 1, 'moyenne' => 8],
            ['nom' => 'Cissé', 'prenom' => 'Aïcha', 'classe_id' => 1, 'moyenne' => 7],
            
            // 6ème B
            ['nom' => 'Ba', 'prenom' => 'Ibrahima', 'classe_id' => 2, 'moyenne' => 13],
            ['nom' => 'Sow', 'prenom' => 'Mariam', 'classe_id' => 2, 'moyenne' => 9],
            ['nom' => 'Diouf', 'prenom' => 'Cheikh', 'classe_id' => 2, 'moyenne' => 15],
            
            // 5ème A
            ['nom' => 'Thiam', 'prenom' => 'Khadija', 'classe_id' => 3, 'moyenne' => 11],
            ['nom' => 'Gueye', 'prenom' => 'Mamadou', 'classe_id' => 3, 'moyenne' => 6],
            ['nom' => 'Sy', 'prenom' => 'Binta', 'classe_id' => 3, 'moyenne' => 14],
            
            // 4ème A
            ['nom' => 'Kane', 'prenom' => 'Ousmane', 'classe_id' => 5, 'moyenne' => 10],
            ['nom' => 'Mbaye', 'prenom' => 'Awa', 'classe_id' => 5, 'moyenne' => 17],
            
            // 3ème A
            ['nom' => 'Diop', 'prenom' => 'Alioune', 'classe_id' => 7, 'moyenne' => 12],
            ['nom' => 'Faye', 'prenom' => 'Ndèye', 'classe_id' => 7, 'moyenne' => 8],
        ];

        $elevesCreees = [];
        foreach ($eleves as $eleveData) {
            $eleve = User::create([
                'nom' => $eleveData['nom'],
                'prenom' => $eleveData['prenom'],
                'email' => strtolower($eleveData['prenom'] . '.' . $eleveData['nom']) . '@eleve.com',
                'password' => Hash::make('password'),
                'role' => 'eleve',
                'classe_id' => $eleveData['classe_id'],
                'actif' => true,
                'numero_etudiant' => '2024' . str_pad(count($elevesCreees) + 1, 4, '0', STR_PAD_LEFT)
            ]);
            
            // Mettre à jour l'effectif de la classe
            $classe = Classe::find($eleveData['classe_id']);
            $classe->increment('effectif_actuel');
            
            $elevesCreees[] = ['eleve' => $eleve, 'moyenne' => $eleveData['moyenne']];
        }

        // Utiliser les cours existants
        $coursCreees = Cours::all();
        if ($coursCreees->isEmpty()) {
            echo "⚠️ Aucun cours trouvé. Veuillez d'abord créer des cours.\n";
            return;
        }

        // Créer les notes pour chaque élève
        $anneeScolaire2023 = AnneeScolaire::where('nom', '2023-2024')->first();
        
        foreach ($elevesCreees as $eleveInfo) {
            $eleve = $eleveInfo['eleve'];
            $moyenneCible = $eleveInfo['moyenne'];
            
            // Générer des notes cohérentes avec la moyenne cible
            foreach ($coursCreees as $cours) {
                // Variation autour de la moyenne cible
                $variation = rand(-3, 3);
                $noteBase = max(0, min(20, $moyenneCible + $variation));
                
                // Créer les notes pour les 2 semestres
                for ($semestre = 1; $semestre <= 2; $semestre++) {
                    // Devoir 1
                    Note::create([
                        'eleve_id' => $eleve->id,
                        'cours_id' => $cours->id,
                        'matiere_id' => $cours->matiere_id,
                        'annee_scolaire_id' => $anneeScolaire2023->id,
                        'semestre' => $semestre,
                        'type_evaluation' => 'devoir1',
                        'note' => max(0, min(20, $noteBase + rand(-2, 2))),
                        'coefficient' => 1,
                        'date_evaluation' => now()->subMonths(rand(1, 6))
                    ]);
                    
                    // Devoir 2
                    Note::create([
                        'eleve_id' => $eleve->id,
                        'cours_id' => $cours->id,
                        'matiere_id' => $cours->matiere_id,
                        'annee_scolaire_id' => $anneeScolaire2023->id,
                        'semestre' => $semestre,
                        'type_evaluation' => 'devoir2',
                        'note' => max(0, min(20, $noteBase + rand(-2, 2))),
                        'coefficient' => 1,
                        'date_evaluation' => now()->subMonths(rand(1, 6))
                    ]);
                    
                    // Examen
                    Note::create([
                        'eleve_id' => $eleve->id,
                        'cours_id' => $cours->id,
                        'matiere_id' => $cours->matiere_id,
                        'annee_scolaire_id' => $anneeScolaire2023->id,
                        'semestre' => $semestre,
                        'type_evaluation' => 'examen',
                        'note' => max(0, min(20, $noteBase + rand(-1, 1))),
                        'coefficient' => 1,
                        'date_evaluation' => now()->subMonths(rand(1, 6))
                    ]);
                }
            }
        }

        echo "✅ Base réinitialisée avec succès !\n";
        echo "📚 " . count($classesCreees) . " classes créées\n";
        echo "👥 " . count($elevesCreees) . " élèves créés\n";
        echo "📝 " . (count($elevesCreees) * count($coursCreees) * 6) . " notes générées\n";
    }
}