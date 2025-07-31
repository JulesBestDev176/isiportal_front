<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Salle;
use App\Models\Batiment;

class SallesSeeder extends Seeder
{
    public function run()
    {
        $batiments = Batiment::all()->keyBy('code');
        
        $salles = [
            // Bâtiment A - Administration
            ['nom' => 'Bureau Directeur', 'code' => 'A101', 'batiment' => 'BAT-A', 'etage' => 1, 'capacite' => 10, 'type' => 'bureau'],
            ['nom' => 'Salle de Réunion', 'code' => 'A102', 'batiment' => 'BAT-A', 'etage' => 1, 'capacite' => 20, 'type' => 'reunion'],
            ['nom' => 'Secrétariat', 'code' => 'A103', 'batiment' => 'BAT-A', 'etage' => 1, 'capacite' => 5, 'type' => 'bureau'],
            
            // Bâtiment B - Informatique
            ['nom' => 'Labo Info 1', 'code' => 'B101', 'batiment' => 'BAT-B', 'etage' => 1, 'capacite' => 30, 'type' => 'laboratoire'],
            ['nom' => 'Labo Info 2', 'code' => 'B102', 'batiment' => 'BAT-B', 'etage' => 1, 'capacite' => 30, 'type' => 'laboratoire'],
            ['nom' => 'Labo Info 3', 'code' => 'B103', 'batiment' => 'BAT-B', 'etage' => 1, 'capacite' => 25, 'type' => 'laboratoire'],
            ['nom' => 'Salle TP Réseaux', 'code' => 'B201', 'batiment' => 'BAT-B', 'etage' => 2, 'capacite' => 20, 'type' => 'laboratoire'],
            ['nom' => 'Salle Projet', 'code' => 'B202', 'batiment' => 'BAT-B', 'etage' => 2, 'capacite' => 15, 'type' => 'projet'],
            ['nom' => 'Salle Cours Info 1', 'code' => 'B301', 'batiment' => 'BAT-B', 'etage' => 3, 'capacite' => 40, 'type' => 'cours'],
            ['nom' => 'Salle Cours Info 2', 'code' => 'B302', 'batiment' => 'BAT-B', 'etage' => 3, 'capacite' => 40, 'type' => 'cours'],
            ['nom' => 'Salle Cours Info 3', 'code' => 'B303', 'batiment' => 'BAT-B', 'etage' => 3, 'capacite' => 35, 'type' => 'cours'],
            
            // Bâtiment C - Sciences
            ['nom' => 'Salle Math 1', 'code' => 'C101', 'batiment' => 'BAT-C', 'etage' => 1, 'capacite' => 45, 'type' => 'cours'],
            ['nom' => 'Salle Math 2', 'code' => 'C102', 'batiment' => 'BAT-C', 'etage' => 1, 'capacite' => 45, 'type' => 'cours'],
            ['nom' => 'Salle Physique', 'code' => 'C103', 'batiment' => 'BAT-C', 'etage' => 1, 'capacite' => 40, 'type' => 'cours'],
            ['nom' => 'Labo Physique', 'code' => 'C201', 'batiment' => 'BAT-C', 'etage' => 2, 'capacite' => 25, 'type' => 'laboratoire'],
            ['nom' => 'Salle TD Math', 'code' => 'C202', 'batiment' => 'BAT-C', 'etage' => 2, 'capacite' => 30, 'type' => 'td'],
            ['nom' => 'Salle Statistiques', 'code' => 'C301', 'batiment' => 'BAT-C', 'etage' => 3, 'capacite' => 35, 'type' => 'cours'],
            
            // Bâtiment D - Amphithéâtres
            ['nom' => 'Amphithéâtre A', 'code' => 'D101', 'batiment' => 'BAT-D', 'etage' => 1, 'capacite' => 150, 'type' => 'amphitheatre'],
            ['nom' => 'Amphithéâtre B', 'code' => 'D102', 'batiment' => 'BAT-D', 'etage' => 1, 'capacite' => 120, 'type' => 'amphitheatre'],
            ['nom' => 'Grand Amphithéâtre', 'code' => 'D201', 'batiment' => 'BAT-D', 'etage' => 2, 'capacite' => 200, 'type' => 'amphitheatre'],
            
            // Bibliothèque
            ['nom' => 'Salle de Lecture', 'code' => 'BIB101', 'batiment' => 'BIBLIO', 'etage' => 1, 'capacite' => 80, 'type' => 'bibliotheque'],
            ['nom' => 'Salle Multimédia', 'code' => 'BIB201', 'batiment' => 'BIBLIO', 'etage' => 2, 'capacite' => 30, 'type' => 'multimedia'],
            
            // Salles supplémentaires
            ['nom' => 'Salle Langues 1', 'code' => 'B401', 'batiment' => 'BAT-B', 'etage' => 4, 'capacite' => 25, 'type' => 'cours'],
            ['nom' => 'Salle Langues 2', 'code' => 'B402', 'batiment' => 'BAT-B', 'etage' => 4, 'capacite' => 25, 'type' => 'cours'],
            ['nom' => 'Salle Conférence', 'code' => 'A201', 'batiment' => 'BAT-A', 'etage' => 2, 'capacite' => 50, 'type' => 'conference']
        ];

        foreach ($salles as $salleData) {
            $batiment = $batiments[$salleData['batiment']] ?? null;
            
            if ($batiment) {
                Salle::create([
                    'nom' => $salleData['nom'],
                    'code' => $salleData['code'],
                    'batiment_id' => $batiment->id,
                    'etage' => $salleData['etage'],
                    'capacite' => $salleData['capacite'],
                    'type' => $salleData['type'],
                    'equipements' => json_encode($this->getEquipements($salleData['type'])),
                    'statut' => 'disponible'
                ]);
            }
        }

        $this->command->info('Salles créées avec succès!');
    }

    private function getEquipements($type)
    {
        $equipements = [
            'cours' => ['tableau', 'projecteur', 'ordinateur', 'sono'],
            'laboratoire' => ['ordinateurs', 'réseau', 'logiciels', 'imprimante'],
            'amphitheatre' => ['micro', 'projecteur', 'écran géant', 'sono', 'éclairage'],
            'td' => ['tableau', 'chaises mobiles'],
            'bureau' => ['bureau', 'chaises', 'ordinateur', 'téléphone'],
            'reunion' => ['table de réunion', 'projecteur', 'écran', 'téléconférence'],
            'bibliotheque' => ['tables', 'chaises', 'étagères', 'ordinateurs'],
            'multimedia' => ['ordinateurs', 'casques', 'logiciels', 'internet'],
            'conference' => ['podium', 'micro', 'projecteur', 'sono', 'éclairage'],
            'projet' => ['tables modulables', 'tableau blanc', 'prises électriques']
        ];

        return $equipements[$type] ?? ['équipement de base'];
    }
}