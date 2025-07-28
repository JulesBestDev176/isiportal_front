<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\HistoriqueConnexion;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    use ApiResponse;

    /**
     * Récupère le profil de l'utilisateur connecté
     */
    public function show()
    {
        try {
            $user = Auth::user()->load(['classe.niveau', 'matieres']);
            return $this->successResponse($user, 'Profil récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération du profil: ' . $e->getMessage());
        }
    }

    /**
     * Met à jour le profil de l'utilisateur
     */
    public function update(Request $request)
    {
        try {
            $user = Auth::user();

            $validator = Validator::make($request->all(), [
                'nom' => 'sometimes|string|max:255',
                'prenom' => 'sometimes|string|max:255',
                'email' => 'sometimes|email|unique:users,email,' . $user->id,
                'telephone' => 'nullable|string|max:20',
                'adresse' => 'nullable|string',
                'dateNaissance' => 'sometimes|date',
                'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $data = $request->only(['nom', 'prenom', 'email', 'telephone', 'adresse', 'dateNaissance']);

            // Gestion de la photo
            if ($request->hasFile('photo')) {
                // Supprimer l'ancienne photo si elle existe
                if ($user->photo && Storage::disk('public')->exists($user->photo)) {
                    Storage::disk('public')->delete($user->photo);
                }

                $photoPath = $request->file('photo')->store('profiles', 'public');
                $data['photo'] = $photoPath;
            }

            $user->update($data);
            $user->load(['classe.niveau', 'matieres']);

            return $this->successResponse($user, 'Profil mis à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour du profil: ' . $e->getMessage());
        }
    }

    /**
     * Change le mot de passe de l'utilisateur
     */
    public function changePassword(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'currentPassword' => 'required|string',
                'newPassword' => 'required|string|min:8|confirmed',
                'newPassword_confirmation' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $user = Auth::user();

            // Vérifier l'ancien mot de passe
            if (!Hash::check($request->currentPassword, $user->motDePasse)) {
                return $this->errorResponse('Le mot de passe actuel est incorrect');
            }

            // Mettre à jour le mot de passe
            $user->update([
                'motDePasse' => Hash::make($request->newPassword),
                'doitChangerMotDePasse' => false,
            ]);

            return $this->successResponse(null, 'Mot de passe changé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du changement de mot de passe: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les préférences de l'utilisateur
     */
    public function getPreferences()
    {
        try {
            $user = Auth::user();
            $preferences = [
                'theme' => $user->preferences['theme'] ?? 'light',
                'language' => $user->preferences['language'] ?? 'fr',
                'notifications' => $user->preferences['notifications'] ?? [
                    'email' => true,
                    'push' => true,
                    'sms' => false,
                ],
                'privacy' => $user->preferences['privacy'] ?? [
                    'showEmail' => true,
                    'showPhone' => false,
                    'showAddress' => false,
                ],
            ];

            return $this->successResponse($preferences, 'Préférences récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des préférences: ' . $e->getMessage());
        }
    }

    /**
     * Met à jour les préférences de l'utilisateur
     */
    public function updatePreferences(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'theme' => 'sometimes|in:light,dark,auto',
                'language' => 'sometimes|in:fr,en',
                'notifications.email' => 'sometimes|boolean',
                'notifications.push' => 'sometimes|boolean',
                'notifications.sms' => 'sometimes|boolean',
                'privacy.showEmail' => 'sometimes|boolean',
                'privacy.showPhone' => 'sometimes|boolean',
                'privacy.showAddress' => 'sometimes|boolean',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $user = Auth::user();
            $currentPreferences = $user->preferences ?? [];
            $newPreferences = array_merge($currentPreferences, $request->all());

            $user->update(['preferences' => $newPreferences]);

            return $this->successResponse($newPreferences, 'Préférences mises à jour avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour des préférences: ' . $e->getMessage());
        }
    }

    /**
     * Supprime le compte de l'utilisateur
     */
    public function deleteAccount(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $user = Auth::user();

            // Vérifier le mot de passe
            if (!Hash::check($request->password, $user->motDePasse)) {
                return $this->errorResponse('Le mot de passe est incorrect');
            }

            // Supprimer la photo si elle existe
            if ($user->photo && Storage::disk('public')->exists($user->photo)) {
                Storage::disk('public')->delete($user->photo);
            }

            // Supprimer l'utilisateur
            $user->delete();

            // Déconnecter l'utilisateur
            Auth::logout();

            return $this->successResponse(null, 'Compte supprimé avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression du compte: ' . $e->getMessage());
        }
    }

    /**
     * Upload une photo de profil
     */
    public function uploadProfilePhoto(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $user = Auth::user();

            // Supprimer l'ancienne photo si elle existe
            if ($user->photo && Storage::disk('public')->exists($user->photo)) {
                Storage::disk('public')->delete($user->photo);
            }

            // Upload de la nouvelle photo
            $photoPath = $request->file('photo')->store('profiles', 'public');
            $user->update(['photo' => $photoPath]);

            $photoUrl = Storage::disk('public')->url($photoPath);

            return $this->successResponse(['photoUrl' => $photoUrl], 'Photo de profil uploadée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'upload de la photo: ' . $e->getMessage());
        }
    }

    /**
     * Supprime la photo de profil
     */
    public function deleteProfilePhoto()
    {
        try {
            $user = Auth::user();

            if ($user->photo && Storage::disk('public')->exists($user->photo)) {
                Storage::disk('public')->delete($user->photo);
            }

            $user->update(['photo' => null]);

            return $this->successResponse(null, 'Photo de profil supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la photo: ' . $e->getMessage());
        }
    }

    /**
     * Récupère l'historique de connexion
     */
    public function getConnectionHistory()
    {
        try {
            $user = Auth::user();
            
            $historique = HistoriqueConnexion::where('user_id', $user->id)
                ->orderBy('date_connexion', 'desc')
                ->limit(50)
                ->get();

            return $this->successResponse($historique, 'Historique de connexion récupéré avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération de l\'historique: ' . $e->getMessage());
        }
    }

    /**
     * Déconnecte l'utilisateur de tous les appareils
     */
    public function logoutFromAllDevices()
    {
        try {
            $user = Auth::user();
            
            // Révoquer tous les tokens de l'utilisateur
            $user->tokens()->delete();

            return $this->successResponse(null, 'Déconnexion de tous les appareils réussie');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la déconnexion: ' . $e->getMessage());
        }
    }

    /**
     * Récupère les sessions actives
     */
    public function getActiveSessions()
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
     * Termine une session spécifique
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