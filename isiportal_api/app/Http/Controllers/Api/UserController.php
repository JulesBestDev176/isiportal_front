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
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    use ApiResponse;

    /**
     * Récupérer tous les utilisateurs avec pagination et filtres
     */
    public function index(Request $request)
    {
        try {
            $query = User::with(['classe', 'classe.niveau']);

            // Log pour diagnostiquer
            \Log::info('UserController@index - Requête reçue', [
                'user_id' => auth()->id(),
                'user_role' => auth()->user()->role ?? 'guest',
                'request_params' => $request->all()
            ]);

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

            // Filtre par statut - temporairement désactivé pour voir tous les utilisateurs
            // if ($request->has('filters.actif')) {
            //     $query->where('actif', $request->filters['actif']);
            // }

            // Pagination - si la limite est élevée, retourner tous les utilisateurs
            $perPage = $request->get('per_page', $request->get('limit', 15));
            
            \Log::info('UserController@index - Pagination', [
                'perPage' => $perPage,
                'perPage >= 1000' => $perPage >= 1000,
                'request_params' => $request->all()
            ]);
            
            if ($perPage >= 1000) {
                $users = $query->get();
                \Log::info('UserController@index - Retourne tous les utilisateurs', [
                    'total_users' => $users->count()
                ]);
                return $this->successResponse($users, 'Utilisateurs récupérés avec succès');
            } else {
                $users = $query->paginate($perPage);
                \Log::info('UserController@index - Retourne pagination', [
                    'total_users' => $users->total(),
                    'current_page' => $users->currentPage()
                ]);
            }

            // Log pour diagnostiquer
            \Log::info('UserController@index - Résultats', [
                'total_users' => $users->total(),
                'roles_found' => $users->pluck('role')->unique()->toArray(),
                'per_page' => $perPage
            ]);

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
} 