<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;

trait ApiResponse
{
    /**
     * Réponse de succès
     */
    protected function successResponse($data = null, string $message = 'Opération réussie', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'timestamp' => now()->toISOString()
        ], $code);
    }

    /**
     * Réponse d'erreur
     */
    protected function errorResponse(string $message = 'Erreur survenue', int $code = 400, $errors = null): JsonResponse
    {
        $response = [
            'success' => false,
            'message' => $message,
            'timestamp' => now()->toISOString()
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Réponse de validation
     */
    protected function validationErrorResponse($errors, string $message = 'Données invalides'): JsonResponse
    {
        return $this->errorResponse($message, 422, $errors);
    }

    /**
     * Réponse de ressource non trouvée
     */
    protected function notFoundResponse(string $message = 'Ressource non trouvée'): JsonResponse
    {
        return $this->errorResponse($message, 404);
    }

    /**
     * Réponse d'accès interdit
     */
    protected function forbiddenResponse(string $message = 'Accès interdit'): JsonResponse
    {
        return $this->errorResponse($message, 403);
    }

    /**
     * Réponse de ressource créée
     */
    protected function createdResponse($data = null, string $message = 'Ressource créée avec succès'): JsonResponse
    {
        return $this->successResponse($data, $message, 201);
    }

    /**
     * Réponse de ressource supprimée
     */
    protected function deletedResponse(string $message = 'Ressource supprimée avec succès'): JsonResponse
    {
        return $this->successResponse(null, $message, 200);
    }
} 