<?php

namespace App\Services;

use App\Models\User;
use App\Models\Cours;
use App\Models\Note;
use App\Models\AssignationCoursClasse;
use Illuminate\Support\Collection;

class EleveCoursService
{
    /**
     * Récupérer les cours optimisés pour un élève
     */
    public function getCoursOptimises(User $eleve): Collection
    {
        // Vérifier que l'utilisateur est un élève avec une classe
        if ($eleve->role !== 'eleve' || !$eleve->classe_id) {
            return collect([]);
        }

        // Récupérer les cours avec une seule requête optimisée
        return Cours::with([
            'matiere:id,nom,code,coefficient',
            'niveau:id,nom,cycle',
            'professeurs:id,nom,prenom',
            'assignations' => function($query) use ($eleve) {
                $query->where('classe_id', $eleve->classe_id)
                      ->select('id', 'cours_id', 'classe_id', 'heures_par_semaine', 'remarques');
            }
        ])
        ->whereHas('assignations', function($query) use ($eleve) {
            $query->where('classe_id', $eleve->classe_id)
                  ->where('statut', 'active');
        })
        ->orWhere(function($query) use ($eleve) {
            // Fallback pour les cours sans assignation spécifique
            $query->where('niveau_id', $eleve->classe->niveau_id)
                  ->where('annee_scolaire_id', $eleve->classe->annee_scolaire_id)
                  ->whereDoesntHave('assignations');
        })
        ->actifs()
        ->get();
    }

    /**
     * Calculer les statistiques de notes pour un élève et ses cours
     */
    public function getStatistiquesNotes(User $eleve, Collection $cours): array
    {
        $statistiques = [];
        
        // Récupérer toutes les notes de l'élève en une seule requête
        $notes = Note::where('eleve_id', $eleve->id)
            ->whereIn('matiere_id', $cours->pluck('matiere_id'))
            ->select('matiere_id', 'note', 'coefficient', 'date_evaluation', 'type_evaluation', 'appreciation')
            ->orderBy('date_evaluation', 'desc')
            ->get()
            ->groupBy('matiere_id');

        foreach ($cours as $coursItem) {
            $notesMatiere = $notes->get($coursItem->matiere_id, collect([]));
            
            $moyenne = $notesMatiere->isNotEmpty() 
                ? round($notesMatiere->avg('note'), 1) 
                : null;
            
            $derniereNote = $notesMatiere->first();
            
            $statistiques[$coursItem->id] = [
                'moyenne' => $moyenne,
                'nombre_notes' => $notesMatiere->count(),
                'derniere_note' => $derniereNote ? [
                    'note' => $derniereNote->note,
                    'type_evaluation' => $derniereNote->type_evaluation,
                    'date_evaluation' => $derniereNote->date_evaluation->format('d/m/Y'),
                    'appreciation' => $derniereNote->appreciation,
                ] : null,
            ];
        }

        return $statistiques;
    }

    /**
     * Formater les données de cours pour l'API
     */
    public function formaterCours(Collection $cours, array $statistiques): Collection
    {
        return $cours->map(function ($coursItem) use ($statistiques) {
            $stats = $statistiques[$coursItem->id] ?? [
                'moyenne' => null,
                'nombre_notes' => 0,
                'derniere_note' => null
            ];

            $assignation = $coursItem->assignations->first();
            
            return [
                'id' => $coursItem->id,
                'titre' => $coursItem->titre,
                'description' => $coursItem->description,
                'matiere' => [
                    'id' => $coursItem->matiere->id,
                    'nom' => $coursItem->matiere->nom,
                    'code' => $coursItem->matiere->code ?? $coursItem->matiere->nom,
                    'coefficient' => $coursItem->matiere->coefficient ?? 1,
                ],
                'niveau' => [
                    'id' => $coursItem->niveau->id,
                    'nom' => $coursItem->niveau->nom,
                    'cycle' => $coursItem->niveau->cycle ?? 'Non défini',
                ],
                'professeur' => $coursItem->professeurs->first() ? [
                    'nom' => $coursItem->professeurs->first()->nom,
                    'prenom' => $coursItem->professeurs->first()->prenom,
                    'nom_complet' => $coursItem->professeurs->first()->prenom . ' ' . $coursItem->professeurs->first()->nom,
                ] : null,
                'statut' => $coursItem->statut,
                'statut_libelle' => $coursItem->statut_libelle,
                'heures_par_semaine' => $assignation ? $assignation->heures_par_semaine : $coursItem->heures_par_semaine,
                'coefficient' => $coursItem->coefficient,
                'moyenne' => $stats['moyenne'],
                'nombre_notes' => $stats['nombre_notes'],
                'derniere_note' => $stats['derniere_note'],
                'assignation' => $assignation ? [
                    'heures_par_semaine' => $assignation->heures_par_semaine,
                    'remarques' => $assignation->remarques,
                ] : null,
            ];
        });
    }

    /**
     * Calculer les statistiques générales
     */
    public function calculerStatistiquesGenerales(Collection $coursFormates): array
    {
        $coursAvecNotes = $coursFormates->where('moyenne', '!=', null);
        
        return [
            'total_cours' => $coursFormates->count(),
            'moyenne_generale' => $coursAvecNotes->isNotEmpty() 
                ? round($coursAvecNotes->avg('moyenne'), 1) 
                : null,
            'cours_avec_notes' => $coursAvecNotes->count(),
            'cours_sans_notes' => $coursFormates->where('nombre_notes', '=', 0)->count(),
        ];
    }

    /**
     * Nettoyer les données inutiles pour optimiser la réponse
     */
    public function nettoyerDonnees(array $data): array
    {
        // Supprimer les champs null ou vides pour réduire la taille de la réponse
        return array_filter($data, function($value) {
            if (is_array($value)) {
                return !empty($value);
            }
            return $value !== null && $value !== '';
        });
    }
}