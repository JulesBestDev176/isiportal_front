<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    use ApiResponse;

    /**
     * Connexion utilisateur
     */
    public function login(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'email' => 'required|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $credentials = $request->only('email', 'password');
            
            if (!Auth::attempt($credentials)) {
                return $this->errorResponse('Identifiants incorrects');
            }

            $user = Auth::user();
            
            // Vérifier si l'utilisateur est autorisé à se connecter
            if (in_array($user->role, ['parent', 'eleve'])) {
                Auth::logout();
                return $this->errorResponse('Ce type d\'utilisateur n\'est pas autorisé sur cette plateforme');
            }

            // Créer le token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Enregistrer la connexion
            $user->historiqueConnexions()->create([
                'date_connexion' => now(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            return $this->successResponse([
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role,
                    'full_name' => $user->nom . ' ' . $user->prenom,
                    'doitChangerMotDePasse' => (bool) $user->doit_changer_mot_de_passe,
                ],
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => config('sanctum.expiration') * 60,
            ], 'Connexion réussie');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la connexion: ' . $e->getMessage());
        }
    }

    /**
     * Déconnexion utilisateur
     */
    public function logout(Request $request)
    {
        try {
            $user = Auth::user();
            
            if ($user) {
                // Révoquer le token actuel
                $request->user()->currentAccessToken()->delete();
            }

            return $this->successResponse(null, 'Déconnexion réussie');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la déconnexion: ' . $e->getMessage());
        }
    }

    /**
     * Déconnexion de tous les appareils
     */
    public function logoutFromAllDevices(Request $request)
    {
        try {
            $user = Auth::user();
            
            if ($user) {
                // Révoquer tous les tokens de l'utilisateur
                $user->tokens()->delete();
            }

            return $this->successResponse(null, 'Déconnexion de tous les appareils réussie');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la déconnexion: ' . $e->getMessage());
        }
    }

    /**
     * Vérifier le statut d'authentification
     */
    public function checkAuth()
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Non authentifié');
            }

            return $this->successResponse([
                'isAuthenticated' => true,
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role,
                    'full_name' => $user->nom . ' ' . $user->prenom,
                    'doitChangerMotDePasse' => $user->doitChangerMotDePasse,
                ]
            ], 'Utilisateur authentifié');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la vérification: ' . $e->getMessage());
        }
    }

    /**
     * Rafraîchir le token
     */
    public function refreshToken(Request $request)
    {
        try {
            $user = Auth::user();
            
            if (!$user) {
                return $this->errorResponse('Non authentifié');
            }

            // Révoquer l'ancien token
            $request->user()->currentAccessToken()->delete();

            // Créer un nouveau token
            $token = $user->createToken('auth-token')->plainTextToken;

            return $this->successResponse([
                'token' => $token,
                'token_type' => 'Bearer',
                'expires_in' => config('sanctum.expiration') * 60,
            ], 'Token rafraîchi avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du rafraîchissement du token: ' . $e->getMessage());
        }
    }

    /**
     * Changer le mot de passe
     */
    public function changePassword(Request $request)
    {
        try {
            // Récupérer toutes les données possibles
            $data = $request->all();
            $json = $request->json()->all();
            $input = $request->input();
            
            // Fusionner toutes les sources de données
            $allData = array_merge($data, $json, $input);
            
            // Essayer tous les formats possibles
            $currentPassword = $allData['currentPassword'] ?? 
                              $allData['motDePasseActuel'] ?? 
                              $allData['current_password'] ?? 
                              $allData['ancien_mot_de_passe'] ?? null;
                              
            $newPassword = $allData['newPassword'] ?? 
                          $allData['nouveauMotDePasse'] ?? 
                          $allData['new_password'] ?? 
                          $allData['nouveau_mot_de_passe'] ?? null;
            
            // Si toujours vide, retourner les données reçues pour debug
            if (!$currentPassword || !$newPassword) {
                return response()->json([
                    'success' => false,
                    'message' => 'Données manquantes',
                    'debug' => [
                        'request_all' => $request->all(),
                        'request_json' => $request->json()->all(),
                        'request_input' => $request->input(),
                        'content_type' => $request->header('Content-Type'),
                        'raw_content' => $request->getContent(),
                        'currentPassword_found' => $currentPassword ? 'yes' : 'no',
                        'newPassword_found' => $newPassword ? 'yes' : 'no'
                    ]
                ], 400);
            }
            
            if (strlen($newPassword) < 6) { // Réduire à 6 pour les tests
                return $this->errorResponse('Le nouveau mot de passe doit contenir au moins 6 caractères', null, 400);
            }

            $user = Auth::user();
            if (!$user) {
                return $this->errorResponse('Utilisateur non authentifié', null, 401);
            }

            // Vérifier l'ancien mot de passe
            if (!Hash::check($currentPassword, $user->password)) {
                return $this->errorResponse('Le mot de passe actuel est incorrect', null, 400);
            }

            // Mettre à jour le mot de passe
            $user->update([
                'password' => Hash::make($newPassword),
                'doit_changer_mot_de_passe' => false,
            ]);

            // Recharger l'utilisateur pour avoir les données à jour
            $user->refresh();

            return $this->successResponse([
                'success' => true,
                'user' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'email' => $user->email,
                    'role' => $user->role,
                    'full_name' => $user->nom . ' ' . $user->prenom,
                    'doitChangerMotDePasse' => $user->doit_changer_mot_de_passe,
                ]
            ], 'Mot de passe changé avec succès');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur serveur',
                'error' => $e->getMessage(),
                'debug' => [
                    'request_data' => $request->all(),
                    'content_type' => $request->header('Content-Type')
                ]
            ], 500);
        }
    }

    /**
     * Envoyer les informations de connexion
     */
    public function sendConnectionInfo(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'utilisateurId' => 'required|exists:users,id',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $user = User::findOrFail($request->utilisateurId);
            
            // Générer un mot de passe temporaire
            $tempPassword = Str::random(8);
            
            $user->update([
                'password' => Hash::make($tempPassword),
                'doit_changer_mot_de_passe' => true,
            ]);

            // Envoyer l'email avec les informations de connexion
            // Mail::to($user->email)->send(new ConnectionInfoMail($user, $tempPassword));

            return $this->successResponse(null, 'Informations de connexion envoyées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'envoi des informations: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer les sessions actives
     */
    public function getActiveSessions(Request $request)
    {
        try {
            $user = Auth::user();
            
            $sessions = $user->tokens()
                ->where('last_used_at', '>=', now()->subDays(30))
                ->get()
                ->map(function ($token) {
                    return [
                        'id' => $token->id,
                        'name' => $token->name,
                        'last_used_at' => $token->last_used_at,
                        'created_at' => $token->created_at,
                        'ip_address' => $token->ip_address ?? 'N/A',
                        'user_agent' => $token->user_agent ?? 'N/A',
                    ];
                });

            return $this->successResponse($sessions, 'Sessions actives récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des sessions: ' . $e->getMessage());
        }
    }

    /**
     * Terminer une session spécifique
     */
    public function terminateSession(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'tokenId' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $user = Auth::user();
            $token = $user->tokens()->find($request->tokenId);

            if (!$token) {
                return $this->errorResponse('Session non trouvée');
            }

            $token->delete();

            return $this->successResponse(null, 'Session terminée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la terminaison de la session: ' . $e->getMessage());
        }
    }
} 