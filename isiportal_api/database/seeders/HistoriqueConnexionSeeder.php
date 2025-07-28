<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\HistoriqueConnexion;
use App\Models\User;

class HistoriqueConnexionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $utilisateurs = User::all();

        foreach ($utilisateurs as $utilisateur) {
            // Créer 5-15 connexions par utilisateur
            $nombreConnexions = rand(5, 15);
            
            for ($i = 0; $i < $nombreConnexions; $i++) {
                HistoriqueConnexion::create([
                    'user_id' => $utilisateur->id,
                    'date_connexion' => now()->subDays(rand(1, 90)),
                    'ip_address' => '192.168.1.' . rand(1, 255),
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'plateforme' => 'web',
                    'statut' => 'reussie',
                    'remarques' => rand(1, 100) <= 20 ? 'Connexion depuis le bureau' : null,
                ]);
            }
        }

        $this->command->info('Historique des connexions créé avec succès !');
    }
} 