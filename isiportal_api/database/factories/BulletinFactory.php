<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bulletin>
 */
class BulletinFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $matieres = [
            [
                'nom' => 'Mathématiques',
                'moyenne' => $this->faker->randomFloat(2, 8, 18),
                'coefficient' => 4,
                'appreciation' => $this->faker->sentence()
            ],
            [
                'nom' => 'Français',
                'moyenne' => $this->faker->randomFloat(2, 8, 18),
                'coefficient' => 3,
                'appreciation' => $this->faker->sentence()
            ],
            [
                'nom' => 'Histoire-Géographie',
                'moyenne' => $this->faker->randomFloat(2, 8, 18),
                'coefficient' => 2,
                'appreciation' => $this->faker->sentence()
            ],
            [
                'nom' => 'Anglais',
                'moyenne' => $this->faker->randomFloat(2, 8, 18),
                'coefficient' => 2,
                'appreciation' => $this->faker->sentence()
            ],
            [
                'nom' => 'SVT',
                'moyenne' => $this->faker->randomFloat(2, 8, 18),
                'coefficient' => 2,
                'appreciation' => $this->faker->sentence()
            ]
        ];

        return [
            'eleve_id' => User::factory()->eleve(),
            'annee_scolaire' => $this->faker->randomElement(['2023-2024', '2024-2025']),
            'semestre' => $this->faker->randomElement([1, 2]),
            'moyenne' => 0, // Sera calculée automatiquement
            'matieres' => $matieres,
            'appreciation' => $this->faker->paragraph(),
            'date_creation' => now(),
            'date_modification' => now(),
        ];
    }

    /**
     * Créer un bulletin avec une bonne moyenne
     */
    public function bonneMoyenne(): static
    {
        return $this->state(fn (array $attributes) => [
            'matieres' => [
                [
                    'nom' => 'Mathématiques',
                    'moyenne' => $this->faker->randomFloat(2, 14, 18),
                    'coefficient' => 4,
                    'appreciation' => 'Très bon travail'
                ],
                [
                    'nom' => 'Français',
                    'moyenne' => $this->faker->randomFloat(2, 14, 18),
                    'coefficient' => 3,
                    'appreciation' => 'Excellent niveau'
                ],
                [
                    'nom' => 'Histoire-Géographie',
                    'moyenne' => $this->faker->randomFloat(2, 14, 18),
                    'coefficient' => 2,
                    'appreciation' => 'Bon travail'
                ]
            ]
        ]);
    }

    /**
     * Créer un bulletin avec une moyenne moyenne
     */
    public function moyenneMoyenne(): static
    {
        return $this->state(fn (array $attributes) => [
            'matieres' => [
                [
                    'nom' => 'Mathématiques',
                    'moyenne' => $this->faker->randomFloat(2, 10, 13),
                    'coefficient' => 4,
                    'appreciation' => 'Travail correct'
                ],
                [
                    'nom' => 'Français',
                    'moyenne' => $this->faker->randomFloat(2, 10, 13),
                    'coefficient' => 3,
                    'appreciation' => 'Peut mieux faire'
                ],
                [
                    'nom' => 'Histoire-Géographie',
                    'moyenne' => $this->faker->randomFloat(2, 10, 13),
                    'coefficient' => 2,
                    'appreciation' => 'Efforts à fournir'
                ]
            ]
        ]);
    }

    /**
     * Créer un bulletin avec une faible moyenne
     */
    public function faibleMoyenne(): static
    {
        return $this->state(fn (array $attributes) => [
            'matieres' => [
                [
                    'nom' => 'Mathématiques',
                    'moyenne' => $this->faker->randomFloat(2, 5, 9),
                    'coefficient' => 4,
                    'appreciation' => 'Difficultés importantes'
                ],
                [
                    'nom' => 'Français',
                    'moyenne' => $this->faker->randomFloat(2, 5, 9),
                    'coefficient' => 3,
                    'appreciation' => 'Travail insuffisant'
                ],
                [
                    'nom' => 'Histoire-Géographie',
                    'moyenne' => $this->faker->randomFloat(2, 5, 9),
                    'coefficient' => 2,
                    'appreciation' => 'Remise en question nécessaire'
                ]
            ]
        ]);
    }

    /**
     * Créer un bulletin du premier semestre
     */
    public function premierSemestre(): static
    {
        return $this->state(fn (array $attributes) => [
            'semestre' => 1,
        ]);
    }

    /**
     * Créer un bulletin du deuxième semestre
     */
    public function deuxiemeSemestre(): static
    {
        return $this->state(fn (array $attributes) => [
            'semestre' => 2,
        ]);
    }

    /**
     * Créer un bulletin pour une année scolaire spécifique
     */
    public function anneeScolaire(string $annee): static
    {
        return $this->state(fn (array $attributes) => [
            'annee_scolaire' => $annee,
        ]);
    }
} 