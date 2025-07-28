<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Niveau extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'code',
        'description',
        'cycle',
        'ordre',
        'statut',
        'matieres_ids',
        'date_creation'
    ];

    protected $casts = [
        'ordre' => 'integer',
        'matieres_ids' => 'array',
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
     * Relation avec les matières
     */
    public function matieres(): BelongsToMany
    {
        return $this->belongsToMany(Matiere::class, 'matiere_niveaux');
    }

    /**
     * Relation avec les élèves
     */
    public function eleves(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'eleve');
    }

    /**
     * Obtenir le cycle formaté
     */
    public function getCycleLibelleAttribute(): string
    {
        return match($this->cycle) {
            'college' => 'Collège',
            'lycee' => 'Lycée',
            default => $this->cycle
        };
    }

    /**
     * Obtenir la couleur du cycle
     */
    public function getCycleCouleurAttribute(): string
    {
        return match($this->cycle) {
            'college' => 'blue',
            'lycee' => 'green',
            default => 'gray'
        };
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'active' => 'Active',
            'inactive' => 'Inactive',
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
            default => 'secondary'
        };
    }

    /**
     * Scope pour les niveaux actifs
     */
    public function scopeActifs($query)
    {
        return $query->where('statut', 'active');
    }

    /**
     * Scope pour filtrer par cycle
     */
    public function scopeParCycle($query, $cycle)
    {
        return $query->where('cycle', $cycle);
    }

    /**
     * Scope pour trier par ordre
     */
    public function scopeParOrdre($query)
    {
        return $query->orderBy('ordre');
    }
} 