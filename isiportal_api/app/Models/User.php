<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Events\Created;
use Illuminate\Database\Eloquent\Events\Deleted;
use App\Models\Classe;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'prenom',
        'email',
        'password',
        'role',
        'type_parent',
        'actif',
        'doit_changer_mot_de_passe',
        'derniere_connexion',
        'telephone',
        'adresse',
        'sections',
        'matieres',
        'cours',
        'privileges',
        'historique_connexions',
        'dernier_acces',
        'tentatives_connexion_echouees',
        'compte_verrouille',
        'date_verrouillage',
        'classe_id',
        'date_naissance',
        'lieu_naissance',
        'numero_etudiant',
        'parents_ids',
        'enfants_ids',
        'profession'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'actif' => 'boolean',
        'doit_changer_mot_de_passe' => 'boolean',
        'derniere_connexion' => 'datetime',
        'sections' => 'array',
        'matieres' => 'array',
        'cours' => 'array',
        'privileges' => 'array',
        'historique_connexions' => 'array',
        'dernier_acces' => 'datetime',
        'tentatives_connexion_echouees' => 'integer',
        'compte_verrouille' => 'boolean',
        'date_verrouillage' => 'datetime',
        'date_naissance' => 'date',
        'parents_ids' => 'array',
        'enfants_ids' => 'array',
    ];

    /**
     * Relation avec la classe (pour les élèves)
     */
    public function classe(): BelongsTo
    {
        return $this->belongsTo(Classe::class);
    }

    /**
     * Relation avec les matières (pour les professeurs)
     */
    public function matieres(): BelongsToMany
    {
        return $this->belongsToMany(Matiere::class, 'user_matieres');
    }

    /**
     * Relation avec les cours (pour les professeurs)
     */
    public function cours(): BelongsToMany
    {
        return $this->belongsToMany(Cours::class, 'user_cours');
    }

    /**
     * Relation avec les parents (pour les élèves)
     */
    public function parents(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_parents', 'eleve_id', 'parent_id')
                    ->where('role', 'parent');
    }

    /**
     * Relation avec les enfants (pour les parents)
     */
    public function enfants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_parents', 'parent_id', 'eleve_id')
                    ->where('role', 'eleve');
    }

    /**
     * Relation avec les notes (pour les élèves)
     */
    public function notes(): HasMany
    {
        return $this->hasMany(Note::class, 'eleve_id');
    }

    /**
     * Relation avec les bulletins (pour les élèves)
     */
    public function bulletins(): HasMany
    {
        return $this->hasMany(Bulletin::class, 'eleve_id');
    }

    /**
     * Relation avec les absences (pour les élèves)
     */
    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class, 'eleve_id');
    }

    /**
     * Relation avec les notifications
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class, 'destinataire_id');
    }

    /**
     * Relation avec l'historique des connexions
     */
    public function historiqueConnexions(): HasMany
    {
        return $this->hasMany(HistoriqueConnexion::class, 'user_id');
    }

    /**
     * Vérifier si l'utilisateur est un administrateur
     */
    public function isAdmin(): bool
    {
        return $this->role === 'administrateur';
    }

    /**
     * Vérifier si l'utilisateur est un gestionnaire
     */
    public function isGestionnaire(): bool
    {
        return $this->role === 'gestionnaire';
    }

    /**
     * Vérifier si l'utilisateur est un professeur
     */
    public function isProfesseur(): bool
    {
        return $this->role === 'professeur';
    }

    /**
     * Vérifier si l'utilisateur est un élève
     */
    public function isEleve(): bool
    {
        return $this->role === 'eleve';
    }

    /**
     * Vérifier si l'utilisateur est un parent
     */
    public function isParent(): bool
    {
        return $this->role === 'parent';
    }

    /**
     * Obtenir le nom complet
     */
    public function getFullNameAttribute(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }

    /**
     * Obtenir les informations du rôle
     */
    public function getRoleInfo(): array
    {
        return match($this->role) {
            'administrateur' => ['label' => 'Administrateur', 'color' => 'purple'],
            'gestionnaire' => ['label' => 'Gestionnaire', 'color' => 'blue'],
            'professeur' => ['label' => 'Professeur', 'color' => 'green'],
            'eleve' => ['label' => 'Élève', 'color' => 'yellow'],
            'parent' => ['label' => 'Parent', 'color' => 'orange'],
            default => ['label' => 'Inconnu', 'color' => 'gray']
        };
    }

    /**
     * Scope pour les utilisateurs actifs
     */
    public function scopeActifs($query)
    {
        return $query->where('actif', true);
    }

    /**
     * Scope pour filtrer par rôle
     */
    public function scopeParRole($query, $role)
    {
        return $query->where('role', $role);
    }

    /**
     * Boot method pour les événements
     */
    protected static function boot()
    {
        parent::boot();

        // Incrémenter l'effectif de la classe quand un élève est créé
        static::created(function ($user) {
            if ($user->role === 'eleve' && $user->classe_id) {
                $classe = Classe::find($user->classe_id);
                if ($classe) {
                    $classe->increment('effectif_actuel');
                }
            }
        });

        // Décrémenter l'effectif de la classe quand un élève est supprimé
        static::deleted(function ($user) {
            if ($user->role === 'eleve' && $user->classe_id) {
                $classe = Classe::find($user->classe_id);
                if ($classe) {
                    $classe->decrement('effectif_actuel');
                }
            }
        });

        // Mettre à jour l'effectif quand la classe d'un élève change
        static::updated(function ($user) {
            if ($user->role === 'eleve' && $user->isDirty('classe_id')) {
                // Décrémenter l'ancienne classe
                $oldClasseId = $user->getOriginal('classe_id');
                if ($oldClasseId) {
                    $oldClasse = Classe::find($oldClasseId);
                    if ($oldClasse) {
                        $oldClasse->decrement('effectif_actuel');
                    }
                }

                // Incrémenter la nouvelle classe
                if ($user->classe_id) {
                    $newClasse = Classe::find($user->classe_id);
                    if ($newClasse) {
                        $newClasse->increment('effectif_actuel');
                    }
                }
            }
        });
    }
}
