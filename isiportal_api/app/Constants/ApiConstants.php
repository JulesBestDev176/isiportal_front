<?php

namespace App\Constants;

class ApiConstants
{
    // Rôles utilisateurs
    const ROLES = [
        'ADMINISTRATEUR' => 'administrateur',
        'GESTIONNAIRE' => 'gestionnaire',
        'PROFESSEUR' => 'professeur',
        'ELEVE' => 'eleve',
        'PARENT' => 'parent'
    ];

    // Rôles autorisés sur cette API
    const ROLES_AUTORISES = [
        'administrateur',
        'gestionnaire',
        'professeur'
    ];

    // Sections
    const SECTIONS = [
        'COLLEGE' => 'college',
        'LYCEE' => 'lycee'
    ];

    // Statuts des classes
    const STATUTS_CLASSE = [
        'ACTIVE' => 'active',
        'INACTIVE' => 'inactive',
        'ARCHIVEE' => 'archivee'
    ];

    // Statuts des cours
    const STATUTS_COURS = [
        'PLANIFIE' => 'planifie',
        'EN_COURS' => 'en_cours',
        'TERMINE' => 'termine',
        'ANNULE' => 'annule'
    ];

    // Statuts des matières
    const STATUTS_MATIERE = [
        'ACTIVE' => 'active',
        'INACTIVE' => 'inactive',
        'MAINTENANCE' => 'maintenance'
    ];

    // Cycles
    const CYCLES = [
        'COLLEGE' => 'college',
        'LYCEE' => 'lycee'
    ];

    // Messages d'erreur
    const MESSAGES = [
        'UNAUTHORIZED' => 'Non autorisé',
        'FORBIDDEN' => 'Accès interdit',
        'NOT_FOUND' => 'Ressource non trouvée',
        'VALIDATION_ERROR' => 'Erreur de validation',
        'SERVER_ERROR' => 'Erreur serveur',
        'SUCCESS' => 'Opération réussie',
        'CREATED' => 'Ressource créée avec succès',
        'UPDATED' => 'Ressource mise à jour avec succès',
        'DELETED' => 'Ressource supprimée avec succès'
    ];

    // Codes de statut HTTP
    const HTTP_CODES = [
        'OK' => 200,
        'CREATED' => 201,
        'NO_CONTENT' => 204,
        'BAD_REQUEST' => 400,
        'UNAUTHORIZED' => 401,
        'FORBIDDEN' => 403,
        'NOT_FOUND' => 404,
        'VALIDATION_ERROR' => 422,
        'SERVER_ERROR' => 500
    ];

    // Pagination
    const PAGINATION = [
        'DEFAULT_PER_PAGE' => 15,
        'MAX_PER_PAGE' => 100
    ];

    // Validation
    const VALIDATION = [
        'PASSWORD_MIN_LENGTH' => 8,
        'EMAIL_MAX_LENGTH' => 255,
        'NAME_MAX_LENGTH' => 255,
        'DESCRIPTION_MAX_LENGTH' => 1000
    ];
} 