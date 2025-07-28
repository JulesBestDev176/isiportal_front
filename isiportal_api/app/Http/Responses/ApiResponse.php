<?php

namespace App\Http\Responses;

trait ApiResponse
{
    /**
     * Réponse de succès
     */
    protected function successResponse($data = null, $message = 'Succès', $code = 200)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    /**
     * Réponse d'erreur
     */
    protected function errorResponse($message = 'Erreur', $errors = null, $code = 400)
    {
        $response = [
            'success' => false,
            'message' => $message
        ];

        if ($errors) {
            $response['errors'] = $errors;
        }

        return response()->json($response, $code);
    }

    /**
     * Réponse de validation
     */
    protected function validationErrorResponse($errors, $message = 'Erreur de validation')
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors
        ], 422);
    }

    /**
     * Réponse de ressource non trouvée
     */
    protected function notFoundResponse($message = 'Ressource non trouvée')
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 404);
    }

    /**
     * Réponse d'accès interdit
     */
    protected function forbiddenResponse($message = 'Accès interdit')
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 403);
    }

    /**
     * Réponse de serveur interne
     */
    protected function serverErrorResponse($message = 'Erreur interne du serveur')
    {
        return response()->json([
            'success' => false,
            'message' => $message
        ], 500);
    }
} 