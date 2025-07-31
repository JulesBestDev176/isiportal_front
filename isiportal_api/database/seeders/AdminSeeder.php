<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        $admins = [
            [
                'nom' => 'DIOP',
                'prenom' => 'Amadou',
                'email' => 'admin@isiportal.sn',
                'password' => Hash::make('admin123'),
                'role' => 'administrateur',
                'telephone' => '77 123 45 67',
                'adresse' => 'Dakar, Sénégal',
                'date_naissance' => '1980-05-15',
                'email_verified_at' => now()
            ],
            [
                'nom' => 'FALL',
                'prenom' => 'Fatou',
                'email' => 'gestionnaire@isiportal.sn',
                'password' => Hash::make('gestionnaire123'),
                'role' => 'gestionnaire',
                'telephone' => '77 234 56 78',
                'adresse' => 'Dakar, Sénégal',
                'date_naissance' => '1985-08-22',
                'email_verified_at' => now()
            ],
            [
                'nom' => 'NDIAYE',
                'prenom' => 'Moussa',
                'email' => 'directeur@isiportal.sn',
                'password' => Hash::make('directeur123'),
                'role' => 'administrateur',
                'telephone' => '77 345 67 89',
                'adresse' => 'Dakar, Sénégal',
                'date_naissance' => '1975-12-10',
                'email_verified_at' => now()
            ]
        ];

        foreach ($admins as $admin) {
            User::create($admin);
            $this->command->info("Administrateur créé: {$admin['prenom']} {$admin['nom']} ({$admin['email']})");
        }

        $this->command->info('Comptes administrateurs créés avec succès!');
        $this->command->warn('Mots de passe par défaut:');
        $this->command->warn('- admin@isiportal.sn : admin123');
        $this->command->warn('- gestionnaire@isiportal.sn : gestionnaire123');
        $this->command->warn('- directeur@isiportal.sn : directeur123');
    }
}