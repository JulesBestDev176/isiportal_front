<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class ParentMessagerieController extends Controller
{
    use ApiResponse;

    public function getMesMessages()
    {
        $user = Auth::user();
        
        if ($user->role !== 'parent') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        try {
            // Récupérer les notifications du parent
            $notifications = Notification::where('destinataire_id', $user->id)
                ->orderBy('date_creation', 'desc')
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'titre' => $notification->titre ?? '',
                        'contenu' => $notification->contenu ?? '',
                        'type' => $notification->type ?? 'info',
                        'type_libelle' => ucfirst($notification->type ?? 'info'),
                        'type_couleur' => $notification->type ?? 'blue',
                        'priorite' => $notification->priorite ?? 'normale',
                        'priorite_libelle' => ucfirst($notification->priorite ?? 'normale'),
                        'priorite_couleur' => $notification->priorite ?? 'blue',
                        'lue' => (bool)$notification->lue,
                        'statut_lecture' => $notification->lue ? 'Lue' : 'Non lue',
                        'date_creation' => $notification->date_creation ? $notification->date_creation->format('d/m/Y H:i') : '',
                        'date_lecture' => $notification->date_lecture ? $notification->date_lecture->format('d/m/Y H:i') : null,
                        'expediteur' => $notification->expediteur ? [
                            'id' => $notification->expediteur->id,
                            'nom' => $notification->expediteur->nom,
                            'prenom' => $notification->expediteur->prenom,
                            'nom_complet' => $notification->expediteur->prenom . ' ' . $notification->expediteur->nom,
                            'role' => $notification->expediteur->role,
                        ] : null,
                    ];
                });

            // Statistiques
            $totalMessages = $notifications->count();
            $messagesNonLus = $notifications->where('lue', false)->count();
            $messagesLus = $notifications->where('lue', true)->count();

            return response()->json([
                'success' => true,
                'message' => 'Messages récupérés avec succès',
                'data' => [
                    'messages' => $notifications->values(),
                    'parent' => [
                        'id' => $user->id,
                        'nom' => $user->nom,
                        'prenom' => $user->prenom,
                        'nom_complet' => $user->prenom . ' ' . $user->nom,
                    ],
                    'contacts' => [
                        'professeurs' => [],
                        'administration' => [
                            [
                                'id' => 'admin',
                                'nom' => 'Administration',
                                'prenom' => '',
                                'nom_complet' => 'Administration',
                                'role' => 'administrateur',
                            ]
                        ]
                    ],
                    'statistiques' => [
                        'total_messages' => $totalMessages,
                        'messages_non_lus' => $messagesNonLus,
                        'messages_lus' => $messagesLus,
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des messages: ' . $e->getMessage()
            ], 500);
        }
    }

    public function marquerCommeLu($messageId)
    {
        $user = Auth::user();
        
        if ($user->role !== 'parent') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        try {
            $notification = Notification::where('id', $messageId)
                ->where('destinataire_id', $user->id)
                ->first();

            if (!$notification) {
                return $this->errorResponse('Message non trouvé', 404);
            }

            $notification->update([
                'lue' => true,
                'date_lecture' => now()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Message marqué comme lu'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la mise à jour: ' . $e->getMessage()
            ], 500);
        }
    }
}