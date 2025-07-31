<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Note;
use App\Models\Cours;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class ParentEnfantController extends Controller
{
    use ApiResponse;

    public function getMesEnfants()
    {
        $user = Auth::user();
        
        if ($user->role !== 'parent') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        try {
            // Récupérer les enfants du parent via le champ enfants_ids JSON
            \Log::info('Parent connecté:', ['id' => $user->id, 'nom' => $user->nom, 'enfants_ids_raw' => $user->enfants_ids]);
            
            $enfantsIds = $user->enfants_ids ? json_decode($user->enfants_ids, true) : [];
            \Log::info('IDs enfants décodés:', $enfantsIds);

            if (empty($enfantsIds)) {
                \Log::warning('Aucun enfant trouvé pour le parent', ['parent_id' => $user->id]);
                return response()->json([
                    'success' => true,
                    'message' => 'Aucun enfant trouvé',
                    'data' => [
                        'enfants' => [],
                        'parent' => [
                            'id' => $user->id,
                            'nom' => $user->nom,
                            'prenom' => $user->prenom,
                            'nom_complet' => $user->prenom . ' ' . $user->nom,
                        ],
                        'statistiques' => [
                            'total_enfants' => 0,
                            'total_cours' => 0,
                            'total_notes' => 0,
                        ]
                    ]
                ]);
            }

            $enfants = User::whereIn('id', $enfantsIds)
                ->where('role', 'eleve')
                ->with(['classe.niveau'])
                ->get();
            
            \Log::info('Enfants trouvés:', [
                'count' => $enfants->count(),
                'enfants' => $enfants->map(function($e) {
                    return ['id' => $e->id, 'nom' => $e->nom, 'prenom' => $e->prenom, 'role' => $e->role];
                })
            ]);

            $enfantsData = [];
            foreach ($enfants as $enfant) {
                // Calculer la moyenne générale
                $notes = Note::where('eleve_id', $enfant->id)->get();
                $moyenneGenerale = null;
                if ($notes->isNotEmpty()) {
                    $totalPoints = $notes->sum(function($note) {
                        return $note->note * $note->coefficient;
                    });
                    $totalCoefficients = $notes->sum('coefficient');
                    $moyenneGenerale = $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 1) : null;
                }

                // Notes récentes
                $notesRecentes = Note::where('eleve_id', $enfant->id)
                    ->with(['matiere'])
                    ->orderBy('date_evaluation', 'desc')
                    ->limit(3)
                    ->get()
                    ->map(function ($note) {
                        return [
                            'id' => $note->id,
                            'note' => $note->note,
                            'type_evaluation' => $note->type_evaluation,
                            'date_evaluation' => $note->date_evaluation->format('d/m/Y'),
                            'matiere' => [
                                'nom' => $note->matiere->nom,
                            ],
                        ];
                    })->toArray();

                $enfantsData[] = [
                    'id' => $enfant->id,
                    'nom' => $enfant->nom,
                    'prenom' => $enfant->prenom,
                    'nom_complet' => $enfant->prenom . ' ' . $enfant->nom,
                    'email' => $enfant->email,
                    'date_naissance' => $enfant->date_naissance,
                    'classe' => $enfant->classe ? [
                        'id' => $enfant->classe->id,
                        'nom' => $enfant->classe->nom,
                        'niveau' => [
                            'id' => $enfant->classe->niveau->id,
                            'nom' => $enfant->classe->niveau->nom,
                        ],
                    ] : null,
                    'moyenne_generale' => $moyenneGenerale,
                    'cours' => [],
                    'notes_recentes' => $notesRecentes,
                    'statistiques' => [
                        'total_cours' => 0,
                        'cours_avec_notes' => 0,
                        'total_notes' => $notes->count(),
                        'notes_recentes' => count($notesRecentes),
                    ]
                ];
            }

            return $this->successResponse([
                'enfants' => $enfantsData,
                'parent' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'nom_complet' => $user->prenom . ' ' . $user->nom,
                ],
                'statistiques' => [
                    'total_enfants' => count($enfantsData),
                    'total_cours' => 0,
                    'total_notes' => collect($enfantsData)->sum('statistiques.total_notes'),
                ]
            ], 'Enfants récupérés avec succès');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des enfants: ' . $e->getMessage(), 500);
        }
    }

    public function getEnfantDetails($enfantId)
    {
        $user = Auth::user();
        
        if ($user->role !== 'parent') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        try {
            // Vérifier que l'enfant appartient au parent
            $enfantsIds = $user->enfants_ids ? json_decode($user->enfants_ids, true) : [];
            
            if (!in_array($enfantId, $enfantsIds)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Enfant non trouvé ou non autorisé'
                ], 404);
            }

            $enfant = User::where('id', $enfantId)
                ->where('role', 'eleve')
                ->with(['classe.niveau'])
                ->first();

            if (!$enfant) {
                return response()->json([
                    'success' => false,
                    'message' => 'Enfant non trouvé'
                ], 404);
            }

            // Récupérer toutes les notes de l'enfant
            $notes = Note::where('eleve_id', $enfant->id)
                ->with(['matiere:id,nom,code', 'cours:id,titre', 'anneeScolaire:id,nom'])
                ->orderBy('date_evaluation', 'desc')
                ->get()
                ->map(function ($note) {
                    return [
                        'id' => $note->id,
                        'note' => $note->note,
                        'coefficient' => $note->coefficient,
                        'type_evaluation' => $note->type_evaluation,
                        'date_evaluation' => $note->date_evaluation->format('d/m/Y'),
                        'appreciation' => $note->appreciation,
                        'matiere' => [
                            'nom' => $note->matiere->nom,
                            'code' => $note->matiere->code,
                        ],
                        'cours' => [
                            'titre' => $note->cours->titre,
                        ],
                        'annee_scolaire' => [
                            'nom' => $note->anneeScolaire->nom,
                        ],
                    ];
                });

            // Calculer la moyenne générale
            $moyenneGenerale = null;
            if ($notes->isNotEmpty()) {
                $totalPoints = $notes->sum(function($note) {
                    return $note['note'] * $note['coefficient'];
                });
                $totalCoefficients = $notes->sum('coefficient');
                $moyenneGenerale = $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 1) : null;
            }

            return $this->successResponse([
                'enfant' => [
                    'id' => $enfant->id,
                    'nom' => $enfant->nom,
                    'prenom' => $enfant->prenom,
                    'nom_complet' => $enfant->prenom . ' ' . $enfant->nom,
                    'email' => $enfant->email,
                    'date_naissance' => $enfant->date_naissance,
                    'classe' => $enfant->classe ? [
                        'id' => $enfant->classe->id,
                        'nom' => $enfant->classe->nom,
                        'niveau' => [
                            'id' => $enfant->classe->niveau->id,
                            'nom' => $enfant->classe->niveau->nom,
                        ],
                    ] : null,
                    'moyenne_generale' => $moyenneGenerale,
                ],
                'notes' => $notes,
                'statistiques' => [
                    'total_notes' => $notes->count(),
                    'moyenne_generale' => $moyenneGenerale,
                ]
            ], 'Détails de l\'enfant récupérés avec succès');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des détails: ' . $e->getMessage(), 500);
        }
    }
}