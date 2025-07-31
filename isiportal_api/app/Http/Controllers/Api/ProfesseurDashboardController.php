<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Cours;
use App\Models\Classe;
use App\Models\Note;
use App\Models\Absence;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class ProfesseurDashboardController extends Controller
{
    /**
     * Récupérer les statistiques du dashboard professeur
     */
    public function getStats(): JsonResponse
    {
        try {
            $professeur = auth()->user();
            
            // Classes où le professeur est professeur principal
            $classesCommeProf = Classe::where('professeur_principal_id', $professeur->id)->count();
            
            // Cours assignés au professeur via la table cours_professeurs
            $coursAssignes = DB::table('cours_professeurs')
                ->where('professeur_id', $professeur->id)
                ->count();
            
            // Élèves dans les classes du professeur
            $elevesTotal = User::where('role', 'eleve')
                ->whereIn('classe_id', function($query) use ($professeur) {
                    $query->select('id')
                          ->from('classes')
                          ->where('professeur_principal_id', $professeur->id);
                })
                ->count();
            
            // Notes saisies par le professeur
            $notesSaisies = Note::whereHas('cours', function($query) use ($professeur) {
                $query->whereHas('professeurs', function($subQuery) use ($professeur) {
                    $subQuery->where('professeur_id', $professeur->id);
                });
            })->count();
            
            // Absences à traiter
            $absencesATraiter = Absence::whereHas('cours', function($query) use ($professeur) {
                $query->whereHas('professeurs', function($subQuery) use ($professeur) {
                    $subQuery->where('professeur_id', $professeur->id);
                });
            })->where('justifiee', false)->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'classes_comme_prof_principal' => $classesCommeProf,
                    'cours_assignes' => $coursAssignes,
                    'eleves_total' => $elevesTotal,
                    'notes_saisies' => $notesSaisies,
                    'absences_a_traiter' => $absencesATraiter
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des statistiques',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les classes du professeur
     */
    public function getClasses(): JsonResponse
    {
        try {
            $professeur = auth()->user();
            
            // Classes où le professeur est professeur principal
            $classes = Classe::with(['niveau', 'eleves'])
                ->where('professeur_principal_id', $professeur->id)
                ->get()
                ->map(function($classe) {
                    return [
                        'id' => $classe->id,
                        'nom' => $classe->nom,
                        'niveau' => $classe->niveau->nom ?? 'Niveau inconnu',
                        'effectif' => $classe->eleves->count(),
                        'effectif_max' => $classe->effectif_max
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $classes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des classes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les cours du professeur
     */
    public function getCours(): JsonResponse
    {
        try {
            $professeur = auth()->user();
            
            $cours = Cours::with(['matiere', 'niveau', 'classes'])
                ->whereHas('professeurs', function($query) use ($professeur) {
                    $query->where('professeur_id', $professeur->id);
                })
                ->get()
                ->map(function($cours) {
                    return [
                        'id' => $cours->id,
                        'titre' => $cours->titre,
                        'matiere' => $cours->matiere->nom ?? 'Matière inconnue',
                        'niveau' => $cours->niveau->nom ?? 'Niveau inconnu',
                        'classes' => $cours->classes->pluck('nom')->join(', '),
                        'heures_par_semaine' => $cours->heures_par_semaine,
                        'statut' => $cours->statut
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $cours
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Récupérer les notes récentes du professeur
     */
    public function getNotesRecentes(): JsonResponse
    {
        try {
            $professeur = auth()->user();
            
            $notes = Note::with(['eleve', 'matiere', 'cours'])
                ->whereHas('cours', function($query) use ($professeur) {
                    $query->whereHas('professeurs', function($subQuery) use ($professeur) {
                        $subQuery->where('professeur_id', $professeur->id);
                    });
                })
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get()
                ->map(function($note) {
                    return [
                        'id' => $note->id,
                        'eleve' => $note->eleve->prenom . ' ' . $note->eleve->nom,
                        'matiere' => $note->matiere->nom ?? 'Matière inconnue',
                        'note' => $note->note,
                        'type_evaluation' => $note->type_evaluation,
                        'date_evaluation' => $note->date_evaluation
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $notes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des notes',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}