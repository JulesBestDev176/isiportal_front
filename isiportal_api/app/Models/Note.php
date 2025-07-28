<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    use HasFactory;

    protected $table = 'notes';

    protected $fillable = [
        'eleve_id',
        'cours_id',
        'matiere_id',
        'annee_scolaire_id',
        'semestre',
        'type_evaluation',
        'note',
        'coefficient',
        'appreciation',
        'date_evaluation',
        'commentaire',
    ];

    protected $casts = [
        'note' => 'decimal:2',
        'coefficient' => 'decimal:2',
        'date_evaluation' => 'datetime',
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
     * Relation avec la matière
     */
    public function matiere(): BelongsTo
    {
        return $this->belongsTo(Matiere::class, 'matiere_id');
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
     * Scope pour filtrer par matière
     */
    public function scopeForMatiere($query, $matiereId)
    {
        return $query->where('matiere_id', $matiereId);
    }

    /**
     * Scope pour filtrer par semestre
     */
    public function scopeForSemestre($query, $semestre)
    {
        return $query->where('semestre', $semestre);
    }

    /**
     * Scope pour filtrer par année scolaire
     */
    public function scopeForAnneeScolaire($query, $anneeScolaireId)
    {
        return $query->where('annee_scolaire_id', $anneeScolaireId);
    }

    /**
     * Calculer la moyenne pondérée
     */
    public function getMoyennePondereeAttribute()
    {
        return $this->note * $this->coefficient;
    }

    /**
     * Vérifier si la note est valide
     */
    public function getEstValideAttribute()
    {
        return $this->note >= 0 && $this->note <= 20;
    }
} 