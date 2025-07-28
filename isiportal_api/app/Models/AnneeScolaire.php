<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AnneeScolaire extends Model
{
    use HasFactory;

    protected $table = 'annees_scolaires';

    protected $fillable = [
        'nom',
        'date_debut',
        'date_fin',
        'statut',
        'date_creation'
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'date_creation' => 'datetime'
    ];

    /**
     * Relation avec les classes
     */
    public function classes(): HasMany
    {
        return $this->hasMany(Classe::class);
    }

    /**
     * Relation avec les cours
     */
    public function cours(): HasMany
    {
        return $this->hasMany(Cours::class);
    }

    /**
     * Relation avec les bulletins
     */
    public function bulletins(): HasMany
    {
        return $this->hasMany(Bulletin::class);
    }

    /**
     * Relation avec les absences
     */
    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'terminee' => 'Terminée',
            default => $this->statut
        };
    }

    /**
     * Obtenir la couleur du statut
     */
    public function getStatutCouleurAttribute(): string
    {
        return match($this->statut) {
            'active' => 'success',
            'inactive' => 'warning',
            'terminee' => 'secondary',
            default => 'info'
        };
    }

    /**
     * Vérifier si l'année scolaire est active
     */
    public function getEstActiveAttribute(): bool
    {
        $now = now();
        return $this->date_debut <= $now && $this->date_fin >= $now;
    }

    /**
     * Vérifier si l'année scolaire est terminée
     */
    public function getEstTermineeAttribute(): bool
    {
        return now() > $this->date_fin;
    }

    /**
     * Scope pour les années scolaires actives
     */
    public function scopeActives($query)
    {
        return $query->where('statut', 'active');
    }

    /**
     * Scope pour l'année scolaire courante
     */
    public function scopeCourante($query)
    {
        return $query->where('statut', 'active');
    }

    /**
     * Scope pour les années scolaires terminées
     */
    public function scopeTerminees($query)
    {
        return $query->where('statut', 'terminee');
    }
} 