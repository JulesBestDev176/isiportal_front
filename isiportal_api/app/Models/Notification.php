<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Notification extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'contenu',
        'type',
        'priorite',
        'destinataire_id',
        'expediteur_id',
        'lue',
        'date_lecture',
        'date_envoi',
        'date_creation'
    ];

    protected $casts = [
        'lue' => 'boolean',
        'date_lecture' => 'datetime',
        'date_envoi' => 'datetime',
        'date_creation' => 'datetime'
    ];

    /**
     * Relation avec le destinataire
     */
    public function destinataire(): BelongsTo
    {
        return $this->belongsTo(User::class, 'destinataire_id');
    }

    /**
     * Relation avec l'expéditeur
     */
    public function expediteur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'expediteur_id');
    }

    /**
     * Obtenir le type formaté
     */
    public function getTypeLibelleAttribute(): string
    {
        return match($this->type) {
            'info' => 'Information',
            'warning' => 'Avertissement',
            'error' => 'Erreur',
            'success' => 'Succès',
            'system' => 'Système',
            default => $this->type
        };
    }

    /**
     * Obtenir la couleur du type
     */
    public function getTypeCouleurAttribute(): string
    {
        return match($this->type) {
            'info' => 'blue',
            'warning' => 'yellow',
            'error' => 'red',
            'success' => 'green',
            'system' => 'gray',
            default => 'blue'
        };
    }

    /**
     * Obtenir la priorité formatée
     */
    public function getPrioriteLibelleAttribute(): string
    {
        return match($this->priorite) {
            'basse' => 'Basse',
            'normale' => 'Normale',
            'haute' => 'Haute',
            'urgente' => 'Urgente',
            default => $this->priorite
        };
    }

    /**
     * Obtenir la couleur de la priorité
     */
    public function getPrioriteCouleurAttribute(): string
    {
        return match($this->priorite) {
            'basse' => 'gray',
            'normale' => 'blue',
            'haute' => 'orange',
            'urgente' => 'red',
            default => 'blue'
        };
    }

    /**
     * Obtenir le statut de lecture formaté
     */
    public function getStatutLectureAttribute(): string
    {
        return $this->lue ? 'Lue' : 'Non lue';
    }

    /**
     * Obtenir la couleur du statut de lecture
     */
    public function getStatutLectureCouleurAttribute(): string
    {
        return $this->lue ? 'success' : 'warning';
    }

    /**
     * Scope pour les notifications non lues
     */
    public function scopeNonLues($query)
    {
        return $query->where('lue', false);
    }

    /**
     * Scope pour les notifications lues
     */
    public function scopeLues($query)
    {
        return $query->where('lue', true);
    }

    /**
     * Scope pour filtrer par type
     */
    public function scopeParType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope pour filtrer par priorité
     */
    public function scopeParPriorite($query, $priorite)
    {
        return $query->where('priorite', $priorite);
    }

    /**
     * Scope pour filtrer par destinataire
     */
    public function scopeParDestinataire($query, $destinataireId)
    {
        return $query->where('destinataire_id', $destinataireId);
    }

    /**
     * Scope pour les notifications récentes
     */
    public function scopeRecentes($query, $jours = 7)
    {
        return $query->where('date_creation', '>=', now()->subDays($jours));
    }
} 