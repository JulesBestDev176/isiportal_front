<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CoursClasseProfesseur extends Model
{
    use HasFactory;

    protected $table = 'cours_professeurs';

    protected $fillable = [
        'cours_id',
        'classe_id',
        'professeur_id',
        'annee_scolaire_id',
        'statut'
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
     * Relation avec le professeur
     */
    public function professeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professeur_id');
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