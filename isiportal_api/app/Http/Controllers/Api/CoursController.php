<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cours;
use App\Models\CoursClasseProfesseur;
use App\Models\Creneau;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CoursController extends Controller
{
    /**
     * Liste des cours
     */
    public function index(Request $request): JsonResponse
    {
        $user = auth()->user();
        $query = Cours::with([
            'matiere', 
            'niveau', 
            'anneeScolaire', 
            'classes', 
            'professeurs', 
            'assignationsProfesseurs.professeur', 
            'assignationsProfesseurs.classe', 
            'creneaux.classe',
            'creneaux.professeur',
            'creneaux.salle'
        ]);

        // Filtrage par rôle utilisateur
        if ($user->role === 'professeur') {
            // Les professeurs ne voient que leurs cours assignés
            $query->whereHas('professeurs', function($q) use ($user) {
                $q->where('professeur_id', $user->id);
            });
        }
        // Les administrateurs et gestionnaires voient tous les cours

        // Filtrage par matière
        if ($request->has('matiere_id')) {
            $query->where('matiere_id', $request->matiere_id);
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
            $query->where('titre', 'like', "%{$search}%");
        }

        $cours = $query->get();

        return response()->json([
            'success' => true,
            'message' => 'Liste des cours',
            'data' => $cours
        ]);
    }

    /**
     * Créer un cours
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'titre' => 'required|string|max:255',
            'description' => 'nullable|string',
            'matiere_id' => 'required|exists:matieres,id',
            'niveau_id' => 'required|exists:niveaux,id',
            'annee_scolaire_id' => 'required|exists:annees_scolaires,id',
            'semestres_ids' => 'required|array|min:1|max:2',
            'semestres_ids.*' => 'integer|in:1,2',
            'statut' => 'sometimes|in:planifie,en_cours,termine,annule',
            'coefficient' => 'required|numeric|min:0|max:10',
            'heures_par_semaine' => 'required|integer|min:0',
            'assignations' => 'required|array|min:1',
            'assignations.*.classeId' => 'required|exists:classes,id',
            'assignations.*.professeurId' => 'required|exists:users,id',
            'creneaux' => 'nullable|array',
            'creneaux.*.jour' => 'required|in:lundi,mardi,mercredi,jeudi,vendredi,samedi',
            'creneaux.*.heureDebut' => 'required|date_format:H:i',
            'creneaux.*.heureFin' => 'required|date_format:H:i',
            'creneaux.*.classeId' => 'required|exists:classes,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Créer le cours
            $coursData = $request->except(['assignations', 'creneaux']);
            $cours = Cours::create($coursData);

            // Créer les assignations professeur-classe
            foreach ($request->assignations as $assignation) {
                CoursClasseProfesseur::create([
                    'cours_id' => $cours->id,
                    'classe_id' => $assignation['classeId'],
                    'professeur_id' => $assignation['professeurId'],
                    'annee_scolaire_id' => $request->annee_scolaire_id,
                    'statut' => 'active'
                ]);
            }

            // Créer les créneaux
            if ($request->has('creneaux')) {
                foreach ($request->creneaux as $creneau) {
                    // Trouver le professeur assigné à cette classe
                    $assignation = collect($request->assignations)
                        ->firstWhere('classeId', $creneau['classeId']);
                    
                    Creneau::create([
                        'cours_id' => $cours->id,
                        'classe_id' => $creneau['classeId'],
                        'professeur_id' => $assignation['professeurId'],
                        'jour' => $creneau['jour'],
                        'heure_debut' => $creneau['heureDebut'],
                        'heure_fin' => $creneau['heureFin'],
                        'salle_id' => $creneau['salleId'] ?? 1,
                        'statut' => 'planifie'
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Cours créé avec succès',
                'data' => $cours->load(['matiere', 'niveau', 'anneeScolaire', 'assignationsProfesseurs', 'creneaux'])
            ], 201);
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la création du cours',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Afficher un cours
     */
    public function show(int $id): JsonResponse
    {
        $cours = Cours::with([
            'matiere', 
            'niveau', 
            'anneeScolaire', 
            'classes',
            'professeurs',
            'creneaux',
            'assignations'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'message' => 'Détails du cours',
            'data' => $cours
        ]);
    }

    /**
     * Mettre à jour un cours
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $cours = Cours::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'titre' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'matiere_id' => 'sometimes|exists:matieres,id',
            'niveau_id' => 'sometimes|exists:niveaux,id',
            'annee_scolaire_id' => 'sometimes|exists:annees_scolaires,id',
            'semestres_ids' => 'sometimes|array|min:1|max:2',
            'semestres_ids.*' => 'integer|in:1,2',
            'statut' => 'sometimes|in:planifie,en_cours,termine,annule',
            'coefficient' => 'sometimes|numeric|min:0|max:10',
            'heures_par_semaine' => 'sometimes|integer|min:0',
            'ressources' => 'nullable|array',
            'creneaux' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Données invalides',
                'errors' => $validator->errors()
            ], 422);
        }

        $cours->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Cours mis à jour avec succès',
            'data' => $cours->load(['matiere', 'niveau', 'anneeScolaire'])
        ]);
    }

    /**
     * Supprimer un cours
     */
    public function destroy(int $id): JsonResponse
    {
        $cours = Cours::findOrFail($id);

        // Vérifier s'il y a des assignations
        if ($cours->assignations()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer ce cours car il a des assignations'
            ], 422);
        }

        $cours->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cours supprimé avec succès'
        ]);
    }

    /**
     * Obtenir les cours par matière
     */
    public function getByMatiere(int $matiereId): JsonResponse
    {
        $cours = Cours::with(['matiere', 'niveau', 'anneeScolaire'])
                     ->where('matiere_id', $matiereId)
                     ->where('statut', '!=', 'annule')
                     ->get();

        return response()->json([
            'success' => true,
            'message' => 'Cours de la matière',
            'data' => $cours
        ]);
    }

    /**
     * Obtenir les cours par niveau
     */
    public function getByNiveau(int $niveauId): JsonResponse
    {
        $cours = Cours::with(['matiere', 'niveau', 'anneeScolaire'])
                     ->where('niveau_id', $niveauId)
                     ->where('statut', '!=', 'annule')
                     ->get();

        return response()->json([
            'success' => true,
            'message' => 'Cours du niveau',
            'data' => $cours
        ]);
    }
} 