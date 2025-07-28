<?php

namespace App\Services;

use App\Mail\WelcomeUserMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Envoyer un email de bienvenue à un nouvel utilisateur
     */
    public static function sendWelcomeEmail(User $user, string $password): bool
    {
        try {
            // Déterminer l'URL de connexion selon le rôle
            $loginUrl = self::getLoginUrlForRole($user->role);

            // Envoyer l'email
            Mail::to($user->email)->send(new WelcomeUserMail($user, $password, $loginUrl));

            Log::info('Email de bienvenue envoyé avec succès', [
                'user_id' => $user->id,
                'email' => $user->email,
                'role' => $user->role
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi de l\'email de bienvenue', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return false;
        }
    }

    /**
     * Obtenir l'URL de connexion selon le rôle
     */
    private static function getLoginUrlForRole(string $role): string
    {
        return match ($role) {
            'administrateur', 'gestionnaire', 'professeur' => 'http://localhost:3000',
            'parent', 'eleve' => 'http://localhost:3001',
            default => 'http://localhost:3000'
        };
    }

    /**
     * Envoyer un email de réinitialisation de mot de passe
     */
    public static function sendPasswordResetEmail(User $user, string $resetToken): bool
    {
        try {
            // TODO: Implémenter l'email de réinitialisation
            Log::info('Email de réinitialisation de mot de passe envoyé', [
                'user_id' => $user->id,
                'email' => $user->email
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Erreur lors de l\'envoi de l\'email de réinitialisation', [
                'user_id' => $user->id,
                'email' => $user->email,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }
} 