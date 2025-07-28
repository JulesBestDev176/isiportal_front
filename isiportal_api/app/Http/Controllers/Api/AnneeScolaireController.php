<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AnneeScolaire;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class AnneeScolaireController extends Controller
{
    /**
     * Liste des années scolaires
     */
    public function index(Request $request): JsonResponse
    {
        $query = AnneeScolaire::query();

        // Filtrage par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Tri par date de début (plus récent en premier)
        $query->orderBy('date_debut', 'desc');

        $anneesScolaires = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Liste des années scolaires',
            'data' => $anneesScolaires
        ]);
    }

    /**
     * Créer une année scolaire
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'statut' => 'sometimes|in:active,inactive,terminee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier qu'il n'y a qu'une seule année active
        if ($request->statut === 'active') {
            AnneeScolaire::where('statut', 'active')->update(['statut' => 'inactive']);
        }

        $anneeScolaire = AnneeScolaire::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Année scolaire créée avec succès',
            'data' => $anneeScolaire
        ], 201);
    }

    /**
     * Afficher une année scolaire
     */
    public function show(int $id): JsonResponse
    {
        $anneeScolaire = AnneeScolaire::with(['classes', 'cours'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails de l\'année scolaire',
            'data' => $anneeScolaire
        ]);
    }

    /**
     * Mettre à jour une année scolaire
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $anneeScolaire = AnneeScolaire::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'date_debut' => 'sometimes|date',
            'date_fin' => 'sometimes|date|after:date_debut',
            'statut' => 'sometimes|in:active,inactive,terminee',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Si on active cette année, désactiver les autres
        if ($request->has('statut') && $request->statut === 'active') {
            AnneeScolaire::where('id', '!=', $id)
                        ->where('statut', 'active')
                        ->update(['statut' => 'inactive']);
        }

        $anneeScolaire->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Année scolaire mise à jour avec succès',
            'data' => $anneeScolaire
        ]);
    }

    /**
     * Supprimer une année scolaire
     */
    public function destroy(int $id): JsonResponse
    {
        $anneeScolaire = AnneeScolaire::findOrFail($id);

        // Vérifier s'il y a des classes associées
        if ($anneeScolaire->classes()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cette année scolaire car elle a des classes associées'
            ], 422);
        }

        $anneeScolaire->delete();

        return response()->json([
            'success' => true,
            'message' => 'Année scolaire supprimée avec succès'
        ]);
    }

    /**
     * Obtenir l'année scolaire courante
     */
    public function getCourante(): JsonResponse
    {
        $anneeScolaire = AnneeScolaire::where('statut', 'active')->first();

        if (!$anneeScolaire) {
            return response()->json([
                'success' => false,
                'message' => 'Aucune année scolaire active trouvée'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Année scolaire courante',
            'data' => $anneeScolaire
        ]);
    }
} 