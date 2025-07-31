<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Matiere;
use App\Models\Niveau;
use App\Models\MatiereNiveau;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class MatiereController extends Controller
{
    use ApiResponse;

    /**
     * Récupère toutes les matières avec filtres
     */
    public function index(Request $request)
    {
        try {
            $query = Matiere::with(['niveaux']);

            // Filtres
            if ($request->has('niveauId')) {
                $query->whereHas('niveaux', function ($q) use ($request) {
                    $q->where('niveaux.id', $request->niveauId);
                });
            }

            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            $matieres = $query->paginate($request->get('limit', 15));

            return $this->successResponse($matieres, 'Matières récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des matières: ' . $e->getMessage());
        }
    }

    /**
     * Récupère une matière par ID
     */
    public function show($id)
    {
        try {
            $matiere = Matiere::with(['niveaux'])->findOrFail($id);
            return $this->successResponse($matiere, 'Matière récupérée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Matière non trouvée');
        }
    }

    /**
     * Crée une nouvelle matière
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'description' => 'nullable|string',
                'couleur' => 'nullable|string|max:7',
                'statut' => 'required|in:actif,inactif',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $matiere = Matiere::create($request->all());
            $matiere->load(['niveaux']);

            return $this->successResponse($matiere, 'Matière créée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la matière: ' . $e->getMessage());
        }
    }

    /**
     * Met à jour une matière
     */
    public function update(Request $request, $id)
    {
        try {
            $matiere = Matiere::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nom' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'couleur' => 'nullable|string|max:7',
                'statut' => 'sometimes|in:actif,inactif',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $matiere->update($request->all());
            $matiere->load(['niveaux']);

            return $this->successResponse($matiere, 'Matière mise à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de la matière: ' . $e->getMessage());
        }
    }

    /**
     * Supprime une matière
     */
    public function destroy($id)
    {
        try {
            $matiere = Matiere::findOrFail($id);
            $matiere->delete();

            return $this->successResponse(null, 'Matière supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la matière: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer les matières par niveau
     */
    public function getMatieresByNiveau($niveauId): JsonResponse
    {
        try {
            $matieres = Matiere::whereJsonContains('niveaux_ids', (int)$niveauId)
                ->where('statut', 'active')
                ->orderBy('nom')
                ->get()
                ->map(function($matiere) {
                    return [
                        'id' => $matiere->id,
                        'nom' => $matiere->nom,
                        'code' => $matiere->code,
                        'description' => $matiere->description,
                        'couleur' => $matiere->couleur,
                        'statut' => $matiere->statut,
                        'coefficient' => $matiere->coefficient,
                        'heures_par_semaine' => $matiere->heures_par_semaine
                    ];
                });

            return response()->json([
                'success' => true,
                'message' => 'Matières du niveau récupérées',
                'data' => $matieres
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des matières'
            ], 500);
        }
    }

    /**
     * Assigne une matière à un niveau
     */
    public function assignMatiereToNiveau(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'matiereId' => 'required|exists:matieres,id',
                'niveauId' => 'required|exists:niveaux,id',
                'heuresParSemaine' => 'required|numeric|min:0',
                'coefficient' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $matiere = Matiere::findOrFail($request->matiereId);
            $niveau = Niveau::findOrFail($request->niveauId);

            // Vérifier si l'association existe déjà
            $existing = $matiere->niveaux()->where('niveaux.id', $request->niveauId)->exists();
            if ($existing) {
                return $this->errorResponse('Cette matière est déjà assignée à ce niveau');
            }

            // Créer l'association avec les données pivot
            $matiere->niveaux()->attach($request->niveauId, [
                'heures_par_semaine' => $request->heuresParSemaine,
                'coefficient' => $request->coefficient,
            ]);

            $matiere->load(['niveaux']);

            return $this->successResponse($matiere, 'Matière assignée au niveau avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'assignation de la matière: ' . $e->getMessage());
        }
    }

    /**
     * Supprime l'assignation d'une matière à un niveau
     */
    public function removeMatiereFromNiveau(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'matiereId' => 'required|exists:matieres,id',
                'niveauId' => 'required|exists:niveaux,id',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $matiere = Matiere::findOrFail($request->matiereId);
            $matiere->niveaux()->detach($request->niveauId);

            return $this->successResponse(null, 'Assignation de la matière supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'assignation: ' . $e->getMessage());
        }
    }

    /**
     * Met à jour l'assignation d'une matière à un niveau
     */
    public function updateMatiereNiveau(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'matiereId' => 'required|exists:matieres,id',
                'niveauId' => 'required|exists:niveaux,id',
                'heuresParSemaine' => 'required|numeric|min:0',
                'coefficient' => 'required|numeric|min:0',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $matiere = Matiere::findOrFail($request->matiereId);
            
            // Mettre à jour les données pivot
            $matiere->niveaux()->updateExistingPivot($request->niveauId, [
                'heures_par_semaine' => $request->heuresParSemaine,
                'coefficient' => $request->coefficient,
            ]);

            $matiere->load(['niveaux']);

            return $this->successResponse($matiere, 'Assignation de la matière mise à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de l\'assignation: ' . $e->getMessage());
        }
    }

    /**
     * Statistiques des matières
     */
    public function getStatistiques()
    {
        try {
            $stats = [
                'total' => Matiere::count(),
                'actives' => Matiere::where('statut', 'actif')->count(),
                'inactives' => Matiere::where('statut', 'inactif')->count(),
                'parNiveau' => Niveau::withCount('matieres')->get()->mapWithKeys(function ($niveau) {
                    return [$niveau->nom => $niveau->matieres_count];
                }),
            ];

            return $this->successResponse($stats, 'Statistiques des matières récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
        }
    }
} 