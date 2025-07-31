<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Niveau;
use App\Models\Matiere;
use App\Models\AnneeScolaire;
use App\Models\Classe;
use App\Models\Cours;
use App\Models\Note;
use App\Models\Notification;
use Illuminate\Support\Facades\DB;

class DashboardDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Créer les niveaux (si pas déjà existants)
        $niveaux = [
            ['nom' => '6ème', 'code' => '6EME', 'cycle' => 'college', 'ordre' => 1, 'statut' => 'active'],
            ['nom' => '5ème', 'code' => '5EME', 'cycle' => 'college', 'ordre' => 2, 'statut' => 'active'],
            ['nom' => '4ème', 'code' => '4EME', 'cycle' => 'college', 'ordre' => 3, 'statut' => 'active'],
            ['nom' => '3ème', 'code' => '3EME', 'cycle' => 'college', 'ordre' => 4, 'statut' => 'active'],
        ];

        foreach ($niveaux as $niveau) {
            Niveau::firstOrCreate(['code' => $niveau['code']], $niveau);
        }

        // 2. Créer les matières (si pas déjà existantes)
        $matieres = [
            ['nom' => 'Mathématiques', 'code' => 'MATH', 'coefficient' => 4.0, 'heures_par_semaine' => 5, 'statut' => 'active'],
            ['nom' => 'Français', 'code' => 'FRAN', 'coefficient' => 4.0, 'heures_par_semaine' => 5, 'statut' => 'active'],
            ['nom' => 'Histoire-Géographie', 'code' => 'HIST', 'coefficient' => 3.0, 'heures_par_semaine' => 4, 'statut' => 'active'],
            ['nom' => 'Anglais', 'code' => 'ANGL', 'coefficient' => 3.0, 'heures_par_semaine' => 4, 'statut' => 'active'],
            ['nom' => 'Sciences Physiques', 'code' => 'PC', 'coefficient' => 3.0, 'heures_par_semaine' => 3, 'statut' => 'active'],
        ];

        foreach ($matieres as $matiere) {
            Matiere::firstOrCreate(['code' => $matiere['code']], $matiere);
        }

        // 3. Créer année scolaire si pas déjà créée
        if (!AnneeScolaire::exists()) {
            AnneeScolaire::create([
                'nom' => '2024-2025',
                'date_debut' => '2024-09-01',
                'date_fin' => '2025-06-30',
                'statut' => 'active'
            ]);
        }

        // 4. Créer les classes (si pas déjà existantes)
        $niveauxIds = Niveau::pluck('id', 'code');
        $classes = [
            ['nom' => '6ème A', 'niveau_id' => $niveauxIds['6EME'], 'effectif_max' => 30, 'annee_scolaire_id' => 1, 'statut' => 'active'],
            ['nom' => '5ème A', 'niveau_id' => $niveauxIds['5EME'], 'effectif_max' => 30, 'annee_scolaire_id' => 1, 'statut' => 'active'],
            ['nom' => '4ème A', 'niveau_id' => $niveauxIds['4EME'], 'effectif_max' => 30, 'annee_scolaire_id' => 1, 'statut' => 'active'],
            ['nom' => '3ème A', 'niveau_id' => $niveauxIds['3EME'], 'effectif_max' => 30, 'annee_scolaire_id' => 1, 'statut' => 'active'],
        ];

        foreach ($classes as $classe) {
            Classe::firstOrCreate(['nom' => $classe['nom'], 'annee_scolaire_id' => $classe['annee_scolaire_id']], $classe);
        }

        // 5. Créer des professeurs
        $professeurs = [
            ['nom' => 'Diop', 'prenom' => 'Aminata', 'email' => 'aminata.diop@isiportal.com', 'matiere_id' => 1],
            ['nom' => 'Ndiaye', 'prenom' => 'Moussa', 'email' => 'moussa.ndiaye@isiportal.com', 'matiere_id' => 2],
            ['nom' => 'Fall', 'prenom' => 'Fatou', 'email' => 'fatou.fall@isiportal.com', 'matiere_id' => 3],
            ['nom' => 'Sow', 'prenom' => 'Ibrahima', 'email' => 'ibrahima.sow@isiportal.com', 'matiere_id' => 4],
            ['nom' => 'Ba', 'prenom' => 'Aissatou', 'email' => 'aissatou.ba@isiportal.com', 'matiere_id' => 5],
        ];

        foreach ($professeurs as $prof) {
            User::firstOrCreate(
                ['email' => $prof['email']],
                [
                    'nom' => $prof['nom'],
                    'prenom' => $prof['prenom'],
                    'password' => bcrypt('password123'),
                    'role' => 'professeur',
                    'actif' => true,
                    'telephone' => '77 ' . rand(100, 999) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                    'adresse' => 'Dakar, Sénégal',
                ]
            );
        }

        // 6. Créer des parents et élèves
        $nomsEleves = ['Diallo', 'Sy', 'Cissé', 'Touré', 'Kane', 'Wade', 'Mbaye', 'Diouf'];
        $prenomsGarcons = ['Moussa', 'Ibrahima', 'Ousmane', 'Mamadou', 'Abdoulaye', 'Cheikh'];
        $prenomsFilles = ['Aminata', 'Fatou', 'Aissatou', 'Khady', 'Mariama', 'Awa'];

        for ($i = 3; $i <= 15; $i++) {
            // Créer parent
            $parent = User::firstOrCreate(
                ['email' => "parent{$i}@test.com"],
                [
                    'nom' => $nomsEleves[array_rand($nomsEleves)],
                    'prenom' => $i % 2 ? $prenomsGarcons[array_rand($prenomsGarcons)] : $prenomsFilles[array_rand($prenomsFilles)],
                    'password' => bcrypt('parent123'),
                    'role' => 'parent',
                    'actif' => true,
                    'telephone' => '77 ' . rand(100, 999) . ' ' . rand(10, 99) . ' ' . rand(10, 99),
                    'adresse' => 'Dakar, Sénégal',
                    'profession' => ['Commerçant', 'Enseignant', 'Infirmier', 'Chauffeur', 'Couturier'][array_rand(['Commerçant', 'Enseignant', 'Infirmier', 'Chauffeur', 'Couturier'])],
                ]
            );

            // Créer élève
            $isGirl = rand(0, 1);
            $eleve = User::firstOrCreate(
                ['email' => "eleve{$i}@test.com"],
                [
                    'nom' => $parent->nom,
                    'prenom' => $isGirl ? $prenomsFilles[array_rand($prenomsFilles)] : $prenomsGarcons[array_rand($prenomsGarcons)],
                    'password' => bcrypt('eleve123'),
                    'role' => 'eleve',
                    'actif' => true,
                    'classe_id' => rand(1, 4),
                    'date_naissance' => now()->subYears(rand(11, 15)),
                    'lieu_naissance' => 'Dakar, Sénégal',
                    'numero_etudiant' => 'E2024' . str_pad($i, 4, '0', STR_PAD_LEFT),
                    'parents_ids' => [$parent->id],
                ]
            );

            // Créer relation parent-enfant si elle n'existe pas
            if (!DB::table('user_parents')->where('parent_id', $parent->id)->where('eleve_id', $eleve->id)->exists()) {
                DB::table('user_parents')->insert([
                    'parent_id' => $parent->id,
                    'eleve_id' => $eleve->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // 7. Créer des cours
        $matieres = Matiere::all();
        $niveaux = Niveau::all();
        foreach ($matieres as $matiere) {
            foreach ($niveaux as $niveau) {
                Cours::create([
                    'titre' => $matiere->nom . ' - ' . $niveau->nom,
                    'matiere_id' => $matiere->id,
                    'niveau_id' => $niveau->id,
                    'annee_scolaire_id' => 1,
                    'description' => 'Cours de ' . $matiere->nom . ' pour ' . $niveau->nom,
                    'statut' => 'en_cours',
                    'coefficient' => $matiere->coefficient,
                    'heures_par_semaine' => $matiere->heures_par_semaine,
                    'semestres_ids' => [1, 2],
                ]);
            }
        }

        // 8. Créer des notes
        $eleves = User::where('role', 'eleve')->get();
        $cours = Cours::all();
        $typesEvaluation = ['devoir', 'composition', 'interrogation', 'tp'];

        foreach ($eleves as $eleve) {
            foreach ($cours->take(3) as $cours_item) {
                for ($j = 0; $j < rand(3, 6); $j++) {
                    Note::create([
                        'eleve_id' => $eleve->id,
                        'cours_id' => $cours_item->id,
                        'matiere_id' => $cours_item->matiere_id,
                        'annee_scolaire_id' => 1,
                        'semestre' => rand(1, 2),
                        'type_evaluation' => $typesEvaluation[array_rand($typesEvaluation)],
                        'note' => rand(8, 20) + (rand(0, 9) / 10),
                        'coefficient' => rand(1, 3),
                        'appreciation' => ['Très bien', 'Bien', 'Assez bien', 'Peut mieux faire', 'Insuffisant'][array_rand(['Très bien', 'Bien', 'Assez bien', 'Peut mieux faire', 'Insuffisant'])],
                        'date_evaluation' => now()->subDays(rand(1, 90)),
                    ]);
                }
            }
        }

        // 9. Créer des notifications
        $users = User::whereIn('role', ['parent', 'eleve'])->get();
        $typesNotif = ['info', 'warning', 'success'];
        $priorites = ['normale', 'haute', 'basse'];

        $notifications = [
            ['titre' => 'Nouvelle note disponible', 'contenu' => 'Une nouvelle note a été ajoutée à votre bulletin.'],
            ['titre' => 'Réunion parents-professeurs', 'contenu' => 'Réunion prévue le 15 février à 18h en salle polyvalente.'],
            ['titre' => 'Sortie pédagogique', 'contenu' => 'Sortie au musée des sciences prévue la semaine prochaine.'],
            ['titre' => 'Résultats examens', 'contenu' => 'Les résultats du contrôle de mathématiques sont disponibles.'],
            ['titre' => 'Absence signalée', 'contenu' => 'Votre enfant était absent ce matin. Merci de justifier.'],
        ];

        foreach ($users->take(10) as $user) {
            foreach ($notifications as $notif) {
                Notification::create([
                    'titre' => $notif['titre'],
                    'contenu' => $notif['contenu'],
                    'type' => $typesNotif[array_rand($typesNotif)],
                    'priorite' => $priorites[array_rand($priorites)],
                    'destinataire_id' => $user->id,
                    'destinataire_roles' => [$user->role],
                    'expediteur_id' => 1,
                    'lue' => rand(0, 1),
                    'date_envoi' => now()->subDays(rand(1, 30)),
                    'date_creation' => now()->subDays(rand(1, 30)),
                ]);
            }
        }

        $this->command->info('Données du dashboard créées avec succès !');
        $this->command->info('- ' . User::where('role', 'parent')->count() . ' parents');
        $this->command->info('- ' . User::where('role', 'eleve')->count() . ' élèves');
        $this->command->info('- ' . Note::count() . ' notes');
        $this->command->info('- ' . Notification::count() . ' notifications');
    }
}