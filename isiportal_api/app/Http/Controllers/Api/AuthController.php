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
                    'doitChangerMotDePasse' => $user->doit_changer_mot_de_passe,
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
            $validator = Validator::make($request->all(), [
                'motDePasseActuel' => 'required|string',
                'nouveauMotDePasse' => 'required|string|min:8|confirmed',
                'nouveauMotDePasse_confirmation' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $user = Auth::user();

            // Vérifier l'ancien mot de passe
            if (!Hash::check($request->motDePasseActuel, $user->password)) {
                return $this->errorResponse('Le mot de passe actuel est incorrect');
            }

            // Mettre à jour le mot de passe
            $user->update([
                'password' => Hash::make($request->nouveauMotDePasse),
                'doit_changer_mot_de_passe' => false,
            ]);

            return $this->successResponse(['success' => true], 'Mot de passe changé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du changement de mot de passe: ' . $e->getMessage());
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