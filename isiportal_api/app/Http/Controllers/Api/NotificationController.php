<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Responses\ApiResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    use ApiResponse;

    /**
     * Récupérer les notifications pour l'utilisateur connecté
     */
    public function index(Request $request)
    {
        try {
            $user = auth()->user();
            
            // Pour l'instant, retourner des notifications fictives
            // TODO: Implémenter la logique réelle avec la base de données
            $notifications = [
                [
                    'id' => '1',
                    'titre' => 'Nouvelle inscription',
                    'message' => 'Un nouvel élève s\'est inscrit dans la classe 6ème A',
                    'type' => 'info',
                    'date' => now()->subHours(2)->toISOString()
                ],
                [
                    'id' => '2',
                    'titre' => 'Cours programmé',
                    'message' => 'Un nouveau cours de mathématiques a été programmé pour demain',
                    'type' => 'success',
                    'date' => now()->subHours(4)->toISOString()
                ],
                [
                    'id' => '3',
                    'titre' => 'Absence non justifiée',
                    'message' => 'Un élève de la classe 5ème B est absent sans justification',
                    'type' => 'warning',
                    'date' => now()->subHours(6)->toISOString()
                ]
            ];

            return $this->successResponse($notifications, 'Notifications récupérées avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la récupération des notifications: ' . $e->getMessage());
        }
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead($id)
    {
        try {
            // TODO: Implémenter la logique pour marquer comme lue
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
            // TODO: Implémenter la logique de suppression
            return $this->successResponse(null, 'Notification supprimée avec succès');
        } catch (\Exception $e) {
            return $this->errorResponse('Erreur lors de la suppression de la notification: ' . $e->getMessage());
        }
    }
} 