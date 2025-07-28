<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HistoriqueEleve;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class HistoriqueEleveController extends Controller
{
    /**
     * Liste des historiques d'élèves
     */
    public function index(Request $request): JsonResponse
    {
        $query = HistoriqueEleve::with(['eleve', 'classe']);

        // Filtrage par élève
        if ($request->has('eleve_id')) {
            $query->where('eleve_id', $request->eleve_id);
        }

        // Filtrage par classe
        if ($request->has('classe_id')) {
            $query->where('classe_id', $request->classe_id);
        }

        // Filtrage par année scolaire
        if ($request->has('annee_scolaire')) {
            $query->where('annee_scolaire', $request->annee_scolaire);
        }

        // Filtrage par statut
        if ($request->has('statut')) {
            $query->where('statut', $request->statut);
        }

        // Tri par année scolaire (décroissant)
        $query->orderBy('annee_scolaire', 'desc');

        $historiques = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Liste des historiques d\'élèves',
            'data' => $historiques
        ]);
    }

    /**
     * Créer un historique d'élève
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'eleve_id' => 'required|exists:users,id',
            'classe_id' => 'required|exists:classes,id',
            'classe_nom' => 'required|string',
            'annee_scolaire' => 'required|string',
            'niveau_nom' => 'required|string',
            'moyenne_annuelle' => 'required|numeric|min:0|max:20',
            'statut' => 'required|in:reussi,redouble,transfert,abandon',
            'date_inscription' => 'required|date',
            'date_sortie' => 'nullable|date|after:date_inscription',
            'remarques' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $historique = HistoriqueEleve::create($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Historique d\'élève créé avec succès',
            'data' => $historique->load(['eleve', 'classe'])
        ], 201);
    }

    /**
     * Afficher un historique d'élève
     */
    public function show(int $id): JsonResponse
    {
        $historique = HistoriqueEleve::with(['eleve', 'classe'])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails de l\'historique d\'élève',
            'data' => $historique
        ]);
    }

    /**
     * Mettre à jour un historique d'élève
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $historique = HistoriqueEleve::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'classe_nom' => 'sometimes|string',
            'niveau_nom' => 'sometimes|string',
            'moyenne_annuelle' => 'sometimes|numeric|min:0|max:20',
            'statut' => 'sometimes|in:reussi,redouble,transfert,abandon',
            'date_sortie' => 'nullable|date|after:date_inscription',
            'remarques' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $historique->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Historique d\'élève mis à jour avec succès',
            'data' => $historique->load(['eleve', 'classe'])
        ]);
    }

    /**
     * Supprimer un historique d'élève
     */
    public function destroy(int $id): JsonResponse
    {
        $historique = HistoriqueEleve::findOrFail($id);
        $historique->delete();

        return response()->json([
            'success' => true,
            'message' => 'Historique d\'élève supprimé avec succès'
        ]);
    }

    /**
     * Obtenir l'historique d'un élève
     */
    public function getHistoriqueEleve(int $eleveId): JsonResponse
    {
        $historiques = HistoriqueEleve::with(['classe'])
                                    ->where('eleve_id', $eleveId)
                                    ->orderBy('annee_scolaire', 'desc')
                                    ->get();

        return response()->json([
            'success' => true,
            'message' => 'Historique de l\'élève',
            'data' => $historiques
        ]);
    }

    /**
     * Obtenir l'historique d'une classe
     */
    public function getHistoriqueClasse(int $classeId): JsonResponse
    {
        $historiques = HistoriqueEleve::with(['eleve'])
                                    ->where('classe_id', $classeId)
                                    ->orderBy('moyenne_annuelle', 'desc')
                                    ->get();

        return response()->json([
            'success' => true,
            'message' => 'Historique de la classe',
            'data' => $historiques
        ]);
    }

    /**
     * Obtenir les statistiques des historiques
     */
    public function statistiques(Request $request): JsonResponse
    {
        $query = HistoriqueEleve::query();

        // Filtrage par année scolaire
        if ($request->has('annee_scolaire')) {
            $query->where('annee_scolaire', $request->annee_scolaire);
        }

        $stats = [
            'total_historiques' => $query->count(),
            'reussis' => $query->where('statut', 'reussi')->count(),
            'redoublements' => $query->where('statut', 'redouble')->count(),
            'transferts' => $query->where('statut', 'transfert')->count(),
            'abandons' => $query->where('statut', 'abandon')->count(),
            'moyenne_generale' => round($query->avg('moyenne_annuelle'), 2),
            'taux_reussite' => $query->count() > 0 ? round(($query->where('statut', 'reussi')->count() / $query->count()) * 100, 2) : 0,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Statistiques des historiques',
            'data' => $stats
        ]);
    }
} 