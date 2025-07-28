<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bulletin;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class BulletinController extends Controller
{
    /**
     * Liste des bulletins
     */
    public function index(Request $request): JsonResponse
    {
        $query = Bulletin::with(['eleve']);

        // Filtrage par élève
        if ($request->has('eleve_id')) {
            $query->where('eleve_id', $request->eleve_id);
        }

        // Filtrage par année scolaire
        if ($request->has('annee_scolaire')) {
            $query->where('annee_scolaire', $request->annee_scolaire);
        }

        // Filtrage par semestre
        if ($request->has('semestre')) {
            $query->where('semestre', $request->semestre);
        }

        // Filtrage par réussite
        if ($request->has('reussi')) {
            if ($request->boolean('reussi')) {
                $query->where('moyenne', '>=', 10);
            } else {
                $query->where('moyenne', '<', 10);
            }
        }

        // Tri par moyenne (décroissant)
        $query->orderBy('moyenne', 'desc');

        $bulletins = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Liste des bulletins',
            'data' => $bulletins
        ]);
    }

    /**
     * Créer un bulletin
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'eleve_id' => 'required|exists:users,id',
            'annee_scolaire' => 'required|string',
            'semestre' => 'required|integer|in:1,2',
            'matieres' => 'required|array',
            'matieres.*.nom' => 'required|string',
            'matieres.*.moyenne' => 'required|numeric|min:0|max:20',
            'matieres.*.coefficient' => 'required|numeric|min:0|max:10',
            'matieres.*.appreciation' => 'nullable|string',
            'appreciation' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        // Vérifier qu'il n'y a pas déjà un bulletin pour cet élève, année et semestre
        $existant = Bulletin::where('eleve_id', $request->eleve_id)
                           ->where('annee_scolaire', $request->annee_scolaire)
                           ->where('semestre', $request->semestre)
                           ->first();

        if ($existant) {
            return response()->json([
                'success' => false,
                'message' => 'Un bulletin existe déjà pour cet élève, cette année et ce semestre'
            ], 422);
        }

        $bulletin = Bulletin::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bulletin créé avec succès',
            'data' => $bulletin->load('eleve')
        ], 201);
    }

    /**
     * Afficher un bulletin
     */
    public function show(int $id): JsonResponse
    {
        $bulletin = Bulletin::with(['eleve'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails du bulletin',
            'data' => $bulletin
        ]);
    }

    /**
     * Mettre à jour un bulletin
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $bulletin = Bulletin::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'matieres' => 'sometimes|array',
            'matieres.*.nom' => 'required_with:matieres|string',
            'matieres.*.moyenne' => 'required_with:matieres|numeric|min:0|max:20',
            'matieres.*.coefficient' => 'required_with:matieres|numeric|min:0|max:10',
            'matieres.*.appreciation' => 'nullable|string',
            'appreciation' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $bulletin->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Bulletin mis à jour avec succès',
            'data' => $bulletin->load('eleve')
        ]);
    }

    /**
     * Supprimer un bulletin
     */
    public function destroy(int $id): JsonResponse
    {
        $bulletin = Bulletin::findOrFail($id);
        $bulletin->delete();

        return response()->json([
            'success' => true,
            'message' => 'Bulletin supprimé avec succès'
        ]);
    }

    /**
     * Obtenir les bulletins d'un élève
     */
    public function getBulletinsEleve(int $eleveId): JsonResponse
    {
        $bulletins = Bulletin::where('eleve_id', $eleveId)
                            ->orderBy('annee_scolaire', 'desc')
                            ->orderBy('semestre', 'desc')
                            ->get();

        return response()->json([
            'success' => true,
            'message' => 'Bulletins de l\'élève',
            'data' => $bulletins
        ]);
    }

    /**
     * Obtenir les statistiques des bulletins
     */
    public function statistiques(Request $request): JsonResponse
    {
        $query = Bulletin::query();

        // Filtrage par année scolaire
        if ($request->has('annee_scolaire')) {
            $query->where('annee_scolaire', $request->annee_scolaire);
        }

        // Filtrage par semestre
        if ($request->has('semestre')) {
            $query->where('semestre', $request->semestre);
        }

        $stats = [
            'total_bulletins' => $query->count(),
            'moyenne_generale' => round($query->avg('moyenne'), 2),
            'reussis' => $query->where('moyenne', '>=', 10)->count(),
            'echoues' => $query->where('moyenne', '<', 10)->count(),
            'taux_reussite' => $query->count() > 0 ? round(($query->where('moyenne', '>=', 10)->count() / $query->count()) * 100, 2) : 0,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Statistiques des bulletins',
            'data' => $stats
        ]);
    }
} 