<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Mail\WelcomeUserMail;
use App\Models\User;
use App\Services\EmailService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Récupérer tous les utilisateurs avec pagination et filtres
     */
    public function index(Request $request)
    {
        try {
            $currentUser = auth()->user();
            $query = User::with(['classe', 'classe.niveau', 'matieres']);

            // Filtrage selon le rôle de l'utilisateur connecté
            if ($currentUser->role === 'gestionnaire') {
                $gestionnaireSections = $currentUser->sections ?? [];
                
                $query->where(function ($q) use ($gestionnaireSections) {
                    // Exclure les autres gestionnaires
                    $q->where('role', '!=', 'gestionnaire')
                      ->where(function ($subQ) use ($gestionnaireSections) {
                          // Professeurs de la même section
                          $subQ->where(function ($profQ) use ($gestionnaireSections) {
                              $profQ->where('role', 'professeur')
                                   ->where(function ($sectionQ) use ($gestionnaireSections) {
                                       foreach ($gestionnaireSections as $section) {
                                           $sectionQ->orWhereJsonContains('sections', $section);
                                       }
                                   });
                          })
                          // Élèves de la même section (college/lycee)
                          ->orWhere(function ($eleveQ) use ($gestionnaireSections) {
                              $eleveQ->where('role', 'eleve')
                                     ->whereHas('classe.niveau', function ($niveauQ) use ($gestionnaireSections) {
                                         $niveauQ->whereIn('cycle', $gestionnaireSections);
                                     });
                          })
                          // Parents ayant au moins un enfant dans la section
                          ->orWhere(function ($parentQ) use ($gestionnaireSections) {
                              $parentQ->where('role', 'parent')
                                      ->whereExists(function ($existsQ) use ($gestionnaireSections) {
                                          $existsQ->select(\DB::raw(1))
                                                  ->from('users as enfants')
                                                  ->whereRaw('JSON_CONTAINS(users.enfants_ids, CAST(enfants.id as JSON))')
                                                  ->where('enfants.role', 'eleve')
                                                  ->join('classes', 'enfants.classe_id', '=', 'classes.id')
                                                  ->join('niveaux', 'classes.niveau_id', '=', 'niveaux.id')
                                                  ->whereIn('niveaux.cycle', $gestionnaireSections);
                                      });
                          });
                      });
                });
            }
            // Admin voit tout, autres rôles voient selon leurs permissions
            elseif ($currentUser->role !== 'administrateur') {
                // Autres restrictions selon le rôle si nécessaire
            }

            // Filtre par recherche
            if ($request->has('search') && !empty($request->search)) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('nom', 'like', "%{$search}%")
                      ->orWhere('prenom', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filtre par rôle
            if ($request->has('filters.role') && !empty($request->filters['role'])) {
                $query->where('role', $request->filters['role']);
            }
            
            // Filtre par rôle (paramètre direct)
            if ($request->has('role') && !empty($request->role)) {
                $query->where('role', $request->role);
            }

            // Pagination
            $perPage = $request->get('per_page', $request->get('limit', 15));
            
            if ($perPage >= 1000) {
                $users = $query->get();
                return $this->successResponse($users, 'Utilisateurs récupérés avec succès');
            } else {
                $users = $query->paginate($perPage);
            }

            return $this->successResponse($users, 'Utilisateurs récupérés avec succès');
        } catch (\Exception $e) {
            \Log::error('UserController@index - Erreur', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Erreur lors de la récupération des utilisateurs: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer un utilisateur spécifique
     */
    public function show($id)
    {
        try {
            $user = User::with(['classe', 'classe.niveau'])->find($id);
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non trouvé', 404);
            }

            return $this->successResponse($user, 'Utilisateur récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de l\'utilisateur: ' . $e->getMessage());
        }
    }

    /**
     * Générer un numéro d'étudiant unique basé sur la date/heure complète
     */
    private function generateStudentNumber(): string
    {
        $currentYear = date('Y');
        $currentMonth = date('n');
        
        // Déterminer l'année scolaire (si on est après juin, c'est l'année suivante)
        $schoolYear = $currentMonth >= 6 ? $currentYear + 1 : $currentYear;
        
        // Générer un numéro unique avec date/heure complète
        $timestamp = microtime(true);
        $microseconds = sprintf("%06d", ($timestamp - floor($timestamp)) * 1000000);
        $uniqueId = date('YmdHis', $timestamp) . $microseconds;
        
        // Format: AAAA-YYYYMMDDHHMMSSssssss (ex: 2026-20250728122710123456)
        $studentNumber = sprintf('%d-%s', $schoolYear, $uniqueId);
        
        // Vérifier si le numéro existe déjà (très improbable mais par sécurité)
        $attempts = 0;
        $originalNumber = $studentNumber;
        
        while (User::where('numero_etudiant', $studentNumber)->exists() && $attempts < 10) {
            $attempts++;
            // Ajouter un suffixe aléatoire si conflit
            $suffix = strtoupper(substr(md5(uniqid()), 0, 3));
            $studentNumber = $originalNumber . '-' . $suffix;
        }
        
        return $studentNumber;
    }

    /**
     * Générer un mot de passe sécurisé
     */
    private function generatePassword(): string
    {
        // Générer un mot de passe de 8 caractères avec lettres et chiffres
        $chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $password = '';
        for ($i = 0; $i < 8; $i++) {
            $password .= $chars[rand(0, strlen($chars) - 1)];
        }
        return $password;
    }

    /**
     * Créer un nouvel utilisateur
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nom' => 'required|string|max:255',
                'prenom' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'nullable|string|min:6', // Rendre optionnel
                'role' => ['required', Rule::in(['administrateur', 'gestionnaire', 'professeur', 'eleve', 'parent'])],
                'type_parent' => 'nullable|string|in:mere,pere,tuteur',
                'telephone' => 'nullable|string|max:20',
                'adresse' => 'nullable|string|max:500',
                'actif' => 'boolean',
                'classeId' => 'nullable|integer|exists:classes,id', // Rendre nullable pour tous
                'dateNaissance' => 'nullable|date',
                'lieuNaissance' => 'nullable|string|max:255',
                'profession' => 'nullable|string|max:255',
                'sections' => 'nullable|array',
                'matieres' => 'nullable|array',
                'parentsIds' => 'nullable|array',
            ]);

            // Mapper les champs camelCase vers snake_case
            $userData = [
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'email' => $validated['email'],
                'role' => $validated['role'],
                'type_parent' => $validated['type_parent'] ?? null,
                'telephone' => $validated['telephone'] ?? null,
                'adresse' => $validated['adresse'] ?? null,
                'actif' => $validated['actif'] ?? true,
                'classe_id' => $validated['classeId'] ?? null,
                'date_naissance' => $validated['dateNaissance'] ?? null,
                'lieu_naissance' => $validated['lieuNaissance'] ?? null,
                'profession' => $validated['profession'] ?? null,
                'sections' => $validated['sections'] ?? null,
                'matieres' => $validated['matieres'] ?? null,
                'parents_ids' => $validated['parentsIds'] ?? null,
            ];

            // Convertir les sections string vers IDs numériques
            if (isset($userData['sections']) && is_array($userData['sections'])) {
                $sectionMap = ['college' => 1, 'lycee' => 2];
                $userData['sections'] = array_map(function($section) use ($sectionMap) {
                    return $sectionMap[$section] ?? $section;
                }, $userData['sections']);
            }

            // Validation de l'âge minimum pour les élèves (8 ans)
            if ($userData['role'] === 'eleve' && !empty($userData['date_naissance'])) {
                $birthDate = new \DateTime($userData['date_naissance']);
                $today = new \DateTime();
                $age = $today->diff($birthDate)->y;
                if ($age < 8) {
                    return $this->errorResponse('L\'élève doit avoir au moins 8 ans.', 422);
                }
            }

            // Générer automatiquement le numéro d'étudiant si c'est un élève
            if ($userData['role'] === 'eleve') {
                $userData['numero_etudiant'] = $this->generateStudentNumber();
            }

            // Générer un mot de passe automatiquement s'il n'est pas fourni
            $plainPassword = $validated['password'] ?? $this->generatePassword();
            $userData['password'] = Hash::make($plainPassword);

            $user = User::create($userData);

            // Mettre à jour automatiquement les parents pour leur associer l'enfant
            if ($user->role === 'eleve' && !empty($userData['parents_ids'])) {
                foreach ($userData['parents_ids'] as $parentId) {
                    $parent = User::find($parentId);
                    if ($parent && $parent->role === 'parent') {
                        $enfants = $parent->enfants_ids ?? [];
                        if (!in_array($user->id, $enfants)) {
                            $enfants[] = $user->id;
                            $parent->enfants_ids = $enfants;
                            $parent->save();
                        }
                    }
                }
            }

            // Envoyer l'email de bienvenue
            EmailService::sendWelcomeEmail($user, $plainPassword);

            return $this->successResponse($user, 'Utilisateur créé avec succès', 201);
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de l\'utilisateur: ' . $e->getMessage());
        }
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non trouvé', 404);
            }

            $validated = $request->validate([
                'nom' => 'sometimes|required|string|max:255',
                'prenom' => 'sometimes|required|string|max:255',
                'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($id)],
                'password' => 'nullable|string|min:6',
                'role' => ['sometimes', 'required', Rule::in(['administrateur', 'gestionnaire', 'professeur', 'eleve', 'parent'])],
                'type_parent' => 'nullable|string|in:mere,pere,tuteur',
                'telephone' => 'nullable|string|max:20',
                'adresse' => 'nullable|string|max:500',
                'actif' => 'boolean',
                'classeId' => 'nullable|integer|exists:classes,id',
                'dateNaissance' => 'nullable|date',
                'lieuNaissance' => 'nullable|string|max:255',
                'profession' => 'nullable|string|max:255',
                'sections' => 'nullable|array',
                'matieres' => 'nullable|array',
                'parentsIds' => 'nullable|array',
                'enfantsIds' => 'nullable|array', // Added for bidirectional sync
            ]);

            // Mapper les champs camelCase vers snake_case
            $userData = [];
            if (isset($validated['nom'])) $userData['nom'] = $validated['nom'];
            if (isset($validated['prenom'])) $userData['prenom'] = $validated['prenom'];
            if (isset($validated['email'])) $userData['email'] = $validated['email'];
            if (isset($validated['role'])) $userData['role'] = $validated['role'];
            if (isset($validated['type_parent'])) $userData['type_parent'] = $validated['type_parent'];
            if (isset($validated['telephone'])) $userData['telephone'] = $validated['telephone'];
            if (isset($validated['adresse'])) $userData['adresse'] = $validated['adresse'];
            if (isset($validated['actif'])) $userData['actif'] = $validated['actif'];
            if (isset($validated['classeId'])) $userData['classe_id'] = $validated['classeId'];
            if (isset($validated['dateNaissance'])) $userData['date_naissance'] = $validated['dateNaissance'];
            if (isset($validated['lieuNaissance'])) $userData['lieu_naissance'] = $validated['lieuNaissance'];
            if (isset($validated['profession'])) $userData['profession'] = $validated['profession'];
            if (isset($validated['sections'])) $userData['sections'] = $validated['sections'];
            if (isset($validated['matieres'])) $userData['matieres'] = $validated['matieres'];
            if (isset($validated['parentsIds'])) $userData['parents_ids'] = $validated['parentsIds'];
            if (isset($validated['enfantsIds'])) $userData['enfants_ids'] = $validated['enfantsIds']; // Added for bidirectional sync

            // Convertir les sections string vers IDs numériques
            if (isset($userData['sections']) && is_array($userData['sections'])) {
                $sectionMap = ['college' => 1, 'lycee' => 2];
                $userData['sections'] = array_map(function($section) use ($sectionMap) {
                    return $sectionMap[$section] ?? $section;
                }, $userData['sections']);
            }

            // Validation de l'âge minimum pour les élèves (8 ans) lors de la mise à jour
            if (($user->role === 'eleve' || (isset($userData['role']) && $userData['role'] === 'eleve')) && 
                (!empty($userData['date_naissance']) || !empty($user->date_naissance))) {
                $dateNaissance = $userData['date_naissance'] ?? $user->date_naissance;
                if ($dateNaissance) {
                    $birthDate = new \DateTime($dateNaissance);
                    $today = new \DateTime();
                    $age = $today->diff($birthDate)->y;
                    if ($age < 8) {
                        return $this->errorResponse('L\'élève doit avoir au moins 8 ans.', 422);
                    }
                }
            }

            if (isset($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $user->update($userData);

            // Synchronisation bidirectionnelle pour les parents
            if ($user->role === 'parent' && isset($validated['enfantsIds'])) {
                // Mettre à jour les enfants_ids du parent
                $user->enfants_ids = $validated['enfantsIds'];
                $user->save();
                
                // Mettre à jour les parents_ids de tous les enfants
                foreach ($validated['enfantsIds'] as $enfantId) {
                    $enfant = User::find($enfantId);
                    if ($enfant && $enfant->role === 'eleve') {
                        $parentsIds = $enfant->parents_ids ?? [];
                        if (!in_array($user->id, $parentsIds)) {
                            $parentsIds[] = $user->id;
                            $enfant->parents_ids = $parentsIds;
                            $enfant->save();
                        }
                    }
                }
            }

            return $this->successResponse($user, 'Utilisateur mis à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour de l\'utilisateur: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer tous les utilisateurs sans pagination
     */
    public function getAllUsers()
    {
        try {
            $users = User::all();
            
            $rolesCount = $users->groupBy('role')->map(function ($group) {
                return $group->count();
            });

            return $this->successResponse([
                'total_users' => $users->count(),
                'roles_count' => $rolesCount,
                'all_roles' => $users->pluck('role')->unique()->values(),
                'users' => $users
            ], 'Tous les utilisateurs récupérés');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur: ' . $e->getMessage());
        }
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy($id)
    {
        try {
            $user = User::find($id);
            
            if (!$user) {
                return $this->errorResponse('Utilisateur non trouvé', 404);
            }

            // Log pour déboguer
            \Log::info('UserController@destroy - Suppression utilisateur', [
                'user_id' => $user->id,
                'user_name' => $user->prenom . ' ' . $user->nom,
                'user_role' => $user->role,
                'classe_id' => $user->classe_id,
                'parents_ids' => $user->parents_ids,
                'enfants_ids' => $user->enfants_ids
            ]);

            // Si c'est un élève, gérer la dissociation des parents et la décrémentation de l'effectif
            if ($user->role === 'eleve') {
                $this->handleEleveDeletion($user);
            }
            // Si c'est un parent, gérer la dissociation des enfants
            elseif ($user->role === 'parent') {
                $this->handleParentDeletion($user);
            }

            $user->delete();

            return $this->successResponse(null, 'Utilisateur supprimé avec succès');
        } catch (\Exception $e) {
            \Log::error('UserController@destroy - Erreur', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return $this->errorResponse('Erreur lors de la suppression de l\'utilisateur: ' . $e->getMessage());
        }
    }

    /**
     * Gérer la suppression d'un élève
     */
    private function handleEleveDeletion($eleve)
    {
        \Log::info('UserController@handleEleveDeletion - Début', [
            'eleve_id' => $eleve->id,
            'eleve_name' => $eleve->prenom . ' ' . $eleve->nom
        ]);

        // 1. Décrémenter l'effectif de la classe
        if ($eleve->classe_id) {
            $classe = \App\Models\Classe::find($eleve->classe_id);
            if ($classe) {
                $classe->effectif_actuel = max(0, $classe->effectif_actuel - 1);
                $classe->save();
                
                \Log::info('UserController@handleEleveDeletion - Effectif décrémenté', [
                    'classe_id' => $classe->id,
                    'classe_nom' => $classe->nom,
                    'nouvel_effectif' => $classe->effectif_actuel
                ]);
            }
        }

        // 2. Dissocier des parents
        if ($eleve->parents_ids && is_array($eleve->parents_ids)) {
            foreach ($eleve->parents_ids as $parentId) {
                $parent = User::find($parentId);
                if ($parent && $parent->role === 'parent') {
                    // Retirer l'enfant des enfants_ids du parent
                    $enfantsIds = $parent->enfants_ids ?? [];
                    $enfantsIds = array_filter($enfantsIds, function($enfantId) use ($eleve) {
                        return $enfantId !== $eleve->id;
                    });
                    $parent->enfants_ids = array_values($enfantsIds);
                    $parent->save();

                    \Log::info('UserController@handleEleveDeletion - Enfant retiré du parent', [
                        'parent_id' => $parent->id,
                        'parent_name' => $parent->prenom . ' ' . $parent->nom,
                        'nouveaux_enfants_ids' => $parent->enfants_ids
                    ]);

                    // Si le parent n'a plus d'enfants, le supprimer aussi
                    if (empty($parent->enfants_ids)) {
                        $parent->delete();
                        \Log::info('UserController@handleEleveDeletion - Parent supprimé car plus d\'enfants', [
                            'parent_id' => $parent->id,
                            'parent_name' => $parent->prenom . ' ' . $parent->nom
                        ]);
                    }
                }
            }
        }
    }

    /**
     * Gérer la suppression d'un parent
     */
    private function handleParentDeletion($parent)
    {
        \Log::info('UserController@handleParentDeletion - Début', [
            'parent_id' => $parent->id,
            'parent_name' => $parent->prenom . ' ' . $parent->nom
        ]);

        // Retirer le parent des parents_ids de tous ses enfants
        if ($parent->enfants_ids && is_array($parent->enfants_ids)) {
            foreach ($parent->enfants_ids as $enfantId) {
                $enfant = User::find($enfantId);
                if ($enfant && $enfant->role === 'eleve') {
                    $parentsIds = $enfant->parents_ids ?? [];
                    $parentsIds = array_filter($parentsIds, function($parentId) use ($parent) {
                        return $parentId !== $parent->id;
                    });
                    $enfant->parents_ids = array_values($parentsIds);
                    $enfant->save();

                    \Log::info('UserController@handleParentDeletion - Parent retiré de l\'enfant', [
                        'enfant_id' => $enfant->id,
                        'enfant_name' => $enfant->prenom . ' ' . $enfant->nom,
                        'nouveaux_parents_ids' => $enfant->parents_ids
                    ]);
                }
            }
        }
    }

    /**
     * Récupérer les élèves d'une classe spécifique
     */
    public function getElevesByClasse(int $classeId): JsonResponse
    {
        try {
            $eleves = User::where('role', 'eleve')
                         ->where('classe_id', $classeId)
                         ->with(['classe', 'classe.niveau'])
                         ->get();

            $elevesTransformes = $eleves->map(function ($eleve) {
                return [
                    'id' => $eleve->id,
                    'nom' => $eleve->nom,
                    'prenom' => $eleve->prenom,
                    'email' => $eleve->email,
                    'moyenneAnnuelle' => $eleve->moyenne_annuelle ?? 0,
                    'statut' => $eleve->statut ?? 'inscrit',
                    'dateInscription' => $eleve->date_inscription ?? '2024-09-01',
                    'classe' => $eleve->classe ? [
                        'id' => $eleve->classe->id,
                        'nom' => $eleve->classe->nom,
                        'niveau' => $eleve->classe->niveau ? [
                            'id' => $eleve->classe->niveau->id,
                            'nom' => $eleve->classe->niveau->nom
                        ] : null
                    ] : null
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Élèves de la classe récupérés avec succès',
                'data' => $elevesTransformes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des élèves de la classe',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Évolution vers l'année scolaire supérieure
     */
    public function evolutionAnneeScolaire()
    {
        try {
            \DB::beginTransaction();
            
            // 1. Gérer les années scolaires
            $anneeActive = \App\Models\AnneeScolaire::where('statut', 'active')->first();
            $prochaineAnnee = \App\Models\AnneeScolaire::where('statut', 'inactive')
                ->orderBy('date_debut')
                ->first();
            
            // Si pas d'années scolaires, créer les années par défaut
            if (!$anneeActive) {
                $anneeActive = \App\Models\AnneeScolaire::create([
                    'nom' => '2024-2025',
                    'date_debut' => '2024-09-01',
                    'date_fin' => '2025-07-31',
                    'statut' => 'active'
                ]);
            }
            
            if (!$prochaineAnnee) {
                $prochaineAnnee = \App\Models\AnneeScolaire::create([
                    'nom' => '2025-2026',
                    'date_debut' => '2025-09-01',
                    'date_fin' => '2026-07-31',
                    'statut' => 'inactive'
                ]);
            }
            
            // Changer les statuts des années scolaires
            $anneeActive->update(['statut' => 'terminee']);
            $prochaineAnnee->update(['statut' => 'active']);
            
            // 2. Transférer les élèves (logique simplifiée)
            $eleves = User::where('role', 'eleve')
                ->with(['classe.niveau'])
                ->get();
            
            $transferes = 0;
            $redoublants = 0;
            $niveauxMap = [
                1 => 2, // 6ème -> 5ème
                2 => 3, // 5ème -> 4ème
                3 => 4, // 4ème -> 3ème
                4 => 5, // 3ème -> 2nde
                5 => 6, // 2nde -> 1ère
                6 => 7, // 1ère -> Terminale
                7 => null // Terminale -> Sortie
            ];
            
            foreach ($eleves as $eleve) {
                if ($eleve->classe && $eleve->classe->niveau) {
                    $niveauActuel = $eleve->classe->niveau_id;
                    
                    // Pour cette démo, on considère que tous les élèves passent
                    // (vous pouvez ajouter la logique de moyenne plus tard)
                    $moyenneAnnuelle = 12; // Moyenne fictive
                    
                    if ($moyenneAnnuelle >= 10) {
                        $niveauSuivant = $niveauxMap[$niveauActuel] ?? null;
                        
                        if ($niveauSuivant) {
                            // Trouver une classe existante du niveau suivant
                            $classeSuperieure = \App\Models\Classe::where('niveau_id', $niveauSuivant)
                                ->first();
                            
                            if ($classeSuperieure) {
                                $eleve->update(['classe_id' => $classeSuperieure->id]);
                                $transferes++;
                            }
                        }
                    } else {
                        $redoublants++;
                    }
                }
            }
            
            \DB::commit();
            
            return $this->successResponse([
                'ancienne_annee' => $anneeActive->nom,
                'nouvelle_annee' => $prochaineAnnee->nom,
                'eleves_transferes' => $transferes,
                'eleves_redoublants' => $redoublants
            ], 'Évolution réussie ! ' . $transferes . ' élèves transférés, ' . $redoublants . ' redoublants.');
            
        } catch (\Exception $e) {
            \DB::rollback();
            return $this->errorResponse('Erreur lors de l\'évolution: ' . $e->getMessage());
        }
    }
    
    /**
     * Calculer la moyenne annuelle d'un élève pour une année scolaire donnée
     */
    private function calculerMoyenneAnnuelleEleve($eleveId, $anneeScolaireId)
    {
        $notes = \App\Models\Note::where('eleve_id', $eleveId)
            ->where('annee_scolaire_id', $anneeScolaireId)
            ->where('note', '>', 0)
            ->get();
        
        if ($notes->isEmpty()) {
            return 0;
        }
        
        // Coefficients par type d'évaluation
        $coeffsEvaluation = [
            'devoir1' => 1,
            'devoir2' => 1,
            'examen' => 2
        ];
        
        // Grouper par semestre
        $notesSemestre1 = $notes->where('semestre', 1);
        $notesSemestre2 = $notes->where('semestre', 2);
        
        // Calculer moyenne semestre 1
        $moyenneSemestre1 = 0;
        if ($notesSemestre1->count() > 0) {
            $totalPondere = 0;
            $totalCoefficients = 0;
            
            foreach ($notesSemestre1 as $note) {
                $coeff = $coeffsEvaluation[$note->type_evaluation] ?? 1;
                $totalPondere += $note->note * $coeff;
                $totalCoefficients += $coeff;
            }
            
            $moyenneSemestre1 = $totalCoefficients > 0 ? $totalPondere / $totalCoefficients : 0;
        }
        
        // Calculer moyenne semestre 2
        $moyenneSemestre2 = 0;
        if ($notesSemestre2->count() > 0) {
            $totalPondere = 0;
            $totalCoefficients = 0;
            
            foreach ($notesSemestre2 as $note) {
                $coeff = $coeffsEvaluation[$note->type_evaluation] ?? 1;
                $totalPondere += $note->note * $coeff;
                $totalCoefficients += $coeff;
            }
            
            $moyenneSemestre2 = $totalCoefficients > 0 ? $totalPondere / $totalCoefficients : 0;
        }
        
        // Calculer moyenne annuelle
        $moyenneAnnuelle = 0;
        if ($moyenneSemestre1 > 0 && $moyenneSemestre2 > 0) {
            $moyenneAnnuelle = ($moyenneSemestre1 + $moyenneSemestre2) / 2;
        } elseif ($moyenneSemestre1 > 0) {
            $moyenneAnnuelle = $moyenneSemestre1;
        } elseif ($moyenneSemestre2 > 0) {
            $moyenneAnnuelle = $moyenneSemestre2;
        }
        
        return round($moyenneAnnuelle, 2);
    }
} 