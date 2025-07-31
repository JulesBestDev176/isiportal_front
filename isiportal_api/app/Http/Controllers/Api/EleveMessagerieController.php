<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class EleveMessagerieController extends Controller
{
    use ApiResponse;

    public function getMesMessages()
    {
        $user = Auth::user();
        
        if ($user->role !== 'eleve') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        try {
            // Récupérer les notifications de l'élève
            $notifications = Notification::where('destinataire_id', $user->id)
                ->orWhere(function($query) use ($user) {
                    $query->whereJsonContains('destinataire_roles', $user->role);
                })
                ->with(['expediteur:id,nom,prenom,role'])
                ->orderBy('date_creation', 'desc')
                ->get()
                ->map(function ($notification) {
                    return [
                        'id' => $notification->id,
                        'titre' => $notification->titre,
                        'contenu' => $notification->contenu,
                        'type' => $notification->type,
                        'type_libelle' => $notification->type_libelle,
                        'type_couleur' => $notification->type_couleur,
                        'priorite' => $notification->priorite,
                        'priorite_libelle' => $notification->priorite_libelle,
                        'priorite_couleur' => $notification->priorite_couleur,
                        'lue' => $notification->lue,
                        'statut_lecture' => $notification->statut_lecture,
                        'date_creation' => $notification->date_creation->format('d/m/Y H:i'),
                        'date_lecture' => $notification->date_lecture?->format('d/m/Y H:i'),
                        'expediteur' => $notification->expediteur ? [
                            'id' => $notification->expediteur->id,
                            'nom' => $notification->expediteur->nom,
                            'prenom' => $notification->expediteur->prenom,
                            'nom_complet' => $notification->expediteur->prenom . ' ' . $notification->expediteur->nom,
                            'role' => $notification->expediteur->role,
                        ] : null,
                    ];
                });

            // Récupérer les professeurs de l'élève pour les contacts
            $professeurs = [];
            if ($user->classe_id) {
                $coursEleve = \App\Models\Cours::whereHas('assignations', function($query) use ($user) {
                    $query->where('classe_id', $user->classe_id);
                })
                ->with(['professeurs:id,nom,prenom,role'])
                ->get();

                $professeursIds = [];
                foreach ($coursEleve as $cours) {
                    foreach ($cours->professeurs as $prof) {
                        if (!in_array($prof->id, $professeursIds)) {
                            $professeursIds[] = $prof->id;
                            $professeurs[] = [
                                'id' => $prof->id,
                                'nom' => $prof->nom,
                                'prenom' => $prof->prenom,
                                'nom_complet' => $prof->prenom . ' ' . $prof->nom,
                                'role' => $prof->role,
                            ];
                        }
                    }
                }
            }

            // Statistiques
            $totalMessages = $notifications->count();
            $messagesNonLus = $notifications->where('lue', false)->count();
            $messagesLus = $notifications->where('lue', true)->count();

            return $this->successResponse([
                'messages' => $notifications->values(),
                'eleve' => [
                    'id' => $user->id,
                    'nom' => $user->nom,
                    'prenom' => $user->prenom,
                    'nom_complet' => $user->prenom . ' ' . $user->nom,
                    'classe' => $user->classe ? [
                        'id' => $user->classe->id,
                        'nom' => $user->classe->nom,
                        'niveau' => [
                            'id' => $user->classe->niveau->id,
                            'nom' => $user->classe->niveau->nom,
                        ],
                    ] : null,
                ],
                'contacts' => [
                    'professeurs' => $professeurs,
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
            ], 'Messages récupérés avec succès');
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des messages: ' . $e->getMessage(), 500);
        }
    }

    public function marquerCommeLu($messageId)
    {
        $user = Auth::user();
        
        if ($user->role !== 'eleve') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        try {
            $notification = Notification::where('id', $messageId)
                ->where(function($query) use ($user) {
                    $query->where('destinataire_id', $user->id)
                          ->orWhere(function($q) use ($user) {
                              $q->whereJsonContains('destinataire_roles', $user->role);
                          });
                })
                ->first();

            if (!$notification) {
                return $this->errorResponse('Message non trouvé', 404);
            }

            $notification->update([
                'lue' => true,
                'date_lecture' => now()
            ]);

            return $this->successResponse([
                'message' => 'Message marqué comme lu'
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la mise à jour: ' . $e->getMessage(), 500);
        }
    }

    public function envoyerMessage(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role !== 'eleve') {
            return $this->errorResponse('Accès non autorisé', 403);
        }

        $request->validate([
            'destinataire_id' => 'required|exists:users,id',
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
            'priorite' => 'in:basse,normale,haute,urgente'
        ]);

        try {
            $notification = Notification::create([
                'titre' => $request->titre,
                'contenu' => $request->contenu,
                'type' => 'info',
                'priorite' => $request->priorite ?? 'normale',
                'destinataire_id' => $request->destinataire_id,
                'expediteur_id' => $user->id,
                'lue' => false,
                'date_creation' => now(),
                'date_envoi' => now()
            ]);

            return $this->successResponse([
                'message' => 'Message envoyé avec succès',
                'notification_id' => $notification->id
            ]);
            
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de l\'envoi: ' . $e->getMessage(), 500);
        }
    }
}