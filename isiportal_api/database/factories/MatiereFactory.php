<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Matiere>
 */
class MatiereFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nom' => $this->faker->randomElement([
                'Mathématiques', 'Français', 'Histoire-Géographie', 'Anglais', 
                'Espagnol', 'Allemand', 'Physique-Chimie', 'SVT', 'EPS', 
                'Arts Plastiques', 'Éducation Musicale', 'Technologie', 'Philosophie'
            ]),
            'code' => $this->faker->unique()->regexify('[A-Z]{4}'),
            'description' => $this->faker->sentence(),
            'coefficient' => $this->faker->randomFloat(2, 1, 4),
            'heures_par_semaine' => $this->faker->numberBetween(1, 6),
            'statut' => 'active',
            'niveaux_ids' => [1, 2, 3, 4, 5, 6, 7],
            'date_creation' => now(),
        ];
    }

    /**
     * Créer une matière avec coefficient élevé
     */
    public function coefficientEleve(): static
    {
        return $this->state(fn (array $attributes) => [
            'coefficient' => $this->faker->randomFloat(2, 3, 4),
        ]);
    }

    /**
     * Créer une matière avec coefficient faible
     */
    public function coefficientFaible(): static
    {
        return $this->state(fn (array $attributes) => [
            'coefficient' => $this->faker->randomFloat(2, 1, 2),
        ]);
    }

    /**
     * Créer une matière inactive
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'inactive',
        ]);
    }

    /**
     * Créer une matière en maintenance
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'maintenance',
        ]);
    }
} 