<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Classe;
use App\Models\HistoriqueEleve;
use App\Models\Bulletin;
use App\Models\Note;
use App\Models\Absence;
use App\Models\Niveau;
use App\Models\RegleTransfert;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class EleveController extends Controller
{
    use ApiResponse;

    /**
     * Récupère tous les élèves avec filtres
     */
    public function index(Request $request)
    {
        try {
            $query = User::where('role', 'eleve')
                ->with(['classe.niveau', 'classe.anneeScolaire']);

            // Filtres
            if ($request->has('classeId')) {
                $query->where('classe_id', $request->classeId);
            }

            if ($request->has('niveauId')) {
                $query->whereHas('classe', function ($q) use ($request) {
                    $q->where('niveau_id', $request->niveauId);
                });
            }

            if ($request->has('statut')) {
                $query->where('statut', $request->statut);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            $eleves = $query->paginate($request->get('limit', 15));

            return $this->successResponse($eleves, 'Élèves récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des élèves: ' . $e->getMessage());
        }
    }

    /**
     * Récupère un élève par ID
     */
    public function show($id)
    {
        try {
            $eleve = User::where('role', 'eleve')
                ->with(['classe.niveau', 'classe.anneeScolaire', 'notes', 'absences'])
                ->findOrFail($id);

            return $this->successResponse($eleve, 'Élève récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Élève non trouvé');
        }
    }

    /**
     * Crée un nouvel élève
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'dateNaissance' => 'required|date',
                'classe_id' => 'required|exists:classes,id',
                'adresse' => 'nullable|string',
                'telephone' => 'nullable|string',
                'sexe' => 'required|in:homme,femme',
                'statut' => 'required|in:actif,inactif,suspendu',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $eleve = User::create([
                'nom' => $request->nom,
                'prenom' => $request->prenom,
                'email' => $request->email,
                'dateNaissance' => $request->dateNaissance,
                'classe_id' => $request->classe_id,
                'adresse' => $request->adresse,
                'telephone' => $request->telephone,
                'sexe' => $request->sexe,
                'statut' => $request->statut,
                'role' => 'eleve',
                'doitChangerMotDePasse' => true,
                'motDePasse' => bcrypt('password123'), // Mot de passe temporaire
            ]);

            $eleve->load(['classe.niveau', 'classe.anneeScolaire']);

            return $this->successResponse($eleve, 'Élève créé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'élève: ' . $e->getMessage());
        }
    }

    /**
     * Met à jour un élève
     */
    public function update(Request $request, $id)
    {
        try {
            $eleve = User::where('role', 'eleve')->findOrFail($id);

            $validator = Validator::make($request->all(), [
                'nom' => 'sometimes|string|max:255',
                'prenom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $id,
                'dateNaissance' => 'sometimes|date',
                'classe_id' => 'sometimes|exists:classes,id',
                'adresse' => 'nullable|string',
                'telephone' => 'nullable|string',
                'sexe' => 'sometimes|in:homme,femme',
                'statut' => 'sometimes|in:actif,inactif,suspendu',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $eleve->update($request->only([
                'nom', 'prenom', 'email', 'dateNaissance', 'classe_id',
                'adresse', 'telephone', 'sexe', 'statut'
            ]));

            $eleve->load(['classe.niveau', 'classe.anneeScolaire']);

            return $this->successResponse($eleve, 'Élève mis à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de l\'élève: ' . $e->getMessage());
        }
    }

    /**
     * Supprime un élève
     */
    public function destroy($id)
    {
        try {
            $eleve = User::where('role', 'eleve')->findOrFail($id);
            $eleve->delete();

            return $this->successResponse(null, 'Élève supprimé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de l\'élève: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les élèves d'une classe
     */
    public function getElevesByClasse($classeId)
    {
        try {
            $eleves = User::where('role', 'eleve')
                ->where('classe_id', $classeId)
                ->with(['classe.niveau', 'classe.anneeScolaire'])
                ->get();

            return $this->successResponse($eleves, 'Élèves de la classe récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des élèves de la classe: ' . $e->getMessage());
        }
    }

    /**
     * Récupère l'historique d'un élève
     */
    public function getEleveHistorique($eleveId)
    {
        try {
            $historique = HistoriqueEleve::where('eleve_id', $eleveId)
                ->with(['classe.niveau'])
                ->orderBy('annee_scolaire', 'desc')
                ->get();

            return $this->successResponse($historique, 'Historique de l\'élève récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de l\'historique: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les détails d'un élève
     */
    public function getEleveDetails($eleveId, Request $request)
    {
        try {
            $anneeScolaireId = $request->anneeScolaireId;
            
            $eleve = User::where('role', 'eleve')
                ->with([
                    'classe.niveau',
                    'classe.anneeScolaire',
                    'notes' => function ($query) use ($anneeScolaireId) {
                        $query->where('annee_scolaire_id', $anneeScolaireId);
                    },
                    'absences' => function ($query) use ($anneeScolaireId) {
                        $query->where('annee_scolaire_id', $anneeScolaireId);
                    },
                    'bulletins' => function ($query) use ($anneeScolaireId) {
                        $query->where('annee_scolaire_id', $anneeScolaireId);
                    }
                ])
                ->findOrFail($eleveId);

            return $this->successResponse($eleve, 'Détails de l\'élève récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des détails: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les notes d'un élève
     */
    public function getEleveNotes($eleveId, Request $request)
    {
        try {
            $anneeScolaireId = $request->anneeScolaireId;
            
            $notes = Note::where('eleve_id', $eleveId)
                ->where('annee_scolaire_id', $anneeScolaireId)
                ->with(['matiere', 'cours'])
                ->get()
                ->groupBy(['semestre', 'matiere_id']);

            return $this->successResponse($notes, 'Notes de l\'élève récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notes: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les absences d'un élève
     */
    public function getEleveAbsences($eleveId, Request $request)
    {
        try {
            $anneeScolaireId = $request->anneeScolaireId;
            
            $absences = Absence::where('eleve_id', $eleveId)
                ->where('annee_scolaire_id', $anneeScolaireId)
                ->with(['cours.matiere'])
                ->get();

            return $this->successResponse($absences, 'Absences de l\'élève récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des absences: ' . $e->getMessage());
        }
    }

    /**
     * Transfère un élève vers une nouvelle classe
     */
    public function transfererEleve(Request $request, $eleveId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'nouvelleClasseId' => 'required|exists:classes,id',
                'reglesTransfert' => 'required|array',
                'anneeScolaire' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            DB::beginTransaction();

            $eleve = User::where('role', 'eleve')->findOrFail($eleveId);
            $ancienneClasseId = $eleve->classe_id;
            $nouvelleClasseId = $request->nouvelleClasseId;

            // Créer l'historique de l'ancienne classe
            HistoriqueEleve::create([
                'eleve_id' => $eleveId,
                'classe_id' => $ancienneClasseId,
                'annee_scolaire' => $request->anneeScolaire,
                'statut' => 'transfert',
                'date_sortie' => now(),
            ]);

            // Mettre à jour la classe de l'élève
            $eleve->update(['classe_id' => $nouvelleClasseId]);

            // Créer l'historique de la nouvelle classe
            HistoriqueEleve::create([
                'eleve_id' => $eleveId,
                'classe_id' => $nouvelleClasseId,
                'annee_scolaire' => $request->anneeScolaire,
                'statut' => 'actif',
                'date_inscription' => now(),
            ]);

            DB::commit();

            return $this->successResponse(null, 'Élève transféré avec succès');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Erreur lors du transfert de l\'élève: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les élèves éligibles au transfert
     */
    public function getElevesEligiblesTransfert(Request $request, $classeId)
    {
        try {
            $reglesTransfert = $request->reglesTransfert;
            $moyenneMinimale = $reglesTransfert['moyenneMinimale'] ?? 8;

            $eleves = User::where('role', 'eleve')
                ->where('classe_id', $classeId)
                ->where('statut', 'actif')
                ->with(['classe.niveau', 'bulletins'])
                ->get()
                ->filter(function ($eleve) use ($moyenneMinimale) {
                    // Calculer la moyenne annuelle
                    $moyenne = $eleve->bulletins->avg('moyenne');
                    return $moyenne >= $moyenneMinimale;
                });

            return $this->successResponse($eleves, 'Élèves éligibles au transfert récupérés avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des élèves éligibles: ' . $e->getMessage());
        }
    }

    /**
     * Statistiques des élèves
     */
    public function getStatistiques(Request $request)
    {
        try {
            $stats = [
                'total' => User::where('role', 'eleve')->count(),
                'actifs' => User::where('role', 'eleve')->where('statut', 'actif')->count(),
                'inactifs' => User::where('role', 'eleve')->where('statut', 'inactif')->count(),
                'suspendus' => User::where('role', 'eleve')->where('statut', 'suspendu')->count(),
                'parClasse' => User::where('role', 'eleve')
                    ->with('classe')
                    ->get()
                    ->groupBy('classe.nom')
                    ->map->count(),
                'parNiveau' => User::where('role', 'eleve')
                    ->with('classe.niveau')
                    ->get()
                    ->groupBy('classe.niveau.nom')
                    ->map->count(),
            ];

            return $this->successResponse($stats, 'Statistiques des élèves récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des statistiques: ' . $e->getMessage());
        }
    }
} 