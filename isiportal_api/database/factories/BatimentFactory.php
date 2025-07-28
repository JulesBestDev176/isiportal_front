<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Batiment>
 */
class BatimentFactory extends Factory
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
                'Bâtiment A - Administration',
                'Bâtiment B - Collège',
                'Bâtiment C - Lycée',
                'Bâtiment D - Sciences',
                'Bâtiment E - Arts et Sports',
                'Bâtiment F - Informatique'
            ]),
            'description' => $this->faker->sentence(),
            'adresse' => $this->faker->address(),
            'statut' => $this->faker->randomElement(['actif', 'inactif', 'renovation', 'maintenance']),
            'date_creation' => now(),
        ];
    }

    /**
     * Créer un bâtiment actif
     */
    public function actif(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'actif',
        ]);
    }

    /**
     * Créer un bâtiment en maintenance
     */
    public function maintenance(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'maintenance',
        ]);
    }

    /**
     * Créer un bâtiment en rénovation
     */
    public function renovation(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'renovation',
        ]);
    }

    /**
     * Créer un bâtiment inactif
     */
    public function inactif(): static
    {
        return $this->state(fn (array $attributes) => [
            'statut' => 'inactif',
        ]);
    }
} 