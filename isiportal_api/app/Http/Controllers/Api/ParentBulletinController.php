<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Note;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class ParentBulletinController extends Controller
{
    use ApiResponse;

    public function getMesEnfantsBulletins()
    {
        $user = Auth::user();
        
        if ($user->role !== 'parent') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        try {
            // Récupérer les enfants du parent connecté
            $enfants = User::where('parent_id', $user->id)
                ->where('role', 'eleve')
                ->with(['classe.niveau'])
                ->get();

            if ($enfants->isEmpty()) {
                return $this->successResponse([
                    'enfants' => [],
                    'parent' => [
                        'id' => $user->id,
                        'nom' => $user->nom,
                        'prenom' => $user->prenom,
                        'nom_complet' => $user->prenom . ' ' . $user->nom,
                    ],
                    'statistiques' => [
                        'total_enfants' => 0,
                        'total_bulletins' => 0,
                    ]
                ], 'Aucun enfant trouvé');
            }

            $enfantsData = [];
            $totalBulletins = 0;

            foreach ($enfants as $enfant) {
                // Récupérer les notes de l'enfant groupées par semestre et année scolaire
                $notes = Note::where('eleve_id', $enfant->id)
                    ->with(['matiere:id,nom,code,coefficient', 'anneeScolaire:id,nom,statut'])
                    ->orderBy('annee_scolaire_id', 'desc')
                    ->orderBy('semestre', 'desc')
                    ->get();

                $bulletins = [];
                if ($notes->isNotEmpty()) {
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

                    $bulletins = $bulletinsData->toArray();
                    $totalBulletins += count($bulletins);
                }

                // Calculer la moyenne générale de l'enfant
                $moyenneGeneraleEnfant = null;
                if ($notes->isNotEmpty()) {
                    $totalPoints = $notes->sum(function($note) {
                        return $note->note * $note->coefficient;
                    });
                    $totalCoefficients = $notes->sum('coefficient');
                    $moyenneGeneraleEnfant = $totalCoefficients > 0 ? round($totalPoints / $totalCoefficients, 1) : null;
                }

                $enfantsData[] = [
                    'id' => $enfant->id,
                    'nom' => $enfant->nom,
                    'prenom' => $enfant->prenom,
                    'nom_complet' => $enfant->prenom . ' ' . $enfant->nom,
                    'classe' => $enfant->classe ? [
                        'id' => $enfant->classe->id,
                        'nom' => $enfant->classe->nom,
                        'niveau' => [
                            'id' => $enfant->classe->niveau->id,
                            'nom' => $enfant->classe->niveau->nom,
                        ],
                    ] : null,
                    'moyenne_generale' => $moyenneGeneraleEnfant,
                    'bulletins' => $bulletins,
                    'statistiques' => [
                        'total_bulletins' => count($bulletins),
                        'bulletins_reussis' => collect($bulletins)->where('reussi', true)->count(),
                        'bulletins_echoues' => collect($bulletins)->where('reussi', false)->count(),
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
                    'total_bulletins' => $totalBulletins,
                ]
            ], 'Bulletins des enfants récupérés avec succès');
            
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