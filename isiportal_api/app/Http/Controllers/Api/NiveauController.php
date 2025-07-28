<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Niveau;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class NiveauController extends Controller
{
    /**
     * Liste des niveaux
     */
    public function index(Request $request): JsonResponse
    {
        $query = Niveau::query();

        // Filtrage par cycle
        if ($request->has('cycle')) {
            $query->where('cycle', $request->cycle);
        }

        // Filtrage par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Tri par ordre
        $query->orderBy('ordre');

        $niveaux = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Liste des niveaux',
            'data' => $niveaux
        ]);
    }

    /**
     * Créer un niveau
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'code' => 'required|string|max:10|unique:niveaux,code',
            'description' => 'nullable|string',
            'cycle' => 'required|in:college,lycee',
            'ordre' => 'required|integer|min:1',
            'statut' => 'sometimes|in:active,inactive',
            'matieres_ids' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $niveau = Niveau::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Niveau créé avec succès',
            'data' => $niveau
        ], 201);
    }

    /**
     * Afficher un niveau
     */
    public function show(int $id): JsonResponse
    {
        $niveau = Niveau::with(['classes', 'cours', 'matieres'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails du niveau',
            'data' => $niveau
        ]);
    }

    /**
     * Mettre à jour un niveau
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $niveau = Niveau::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:10|unique:niveaux,code,' . $id,
            'description' => 'nullable|string',
            'cycle' => 'sometimes|in:college,lycee',
            'ordre' => 'sometimes|integer|min:1',
            'statut' => 'sometimes|in:active,inactive',
            'matieres_ids' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $niveau->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Niveau mis à jour avec succès',
            'data' => $niveau
        ]);
    }

    /**
     * Supprimer un niveau
     */
    public function destroy(int $id): JsonResponse
    {
        $niveau = Niveau::findOrFail($id);

        // Vérifier s'il y a des classes associées
        if ($niveau->classes()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce niveau car il a des classes associées'
            ], 422);
        }

        $niveau->delete();

        return response()->json([
            'success' => true,
            'message' => 'Niveau supprimé avec succès'
        ]);
    }
} 