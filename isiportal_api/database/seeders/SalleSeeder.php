<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Salle;
use App\Models\Batiment;

class SalleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $batiments = Batiment::all();

        // Salles de cours standard
        foreach ($batiments as $batiment) {
            if (in_array($batiment->nom, ['Bâtiment B - Collège', 'Bâtiment C - Lycée'])) {
                for ($i = 1; $i <= 8; $i++) {
                    Salle::create([
                        'nom' => "Salle {$i}",
                        'numero' => "{$batiment->id}0{$i}",
                        'capacite' => rand(25, 35),
                        'type' => 'salle_cours',
                        'equipements' => ['tableau', 'projecteur', 'ordinateur'],
                        'statut' => 'disponible',
                        'batiment_id' => $batiment->id
                    ]);
                }
            }
        }

        // Laboratoires (Bâtiment D)
        $batimentSciences = $batiments->where('nom', 'Bâtiment D - Sciences')->first();
        if ($batimentSciences) {
            $laboratoires = [
                ['nom' => 'Labo Physique', 'type' => 'laboratoire', 'capacite' => 20],
                ['nom' => 'Labo Chimie', 'type' => 'laboratoire', 'capacite' => 20],
                ['nom' => 'Labo SVT', 'type' => 'laboratoire', 'capacite' => 25],
            ];

            foreach ($laboratoires as $labo) {
                Salle::create([
                    'nom' => $labo['nom'],
                    'numero' => "D{$labo['type']}",
                    'capacite' => $labo['capacite'],
                    'type' => $labo['type'],
                    'equipements' => ['paillasses', 'sorbonne', 'microscopes', 'projecteur'],
                    'statut' => 'disponible',
                    'batiment_id' => $batimentSciences->id
                ]);
            }
        }

        // Salles informatiques (Bâtiment F)
        $batimentInfo = $batiments->where('nom', 'Bâtiment F - Informatique')->first();
        if ($batimentInfo) {
            for ($i = 1; $i <= 3; $i++) {
                Salle::create([
                    'nom' => "Salle Info {$i}",
                    'numero' => "F{$i}",
                    'capacite' => 20,
                    'type' => 'salle_info',
                    'equipements' => ['ordinateurs', 'projecteur', 'imprimante'],
                    'statut' => 'disponible',
                    'batiment_id' => $batimentInfo->id
                ]);
            }
        }

        // Salles d'arts et musique (Bâtiment E)
        $batimentArts = $batiments->where('nom', 'Bâtiment E - Arts et Sports')->first();
        if ($batimentArts) {
            $sallesSpecialisees = [
                ['nom' => 'Salle Arts Plastiques', 'type' => 'salle_arts', 'capacite' => 25],
                ['nom' => 'Salle Musique', 'type' => 'salle_musique', 'capacite' => 30],
                ['nom' => 'Gymnase', 'type' => 'salle_sport', 'capacite' => 50],
                ['nom' => 'Salle de Danse', 'type' => 'salle_sport', 'capacite' => 30],
            ];

            foreach ($sallesSpecialisees as $salle) {
                Salle::create([
                    'nom' => $salle['nom'],
                    'numero' => "E{$salle['type']}",
                    'capacite' => $salle['capacite'],
                    'type' => $salle['type'],
                    'equipements' => ['projecteur', 'sonorisation'],
                    'statut' => 'disponible',
                    'batiment_id' => $batimentArts->id
                ]);
            }
        }

        // Amphithéâtre (Bâtiment A)
        $batimentAdmin = $batiments->where('nom', 'Bâtiment A - Administration')->first();
        if ($batimentAdmin) {
            Salle::create([
                'nom' => 'Amphithéâtre Principal',
                'numero' => 'A001',
                'capacite' => 150,
                'type' => 'amphitheatre',
                'equipements' => ['projecteur', 'sonorisation', 'micros', 'écran géant'],
                'statut' => 'disponible',
                'batiment_id' => $batimentAdmin->id
            ]);

            Salle::create([
                'nom' => 'Salle de Réunion',
                'numero' => 'A002',
                'capacite' => 20,
                'type' => 'salle_reunion',
                'equipements' => ['tableau', 'projecteur', 'vidéoconférence'],
                'statut' => 'disponible',
                'batiment_id' => $batimentAdmin->id
            ]);
        }
    }
} 