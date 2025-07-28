<?php

namespace Database\Factories;

use App\Models\HistoriqueEleve;
use App\Models\User;
use App\Models\Classe;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HistoriqueEleve>
 */
class HistoriqueEleveFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'eleve_id' => User::factory()->create(['role' => 'eleve'])->id,
            'annee_scolaire' => $this->faker->year() . '-' . ($this->faker->year() + 1),
            'classe' => $this->faker->randomElement(['6ème A', '6ème B', '5ème A', '5ème B', '4ème A', '4ème B', '3ème A', '3ème B']),
            'statut' => $this->faker->randomElement(['reussi', 'redouble', 'transfert', 'abandon']),
            'moyenne_generale' => $this->faker->randomFloat(2, 8, 20),
            'remarques' => $this->faker->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the student succeeded.
     */
    public function reussi(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'reussi',
        ]);
    }

    /**
     * Indicate that the student repeated the year.
     */
    public function redouble(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'redouble',
        ]);
    }

    /**
     * Indicate that the student transferred.
     */
    public function transfert(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'transfert',
        ]);
    }
} 