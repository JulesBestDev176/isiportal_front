<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Salle extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'numero',
        'capacite',
        'type',
        'equipements',
        'statut',
        'batiment_id',
        'date_creation'
    ];

    protected $casts = [
        'capacite' => 'integer',
        'equipements' => 'array',
        'date_creation' => 'datetime'
    ];

    /**
     * Relation avec le bâtiment
     */
    public function batiment(): BelongsTo
    {
        return $this->belongsTo(Batiment::class);
    }

    /**
     * Relation avec les classes
     */
    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(Classe::class, 'classe_salles');
    }

    /**
     * Relation avec les créneaux
     */
    public function creneaux(): BelongsToMany
    {
        return $this->belongsToMany(Creneau::class, 'creneau_salles');
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'disponible' => 'Disponible',
            'occupee' => 'Occupée',
            'reservee' => 'Réservée',
            'maintenance' => 'En maintenance',
            default => $this->statut
        };
    }

    /**
     * Obtenir la couleur du statut
     */
    public function getStatutCouleurAttribute(): string
    {
        return match($this->statut) {
            'disponible' => 'success',
            'occupee' => 'warning',
            'reservee' => 'info',
            'maintenance' => 'danger',
            default => 'secondary'
        };
    }

    /**
     * Obtenir le type formaté
     */
    public function getTypeLibelleAttribute(): string
    {
        return match($this->type) {
            'salle_cours' => 'Salle de cours',
            'laboratoire' => 'Laboratoire',
            'salle_info' => 'Salle informatique',
            'salle_arts' => 'Salle d\'arts',
            'salle_musique' => 'Salle de musique',
            'salle_sport' => 'Salle de sport',
            'amphitheatre' => 'Amphithéâtre',
            'salle_reunion' => 'Salle de réunion',
            default => $this->type
        };
    }

    /**
     * Obtenir le nom complet (bâtiment + salle)
     */
    public function getNomCompletAttribute(): string
    {
        return $this->batiment->nom . ' - ' . $this->nom;
    }

    /**
     * Scope pour les salles disponibles
     */
    public function scopeDisponibles($query)
    {
        return $query->where('statut', 'disponible');
    }

    /**
     * Scope pour filtrer par type
     */
    public function scopeParType($query, $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope pour filtrer par bâtiment
     */
    public function scopeParBatiment($query, $batimentId)
    {
        return $query->where('batiment_id', $batimentId);
    }

    /**
     * Scope pour filtrer par capacité
     */
    public function scopeParCapacite($query, $capacite)
    {
        return $query->where('capacite', '>=', $capacite);
    }
} 