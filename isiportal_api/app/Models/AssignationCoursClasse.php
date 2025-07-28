<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AssignationCoursClasse extends Model
{
    use HasFactory;

    protected $table = 'assignations_cours_classe';

    protected $fillable = [
        'cours_id',
        'classe_id',
        'annee_scolaire_id',
        'heures_par_semaine',
        'statut',
        'remarques',
    ];

    /**
     * Relation avec le cours
     */
    public function cours(): BelongsTo
    {
        return $this->belongsTo(Cours::class);
    }

    /**
     * Relation avec la classe
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Relation avec l'année scolaire
     */
    public function anneeScolaire(): BelongsTo
    {
        return $this->belongsTo(AnneeScolaire::class);
    }

    /**
     * Scope pour les assignations actives
     */
    public function scopeActives($query)
    {
        return $query->where('statut', 'active');
    }
} 