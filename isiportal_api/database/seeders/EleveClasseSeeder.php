<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Classe;
use Illuminate\Support\Facades\Hash;

class EleveClasseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Créer des élèves s'ils n'existent pas
        $elevesExistants = User::where('role', 'eleve')->count();
        
        if ($elevesExistants === 0) {
            $this->command->info('Création d\'élèves...');
            
            // Créer 200 élèves avec des noms plus réalistes
            $prenoms = ['Lucas', 'Emma', 'Hugo', 'Léa', 'Jules', 'Chloé', 'Arthur', 'Jade', 'Louis', 'Alice', 'Raphaël', 'Inès', 'Adam', 'Louise', 'Paul', 'Eva', 'Antoine', 'Zoé', 'Nathan', 'Camille', 'Théo', 'Lola', 'Ethan', 'Sarah', 'Tom', 'Clara', 'Noah', 'Julia', 'Liam', 'Mia', 'Gabriel', 'Nina', 'Léo', 'Anaïs', 'Alexandre', 'Élise', 'Victor', 'Manon', 'Romain', 'Léna', 'Enzo', 'Maëlys', 'Baptiste', 'Agathe', 'Valentin', 'Romane', 'Maxime', 'Léonie', 'Clément', 'Margaux', 'Thomas', 'Océane'];
            $noms = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia', 'David', 'Bertrand', 'Roux', 'Vincent', 'Fournier', 'Morel', 'Girard', 'Andre', 'Lefevre', 'Mercier', 'Dupont', 'Lambert', 'Bonnet', 'Francois', 'Martinez', 'Legrand', 'Garnier', 'Faure', 'Rousseau', 'Blanc', 'Guerin', 'Muller', 'Henry', 'Roussel', 'Nicolas', 'Perrin', 'Morin', 'Mathieu', 'Clement', 'Gauthier', 'Dumont', 'Lopez', 'Fontaine', 'Chevalier', 'Robin', 'Meyer'];
            
            for ($i = 1; $i <= 200; $i++) {
                $prenom = $prenoms[array_rand($prenoms)];
                $nom = $noms[array_rand($noms)];
                
                User::create([
                    'nom' => $nom,
                    'prenom' => $prenom,
                    'email' => strtolower($prenom) . '.' . strtolower($nom) . $i . '@isiportal.com',
                    'password' => Hash::make('password123'),
                    'role' => 'eleve',
                    'actif' => true,
                    'doit_changer_mot_de_passe' => false,
                    'date_naissance' => now()->subYears(rand(12, 18)),
                    'adresse' => 'Adresse ' . $i . ', Paris',
                    'telephone' => '0' . rand(100000000, 999999999),
                ]);
            }
            
            $this->command->info('200 élèves créés avec succès!');
        }
        
        // Récupérer toutes les classes
        $classes = Classe::all();
        
        // Récupérer tous les élèves
        $eleves = User::where('role', 'eleve')->get();
        
        // Vider la table eleve_classe
        DB::table('eleve_classe')->truncate();
        
        // Répartir les élèves entre les classes
        $elevesParClasse = ceil($eleves->count() / $classes->count());
        $elevesRestants = $eleves;
        
        foreach ($classes as $classe) {
            // Prendre un nombre aléatoire d'élèves pour cette classe (entre 15 et 30)
            $nombreEleves = rand(15, 30);
            $elevesClasse = $elevesRestants->take($nombreEleves);
            
            foreach ($elevesClasse as $eleve) {
                // Créer une association élève-classe
                DB::table('eleve_classe')->insert([
                    'eleve_id' => $eleve->id,
                    'classe_id' => $classe->id,
                    'annee_scolaire_id' => 1, // Année scolaire active
                    'date_inscription' => now(),
                    'statut' => 'inscrit',
                    'moyenne_annuelle' => rand(8, 18), // Moyenne entre 8 et 18
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                
                // Mettre à jour le classe_id de l'élève dans la table users
                $eleve->update([
                    'classe_id' => $classe->id
                ]);
            }
            
            // Mettre à jour l'effectif de la classe
            $classe->update([
                'effectif_actuel' => $elevesClasse->count()
            ]);
            
            // Retirer les élèves utilisés de la liste
            $elevesRestants = $elevesRestants->diff($elevesClasse);
        }
        
        $this->command->info('Élèves associés aux classes avec succès!');
        $this->command->info('Effectifs des classes mis à jour!');
    }
} 