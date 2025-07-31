<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Cours extends Model
{
    use HasFactory;

    protected $fillable = [
        'titre',
        'description',
        'matiere_id',
        'niveau_id',
        'annee_scolaire_id',
        'semestres_ids',
        'statut',
        'coefficient',
        'heures_par_semaine',
        'ressources',
        'creneaux',
        'date_creation',
        'date_modification'
    ];

    protected $casts = [
        'semestres_ids' => 'array',
        'ressources' => 'array',
        'creneaux' => 'array',
        'coefficient' => 'decimal:2',
        'heures_par_semaine' => 'integer',
        'date_creation' => 'datetime',
        'date_modification' => 'datetime'
    ];

    /**
     * Relation avec la matière
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class);
    }

    /**
     * Relation avec le niveau
     */
    public function niveau(): BelongsTo
    {
        return $this->belongsTo(Niveau::class);
    }

    /**
     * Relation avec l'année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    /**
     * Relation avec les classes
     */
    public function classes(): BelongsToMany
    {
        return $this->belongsToMany(Classe::class, 'cours_classes');
    }

    /**
     * Relation avec les professeurs
     */
    public function professeurs(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'cours_professeurs', 'cours_id', 'professeur_id')
                    ->where('role', 'professeur');
    }

    /**
     * Relation avec les créneaux
     */
    public function creneaux(): HasMany
    {
        return $this->hasMany(Creneau::class);
    }

    /**
     * Relation avec les assignations
     */
    public function assignations(): HasMany
    {
        return $this->hasMany(AssignationCoursClasse::class);
    }

    /**
     * Relation avec les progressions de séance
     */
    public function progressions(): HasMany
    {
        return $this->hasMany(ProgressionSeance::class);
    }

    /**
     * Obtenir le statut formaté
     */
    public function getStatutLibelleAttribute(): string
    {
        return match($this->statut) {
            'planifie' => 'Planifié',
            'en_cours' => 'En cours',
            'termine' => 'Terminé',
            'annule' => 'Annulé',
            default => $this->statut
        };
    }

    /**
     * Obtenir la couleur du statut
     */
    public function getStatutCouleurAttribute(): string
    {
        return match($this->statut) {
            'planifie' => 'blue',
            'en_cours' => 'green',
            'termine' => 'gray',
            'annule' => 'red',
            default => 'info'
        };
    }

    /**
     * Obtenir le nom de la matière
     */
    public function getMatiereNomAttribute(): string
    {
        return $this->matiere?->nom ?? 'Matière inconnue';
    }

    /**
     * Obtenir le nom du niveau
     */
    public function getNiveauNomAttribute(): string
    {
        return $this->niveau?->nom ?? 'Niveau inconnu';
    }

    /**
     * Obtenir le nom de l'année scolaire
     */
    public function getAnneeScolaireNomAttribute(): string
    {
        return $this->anneeScolaire?->nom ?? 'Année inconnue';
    }

    /**
     * Scope pour les cours actifs
     */
    public function scopeActifs($query)
    {
        return $query->whereIn('statut', ['planifie', 'en_cours']);
    }

    /**
     * Scope pour filtrer par matière
     */
    public function scopeParMatiere($query, $matiereId)
    {
        return $query->where('matiere_id', $matiereId);
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

    /**
     * Scope pour filtrer par statut
     */
    public function scopeParStatut($query, $statut)
    {
        return $query->where('statut', $statut);
    }
} 