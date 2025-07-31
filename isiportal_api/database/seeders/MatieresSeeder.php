<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Matiere;
use App\Models\Niveau;

class MatieresSeeder extends Seeder
{
    public function run()
    {
        $niveaux = Niveau::all()->keyBy('nom');
        
        $matieres = [
            // Matières L1
            [
                'nom' => 'Mathématiques Générales',
                'code' => 'MATH101',
                'description' => 'Algèbre et analyse mathématique de base',
                'coefficient' => 3,
                'heures_par_semaine' => 6,
                'niveaux' => ['L1'],
                'type' => 'fondamentale'
            ],
            [
                'nom' => 'Algorithmique et Programmation',
                'code' => 'INFO101',
                'description' => 'Introduction à la programmation et aux algorithmes',
                'coefficient' => 4,
                'heures_par_semaine' => 8,
                'niveaux' => ['L1'],
                'type' => 'fondamentale'
            ],
            [
                'nom' => 'Physique Générale',
                'code' => 'PHYS101',
                'description' => 'Mécanique et électricité de base',
                'coefficient' => 2,
                'heures_par_semaine' => 4,
                'niveaux' => ['L1'],
                'type' => 'fondamentale'
            ],
            [
                'nom' => 'Anglais Technique',
                'code' => 'ANG101',
                'description' => 'Anglais appliqué aux sciences et technologies',
                'coefficient' => 1,
                'heures_par_semaine' => 2,
                'niveaux' => ['L1', 'L2', 'L3'],
                'type' => 'transversale'
            ],
            [
                'nom' => 'Expression Française',
                'code' => 'FRAN101',
                'description' => 'Communication écrite et orale en français',
                'coefficient' => 1,
                'heures_par_semaine' => 2,
                'niveaux' => ['L1'],
                'type' => 'transversale'
            ],

            // Matières L2
            [
                'nom' => 'Structures de Données',
                'code' => 'INFO201',
                'description' => 'Listes, arbres, graphes et algorithmes associés',
                'coefficient' => 4,
                'heures_par_semaine' => 8,
                'niveaux' => ['L2'],
                'type' => 'fondamentale'
            ],
            [
                'nom' => 'Bases de Données',
                'code' => 'INFO202',
                'description' => 'Conception et gestion de bases de données relationnelles',
                'coefficient' => 3,
                'heures_par_semaine' => 6,
                'niveaux' => ['L2'],
                'type' => 'fondamentale'
            ],
            [
                'nom' => 'Systèmes d\'Exploitation',
                'code' => 'INFO203',
                'description' => 'Principes des systèmes d\'exploitation Unix/Linux',
                'coefficient' => 3,
                'heures_par_semaine' => 6,
                'niveaux' => ['L2'],
                'type' => 'fondamentale'
            ],
            [
                'nom' => 'Mathématiques Discrètes',
                'code' => 'MATH201',
                'description' => 'Logique, combinatoire et théorie des graphes',
                'coefficient' => 2,
                'heures_par_semaine' => 4,
                'niveaux' => ['L2'],
                'type' => 'fondamentale'
            ],
            [
                'nom' => 'Probabilités et Statistiques',
                'code' => 'STAT201',
                'description' => 'Théorie des probabilités et statistiques descriptives',
                'coefficient' => 2,
                'heures_par_semaine' => 4,
                'niveaux' => ['L2'],
                'type' => 'fondamentale'
            ],

            // Matières L3
            [
                'nom' => 'Génie Logiciel',
                'code' => 'INFO301',
                'description' => 'Méthodes de développement logiciel et gestion de projet',
                'coefficient' => 4,
                'heures_par_semaine' => 8,
                'niveaux' => ['L3'],
                'type' => 'spécialisée'
            ],
            [
                'nom' => 'Réseaux Informatiques',
                'code' => 'INFO302',
                'description' => 'Architecture et protocoles des réseaux',
                'coefficient' => 3,
                'heures_par_semaine' => 6,
                'niveaux' => ['L3'],
                'type' => 'spécialisée'
            ],
            [
                'nom' => 'Intelligence Artificielle',
                'code' => 'INFO303',
                'description' => 'Algorithmes d\'IA et apprentissage automatique',
                'coefficient' => 3,
                'heures_par_semaine' => 6,
                'niveaux' => ['L3'],
                'type' => 'spécialisée'
            ],
            [
                'nom' => 'Sécurité Informatique',
                'code' => 'INFO304',
                'description' => 'Cryptographie et sécurité des systèmes',
                'coefficient' => 2,
                'heures_par_semaine' => 4,
                'niveaux' => ['L3'],
                'type' => 'spécialisée'
            ],
            [
                'nom' => 'Projet de Fin d\'Études',
                'code' => 'PROJ301',
                'description' => 'Projet pratique de développement',
                'coefficient' => 5,
                'heures_par_semaine' => 10,
                'niveaux' => ['L3'],
                'type' => 'projet'
            ],

            // Matières M1
            [
                'nom' => 'Architecture Logicielle',
                'code' => 'INFO401',
                'description' => 'Patterns et architectures distribuées',
                'coefficient' => 4,
                'heures_par_semaine' => 8,
                'niveaux' => ['M1'],
                'type' => 'avancée'
            ],
            [
                'nom' => 'Big Data et Analytics',
                'code' => 'INFO402',
                'description' => 'Traitement de données massives',
                'coefficient' => 3,
                'heures_par_semaine' => 6,
                'niveaux' => ['M1'],
                'type' => 'avancée'
            ],
            [
                'nom' => 'Cloud Computing',
                'code' => 'INFO403',
                'description' => 'Technologies cloud et virtualisation',
                'coefficient' => 3,
                'heures_par_semaine' => 6,
                'niveaux' => ['M1'],
                'type' => 'avancée'
            ],

            // Matières M2
            [
                'nom' => 'Recherche Opérationnelle',
                'code' => 'INFO501',
                'description' => 'Optimisation et aide à la décision',
                'coefficient' => 3,
                'heures_par_semaine' => 6,
                'niveaux' => ['M2'],
                'type' => 'recherche'
            ],
            [
                'nom' => 'Mémoire de Master',
                'code' => 'MEM501',
                'description' => 'Travail de recherche et mémoire',
                'coefficient' => 8,
                'heures_par_semaine' => 16,
                'niveaux' => ['M2'],
                'type' => 'mémoire'
            ]
        ];

        foreach ($matieres as $matiereData) {
            $niveauxIds = [];
            foreach ($matiereData['niveaux'] as $niveauNom) {
                if (isset($niveaux[$niveauNom])) {
                    $niveauxIds[] = $niveaux[$niveauNom]->id;
                }
            }

            $matiere = Matiere::create([
                'nom' => $matiereData['nom'],
                'code' => $matiereData['code'],
                'description' => $matiereData['description'],
                'coefficient' => $matiereData['coefficient'],
                'heures_par_semaine' => $matiereData['heures_par_semaine'],
                'niveaux_ids' => json_encode($niveauxIds),
                'type' => $matiereData['type']
            ]);

            $this->command->info("Matière créée: {$matiere->nom}");
        }

        $this->command->info('Matières créées avec succès!');
    }
}