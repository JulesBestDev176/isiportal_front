<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class NotificationController extends Controller
{
    use ApiResponse;

    /**
     * Récupérer les notifications pour l'utilisateur connecté
     */
    public function index(Request $request)
    {
        try {
            $user = Auth::user();
            
            $notifications = Notification::with(['expediteur:id,nom,prenom'])
                ->where(function($query) use ($user) {
                    $query->where('destinataire_id', $user->id)
                          ->orWhereJsonContains('destinataire_roles', $user->role)
                          ->orWhere('expediteur_id', $user->id);
                })
                ->orderBy('date_creation', 'desc')
                ->get()
                ->map(function ($notification) use ($user) {
                    $estEnvoyee = $notification->expediteur_id === $user->id;
                    return [
                        'id' => $notification->id,
                        'titre' => $notification->titre,
                        'contenu' => $notification->contenu,
                        'type' => $notification->type,
                        'priorite' => $notification->priorite,
                        'lue' => $notification->lue,
                        'date_lecture' => $notification->date_lecture,
                        'date_envoi' => $notification->date_envoi,
                        'date_creation' => $notification->date_creation,
                        'destinataire_roles' => $notification->destinataire_roles,
                        'est_envoyee' => $estEnvoyee,
                        'expediteur' => $notification->expediteur ? [
                            'nom' => $notification->expediteur->nom,
                            'prenom' => $notification->expediteur->prenom
                        ] : null
                    ];
                });

            return $this->successResponse($notifications, 'Notifications récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notifications: ' . $e->getMessage());
        }
    }

    /**
     * Créer une nouvelle notification
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'titre' => 'required|string|max:255',
                'contenu' => 'required|string',
                'type' => 'required|in:info,warning,error,success,system',
                'priorite' => 'required|in:basse,normale,haute,urgente',
                'destinataire_roles' => 'required|array',
                'destinataire_roles.*' => 'in:administrateur,gestionnaire,professeur,eleve,parent'
            ]);

            if ($validator->fails()) {
                return $this->errorResponse('Données invalides', $validator->errors());
            }

            $expediteur = Auth::user();
            $destinataireRoles = $request->destinataire_roles;
            
            // Vérifier les permissions selon le rôle de l'expéditeur
            $rolesAutorises = $this->getRolesAutorises($expediteur->role);
            $rolesNonAutorises = array_diff($destinataireRoles, $rolesAutorises);
            
            if (!empty($rolesNonAutorises)) {
                return $this->errorResponse('Vous n\'êtes pas autorisé à envoyer des notifications aux rôles: ' . implode(', ', $rolesNonAutorises));
            }

            // Créer une seule notification avec les rôles destinataires
            $notification = Notification::create([
                'titre' => $request->titre,
                'contenu' => $request->contenu,
                'type' => $request->type,
                'priorite' => $request->priorite,
                'destinataire_roles' => $destinataireRoles,
                'expediteur_id' => $expediteur->id,
                'date_envoi' => now(),
                'date_creation' => now()
            ]);

            return $this->successResponse([
                'notification_id' => $notification->id,
                'destinataire_roles' => $destinataireRoles
            ], 'Notification créée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la création de la notification: ' . $e->getMessage());
        }
    }
    
    /**
     * Obtenir les rôles autorisés selon le rôle de l'utilisateur
     */
    private function getRolesAutorises($roleUtilisateur)
    {
        return match($roleUtilisateur) {
            'administrateur' => ['gestionnaire', 'professeur', 'parent'],
            'gestionnaire' => ['professeur', 'eleve', 'parent'],
            'professeur' => ['eleve'],
            default => []
        };
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        try {
            $user = Auth::user();
            
            $notification = Notification::where('id', $id)
                ->where(function($query) use ($user) {
                    $query->where('destinataire_id', $user->id)
                          ->orWhereJsonContains('destinataire_roles', $user->role);
                })
                ->first();

            if (!$notification) {
                return $this->errorResponse('Notification non trouvée');
            }

            $notification->update([
                'lue' => true,
                'date_lecture' => now()
            ]);

            return $this->successResponse(null, 'Notification marquée comme lue');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors du marquage de la notification: ' . $e->getMessage());
        }
    }

    /**
     * Supprimer une notification
     */
    public function destroy($id)
    {
        try {
            $user = Auth::user();
            
            $notification = Notification::where('id', $id)
                ->where(function($query) use ($user) {
                    $query->where('destinataire_id', $user->id)
                          ->orWhereJsonContains('destinataire_roles', $user->role);
                })
                ->first();

            if (!$notification) {
                return $this->errorResponse('Notification non trouvée');
            }

            $notification->delete();

            return $this->successResponse(null, 'Notification supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la notification: ' . $e->getMessage());
        }
    }

    /**
     * Récupérer les notifications envoyées par l'utilisateur connecté
     */
    public function sent()
    {
        try {
            $user = Auth::user();
            
            $notifications = Notification::with(['destinataire:id,nom,prenom'])
                ->where('expediteur_id', $user->id)
                ->orderBy('date_creation', 'desc')
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'titre' => $notification->titre,
                        'contenu' => $notification->contenu,
                        'type' => $notification->type,
                        'priorite' => $notification->priorite,
                        'lue' => $notification->lue,
                        'date_lecture' => $notification->date_lecture,
                        'date_envoi' => $notification->date_envoi,
                        'date_creation' => $notification->date_creation,
                        'destinataire' => [
                            'nom' => $notification->destinataire->nom,
                            'prenom' => $notification->destinataire->prenom
                        ]
                    ];
                });

            return $this->successResponse($notifications, 'Notifications envoyées récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notifications envoyées: ' . $e->getMessage());
        }
    }
} 