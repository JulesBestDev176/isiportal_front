<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Classe extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'niveau_id',
        'effectif_max',
        'effectif_actuel',
        'description',
        'professeur_principal_id',
        'statut',
        'annee_scolaire_id',
        'date_creation'
    ];

    protected $casts = [
        'effectif_max' => 'integer',
        'effectif_actuel' => 'integer',
        'date_creation' => 'datetime'
    ];

    /**
     * Relation avec le niveau
     */
    public function niveau(): BelongsTo
    {
        return $this->belongsTo(Niveau::class);
    }

    /**
     * Relation avec le professeur principal
     */
    public function professeurPrincipal(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professeur_principal_id');
    }

    /**
     * Relation avec l'année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    /**
     * Relation avec les élèves
     */
    public function eleves(): HasMany
    {
        return $this->hasMany(User::class)->where('role', 'eleve');
    }

    /**
     * Relation avec les cours
     */
    public function cours(): BelongsToMany
    {
        return $this->belongsToMany(Cours::class, 'cours_classes');
    }

    /**
     * Relation avec les salles
     */
    public function salles(): BelongsToMany
    {
        return $this->belongsToMany(Salle::class, 'classe_salles');
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
     * Obtenir l'effectif actuel
     */
    public function getEffectifActuelAttribute(): int
    {
        return $this->eleves()->count();
    }

    /**
     * Obtenir le badge d'effectif
     */
    public function getEffectifBadgeAttribute(): string
    {
        $effectif = $this->effectif_actuel;
        $max = $this->effectif_max;
        
        if ($effectif >= $max) {
            return 'bg-red-100 text-red-800';
        } elseif ($effectif >= $max * 0.8) {
            return 'bg-yellow-100 text-yellow-800';
        } else {
            return 'bg-green-100 text-green-800';
        }
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'active' => 'Active',
            'inactive' => 'Inactive',
            'archivee' => 'Archivée',
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
            'archivee' => 'secondary',
            default => 'info'
        };
    }

    /**
     * Scope pour les classes actives
     */
    public function scopeActives($query)
    {
        return $query->where('statut', 'active');
    }

    /**
     * Scope pour filtrer par niveau
     */
    public function scopeParNiveau($query, $niveauId)
    {
        return $query->where('niveau_id', $niveauId);
    }

    /**
     * Scope pour filtrer par année scolaire
     */
    public function scopeParAnneeScolaire($query, $anneeScolaireId)
    {
        return $query->where('annee_scolaire_id', $anneeScolaireId);
    }
} 