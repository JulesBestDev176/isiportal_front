<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Batiment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BatimentController extends Controller
{
    /**
     * Liste des bâtiments
     */
    public function index(Request $request): JsonResponse
    {
        $query = Batiment::with(['salles']);

        // Filtrage par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nom', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        $batiments = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Liste des bâtiments',
            'data' => $batiments
        ]);
    }

    /**
     * Créer un bâtiment
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'description' => 'nullable|string',
            'adresse' => 'nullable|string|max:255',
            'statut' => 'sometimes|in:actif,inactif,renovation,maintenance',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $batiment = Batiment::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bâtiment créé avec succès',
            'data' => $batiment->load('salles')
        ], 201);
    }

    /**
     * Afficher un bâtiment
     */
    public function show(int $id): JsonResponse
    {
        $batiment = Batiment::with(['salles'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails du bâtiment',
            'data' => $batiment
        ]);
    }

    /**
     * Mettre à jour un bâtiment
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $batiment = Batiment::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'adresse' => 'nullable|string|max:255',
            'statut' => 'sometimes|in:actif,inactif,renovation,maintenance',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $batiment->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bâtiment mis à jour avec succès',
            'data' => $batiment->load('salles')
        ]);
    }

    /**
     * Supprimer un bâtiment
     */
    public function destroy(int $id): JsonResponse
    {
        $batiment = Batiment::findOrFail($id);

        // Vérifier s'il y a des salles dans le bâtiment
        if ($batiment->salles()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce bâtiment car il contient des salles'
            ], 422);
        }

        $batiment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bâtiment supprimé avec succès'
        ]);
    }

    /**
     * Obtenir les statistiques d'un bâtiment
     */
    public function statistiques(int $id): JsonResponse
    {
        $batiment = Batiment::with(['salles'])->findOrFail($id);

        $stats = [
            'total_salles' => $batiment->salles()->count(),
            'salles_disponibles' => $batiment->salles()->where('statut', 'disponible')->count(),
            'salles_occupees' => $batiment->salles()->where('statut', 'occupee')->count(),
            'salles_reservees' => $batiment->salles()->where('statut', 'reservee')->count(),
            'salles_maintenance' => $batiment->salles()->where('statut', 'maintenance')->count(),
            'capacite_totale' => $batiment->salles()->sum('capacite'),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Statistiques du bâtiment',
            'data' => $stats
        ]);
    }
} 