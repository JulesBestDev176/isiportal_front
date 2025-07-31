<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\User;
use App\Models\AnneeScolaire;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class EleveBulletinController extends Controller
{
    use ApiResponse;

    public function getMesBulletins()
    {
        $user = Auth::user();
        
        if ($user->role !== 'eleve') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        if (!$user->classe_id) {
            return $this->errorResponse('Élève non assigné à une classe', 400);
        }

        try {
            // Récupérer les notes de l'élève groupées par semestre et année scolaire
            $notes = Note::where('eleve_id', $user->id)
                ->with(['matiere:id,nom,code,coefficient', 'anneeScolaire:id,nom,statut'])
                ->orderBy('annee_scolaire_id', 'desc')
                ->orderBy('semestre', 'desc')
                ->get();

            if ($notes->isEmpty()) {
                return $this->successResponse([
                    'bulletins' => [],
                    'eleve' => [
                        'id' => $user->id,
                        'nom_complet' => $user->prenom . ' ' . $user->nom,
                        'classe' => [
                            'nom' => $user->classe->nom,
                            'niveau' => $user->classe->niveau->nom,
                        ]
                    ],
                    'statistiques' => [
                        'total_bulletins' => 0,
                        'moyenne_generale' => null,
                    ]
                ], 'Aucune note disponible');
            }

            // Grouper les notes par année scolaire et semestre
            $bulletinsData = $notes->groupBy(['annee_scolaire_id', 'semestre'])
                ->map(function ($notesByAnnee, $anneeScolaireId) {
                    return $notesByAnnee->map(function ($notesBySemestre, $semestre) use ($anneeScolaireId) {
                        $anneeScolaire = $notesBySemestre->first()->anneeScolaire;
                        
                        // Calculer les moyennes par matière
                        $matieres = $notesBySemestre->groupBy('matiere_id')
                            ->map(function ($notesMatiere) {
                                $matiere = $notesMatiere->first()->matiere;
                                $moyenneMatiere = $notesMatiere->avg('note');
                                
                                return [
                                    'id' => $matiere->id,
                                    'nom' => $matiere->nom,
                                    'code' => $matiere->code,
                                    'coefficient' => $matiere->coefficient,
                                    'moyenne' => round($moyenneMatiere, 1),
                                    'nombre_notes' => $notesMatiere->count(),
                                    'notes' => $notesMatiere->map(function ($note) {
                                        return [
                                            'id' => $note->id,
                                            'note' => $note->note,
                                            'coefficient' => $note->coefficient,
                                            'type_evaluation' => $note->type_evaluation,
                                            'date_evaluation' => $note->date_evaluation->format('d/m/Y'),
                                            'appreciation' => $note->appreciation,
                                        ];
                                    })->values()
                                ];
                            })->values();

                        // Calculer la moyenne générale du semestre
                        $totalPoints = 0;
                        $totalCoefficients = 0;
                        
                        foreach ($matieres as $matiere) {
                            $totalPoints += $matiere['moyenne'] * $matiere['coefficient'];
                            $totalCoefficients += $matiere['coefficient'];
                        }
                        
                        $moyenneGenerale = $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 1) : null;
                        
                        // Déterminer la mention
                        $mention = $this->getMention($moyenneGenerale);
                        
                        return [
                            'annee_scolaire' => [
                                'id' => $anneeScolaire->id,
                                'nom' => $anneeScolaire->nom,
                                'statut' => $anneeScolaire->statut,
                            ],
                            'semestre' => $semestre,
                            'moyenne_generale' => $moyenneGenerale,
                            'mention' => $mention,
                            'reussi' => $moyenneGenerale >= 10,
                            'matieres' => $matieres,
                            'total_notes' => $notesBySemestre->count(),
                        ];
                    });
                })
                ->flatten(1)
                ->values();

            // Calculer les statistiques générales
            $moyennesGenerales = $bulletinsData->pluck('moyenne_generale')->filter();
            $moyenneGeneraleGlobale = $moyennesGenerales->isNotEmpty() ? round($moyennesGenerales->avg(), 1) : null;
            
            return $this->successResponse([
                'bulletins' => $bulletinsData,
                'eleve' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'nom_complet' => $user->prenom . ' ' . $user->nom,
                    'classe' => [
                        'id' => $user->classe->id,
                        'nom' => $user->classe->nom,
                        'niveau' => [
                            'id' => $user->classe->niveau->id,
                            'nom' => $user->classe->niveau->nom,
                        ],
                    ]
                ],
                'statistiques' => [
                    'total_bulletins' => $bulletinsData->count(),
                    'moyenne_generale' => $moyenneGeneraleGlobale,
                    'bulletins_reussis' => $bulletinsData->where('reussi', true)->count(),
                    'bulletins_echoues' => $bulletinsData->where('reussi', false)->count(),
                ]
            ], 'Bulletins récupérés avec succès');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des bulletins: ' . $e->getMessage(), 500);
        }
    }

    private function getMention($moyenne)
    {
        if (!$moyenne) return null;
        
        if ($moyenne >= 16) return ['label' => 'Très Bien', 'color' => 'green'];
        if ($moyenne >= 14) return ['label' => 'Bien', 'color' => 'blue'];
        if ($moyenne >= 12) return ['label' => 'Assez Bien', 'color' => 'yellow'];
        if ($moyenne >= 10) return ['label' => 'Passable', 'color' => 'orange'];
        return ['label' => 'Insuffisant', 'color' => 'red'];
    }
}