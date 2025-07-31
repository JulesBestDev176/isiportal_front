<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use Illuminate\Http\JsonResponse;

class ProfesseurCoursController extends Controller
{
    /**
     * Récupérer les cours du professeur connecté
     */
    public function index(): JsonResponse
    {
        try {
            $professeur = auth()->user();
            
            $cours = Cours::with(['matiere', 'niveau', 'anneeScolaire', 'classes'])
                ->whereHas('professeurs', function($query) use ($professeur) {
                    $query->where('professeur_id', $professeur->id);
                })
                ->get()
                ->map(function($cours) {
                    return [
                        'id' => $cours->id,
                        'titre' => $cours->titre,
                        'description' => $cours->description,
                        'matiere' => [
                            'id' => $cours->matiere->id,
                            'nom' => $cours->matiere->nom
                        ],
                        'niveau' => [
                            'id' => $cours->niveau->id,
                            'nom' => $cours->niveau->nom
                        ],
                        'annee_scolaire' => [
                            'id' => $cours->anneeScolaire->id,
                            'nom' => $cours->anneeScolaire->nom
                        ],
                        'classes' => $cours->classes->map(function($classe) {
                            return [
                                'id' => $classe->id,
                                'nom' => $classe->nom
                            ];
                        }),
                        'coefficient' => $cours->coefficient,
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
}