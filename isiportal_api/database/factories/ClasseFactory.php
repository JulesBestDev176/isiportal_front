<?php

namespace Database\Factories;

use App\Models\Classe;
use App\Models\Niveau;
use App\Models\AnneeScolaire;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Classe>
 */
class ClasseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement(['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B']),
            'capacite' => $this->faker->numberBetween(20, 35),
            'niveau_id' => Niveau::factory(),
            'annee_scolaire_id' => AnneeScolaire::factory(),
            'professeur_principal_id' => User::factory()->create(['role' => 'professeur'])->id,
            'statut' => $this->faker->randomElement(['active', 'inactive']),
            'description' => $this->faker->sentence(),
        ];
    }

    /**
     * Indicate that the classe is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'active',
        ]);
    }

    /**
     * Indicate that the classe is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'inactive',
        ]);
    }
} 