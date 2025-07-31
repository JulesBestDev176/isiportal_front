<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class ClasseController extends Controller
{
    /**
     * Liste des classes
     */
    public function index(Request $request): JsonResponse
    {
        $currentUser = auth()->user();
        $query = Classe::with(['niveau', 'professeurPrincipal']);

        // Filtrage selon le rôle de l'utilisateur connecté
        if ($currentUser->role === 'gestionnaire') {
            $gestionnaireSections = $currentUser->sections ?? [];
            $query->whereHas('niveau', function($q) use ($gestionnaireSections) {
                $q->whereIn('cycle', $gestionnaireSections);
            });
        }

        // Filtrage par niveau
        if ($request->has('niveau_id')) {
            $query->where('niveau_id', $request->niveau_id);
        }

        // Filtrage par année scolaire
        if ($request->has('annee_scolaire_id')) {
            $query->where('annee_scolaire_id', $request->annee_scolaire_id);
        }

        // Filtrage par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nom', 'like', "%{$search}%");
        }

        // Filtrer les classes avec effectif_actuel < effectif_max
        if ($request->has('disponible') && $request->disponible == 'true') {
            $query->whereRaw('effectif_actuel < effectif_max');
        }

        $classes = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Liste des classes',
            'data' => $classes
        ]);
    }

    /**
     * Créer une classe
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'niveau_id' => 'required|exists:niveaux,id',
            'effectif_max' => 'required|integer|min:1',
            'description' => 'nullable|string',
            'professeur_principal_id' => 'nullable|exists:users,id',
            'statut' => 'sometimes|in:active,inactive,archivee',
            'annee_scolaire_id' => 'required|exists:annees_scolaires,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $classe = Classe::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Classe créée avec succès',
            'data' => $classe->load(['niveau', 'professeurPrincipal', 'anneeScolaire'])
        ], 201);
    }

    /**
     * Afficher une classe
     */
    public function show(int $id): JsonResponse
    {
        $classe = Classe::with([
            'niveau', 
            'professeurPrincipal', 
            'anneeScolaire', 
            'eleves',
            'cours'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails de la classe',
            'data' => $classe
        ]);
    }

    /**
     * Mettre à jour une classe
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $classe = Classe::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'niveau_id' => 'sometimes|exists:niveaux,id',
            'effectif_max' => 'sometimes|integer|min:1',
            'description' => 'nullable|string',
            'professeur_principal_id' => 'nullable|exists:users,id',
            'statut' => 'sometimes|in:active,inactive,archivee',
            'annee_scolaire_id' => 'sometimes|exists:annees_scolaires,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $classe->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Classe mise à jour avec succès',
            'data' => $classe->load(['niveau', 'professeurPrincipal', 'anneeScolaire'])
        ]);
    }

    /**
     * Supprimer une classe
     */
    public function destroy(int $id): JsonResponse
    {
        $classe = Classe::findOrFail($id);

        // Vérifier s'il y a des élèves dans la classe
        if ($classe->eleves()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cette classe car elle contient des élèves'
            ], 422);
        }

        $classe->delete();

        return response()->json([
            'success' => true,
            'message' => 'Classe supprimée avec succès'
        ]);
    }

    /**
     * Obtenir les classes par niveau
     */
    public function getByNiveau(int $niveauId): JsonResponse
    {
        $classes = Classe::with(['niveau', 'professeurPrincipal', 'anneeScolaire'])
                        ->where('niveau_id', $niveauId)
                        ->where('statut', 'active')
                        ->get();

        return response()->json([
            'success' => true,
            'message' => 'Classes du niveau',
            'data' => $classes
        ]);
    }

    /**
     * Obtenir les élèves d'une classe
     */
    public function getEleves(int $id): JsonResponse
    {
        $classe = Classe::findOrFail($id);
        $eleves = $classe->eleves()->paginate(15);

        return response()->json([
            'success' => true,
            'message' => 'Élèves de la classe',
            'data' => $eleves
        ]);
    }
} 