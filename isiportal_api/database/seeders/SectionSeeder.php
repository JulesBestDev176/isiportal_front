<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Section;

class SectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sections = [
            [
                'nom' => 'Collège',
                'description' => 'Section collège (6ème à 3ème)',
                'niveaux' => ['6ème', '5ème', '4ème', '3ème'],
                'statut' => 'active',
            ],
            [
                'nom' => 'Lycée',
                'description' => 'Section lycée (2nde à Terminale)',
                'niveaux' => ['2nde', '1ère', 'Terminale'],
                'statut' => 'active',
            ],
            [
                'nom' => 'Primaire',
                'description' => 'Section primaire (CP à CM2)',
                'niveaux' => ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
                'statut' => 'inactive',
            ],
        ];

        foreach ($sections as $section) {
            Section::create($section);
        }

        $this->command->info('Sections créées avec succès !');
    }
} 