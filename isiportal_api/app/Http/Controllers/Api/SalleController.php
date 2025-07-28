<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Salle;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class SalleController extends Controller
{
    /**
     * Liste des salles
     */
    public function index(Request $request): JsonResponse
    {
        $query = Salle::with(['batiment']);

        // Filtrage par bâtiment
        if ($request->has('batiment_id')) {
            $query->where('batiment_id', $request->batiment_id);
        }

        // Filtrage par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtrage par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Filtrage par capacité
        if ($request->has('capacite_min')) {
            $query->where('capacite', '>=', $request->capacite_min);
        }

        // Recherche
        if ($request->has('search')) {
            $search = $request->search;
            $query->where('nom', 'like', "%{$search}%")
                  ->orWhere('numero', 'like', "%{$search}%");
        }

        $salles = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Liste des salles',
            'data' => $salles
        ]);
    }

    /**
     * Créer une salle
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'numero' => 'nullable|string|max:50',
            'capacite' => 'required|integer|min:1',
            'type' => 'required|in:salle_cours,laboratoire,salle_info,salle_arts,salle_musique,salle_sport,amphitheatre,salle_reunion',
            'equipements' => 'nullable|array',
            'statut' => 'sometimes|in:disponible,occupee,reservee,maintenance',
            'batiment_id' => 'required|exists:batiments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $salle = Salle::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Salle créée avec succès',
            'data' => $salle->load('batiment')
        ], 201);
    }

    /**
     * Afficher une salle
     */
    public function show(int $id): JsonResponse
    {
        $salle = Salle::with(['batiment', 'classes', 'creneaux'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails de la salle',
            'data' => $salle
        ]);
    }

    /**
     * Mettre à jour une salle
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $salle = Salle::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'nom' => 'sometimes|string|max:255',
            'numero' => 'nullable|string|max:50',
            'capacite' => 'sometimes|integer|min:1',
            'type' => 'sometimes|in:salle_cours,laboratoire,salle_info,salle_arts,salle_musique,salle_sport,amphitheatre,salle_reunion',
            'equipements' => 'nullable|array',
            'statut' => 'sometimes|in:disponible,occupee,reservee,maintenance',
            'batiment_id' => 'sometimes|exists:batiments,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $salle->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Salle mise à jour avec succès',
            'data' => $salle->load('batiment')
        ]);
    }

    /**
     * Supprimer une salle
     */
    public function destroy(int $id): JsonResponse
    {
        $salle = Salle::findOrFail($id);

        // Vérifier s'il y a des créneaux associés
        if ($salle->creneaux()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer cette salle car elle a des créneaux associés'
            ], 422);
        }

        $salle->delete();

        return response()->json([
            'success' => true,
            'message' => 'Salle supprimée avec succès'
        ]);
    }

    /**
     * Obtenir les salles disponibles
     */
    public function disponibles(Request $request): JsonResponse
    {
        $query = Salle::with(['batiment'])
                     ->where('statut', 'disponible');

        // Filtrage par type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Filtrage par capacité
        if ($request->has('capacite_min')) {
            $query->where('capacite', '>=', $request->capacite_min);
        }

        $salles = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Salles disponibles',
            'data' => $salles
        ]);
    }

    /**
     * Obtenir les salles par bâtiment
     */
    public function getByBatiment(int $batimentId): JsonResponse
    {
        $salles = Salle::with(['batiment'])
                      ->where('batiment_id', $batimentId)
                      ->get();

        return response()->json([
            'success' => true,
            'message' => 'Salles du bâtiment',
            'data' => $salles
        ]);
    }

    /**
     * Obtenir les salles par type
     */
    public function getByType(string $type): JsonResponse
    {
        $salles = Salle::with(['batiment'])
                      ->where('type', $type)
                      ->get();

        return response()->json([
            'success' => true,
            'message' => 'Salles du type ' . $type,
            'data' => $salles
        ]);
    }
} 