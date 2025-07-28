<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    use HasFactory;

    protected $table = 'absences';

    protected $fillable = [
        'eleve_id',
        'cours_id',
        'annee_scolaire_id',
        'date_absence',
        'periode',
        'justifiee',
        'motif',
        'justificatif',
        'commentaire',
        'notifiee_parent',
    ];

    protected $casts = [
        'date_absence' => 'date',
        'justifiee' => 'boolean',
        'notifiee_parent' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation avec l'élève
     */
    public function eleve(): BelongsTo
    {
        return $this->belongsTo(User::class, 'eleve_id');
    }

    /**
     * Relation avec le cours
     */
    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class, 'cours_id');
    }

    /**
     * Relation avec l'année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class, 'annee_scolaire_id');
    }

    /**
     * Scope pour filtrer par élève
     */
    public function scopeForEleve($query, $eleveId)
    {
        return $query->where('eleve_id', $eleveId);
    }

    /**
     * Scope pour filtrer par cours
     */
    public function scopeForCours($query, $coursId)
    {
        return $query->where('cours_id', $coursId);
    }

    /**
     * Scope pour filtrer par année scolaire
     */
    public function scopeForAnneeScolaire($query, $anneeScolaireId)
    {
        return $query->where('annee_scolaire_id', $anneeScolaireId);
    }

    /**
     * Scope pour filtrer par date
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('date_absence', $date);
    }

    /**
     * Scope pour filtrer les absences justifiées
     */
    public function scopeJustifiees($query)
    {
        return $query->where('justifiee', true);
    }

    /**
     * Scope pour filtrer les absences non justifiées
     */
    public function scopeNonJustifiees($query)
    {
        return $query->where('justifiee', false);
    }

    /**
     * Calculer la durée de l'absence
     */
    public function getDureeAttribute()
    {
        $periodes = [
            'matin' => 4,
            'apres_midi' => 4,
            'journee' => 8,
        ];

        return $periodes[$this->periode] ?? 0;
    }

    /**
     * Vérifier si l'absence est récente
     */
    public function getEstRecenteAttribute()
    {
        return $this->date_absence->isAfter(now()->subDays(7));
    }
} 