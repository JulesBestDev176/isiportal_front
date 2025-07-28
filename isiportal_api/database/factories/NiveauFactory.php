<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Niveau>
 */
class NiveauFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement(['6ème', '5ème', '4ème', '3ème', '2nde', '1ère', 'Terminale']),
            'code' => $this->faker->unique()->regexify('[A-Z]{4}'),
            'description' => $this->faker->sentence(),
            'cycle' => $this->faker->randomElement(['college', 'lycee']),
            'ordre' => $this->faker->numberBetween(1, 7),
            'statut' => 'active',
            'matieres_ids' => [1, 2, 3, 4, 5],
            'date_creation' => now(),
        ];
    }

    /**
     * Créer un niveau collège
     */
    public function college(): static
    {
        return $this->state(fn (array $attributes) => [
            'cycle' => 'college',
            'nom' => $this->faker->randomElement(['6ème', '5ème', '4ème', '3ème']),
            'ordre' => $this->faker->numberBetween(1, 4),
        ]);
    }

    /**
     * Créer un niveau lycée
     */
    public function lycee(): static
    {
        return $this->state(fn (array $attributes) => [
            'cycle' => 'lycee',
            'nom' => $this->faker->randomElement(['2nde', '1ère', 'Terminale']),
            'ordre' => $this->faker->numberBetween(5, 7),
        ]);
    }

    /**
     * Créer un niveau inactif
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'inactive',
        ]);
    }
} 